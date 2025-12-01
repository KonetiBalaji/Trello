const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const sqsClient = new SQSClient({});

exports.handler = async (event) => {
  try {
    // Handle local testing where requestContext might be undefined
    const userId = event.requestContext?.authorizer?.claims?.sub || 
                   event.requestContext?.authorizer?.principalId || 
                   'local-test-user-id';
    const taskId = event.pathParameters?.taskId;
    const body = JSON.parse(event.body || '{}');
    
    if (!taskId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Task ID is required' })
      };
    }

    // First, get the task to verify ownership
    const getResult = await docClient.send(new GetCommand({
      TableName: process.env.TASKS_TABLE,
      Key: {
        userId: body.userId || userId,
        taskId
      }
    }));

    if (!getResult.Item) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Task not found' })
      };
    }

    // Build update expression
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    if (body.title !== undefined) {
      updateExpressions.push('#title = :title');
      expressionAttributeNames['#title'] = 'title';
      expressionAttributeValues[':title'] = body.title;
    }

    if (body.description !== undefined) {
      updateExpressions.push('#description = :description');
      expressionAttributeNames['#description'] = 'description';
      expressionAttributeValues[':description'] = body.description;
    }

    if (body.status !== undefined) {
      updateExpressions.push('#status = :status');
      expressionAttributeNames['#status'] = 'status';
      expressionAttributeValues[':status'] = body.status;
    }

    if (body.dueDate !== undefined) {
      updateExpressions.push('dueDate = :dueDate');
      expressionAttributeValues[':dueDate'] = body.dueDate;
    }

    if (body.assignedTo !== undefined) {
      updateExpressions.push('assignedTo = :assignedTo');
      expressionAttributeValues[':assignedTo'] = body.assignedTo;
    }

    updateExpressions.push('updatedAt = :updatedAt');
    expressionAttributeValues[':updatedAt'] = Date.now();

    const updateCommand = new UpdateCommand({
      TableName: process.env.TASKS_TABLE,
      Key: {
        userId: body.userId || userId,
        taskId
      },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    });

    const result = await docClient.send(updateCommand);

    // Send activity log message to SQS
    const changes = {};
    if (body.status !== undefined) changes.status = body.status;
    if (body.title !== undefined) changes.title = body.title;

    await sqsClient.send(new SendMessageCommand({
      QueueUrl: process.env.ACTIVITY_LOG_QUEUE_URL,
      MessageBody: JSON.stringify({
        taskId,
        userId,
        action: 'TASK_UPDATED',
        details: changes,
        timestamp: Date.now()
      })
    }));

    // Send reminder message to SQS if due date is set or updated
    const updatedDueDate = body.dueDate !== undefined ? body.dueDate : result.Attributes.dueDate;
    if (updatedDueDate) {
      const dueDateTimestamp = new Date(updatedDueDate).getTime();
      const now = Date.now();
      // Only schedule reminder if due date is in the future and task is not done
      if (dueDateTimestamp > now && result.Attributes.status !== 'Done') {
        const oneDayInMs = 24 * 60 * 60 * 1000;
        const reminderTime = Math.max(dueDateTimestamp - oneDayInMs, now);
        const delaySeconds = Math.floor((reminderTime - now) / 1000);
        
        // SQS supports delay up to 15 minutes (900 seconds) for immediate reminders
        if (delaySeconds <= 900) {
          await sqsClient.send(new SendMessageCommand({
            QueueUrl: process.env.REMINDER_QUEUE_URL,
            MessageBody: JSON.stringify({
              taskId,
              userId: result.Attributes.assignedTo || userId,
              dueDate: updatedDueDate,
              title: result.Attributes.title,
              reminderType: 'DUE_SOON'
            }),
            DelaySeconds: Math.min(delaySeconds, 900)
          }));
        }
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(result.Attributes)
    };
  } catch (error) {
    console.error('Error updating task:', error);
    
    // Structured error response
    const errorResponse = {
      error: 'Internal server error',
      message: error.message || 'An unexpected error occurred',
      code: 'UPDATE_TASK_ERROR'
    };
    
    // Don't expose internal errors in production
    if (process.env.NODE_ENV === 'development') {
      errorResponse.stack = error.stack;
    }
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(errorResponse)
    };
  }
};


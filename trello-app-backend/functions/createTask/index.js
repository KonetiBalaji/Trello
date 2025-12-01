const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');
const { v4: uuidv4 } = require('uuid');

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const sqsClient = new SQSClient({});

exports.handler = async (event) => {
  try {
    // Handle local testing where requestContext might be undefined
    const userId = event.requestContext?.authorizer?.claims?.sub || 
                   event.requestContext?.authorizer?.principalId || 
                   'local-test-user-id';
    const body = JSON.parse(event.body || '{}');
    const { title, description, status = 'To-Do', dueDate, assignedTo } = body;

    if (!title) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Title is required' })
      };
    }

    const taskId = uuidv4();
    const timestamp = Date.now();

    const task = {
      userId: assignedTo || userId,
      taskId,
      title,
      description: description || '',
      status,
      dueDate: dueDate || null,
      assignedTo: assignedTo || userId,
      createdBy: userId,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    await docClient.send(new PutCommand({
      TableName: process.env.TASKS_TABLE,
      Item: task
    }));

    // Send activity log message to SQS
    await sqsClient.send(new SendMessageCommand({
      QueueUrl: process.env.ACTIVITY_LOG_QUEUE_URL,
      MessageBody: JSON.stringify({
        taskId,
        userId,
        action: 'TASK_CREATED',
        details: { title, status },
        timestamp
      })
    }));

    // Send reminder message to SQS if due date is set
    if (dueDate) {
      const dueDateTimestamp = new Date(dueDate).getTime();
      const now = Date.now();
      // Only schedule reminder if due date is in the future
      if (dueDateTimestamp > now) {
        // Calculate delay in seconds (send reminder 1 day before due date, or at due date if less than 1 day away)
        const oneDayInMs = 24 * 60 * 60 * 1000;
        const reminderTime = Math.max(dueDateTimestamp - oneDayInMs, now);
        const delaySeconds = Math.floor((reminderTime - now) / 1000);
        
        // SQS supports delay up to 15 minutes (900 seconds) for immediate reminders
        // For longer delays, we'll use the scheduled reminder checker
        if (delaySeconds <= 900) {
          await sqsClient.send(new SendMessageCommand({
            QueueUrl: process.env.REMINDER_QUEUE_URL,
            MessageBody: JSON.stringify({
              taskId,
              userId: assignedTo || userId,
              dueDate,
              title,
              reminderType: 'DUE_SOON'
            }),
            DelaySeconds: Math.min(delaySeconds, 900)
          }));
        }
      }
    }

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    };
  } catch (error) {
    console.error('Error creating task:', error);
    
    // Structured error response
    const errorResponse = {
      error: 'Internal server error',
      message: error.message || 'An unexpected error occurred',
      code: 'CREATE_TASK_ERROR'
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


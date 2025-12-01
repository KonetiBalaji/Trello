const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, DeleteCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
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

    // First, get the task to verify it exists
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

    await docClient.send(new DeleteCommand({
      TableName: process.env.TASKS_TABLE,
      Key: {
        userId: body.userId || userId,
        taskId
      }
    }));

    // Send activity log message to SQS
    await sqsClient.send(new SendMessageCommand({
      QueueUrl: process.env.ACTIVITY_LOG_QUEUE_URL,
      MessageBody: JSON.stringify({
        taskId,
        userId,
        action: 'TASK_DELETED',
        details: { title: getResult.Item.title },
        timestamp: Date.now()
      })
    }));

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'Task deleted successfully' })
    };
  } catch (error) {
    console.error('Error deleting task:', error);
    
    // Structured error response
    const errorResponse = {
      error: 'Internal server error',
      message: error.message || 'An unexpected error occurred',
      code: 'DELETE_TASK_ERROR'
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


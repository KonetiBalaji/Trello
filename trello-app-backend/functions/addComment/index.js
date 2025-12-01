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
    const taskId = event.pathParameters?.taskId;
    const body = JSON.parse(event.body || '{}');
    const { content } = body;
    
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

    if (!content) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Comment content is required' })
      };
    }

    const commentId = uuidv4();
    const timestamp = Date.now();

    const comment = {
      taskId,
      commentId,
      userId,
      content,
      createdAt: timestamp
    };

    await docClient.send(new PutCommand({
      TableName: process.env.COMMENTS_TABLE,
      Item: comment
    }));

    // Send activity log message to SQS
    await sqsClient.send(new SendMessageCommand({
      QueueUrl: process.env.ACTIVITY_LOG_QUEUE_URL,
      MessageBody: JSON.stringify({
        taskId,
        userId,
        action: 'COMMENT_ADDED',
        details: { commentId },
        timestamp
      })
    }));

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(comment)
    };
  } catch (error) {
    console.error('Error adding comment:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};


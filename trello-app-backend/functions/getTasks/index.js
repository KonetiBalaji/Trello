const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand } = require('@aws-sdk/lib-dynamodb');

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

exports.handler = async (event) => {
  try {
    // Handle local testing where requestContext might be undefined
    const userId = event.requestContext?.authorizer?.claims?.sub || 
                   event.requestContext?.authorizer?.principalId || 
                   'local-test-user-id';

    const result = await docClient.send(new QueryCommand({
      TableName: process.env.TASKS_TABLE,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }));

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(result.Items || [])
    };
  } catch (error) {
    console.error('Error getting tasks:', error);
    
    // Structured error response
    const errorResponse = {
      error: 'Internal server error',
      message: error.message || 'An unexpected error occurred',
      code: 'GET_TASKS_ERROR'
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


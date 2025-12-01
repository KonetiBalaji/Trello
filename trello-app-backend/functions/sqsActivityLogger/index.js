const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

exports.handler = async (event) => {
  const results = [];

  for (const record of event.Records) {
    try {
      const messageBody = JSON.parse(record.body);
      const { taskId, userId, action, details, timestamp } = messageBody;

      const activityLogItem = {
        taskId,
        timestamp: timestamp || Date.now(),
        userId,
        action,
        details: JSON.stringify(details)
      };

      await docClient.send(new PutCommand({
        TableName: process.env.ACTIVITY_LOG_TABLE,
        Item: activityLogItem
      }));

      results.push({ success: true, taskId });
    } catch (error) {
      console.error('Error processing activity log message:', error);
      results.push({ success: false, error: error.message });
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ processed: results.length, results })
  };
};


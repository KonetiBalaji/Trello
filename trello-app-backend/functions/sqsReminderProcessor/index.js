const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

exports.handler = async (event) => {
  const results = [];

  for (const record of event.Records) {
    try {
      const messageBody = JSON.parse(record.body);
      const { taskId, userId, dueDate } = messageBody;

      // Get the task to check if it's still pending
      const taskResult = await docClient.send(new GetCommand({
        TableName: process.env.TASKS_TABLE,
        Key: {
          userId,
          taskId
        }
      }));

      if (taskResult.Item && taskResult.Item.status !== 'Done') {
        // Task is still pending - could send notification here
        // For now, just log it
        console.log(`Reminder: Task ${taskId} is due on ${dueDate}`);
        results.push({ success: true, taskId, reminderSent: true });
      } else {
        results.push({ success: true, taskId, reminderSent: false, reason: 'Task completed or not found' });
      }
    } catch (error) {
      console.error('Error processing reminder:', error);
      results.push({ success: false, error: error.message });
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ processed: results.length, results })
  };
};


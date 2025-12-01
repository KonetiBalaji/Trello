const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const sqsClient = new SQSClient({});

exports.handler = async (event) => {
  try {
    const now = Date.now();
    const oneDayInMs = 24 * 60 * 60 * 1000;
    const tomorrow = now + oneDayInMs;
    
    // Scan all tasks (in production, consider using GSI for better performance)
    const result = await docClient.send(new ScanCommand({
      TableName: process.env.TASKS_TABLE,
      FilterExpression: 'dueDate <> :null AND #status <> :done',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':null': null,
        ':done': 'Done'
      }
    }));

    const remindersSent = [];
    
    for (const task of result.Items || []) {
      if (!task.dueDate) continue;
      
      const dueDateTimestamp = new Date(task.dueDate).getTime();
      
      // Check if task is due within 24 hours
      if (dueDateTimestamp > now && dueDateTimestamp <= tomorrow) {
        // Check if we haven't already sent a reminder (could add a reminderSent flag to avoid duplicates)
        const reminderTime = dueDateTimestamp - oneDayInMs;
        
        // Send reminder if it's time (within the reminder window)
        if (reminderTime <= now) {
          try {
            await sqsClient.send(new SendMessageCommand({
              QueueUrl: process.env.REMINDER_QUEUE_URL,
              MessageBody: JSON.stringify({
                taskId: task.taskId,
                userId: task.assignedTo || task.userId,
                dueDate: task.dueDate,
                title: task.title,
                reminderType: 'DUE_SOON'
              })
            }));
            remindersSent.push(task.taskId);
          } catch (error) {
            console.error(`Error sending reminder for task ${task.taskId}:`, error);
          }
        }
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Reminder check completed',
        tasksChecked: result.Items?.length || 0,
        remindersSent: remindersSent.length,
        taskIds: remindersSent
      })
    };
  } catch (error) {
    console.error('Error checking reminders:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error', message: error.message })
    };
  }
};


# IAM Permissions Fix

## Issue
Lambda functions were getting "not authorized to perform: dynamodb:Query" errors because IAM policies were missing.

## Solution Applied
Added IAM policies to all Lambda functions in `template.yaml`:

### Task CRUD Functions
- **GetTasksFunction**: `DynamoDBReadPolicy` (for Query operations)
- **CreateTaskFunction**: `DynamoDBCrudPolicy` + SQS send permissions
- **UpdateTaskFunction**: `DynamoDBCrudPolicy` + SQS send permissions  
- **DeleteTaskFunction**: `DynamoDBWritePolicy` + SQS send permissions

### Comment Functions
- **GetCommentsFunction**: `DynamoDBReadPolicy`
- **AddCommentFunction**: `DynamoDBCrudPolicy` + SQS send permissions

### Activity Log Functions
- **GetActivityLogFunction**: `DynamoDBReadPolicy`

### SQS Consumer Functions
- **SqsActivityLoggerFunction**: `DynamoDBCrudPolicy` + `SQSPollerPolicy`
- **SqsReminderProcessorFunction**: `DynamoDBReadPolicy` + `SQSPollerPolicy`
- **ScheduledReminderCheckerFunction**: `DynamoDBReadPolicy` + `SQSSendMessagePolicy`

## Next Steps

1. **Redeploy the backend:**
   ```bash
   cd trello-app-backend
   sam build
   sam deploy
   ```

2. **Wait for deployment** (5-10 minutes)

3. **Test the application** - the IAM permission errors should be resolved

## Verification

After deployment, check CloudWatch logs to verify:
- No more "not authorized" errors
- Lambda functions can successfully query/update DynamoDB tables
- SQS messages are being sent and received correctly

## If Issues Persist

If you still see permission errors after redeployment:

1. **Check IAM Roles in Console:**
   - Go to IAM Console → Roles
   - Find roles like `trello-app-backend-GetTasksFunctionRole-*`
   - Verify they have DynamoDB permissions attached

2. **Manually add permissions** (if needed):
   - In IAM Console, edit the role
   - Attach policy: `AmazonDynamoDBReadOnlyAccess` or create custom policy with:
     ```json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Effect": "Allow",
           "Action": [
             "dynamodb:Query",
             "dynamodb:GetItem",
             "dynamodb:Scan"
           ],
           "Resource": "arn:aws:dynamodb:*:*:table/TasksTable"
         }
       ]
     }
     ```

3. **Check CloudWatch Logs:**
   - Go to CloudWatch → Log Groups
   - Find `/aws/lambda/GetTasksFunction`
   - Check for any remaining permission errors


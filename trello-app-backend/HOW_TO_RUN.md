# How to Run the Backend

## Prerequisites

Before running the backend, ensure you have:

1. **AWS CLI** installed and configured:
   ```bash
   aws --version
   aws configure
   ```

2. **AWS SAM CLI** installed:
   ```bash
   sam --version
   ```
   If not installed, download from: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html

3. **Node.js 18.x** installed:
   ```bash
   node --version
   ```

## Option 1: Run Locally (Recommended for Development)

This runs the API locally on your machine using Docker (SAM uses Docker to simulate Lambda).

### Step 1: Navigate to Backend Directory

```bash
cd trello-app-backend
```

### Step 2: Build the Application

```bash
sam build
```

This compiles all Lambda functions and prepares them for execution.

### Step 3: Start Local API

```bash
sam local start-api
```

This will:
- Start a local API Gateway on `http://localhost:3000`
- Run Lambda functions locally using Docker
- Note: DynamoDB, Cognito, and SQS will still need to be in AWS (or use local alternatives)

### Step 4: Test the API

The API will be available at `http://localhost:3000`

Example:
```bash
curl http://localhost:3000/tasks
```

**Note**: For local testing with Cognito, you'll need to:
- Either mock the authentication
- Or use AWS Cognito and get a real token
- Or temporarily disable authentication for local testing

## Option 2: Deploy to AWS (Production)

This deploys the entire backend to AWS (Lambda, DynamoDB, API Gateway, etc.)

### Step 1: Navigate to Backend Directory

```bash
cd trello-app-backend
```

### Step 2: Build the Application

```bash
sam build
```

### Step 3: Deploy to AWS

```bash
sam deploy --guided
```

This interactive command will ask you:
- **Stack Name**: `trello-app-backend` (or your preferred name)
- **AWS Region**: Choose your region (e.g., `us-east-1`)
- **Confirm changes before deploy**: `Y`
- **Allow SAM CLI IAM role creation**: `Y` (required for first deployment)
- **Disable rollback**: `N` (keep rollback enabled)
- **Save arguments to configuration file**: `Y` (saves to `samconfig.toml`)

### Step 4: Wait for Deployment

Deployment takes 5-10 minutes. SAM will create:
- Lambda functions
- DynamoDB tables
- API Gateway
- Cognito User Pool
- SQS queues
- CloudWatch log groups

### Step 5: Get Output Values

After deployment completes, you'll see output like:

```
Outputs:
  ApiGatewayUrl: https://abc123.execute-api.us-east-1.amazonaws.com/prod
  UserPoolId: us-east-1_ABC123
  UserPoolClientId: 1234567890abcdef
```

**Save these values!** You'll need them for the frontend.

### Step 6: Test the Deployed API

```bash
# Get the API URL from outputs
curl https://<api-gateway-url>/tasks \
  -H "Authorization: Bearer <cognito-token>"
```

## Troubleshooting

### Issue: "sam: command not found"
**Solution**: Install AWS SAM CLI
- Windows: Download installer from AWS
- Mac: `brew install aws-sam-cli`
- Linux: Follow AWS documentation

### Issue: "Docker not running"
**Solution**: Start Docker Desktop (required for `sam local`)

### Issue: "Access Denied" during deployment
**Solution**: 
- Check AWS credentials: `aws sts get-caller-identity`
- Ensure your IAM user has necessary permissions
- SAM CLI needs permissions to create Lambda, API Gateway, DynamoDB, etc.

### Issue: "Stack already exists"
**Solution**: 
- Use `sam deploy` (without --guided) if you've deployed before
- Or delete the stack first: `aws cloudformation delete-stack --stack-name trello-app-backend`

### Issue: Local API can't connect to DynamoDB
**Solution**: 
- For local testing, you may need to use DynamoDB Local
- Or deploy to AWS and test against real DynamoDB
- Update environment variables in `template.yaml` for local testing

## Next Steps

After deploying:
1. Copy the output values (API URL, User Pool ID, Client ID)
2. Update frontend `.env` file with these values
3. Run the frontend application

## Useful Commands

```bash
# View logs from deployed Lambda
sam logs -n CreateTaskFunction --stack-name trello-app-backend --tail

# Delete the stack
aws cloudformation delete-stack --stack-name trello-app-backend

# View stack status
aws cloudformation describe-stacks --stack-name trello-app-backend

# Re-deploy after changes
sam build && sam deploy
```


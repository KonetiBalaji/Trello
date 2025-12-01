# Quick Start Guide

## Prerequisites

- AWS CLI installed and configured
- AWS SAM CLI installed
- Node.js 18.x installed
- Git repository (for CI/CD)

## Step 1: Deploy Backend

```bash
cd trello-app-backend
sam build
sam deploy --guided
```

**Important**: Save the output values:
- `ApiGatewayUrl`
- `UserPoolId`
- `UserPoolClientId`

## Step 2: Configure Frontend

1. Create `.env` file in `trello-app-frontend/`:

```bash
cd ../trello-app-frontend
```

Create `.env`:
```
REACT_APP_USER_POOL_ID=<UserPoolId from step 1>
REACT_APP_USER_POOL_CLIENT_ID=<UserPoolClientId from step 1>
REACT_APP_API_URL=<ApiGatewayUrl from step 1>
REACT_APP_AWS_REGION=us-east-1
```

2. Install dependencies and run:

```bash
npm install
npm start
```

## Step 3: Test the Application

1. Open http://localhost:3000
2. Sign up for a new account
3. Create a task
4. Test all features:
   - Update task status
   - Add comments
   - View activity log
   - Assign tasks

## Step 4: Deploy Frontend (Optional)

### Option A: AWS Amplify (Easiest)

1. Push code to GitHub
2. Connect to AWS Amplify
3. Deploy automatically

### Option B: S3 + CloudFront

```bash
npm run build
aws s3 mb s3://trello-app-frontend-<unique-name>
aws s3 sync build/ s3://trello-app-frontend-<unique-name> --delete
```

Then create CloudFront distribution pointing to the S3 bucket.

## Step 5: Set Up CI/CD (Optional)

See:
- `trello-app-backend/cicd-setup-guide.md`
- `trello-app-frontend/cicd-setup-guide.md`

## Troubleshooting

### Backend Issues
- Check CloudWatch logs for Lambda errors
- Verify DynamoDB tables are created
- Check API Gateway authorizer configuration

### Frontend Issues
- Verify `.env` file has correct values
- Check browser console for errors
- Ensure CORS is enabled in API Gateway

### Authentication Issues
- Verify Cognito User Pool is configured correctly
- Check that environment variables match backend outputs
- Ensure user is signed up and confirmed

## Next Steps

- Set up CI/CD pipelines
- Configure CloudFront for production
- Add custom domain
- Set up monitoring and alerts


# Backend Deployment Guide

## Prerequisites

1. AWS CLI configured with appropriate credentials
2. AWS SAM CLI installed
3. Node.js 18.x installed

## Deployment Steps

### 1. Build the Application

```bash
cd trello-app-backend
sam build
```

### 2. Deploy to AWS

```bash
sam deploy --guided
```

This will prompt you for:
- Stack Name: `trello-app-backend`
- AWS Region: Choose your region (e.g., `us-east-1`)
- Confirm changes: `Y`
- Allow SAM CLI IAM role creation: `Y`
- Disable rollback: `N`
- Save arguments to configuration file: `Y`

### 3. Get Output Values

After deployment, note the output values:
- `ApiGatewayUrl`: Your API Gateway endpoint
- `UserPoolId`: Cognito User Pool ID
- `UserPoolClientId`: Cognito User Pool Client ID

### 4. Update Frontend Environment Variables

Update `trello-app-frontend/.env` with the values from step 3:
```
REACT_APP_USER_POOL_ID=<UserPoolId>
REACT_APP_USER_POOL_CLIENT_ID=<UserPoolClientId>
REACT_APP_API_URL=<ApiGatewayUrl>
REACT_APP_AWS_REGION=<your-region>
```

## Manual S3/CloudFront Setup (Alternative)

If you prefer to set up S3 and CloudFront manually:

### 1. Create S3 Bucket

```bash
aws s3 mb s3://trello-app-frontend-<your-unique-name>
```

### 2. Configure Bucket for Static Website Hosting

```bash
aws s3 website s3://trello-app-frontend-<your-unique-name> \
  --index-document index.html \
  --error-document index.html
```

### 3. Create CloudFront Distribution

Use AWS Console or CLI to create a CloudFront distribution pointing to the S3 bucket.

### 4. Upload Frontend Build

```bash
cd ../trello-app-frontend
npm run build
aws s3 sync build/ s3://trello-app-frontend-<your-unique-name> --delete
```

## Testing

Test the API endpoints using curl or Postman:

```bash
# Get tasks (requires authentication token)
curl -X GET https://<api-gateway-url>/tasks \
  -H "Authorization: Bearer <cognito-token>"
```


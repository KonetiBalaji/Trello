# Frontend Deployment Guide

## Prerequisites

1. Backend deployed and API Gateway URL available
2. Cognito User Pool ID and Client ID from backend deployment
3. AWS CLI configured (for S3/CloudFront deployment)

## Environment Setup

1. Create `.env` file in the frontend root:

```bash
REACT_APP_USER_POOL_ID=your-user-pool-id
REACT_APP_USER_POOL_CLIENT_ID=your-client-id
REACT_APP_API_URL=https://your-api-gateway-url/prod
REACT_APP_AWS_REGION=us-east-1
```

2. Install dependencies:

```bash
npm install
```

3. Test locally:

```bash
npm start
```

## Deployment Options

### Option 1: AWS Amplify (Recommended)

1. Push code to GitHub/CodeCommit
2. Connect repository to AWS Amplify
3. Amplify will automatically build and deploy

### Option 2: S3 + CloudFront (Manual)

1. Build the application:

```bash
npm run build
```

2. Create S3 bucket:

```bash
aws s3 mb s3://trello-app-frontend-<your-unique-name>
```

3. Configure bucket for static hosting:

```bash
aws s3 website s3://trello-app-frontend-<your-unique-name> \
  --index-document index.html \
  --error-document index.html
```

4. Upload build files:

```bash
aws s3 sync build/ s3://trello-app-frontend-<your-unique-name> --delete
```

5. Create CloudFront distribution (via AWS Console):
   - Origin: S3 bucket
   - Default root object: `index.html`
   - Error pages: Redirect 404 to `/index.html` (for React Router)

6. Update bucket policy to allow CloudFront access:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::trello-app-frontend-<your-unique-name>/*"
    }
  ]
}
```

### Option 3: Using CI/CD Pipeline

See the CI/CD setup guide for automated deployment.

## Post-Deployment

1. Update CORS settings in API Gateway if needed
2. Verify environment variables are set correctly
3. Test authentication flow
4. Test task CRUD operations


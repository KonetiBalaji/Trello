# Frontend CI/CD Pipeline Setup Guide

## Prerequisites

1. Frontend code pushed to GitHub repository
2. Backend deployed and outputs available
3. S3 bucket created for hosting
4. AWS CLI configured
5. GitHub personal access token with repo access

## Frontend Pipeline Setup

### 1. Create S3 Bucket for Hosting

```bash
aws s3 mb s3://trello-app-frontend-<your-unique-name>
aws s3 website s3://trello-app-frontend-<your-unique-name> \
  --index-document index.html \
  --error-document index.html
```

### 2. Get Backend Outputs

From your backend CloudFormation stack, get:
- User Pool ID
- User Pool Client ID
- API Gateway URL

### 3. Create the Pipeline Stack

```bash
cd trello-app-frontend
aws cloudformation create-stack \
  --stack-name trello-app-frontend-pipeline \
  --template-body file://cicd-pipeline.yaml \
  --parameters \
    ParameterKey=GitHubRepo,ParameterValue=https://github.com/your-username/your-repo.git \
    ParameterKey=GitHubBranch,ParameterValue=main \
    ParameterKey=GitHubToken,ParameterValue=your-github-token \
    ParameterKey=S3BucketName,ParameterValue=trello-app-frontend-<your-unique-name> \
    ParameterKey=UserPoolId,ParameterValue=<user-pool-id> \
    ParameterKey=UserPoolClientId,ParameterValue=<client-id> \
    ParameterKey=ApiUrl,ParameterValue=<api-gateway-url> \
  --capabilities CAPABILITY_IAM
```

### 4. Set Up CloudFront (Optional)

If using CloudFront, create a distribution pointing to your S3 bucket and update the pipeline to invalidate CloudFront cache after deployment.

### 5. Monitor Pipeline

- Go to AWS CodePipeline console
- Find `trello-app-frontend-pipeline`
- The pipeline will trigger on commits to the main branch

## Pipeline Stages

1. **Source**: Pulls code from GitHub
2. **Build**: Runs `npm run build` with environment variables
3. **Deploy**: Uploads build artifacts to S3

## Environment Variables

The pipeline automatically sets these during build:
- `REACT_APP_USER_POOL_ID`
- `REACT_APP_USER_POOL_CLIENT_ID`
- `REACT_APP_API_URL`
- `REACT_APP_AWS_REGION`

## Troubleshooting

- Check CodeBuild logs for build errors
- Verify environment variables are set correctly
- Check S3 bucket permissions
- Ensure GitHub token has correct permissions


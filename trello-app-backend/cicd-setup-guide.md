# CI/CD Pipeline Setup Guide

## Prerequisites

1. Backend code pushed to GitHub repository
2. AWS CLI configured
3. GitHub personal access token with repo access

## Backend Pipeline Setup

### 1. Create the Pipeline Stack

```bash
cd trello-app-backend
aws cloudformation create-stack \
  --stack-name trello-app-backend-pipeline \
  --template-body file://cicd-pipeline.yaml \
  --parameters \
    ParameterKey=GitHubRepo,ParameterValue=https://github.com/your-username/your-repo.git \
    ParameterKey=GitHubBranch,ParameterValue=main \
    ParameterKey=GitHubToken,ParameterValue=your-github-token \
  --capabilities CAPABILITY_IAM
```

### 2. Monitor Pipeline

- Go to AWS CodePipeline console
- Find `trello-app-backend-pipeline`
- The pipeline will trigger on commits to the main branch

### 3. Manual Trigger

You can also manually trigger the pipeline from the AWS Console.

## Pipeline Stages

1. **Source**: Pulls code from GitHub
2. **Build**: Runs `sam build` to package Lambda functions
3. **Deploy**: Deploys using CloudFormation

## Troubleshooting

- Check CodeBuild logs for build errors
- Verify IAM permissions
- Ensure GitHub token has correct permissions
- Check CloudFormation stack events for deployment issues


# Trello App Backend

AWS Serverless backend for Trello-like task management application.

## Prerequisites

- AWS CLI configured
- AWS SAM CLI installed
- Node.js 18.x

## Deployment

1. Build the application:
```bash
sam build
```

2. Deploy to AWS:
```bash
sam deploy --guided
```

## Local Development

Run API locally:
```bash
sam local start-api
```

## Architecture

- **Lambda Functions**: CRUD operations for tasks, comments, and activity logs
- **DynamoDB**: Tables for tasks, comments, and activity logs
- **API Gateway**: REST API with Cognito authentication
- **SQS**: Queues for activity logging and reminders
- **CloudWatch**: Logging and monitoring


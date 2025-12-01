# Trello-like Task Management Application

A full-stack serverless application built with React and AWS services, implementing a minimal Trello-like task management system.

## Project Structure

```
.
├── trello-app-backend/     # AWS Serverless backend
│   ├── functions/         # Lambda functions
│   ├── template.yaml      # AWS SAM template
│   └── ...
└── trello-app-frontend/   # React TypeScript frontend
    ├── src/
    │   ├── components/    # React components
    │   ├── contexts/     # React contexts
    │   ├── services/     # API services
    │   └── ...
    └── ...
```

## Features

- ✅ User authentication with AWS Cognito
- ✅ Task CRUD operations (Create, Read, Update, Delete)
- ✅ Task status management (To-Do → Doing → Done)
- ✅ Task assignment to users
- ✅ Due date tracking
- ✅ Comments on tasks
- ✅ Activity logging via SQS
- ✅ Task reminders via SQS
- ✅ CloudWatch monitoring and logging
- ✅ CI/CD pipeline with CodePipeline

## Architecture

### Backend (AWS Serverless)

- **API Gateway**: REST API with Cognito authentication
- **Lambda Functions**: 
  - Task CRUD operations
  - Comment management
  - Activity log retrieval
  - SQS consumers for async processing
- **DynamoDB**: 
  - Tasks table
  - Comments table
  - Activity log table
- **SQS**: 
  - Activity log queue
  - Reminder queue
- **Cognito**: User authentication and authorization
- **CloudWatch**: Logging, metrics, and alarms

### Frontend (React + TypeScript)

- **React 18** with TypeScript
- **AWS Amplify** for Cognito integration
- **React Router** for navigation
- **Context API** for state management
- **Axios** for API calls

## Quick Start

### Backend Deployment

1. Navigate to backend directory:
```bash
cd trello-app-backend
```

2. Build and deploy:
```bash
sam build
sam deploy --guided
```

3. Note the output values (API URL, User Pool ID, Client ID)

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd trello-app-frontend
```

2. Create `.env` file with backend outputs:
```
REACT_APP_USER_POOL_ID=<from-backend>
REACT_APP_USER_POOL_CLIENT_ID=<from-backend>
REACT_APP_API_URL=<from-backend>
REACT_APP_AWS_REGION=us-east-1
```

3. Install dependencies and start:
```bash
npm install
npm start
```

## Deployment Guides

- [Backend Deployment Guide](trello-app-backend/deployment-guide.md)
- [Frontend Deployment Guide](trello-app-frontend/deployment-guide.md)
- [Backend CI/CD Setup](trello-app-backend/cicd-setup-guide.md)
- [Frontend CI/CD Setup](trello-app-frontend/cicd-setup-guide.md)

## API Endpoints

All endpoints require Cognito authentication via Bearer token.

- `GET /tasks` - Get all tasks for authenticated user
- `POST /tasks` - Create a new task
- `PUT /tasks/{taskId}` - Update a task
- `DELETE /tasks/{taskId}` - Delete a task
- `GET /tasks/{taskId}/comments` - Get comments for a task
- `POST /tasks/{taskId}/comments` - Add a comment to a task
- `GET /tasks/{taskId}/activity` - Get activity log for a task

## Requirements Met

- ✅ React front-end
- ✅ Lambda CRUD for tasks
- ✅ DynamoDB Tasks table
- ✅ Cognito login (per-user tasks)
- ✅ S3/CloudFront hosting
- ✅ CloudWatch logs, metrics
- ✅ SQS for activity logging and reminders
- ✅ CI/CD CodePipeline

## Optional Enhancements

- ElastiCache for caching
- WebSocket API for real-time updates
- Task search/filter functionality
- Email notifications via SES

## License

This project is for educational purposes.


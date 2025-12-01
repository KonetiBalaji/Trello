# Trello App Frontend

React TypeScript frontend for Trello-like task management application.

## Prerequisites

- Node.js 16.x or higher
- npm or yarn

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```
REACT_APP_USER_POOL_ID=your-user-pool-id
REACT_APP_USER_POOL_CLIENT_ID=your-client-id
REACT_APP_API_URL=https://your-api-gateway-url
REACT_APP_AWS_REGION=us-east-1
```

3. Start the development server:
```bash
npm start
```

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Features

- User authentication with AWS Cognito
- Task board with three columns (To-Do, Doing, Done)
- Create, update, and delete tasks
- Add comments to tasks
- View activity log for tasks
- Assign tasks to users
- Set due dates for tasks


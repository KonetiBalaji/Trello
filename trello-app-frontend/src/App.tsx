import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './App.css';

import Dashboard from './components/Dashboard/Dashboard';
import { AuthProvider } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';

// Configure Amplify - these values should be replaced with actual values from backend deployment
const awsconfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.REACT_APP_USER_POOL_ID || '',
      userPoolClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID || '',
      loginWith: {
        email: true
      }
    }
  },
  ...(process.env.REACT_APP_AWS_REGION && {
    aws_project_region: process.env.REACT_APP_AWS_REGION
  })
};

// Only configure if we have the required values
if (process.env.REACT_APP_USER_POOL_ID && process.env.REACT_APP_USER_POOL_CLIENT_ID) {
  Amplify.configure(awsconfig);
} else {
  console.error('Missing required environment variables:', {
    REACT_APP_USER_POOL_ID: process.env.REACT_APP_USER_POOL_ID ? 'Set' : 'Missing',
    REACT_APP_USER_POOL_CLIENT_ID: process.env.REACT_APP_USER_POOL_CLIENT_ID ? 'Set' : 'Missing',
    REACT_APP_API_URL: process.env.REACT_APP_API_URL ? 'Set' : 'Missing'
  });
}

function App() {
  return (
    <Router>
      <Authenticator>
        {({ signOut, user }) => (
          <AuthProvider 
            user={user ? {
              username: user.username || (user as any).signInDetails?.loginId || '',
              attributes: {
                email: (user as any).signInDetails?.loginId || (user as any).attributes?.email || '',
                sub: (user as any).userId || (user as any).attributes?.sub || (user as any).signInDetails?.loginId || ''
              }
            } : null} 
            signOut={signOut || (() => {})}
          >
            <TaskProvider>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </TaskProvider>
          </AuthProvider>
        )}
      </Authenticator>
    </Router>
  );
}

export default App;


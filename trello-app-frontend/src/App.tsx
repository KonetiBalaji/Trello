import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './App.css';

import Dashboard from './components/Dashboard/Dashboard';
import { AuthProvider } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import ConfigError from './components/ConfigError/ConfigError';

// Configure Amplify - these values should be replaced with actual values from backend deployment
const awsconfig = {
  Auth: {
    region: process.env.REACT_APP_AWS_REGION || '',
    userPoolId: process.env.REACT_APP_USER_POOL_ID || '',
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID || ''
  }
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
  // Check if required environment variables are set
  const isConfigured = 
    process.env.REACT_APP_USER_POOL_ID && 
    process.env.REACT_APP_USER_POOL_CLIENT_ID;

  // Show configuration error if variables are missing
  if (!isConfigured) {
    return <ConfigError />;
  }

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


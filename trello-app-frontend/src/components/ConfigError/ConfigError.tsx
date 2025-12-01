import React from 'react';
import './ConfigError.css';

const ConfigError: React.FC = () => {
  const missingVars = [];
  if (!process.env.REACT_APP_USER_POOL_ID) missingVars.push('REACT_APP_USER_POOL_ID');
  if (!process.env.REACT_APP_USER_POOL_CLIENT_ID) missingVars.push('REACT_APP_USER_POOL_CLIENT_ID');
  if (!process.env.REACT_APP_API_URL) missingVars.push('REACT_APP_API_URL');
  if (!process.env.REACT_APP_AWS_REGION) missingVars.push('REACT_APP_AWS_REGION');

  return (
    <div className="config-error-container">
      <div className="config-error-card">
        <div className="config-error-icon">⚠️</div>
        <h2>Configuration Error</h2>
        <p className="config-error-description">
          The application is missing required environment variables. This typically happens when the app hasn't been configured in AWS Amplify.
        </p>
        
        <div className="config-error-details">
          <h3>Missing Variables:</h3>
          <ul>
            {missingVars.map((varName) => (
              <li key={varName}>
                <code>{varName}</code>
              </li>
            ))}
          </ul>
        </div>

        <div className="config-error-solution">
          <h3>How to Fix:</h3>
          <ol>
            <li>Go to <a href="https://console.aws.amazon.com/amplify" target="_blank" rel="noopener noreferrer">AWS Amplify Console</a></li>
            <li>Select your app</li>
            <li>Navigate to <strong>Environment variables</strong> (under App settings)</li>
            <li>Add the following variables:
              <div className="config-error-vars">
                <div><code>REACT_APP_USER_POOL_ID</code> = <code>us-east-1_Tx8ircMe3</code></div>
                <div><code>REACT_APP_USER_POOL_CLIENT_ID</code> = <code>29t53abnqk73vb88e8g0h903g5</code></div>
                <div><code>REACT_APP_API_URL</code> = <code>https://ngffw8m38d.execute-api.us-east-1.amazonaws.com/prod</code></div>
                <div><code>REACT_APP_AWS_REGION</code> = <code>us-east-1</code></div>
              </div>
            </li>
            <li>Redeploy your app</li>
            <li>Wait 5-10 minutes for the build to complete</li>
          </ol>
        </div>

        <div className="config-error-help">
          <p>
            <strong>Need more help?</strong> Check the browser console (F12) for detailed error messages, 
            or see <code>AMPLIFY_ENV_SETUP.md</code> in the project repository.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfigError;


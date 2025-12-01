import { Auth } from '@aws-amplify/auth';

/**
 * Fetches the current user's authentication token
 * @returns Promise that resolves to the JWT token string
 */
export const fetchCurrentUserToken = async (): Promise<string> => {
  try {
    // In Amplify v5, use Auth.currentSession() to get the session
    const session = await Auth.currentSession();
    const idToken = session.getIdToken();
    
    if (!idToken) {
      throw new Error('No authentication token found. Please sign in again.');
    }
    
    // Get the JWT token string
    return idToken.getJwtToken();
  } catch (error) {
    console.error('Error fetching auth token:', error);
    throw new Error(
      error instanceof Error 
        ? `Failed to get authentication token: ${error.message}`
        : 'Failed to get authentication token'
    );
  }
};


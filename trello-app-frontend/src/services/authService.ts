// Using dynamic import to handle module resolution issues with aws-amplify v5
// This ensures the module is loaded at runtime even if webpack has resolution issues during build
export const fetchCurrentUserToken = async (): Promise<string> => {
  try {
    // Dynamic import to handle webpack module resolution
    const authModule = await import('aws-amplify/auth');
    const fetchAuthSession = authModule.fetchAuthSession;
    
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken;
    if (!idToken) {
      throw new Error('No authentication token found');
    }
    // In Amplify v5, idToken is a JWT object with a toString method
    return idToken.toString();
  } catch (error) {
    console.error('Error fetching auth token:', error);
    throw error;
  }
};


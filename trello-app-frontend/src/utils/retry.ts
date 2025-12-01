/**
 * Retry utility with exponential backoff
 * @param fn - Function to retry
 * @param maxRetries - Maximum number of retries (default: 3)
 * @param initialDelay - Initial delay in milliseconds (default: 1000)
 * @returns Promise that resolves with the function result
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> => {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      // Enhanced error handling for axios errors
      if (error && typeof error === 'object' && 'isAxiosError' in error) {
        const axiosError = error as any;
        
        // Don't retry on 4xx errors (client errors)
        if (axiosError.response?.status && axiosError.response.status >= 400 && axiosError.response.status < 500) {
          const status = axiosError.response.status;
          const message = axiosError.response?.data?.message || axiosError.message || 'Request failed';
          throw new Error(`${message} (Status: ${status})`);
        }
        
        // Handle network errors with more context
        if (axiosError.code === 'ERR_NETWORK' || axiosError.message === 'Network Error') {
          const apiUrl = process.env.REACT_APP_API_URL;
          if (!apiUrl) {
            throw new Error('API URL is not configured. Please check REACT_APP_API_URL environment variable.');
          }
          if (attempt === maxRetries) {
            throw new Error(`Network Error: Unable to connect to API at ${apiUrl}. Please check if the API is running and CORS is configured correctly.`);
          }
        }
        
        // Handle other axios errors
        lastError = new Error(
          axiosError.response?.data?.message || 
          axiosError.message || 
          'Request failed'
        );
      } else {
        lastError = error instanceof Error ? error : new Error(String(error));
      }
      
      // If this was the last attempt, throw the error
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Calculate delay with exponential backoff
      const delay = initialDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError || new Error('Unknown error');
};


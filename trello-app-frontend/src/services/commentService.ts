import axios from 'axios';
import { Comment } from '../types';
import { retryWithBackoff } from '../utils/retry';

const API_URL = process.env.REACT_APP_API_URL || '';

// Validate API URL before making requests
const validateApiUrl = () => {
  if (!API_URL) {
    throw new Error('API URL is not configured. Please set REACT_APP_API_URL environment variable.');
  }
  if (!API_URL.startsWith('http://') && !API_URL.startsWith('https://')) {
    throw new Error(`Invalid API URL format: ${API_URL}. URL must start with http:// or https://`);
  }
};

export const getComments = async (token: string, taskId: string): Promise<Comment[]> => {
  validateApiUrl();
  return retryWithBackoff(async () => {
    const response = await axios.get(`${API_URL}/tasks/${taskId}/comments`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  });
};

export const addComment = async (
  token: string,
  taskId: string,
  content: string
): Promise<Comment> => {
  validateApiUrl();
  return retryWithBackoff(async () => {
    const response = await axios.post(
      `${API_URL}/tasks/${taskId}/comments`,
      { content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  });
};


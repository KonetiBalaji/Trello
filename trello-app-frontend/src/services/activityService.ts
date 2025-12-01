import axios from 'axios';
import { ActivityLog } from '../types';
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

export const getActivityLog = async (token: string, taskId: string): Promise<ActivityLog[]> => {
  validateApiUrl();
  return retryWithBackoff(async () => {
    const response = await axios.get(`${API_URL}/tasks/${taskId}/activity`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  });
};


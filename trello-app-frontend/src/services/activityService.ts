import axios from 'axios';
import { ActivityLog } from '../types';
import { retryWithBackoff } from '../utils/retry';

const API_URL = process.env.REACT_APP_API_URL || '';

export const getActivityLog = async (token: string, taskId: string): Promise<ActivityLog[]> => {
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


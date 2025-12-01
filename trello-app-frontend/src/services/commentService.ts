import axios from 'axios';
import { Comment } from '../types';
import { retryWithBackoff } from '../utils/retry';

const API_URL = process.env.REACT_APP_API_URL || '';

export const getComments = async (token: string, taskId: string): Promise<Comment[]> => {
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


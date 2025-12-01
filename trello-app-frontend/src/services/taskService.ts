import axios from 'axios';
import { Task } from '../types';
import { retryWithBackoff } from '../utils/retry';

const API_URL = process.env.REACT_APP_API_URL || '';

export const getTasks = async (token: string): Promise<Task[]> => {
  return retryWithBackoff(async () => {
    const response = await axios.get(`${API_URL}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  });
};

export const createTask = async (
  token: string,
  taskData: Omit<Task, 'taskId' | 'createdAt' | 'updatedAt' | 'createdBy'>
): Promise<Task> => {
  return retryWithBackoff(async () => {
    const response = await axios.post(
      `${API_URL}/tasks`,
      taskData,
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

export const updateTask = async (
  token: string,
  taskId: string,
  updates: Partial<Task>
): Promise<Task> => {
  return retryWithBackoff(async () => {
    const response = await axios.put(
      `${API_URL}/tasks/${taskId}`,
      updates,
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

export const deleteTask = async (
  token: string,
  taskId: string,
  userId: string
): Promise<void> => {
  return retryWithBackoff(async () => {
    await axios.delete(
      `${API_URL}/tasks/${taskId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: { userId }
      }
    );
  });
};


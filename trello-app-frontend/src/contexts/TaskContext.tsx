import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchCurrentUserToken } from '../services/authService';
import { Task, Comment, ActivityLog } from '../types';
import * as taskService from '../services/taskService';
import * as commentService from '../services/commentService';
import * as activityService from '../services/activityService';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  createTask: (task: Omit<Task, 'taskId' | 'createdAt' | 'updatedAt' | 'createdBy'>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string, userId: string) => Promise<void>;
  refreshTasks: () => Promise<void>;
  getComments: (taskId: string) => Promise<Comment[]>;
  addComment: (taskId: string, content: string) => Promise<void>;
  getActivityLog: (taskId: string) => Promise<ActivityLog[]>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await fetchCurrentUserToken();
      
      // Log API URL for debugging (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.log('API URL:', process.env.REACT_APP_API_URL);
      }
      
      const fetchedTasks = await taskService.getTasks(token);
      setTasks(fetchedTasks);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(errorMessage);
      console.error('Error fetching tasks:', err);
      
      // Log additional diagnostic info
      if (!process.env.REACT_APP_API_URL) {
        console.error('REACT_APP_API_URL is not set. Please configure it in AWS Amplify environment variables.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshTasks();
  }, []);

  const createTask = async (taskData: Omit<Task, 'taskId' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    try {
      setError(null);
      const token = await fetchCurrentUserToken();
      const newTask = await taskService.createTask(token, taskData);
      setTasks(prev => [...prev, newTask]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      throw err;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      setError(null);
      const token = await fetchCurrentUserToken();
      const updatedTask = await taskService.updateTask(token, taskId, updates);
      setTasks(prev => prev.map(task => 
        task.taskId === taskId ? updatedTask : task
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      throw err;
    }
  };

  const deleteTask = async (taskId: string, userId: string) => {
    try {
      setError(null);
      const token = await fetchCurrentUserToken();
      await taskService.deleteTask(token, taskId, userId);
      setTasks(prev => prev.filter(task => task.taskId !== taskId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      throw err;
    }
  };

  const getComments = async (taskId: string): Promise<Comment[]> => {
    try {
      const token = await fetchCurrentUserToken();
      return await commentService.getComments(token, taskId);
    } catch (err) {
      console.error('Error fetching comments:', err);
      return [];
    }
  };

  const addComment = async (taskId: string, content: string) => {
    try {
      setError(null);
      const token = await fetchCurrentUserToken();
      await commentService.addComment(token, taskId, content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment');
      throw err;
    }
  };

  const getActivityLog = async (taskId: string): Promise<ActivityLog[]> => {
    try {
      const token = await fetchCurrentUserToken();
      return await activityService.getActivityLog(token, taskId);
    } catch (err) {
      console.error('Error fetching activity log:', err);
      return [];
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        createTask,
        updateTask,
        deleteTask,
        refreshTasks,
        getComments,
        addComment,
        getActivityLog
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};


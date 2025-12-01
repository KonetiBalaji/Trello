export interface Task {
  userId: string;
  taskId: string;
  title: string;
  description: string;
  status: 'To-Do' | 'Doing' | 'Done';
  dueDate: string | null;
  assignedTo: string;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface Comment {
  taskId: string;
  commentId: string;
  userId: string;
  content: string;
  createdAt: number;
}

export interface ActivityLog {
  taskId: string;
  timestamp: number;
  userId: string;
  action: string;
  details: string;
}

export interface User {
  userId: string;
  email: string;
  username: string;
}


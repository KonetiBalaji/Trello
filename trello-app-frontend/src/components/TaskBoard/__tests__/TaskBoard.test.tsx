import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskBoard from '../TaskBoard';
import { TaskProvider } from '../../../contexts/TaskContext';
import { AuthProvider } from '../../../contexts/AuthContext';

// Mock the TaskContext
jest.mock('../../../contexts/TaskContext', () => ({
  ...jest.requireActual('../../../contexts/TaskContext'),
  useTasks: () => ({
    tasks: [
      {
        taskId: '1',
        userId: 'user1',
        title: 'Test Task 1',
        description: 'Description 1',
        status: 'To-Do' as const,
        dueDate: null,
        assignedTo: 'user1',
        createdBy: 'user1',
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      {
        taskId: '2',
        userId: 'user1',
        title: 'Test Task 2',
        description: 'Description 2',
        status: 'Doing' as const,
        dueDate: null,
        assignedTo: 'user1',
        createdBy: 'user1',
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    ],
    loading: false,
    error: null,
    refreshTasks: jest.fn()
  })
}));

// Mock child components
jest.mock('../../TaskCard/TaskCard', () => {
  return function MockTaskCard({ task, onClick }: any) {
    return (
      <div data-testid={`task-card-${task.taskId}`} onClick={onClick}>
        {task.title}
      </div>
    );
  };
});

jest.mock('../../TaskModal/TaskModal', () => {
  return function MockTaskModal({ onClose }: any) {
    return (
      <div data-testid="task-modal">
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

const mockUser = {
  username: 'testuser',
  attributes: {
    email: 'test@example.com',
    sub: 'user1'
  }
};

describe('TaskBoard', () => {
  const renderTaskBoard = () => {
    return render(
      <AuthProvider user={mockUser} signOut={jest.fn()}>
        <TaskProvider>
          <TaskBoard />
        </TaskProvider>
      </AuthProvider>
    );
  };

  it('renders task board with columns', () => {
    renderTaskBoard();
    expect(screen.getByText('My Tasks')).toBeInTheDocument();
    expect(screen.getByText('To-Do')).toBeInTheDocument();
    expect(screen.getByText('Doing')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('displays tasks in correct columns', () => {
    renderTaskBoard();
    expect(screen.getByTestId('task-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('task-card-2')).toBeInTheDocument();
  });

  it('shows create task button', () => {
    renderTaskBoard();
    const createButton = screen.getByText('+ Create Task');
    expect(createButton).toBeInTheDocument();
  });

  it('shows refresh button', () => {
    renderTaskBoard();
    const refreshButton = screen.getByText('↻ Refresh');
    expect(refreshButton).toBeInTheDocument();
  });

  it('shows search input', () => {
    renderTaskBoard();
    const searchInput = screen.getByPlaceholderText(/Search tasks/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('filters tasks by search query', async () => {
    renderTaskBoard();
    const searchInput = screen.getByPlaceholderText(/Search tasks/i);
    
    fireEvent.change(searchInput, { target: { value: 'Test Task 1' } });
    
    await waitFor(() => {
      expect(screen.getByTestId('task-card-1')).toBeInTheDocument();
      expect(screen.queryByTestId('task-card-2')).not.toBeInTheDocument();
    });
  });

  it('filters tasks by status', async () => {
    renderTaskBoard();
    const statusSelect = screen.getByLabelText(/Filter by Status/i);
    
    fireEvent.change(statusSelect, { target: { value: 'To-Do' } });
    
    await waitFor(() => {
      expect(screen.getByTestId('task-card-1')).toBeInTheDocument();
      expect(screen.queryByTestId('task-card-2')).not.toBeInTheDocument();
    });
  });
});


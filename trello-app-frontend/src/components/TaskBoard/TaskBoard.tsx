import React, { useState, useMemo } from 'react';
import { useTasks } from '../../contexts/TaskContext';
import TaskCard from '../TaskCard/TaskCard';
import TaskModal from '../TaskModal/TaskModal';
import { Task } from '../../types';
import './TaskBoard.css';

const TaskBoard: React.FC = () => {
  const { tasks, loading, error, refreshTasks } = useTasks();
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'To-Do' | 'Doing' | 'Done'>('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const statuses: Array<'To-Do' | 'Doing' | 'Done'> = ['To-Do', 'Doing', 'Done'];

  // Filter tasks based on search query and status filter
  const filteredTasks = useMemo(() => {
    let filtered: Task[] = tasks;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.assignedTo.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    return filtered;
  }, [tasks, searchQuery, statusFilter]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshTasks();
    } catch (err) {
      console.error('Error refreshing tasks:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (taskId: string) => {
    setEditingTask(taskId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleCardClick = (taskId: string) => {
    setSelectedTask(selectedTask === taskId ? null : taskId);
  };

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  if (error) {
    const isApiUrlError = error.includes('API URL') || error.includes('REACT_APP_API_URL');
    return (
      <div className="error">
        <div className="error-message">Error: {error}</div>
        {isApiUrlError && (
          <div className="error-help">
            <p><strong>Configuration Issue:</strong></p>
            <p>Please set the <code>REACT_APP_API_URL</code> environment variable in AWS Amplify Console.</p>
            <p>Expected value: <code>https://ngffw8m38d.execute-api.us-east-1.amazonaws.com/prod</code></p>
            <p>See <a href="https://console.aws.amazon.com/amplify" target="_blank" rel="noopener noreferrer">AWS Amplify Console</a> → Your App → Environment variables</p>
          </div>
        )}
        {error.includes('Network Error') && !isApiUrlError && (
          <div className="error-help">
            <p><strong>Troubleshooting:</strong></p>
            <ul>
              <li>Check if the API Gateway URL is correct in AWS Amplify environment variables</li>
              <li>Verify the API Gateway is deployed and accessible</li>
              <li>Check browser console (F12) for detailed error messages</li>
              <li>Ensure CORS is configured correctly in the API Gateway</li>
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="task-board">
      <div className="board-header">
        <h2>My Tasks</h2>
        <div className="board-actions">
          <button 
            onClick={handleRefresh} 
            className="refresh-btn"
            disabled={isRefreshing}
            title="Refresh tasks"
          >
            {isRefreshing ? '⟳' : '↻'} Refresh
          </button>
          <button onClick={handleCreateTask} className="create-task-btn">
            + Create Task
          </button>
        </div>
      </div>

      <div className="board-filters">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search tasks by title, description, or assignee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="status-filter">
          <label htmlFor="status-filter">Filter by Status: </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="status-select"
          >
            <option value="All">All</option>
            <option value="To-Do">To-Do</option>
            <option value="Doing">Doing</option>
            <option value="Done">Done</option>
          </select>
        </div>
      </div>

      {searchQuery || statusFilter !== 'All' ? (
        <div className="filtered-results">
          <p className="results-count">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </p>
          <div className="filtered-tasks-list">
            {filteredTasks.length === 0 ? (
              <div className="no-results">No tasks match your filters</div>
            ) : (
              filteredTasks.map(task => (
                <TaskCard
                  key={task.taskId}
                  task={task}
                  onClick={() => handleCardClick(task.taskId)}
                  onEdit={() => handleEditTask(task.taskId)}
                  isExpanded={selectedTask === task.taskId}
                />
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="board-columns">
          {statuses.map(status => {
            const statusTasks = tasks.filter(task => task.status === status);
            return (
              <div key={status} className="board-column">
                <div className="column-header">
                  <h3>{status}</h3>
                  <span className="task-count">{statusTasks.length}</span>
                </div>
                <div className="column-content">
                  {statusTasks.map(task => (
                    <TaskCard
                      key={task.taskId}
                      task={task}
                      onClick={() => handleCardClick(task.taskId)}
                      onEdit={() => handleEditTask(task.taskId)}
                      isExpanded={selectedTask === task.taskId}
                    />
                  ))}
                  {statusTasks.length === 0 && (
                    <div className="empty-column">No tasks</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <TaskModal
          taskId={editingTask}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default TaskBoard;


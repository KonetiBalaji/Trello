import React, { useState, useEffect } from 'react';
import { useTasks } from '../../contexts/TaskContext';
import { useAuth } from '../../contexts/AuthContext';
import { Task } from '../../types';
import { formatDateForInput } from '../../utils/dateFormatter';
import './TaskModal.css';

interface TaskModalProps {
  taskId: string | null;
  onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ taskId, onClose }) => {
  const { tasks, createTask, updateTask } = useTasks();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To-Do' as 'To-Do' | 'Doing' | 'Done',
    dueDate: '',
    assignedTo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editingTask = taskId ? tasks.find(t => t.taskId === taskId) : null;

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description,
        status: editingTask.status,
        dueDate: formatDateForInput(editingTask.dueDate),
        assignedTo: editingTask.assignedTo
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'To-Do',
        dueDate: '',
        assignedTo: user?.attributes?.sub || ''
      });
    }
  }, [editingTask, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userId = user?.attributes?.sub || '';
      if (!userId) {
        setError('User ID is required');
        setLoading(false);
        return;
      }

      const taskData = {
        userId,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        dueDate: formData.dueDate ? new Date(formData.dueDate).getTime().toString() : null,
        assignedTo: formData.assignedTo || userId
      };

      if (editingTask) {
        await updateTask(taskId!, { ...taskData, userId: editingTask.userId });
      } else {
        await createTask(taskData);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingTask ? 'Edit Task' : 'Create Task'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="task-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter task title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Enter task description"
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="To-Do">To-Do</option>
              <option value="Doing">Doing</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="assignedTo">Assigned To</label>
            <input
              type="text"
              id="assignedTo"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              placeholder={user?.attributes?.sub || 'Enter user ID (defaults to you)'}
              title="Enter the user ID of the person to assign this task to. Leave empty or use your own ID to assign to yourself."
            />
            <small className="form-hint">
              Current user: {user?.attributes?.sub || 'Not available'}
            </small>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Saving...' : editingTask ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;


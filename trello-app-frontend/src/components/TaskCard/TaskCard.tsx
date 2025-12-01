import React from 'react';
import { Task } from '../../types';
import { useTasks } from '../../contexts/TaskContext';
import CommentSection from '../CommentSection/CommentSection';
import ActivityLog from '../ActivityLog/ActivityLog';
import { formatDate, isOverdue as checkOverdue } from '../../utils/dateFormatter';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onEdit: () => void;
  isExpanded: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, onEdit, isExpanded }) => {
  const { updateTask } = useTasks();

  const handleStatusChange = async (newStatus: 'To-Do' | 'Doing' | 'Done') => {
    try {
      await updateTask(task.taskId, { status: newStatus, userId: task.userId });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const isOverdue = checkOverdue(task.dueDate, task.status);

  return (
    <div className={`task-card ${isExpanded ? 'expanded' : ''} ${isOverdue ? 'overdue' : ''}`}>
      <div className="task-card-header" onClick={onClick}>
        <h4 className="task-title">{task.title}</h4>
        <button className="edit-btn" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
          ✏️
        </button>
      </div>
      
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      {task.dueDate && (
        <div className={`task-due-date ${isOverdue ? 'overdue' : ''}`}>
          📅 Due: {formatDate(task.dueDate)}
        </div>
      )}

      <div className="task-status-selector">
        <label>Status: </label>
        <select
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value as 'To-Do' | 'Doing' | 'Done')}
          onClick={(e) => e.stopPropagation()}
        >
          <option value="To-Do">To-Do</option>
          <option value="Doing">Doing</option>
          <option value="Done">Done</option>
        </select>
      </div>

      {isExpanded && (
        <div className="task-card-details" onClick={(e) => e.stopPropagation()}>
          <div className="task-meta">
            <p><strong>Assigned to:</strong> {task.assignedTo}</p>
            <p><strong>Created:</strong> {formatDate(task.createdAt)}</p>
          </div>
          
          <div className="task-sections">
            <CommentSection taskId={task.taskId} />
            <ActivityLog taskId={task.taskId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;


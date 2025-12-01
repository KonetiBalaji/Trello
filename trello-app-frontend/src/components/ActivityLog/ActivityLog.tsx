import React, { useState, useEffect } from 'react';
import { useTasks } from '../../contexts/TaskContext';
import { ActivityLog as ActivityLogType } from '../../types';
import { formatDateTime } from '../../utils/dateFormatter';
import './ActivityLog.css';

interface ActivityLogProps {
  taskId: string;
}

const ActivityLog: React.FC<ActivityLogProps> = ({ taskId }) => {
  const { getActivityLog } = useTasks();
  const [activities, setActivities] = useState<ActivityLogType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadActivityLog();
  }, [taskId]);

  const loadActivityLog = async () => {
    setLoading(true);
    try {
      const fetchedActivities = await getActivityLog(taskId);
      setActivities(fetchedActivities);
    } catch (error) {
      console.error('Error loading activity log:', error);
    } finally {
      setLoading(false);
    }
  };


  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      'TASK_CREATED': 'Task created',
      'TASK_UPDATED': 'Task updated',
      'TASK_DELETED': 'Task deleted',
      'COMMENT_ADDED': 'Comment added'
    };
    return labels[action] || action;
  };

  return (
    <div className="activity-log">
      <h4>Activity Log</h4>
      
      <div className="activities-list">
        {loading ? (
          <div className="loading">Loading activity...</div>
        ) : activities.length === 0 ? (
          <div className="no-activities">No activity yet</div>
        ) : (
          activities.map((activity, index) => (
            <div key={`${activity.taskId}-${activity.timestamp}-${index}`} className="activity-item">
              <div className="activity-header">
                <span className="activity-action">{getActionLabel(activity.action)}</span>
                <span className="activity-date">{formatDateTime(activity.timestamp)}</span>
              </div>
              <div className="activity-user">by {activity.userId}</div>
              {activity.details && (
                <div className="activity-details">
                  {typeof activity.details === 'string' 
                    ? JSON.parse(activity.details) 
                    : activity.details}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityLog;


import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import TaskBoard from '../TaskBoard/TaskBoard';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Trello-like Task Manager</h1>
        <div className="user-info">
          <span>Welcome, {user?.attributes?.email || user?.username}</span>
          <button onClick={signOut} className="sign-out-btn">
            Sign Out
          </button>
        </div>
      </header>
      <main className="dashboard-main">
        <TaskBoard />
      </main>
    </div>
  );
};

export default Dashboard;


import React, { useState, useEffect } from 'react';
import './TodoApp.css';
import { taskService } from './services/taskService';
import type { Task, CreateTaskRequest } from './services/taskService';

const TodoApp: React.FC = () => {
  const [displayedTasks, setDisplayedTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const tasks = await taskService.getAllTasks();
      setDisplayedTasks(tasks);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!title.trim()) return;

    try {
      setLoading(true);
      const newTaskRequest: CreateTaskRequest = {
        title: title.trim(),
        description: description.trim()
      };

      await taskService.createTask(newTaskRequest);
      await fetchTasks(); // Refresh the task list
      setTitle('');
      setDescription('');
      setError(null);
      setShowAddModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create task');
      console.error('Error creating task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDone = async (id: number) => {
    try {
      setLoading(true);
      await taskService.completeTask(id);
      await fetchTasks(); // Refresh the task list to get next tasks
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to complete task');
      console.error('Error completing task:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getCardColor = (index: number) => {
    const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];
    return colors[index % colors.length];
  };

  if (loading && displayedTasks.length === 0) {
    return (
      <div className="todo-container">
        <div className="loading-message">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="todo-container">
      <div className="header">
        <div className="header-left">
          <div className="app-icon">🌟</div>
          <h1>My Tasks</h1>
        </div>
        <button 
          className="add-task-button"
          onClick={() => setShowAddModal(true)}
        >
          + Add Task
        </button>
      </div>

      <div className="tasks-grid">
        {displayedTasks.map((task, index) => (
          <div key={task.id} className="task-card" style={{ borderTopColor: getCardColor(index) }}>
            <div className="task-content">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <div className="task-meta">
                <span className="task-date">
                  🕒 {formatDate(task.createdAt)}
                </span>
              </div>
            </div>
            <button
              className="check-button"
              onClick={() => handleMarkDone(task.id)}
              disabled={loading}
            >
              ✓
            </button>
          </div>
        ))}

        {/* Show message if no more tasks */}
        {displayedTasks.length === 0 && !loading && (
          <div className="no-tasks-message">
            <h3>🎉 All tasks completed!</h3>
            <p>Great job! Add new tasks to continue being productive.</p>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add a Task</h2>
              <button 
                className="close-button" 
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
                rows={4}
                disabled={loading}
              />
            </div>
            <div className="modal-actions">
              <button
                className="cancel-button"
                onClick={() => setShowAddModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="add-button"
                onClick={handleAddTask}
                disabled={loading || !title.trim()}
              >
                {loading ? 'Adding...' : 'Add Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoApp;

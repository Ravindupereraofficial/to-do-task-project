import React, { useState, useEffect } from 'react';
import { taskService } from './services/taskService';
import type { Task, CreateTaskRequest } from './services/taskService';
import './App.css';

interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error';
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<CreateTaskRequest>({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editForm, setEditForm] = useState<CreateTaskRequest>({ title: '', description: '' });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetched = await taskService.getAllTasks();
        setTasks(fetched);
      } catch (e: any) {
        setError(e.message || 'Failed to load tasks');
      } finally {
        setInitialLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const createTask = async () => {
    if (!newTask.title.trim()) return;
    setLoading(true);
    try {
      const created = await taskService.createTask(newTask);
      setTasks(prev => [created, ...prev]);
      setNewTask({ title: '', description: '' });
      setError(null);
      showNotification('Task added successfully!', 'success');
    } catch (e: any) {
      setError(e.message || 'Failed to create task');
      showNotification(e.message || 'Failed to create task', 'error');
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (id: number) => {
    try {
      await taskService.completeTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      showNotification('Task completed successfully!', 'success');
    } catch (e: any) {
      setError(e.message || 'Failed to complete task');
      showNotification(e.message || 'Failed to complete task', 'error');
    }
  };

  const startEditTask = (task: Task) => {
    setEditingTask(task);
    setEditForm({ title: task.title, description: task.description || '' });
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditForm({ title: '', description: '' });
  };

  const saveEdit = async () => {
    if (!editingTask || !editForm.title.trim()) return;

    try {
      // For now, we'll update locally since the backend might not have update endpoint
      setTasks(prev => prev.map(task =>
        task.id === editingTask.id
          ? { ...task, title: editForm.title, description: editForm.description }
          : task
      ));
      setEditingTask(null);
      setEditForm({ title: '', description: '' });
      showNotification('Task updated successfully!', 'success');
    } catch (e: any) {
      showNotification('Failed to update task', 'error');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      createTask();
    }
  };

  // Filter to show only incomplete tasks and limit to 5
  const visibleTasks = tasks.filter(task => !task.completed).slice(0, 5);

  return (
    <div className="page-wrapper">
      <div className="main-content">
        <h1 className="app-title">TaskHub</h1>

        {/* Notifications */}
        <div className="notifications">
          {notifications.map(notification => (
            <div key={notification.id} className={`notification ${notification.type}`}>
              {notification.message}
            </div>
          ))}
        </div>

        <div className="app-container">
          <div className="left-panel">
            <h2 className="panel-title">Add New Task</h2>
            <form className="task-form" onSubmit={(e) => { e.preventDefault(); createTask(); }}>
              <div className="form-group">
                <label htmlFor="task-title" className="form-label">Task Title *</label>
                <input
                  id="task-title"
                  className="text-input"
                  placeholder="Enter task title..."
                  value={newTask.title}
                  maxLength={100}
                  onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                  onKeyDown={handleKeyDown}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="task-description" className="form-label">Description</label>
                <textarea
                  id="task-description"
                  className="text-area"
                  placeholder="Add task description"
                  value={newTask.description}
                  maxLength={500}
                  rows={4}
                  onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <button
                type="submit"
                className="add-btn"
                disabled={!newTask.title.trim() || loading}
              >
                {loading ? (
                  <>
                    <span className="btn-spinner"></span>
                    Adding...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">+</span>
                    Add Task
                  </>
                )}
              </button>
            </form>
            {error && <div className="error-msg" role="alert">{error}</div>}
          </div>

          <div className="divider" aria-hidden="true" />

          <div className="right-panel">
            <h2 className="panel-title">Active Tasks</h2>
            {initialLoading ? (
              <div className="loading-placeholder">
                <div className="loading-spinner"></div>
                Loading tasks...
              </div>
            ) : visibleTasks.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">📝</div>
                <p>No active tasks</p>
                <span>Add a task to get started</span>
              </div>
            ) : (
              <div className="task-list">
                {visibleTasks.map(task => (
                  <div key={task.id} className="task-item">
                    {editingTask?.id === task.id ? (
                      <div className="edit-form">
                        <input
                          className="text-input edit-title"
                          value={editForm.title}
                          onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                          placeholder="Task title..."
                        />
                        <textarea
                          className="text-area edit-desc"
                          value={editForm.description}
                          onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                          placeholder="Task description..."
                          rows={2}
                        />
                        <div className="edit-actions">
                          <button className="save-btn" onClick={saveEdit}>Save</button>
                          <button className="cancel-btn" onClick={cancelEdit}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="task-texts">
                          <h3 className="task-title">{task.title}</h3>
                          {task.description && (
                            <p className="task-desc">{task.description}</p>
                          )}
                        </div>
                        <div className="task-actions">
                          <button
                            className="edit-btn"
                            onClick={() => startEditTask(task)}
                            title="Edit task"
                          >
                            ✏️
                          </button>
                          <button
                            className="done-btn"
                            onClick={() => completeTask(task.id)}
                            title="Mark as complete"
                          >
                            ✓
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

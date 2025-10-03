import React, { useState, useEffect } from 'react';
import { FiPlus, FiCheck, FiClock, FiAlertCircle, FiX } from 'react-icons/fi';
import './App.css';
import { taskService } from './services/taskService';
import type { Task, CreateTaskRequest } from './services/taskService';

interface ErrorState {
  message: string;
  type: 'error' | 'warning' | 'info';
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTask, setNewTask] = useState<CreateTaskRequest>({
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<ErrorState | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const showError = (message: string, type: 'error' | 'warning' | 'info' = 'error') => {
    setError({ message, type });
    // Auto-hide error after 5 seconds
    setTimeout(() => setError(null), 5000);
  };

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await taskService.getAllTasks();
      setTasks(fetchedTasks);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      if (error.status === 0) {
        showError(error.message, 'warning');
      } else {
        showError(`Failed to fetch tasks: ${error.message}`);
      }
    } finally {
      setInitialLoading(false);
    }
  };

  const createTask = async () => {
    if (!newTask.title.trim()) {
      showError('Please enter a task title.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const createdTask = await taskService.createTask(newTask);
      setTasks([createdTask, ...tasks]);
      setNewTask({ title: '', description: '' });
      setIsFormOpen(false);
      setError(null);
      showError('Task created successfully!', 'info');
    } catch (error: any) {
      console.error('Error creating task:', error);
      showError(`Failed to create task: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (id: number) => {
    try {
      const updatedTask = await taskService.completeTask(id);
      setTasks(tasks.map(task =>
        task.id === id ? updatedTask : task
      ));
      setError(null);
      showError('Task completed!', 'info');
    } catch (error: any) {
      console.error('Error completing task:', error);
      showError(`Failed to complete task: ${error.message}`);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter') {
      action();
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setNewTask({ title: '', description: '' });
  };

  if (initialLoading) {
    return (
      <div className="app">
        <div className="background-gradient"></div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="background-gradient"></div>

      {/* Error/Success notification */}
      {error && (
        <div className={`notification ${error.type}`}>
          <div className="notification-content">
            <FiAlertCircle size={16} />
            <span>{error.message}</span>
            <button
              className="notification-close"
              onClick={() => setError(null)}
              aria-label="Close notification"
            >
              <FiX size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="container">
        <header className="header">
          <div className="header-content">
            <h1 className="title">
              <span className="title-icon">✨</span>
              My Tasks
            </h1>
            <p className="subtitle">Stay organized and productive</p>
          </div>
          
          <button
            className="add-task-btn"
            onClick={() => setIsFormOpen(true)}
            aria-label="Add new task"
          >
            <FiPlus size={20} />
            Add Task
          </button>
        </header>

        {isFormOpen && (
          <div
            className="form-overlay"
            onClick={closeForm}
            role="dialog"
            aria-labelledby="form-title"
            aria-modal="true"
          >
            <div
              className="task-form"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 id="form-title">Add a New Task</h3>
              <input
                type="text"
                placeholder="Task title..."
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                onKeyPress={(e) => handleKeyPress(e, createTask)}
                className="form-input"
                autoFocus
                maxLength={100}
                aria-label="Task title"
                required
              />
              <textarea
                placeholder="Description (optional)..."
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="form-textarea"
                rows={3}
                maxLength={500}
                aria-label="Task description"
              />
              <div className="form-actions">
                <button
                  type="button"
                  onClick={closeForm}
                  className="btn-cancel"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={createTask}
                  disabled={loading || !newTask.title.trim()}
                  className="btn-create"
                >
                  {loading ? (
                    <>
                      <div className="button-spinner"></div>
                      Creating...
                    </>
                  ) : (
                    'Create Task'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="tasks-container">
          {tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No tasks yet</h3>
              <p>Create your first task to get started!</p>
              <button
                className="empty-state-btn"
                onClick={() => setIsFormOpen(true)}
              >
                <FiPlus size={16} />
                Create your first task
              </button>
            </div>
          ) : (
            <div className="tasks-grid">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`task-card ${task.completed ? 'completed' : ''}`}
                  role="article"
                  aria-label={`Task: ${task.title}`}
                >
                  <div className="task-header">
                    <h3 className="task-title">{task.title}</h3>
                    <button
                      className={`complete-btn ${task.completed ? 'completed' : ''}`}
                      onClick={() => completeTask(task.id)}
                      disabled={task.completed}
                      aria-label={task.completed ? 'Task completed' : 'Mark task as complete'}
                      title={task.completed ? 'Task completed' : 'Mark as complete'}
                    >
                      <FiCheck size={16} />
                    </button>
                  </div>
                  
                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}
                  
                  <div className="task-footer">
                    <div className="task-date">
                      <FiClock size={14} />
                      {formatDate(task.createdAt)}
                    </div>
                    {task.completed && (
                      <span className="completed-badge">
                        <FiCheck size={12} />
                        Done
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;

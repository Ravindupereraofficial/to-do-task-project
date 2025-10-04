import React, { useState, useEffect } from 'react';
import { taskService } from './services/taskService';
import type { Task, CreateTaskRequest } from './services/taskService';
import './App.css';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<CreateTaskRequest>({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const createTask = async () => {
    if (!newTask.title.trim()) return;
    setLoading(true);
    try {
      const created = await taskService.createTask(newTask);
      setTasks(prev => [created, ...prev]);
      setNewTask({ title: '', description: '' });
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (id: number) => {
    try {
      await taskService.completeTask(id);
      // Remove the completed task from the list instead of updating it
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (e: any) {
      setError(e.message || 'Failed to complete task');
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
      <div className="app-container">
        <div className="left-panel">
          <h2 className="panel-title">Add a Task</h2>
          <div className="form-group">
            <input
              className="text-input"
              placeholder="Title"
              value={newTask.title}
              maxLength={100}
              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="form-group">
            <textarea
              className="text-area"
              placeholder="Description"
              value={newTask.description}
              maxLength={500}
              rows={5}
              onChange={e => setNewTask({ ...newTask, description: e.target.value })}
              onKeyDown={handleKeyDown}
            />
          </div>
          <button
            className="add-btn"
            disabled={!newTask.title.trim() || loading}
            onClick={createTask}
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
          {error && <div className="error-msg" role="alert">{error}</div>}
        </div>
        <div className="divider" aria-hidden="true" />
        <div className="right-panel">
          {initialLoading ? (
            <div className="loading-placeholder">Loading tasks...</div>
          ) : visibleTasks.length === 0 ? (
            <div className="empty">No tasks yet.</div>
          ) : (
            <div className="task-list">
              {visibleTasks.map(task => (
                <div key={task.id} className="task-item">
                  <div className="task-texts">
                    <h3 className="task-title">{task.title}</h3>
                    {task.description && (
                      <p className="task-desc">{task.description}</p>
                    )}
                  </div>
                  <button
                    className="done-btn"
                    onClick={() => completeTask(task.id)}
                  >
                    Done
                  </button>
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

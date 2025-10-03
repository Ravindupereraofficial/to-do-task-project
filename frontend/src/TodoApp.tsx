import React, { useState, useEffect } from 'react';
import './TodoApp.css';
import { taskService } from './services/taskService';
import type { Task, CreateTaskRequest } from './services/taskService';

const TodoApp: React.FC = () => {
  // Tasks from backend API
  const [displayedTasks, setDisplayedTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Edit mode state
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Fetch tasks from backend on component mount
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

  const handleEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || editingTaskId === null) return;

    try {
      setLoading(true);
      const updateRequest: CreateTaskRequest = {
        title: editTitle.trim(),
        description: editDescription.trim()
      };

      await taskService.updateTask(editingTaskId, updateRequest);
      await fetchTasks(); // Refresh the task list
      setEditingTaskId(null);
      setEditTitle('');
      setEditDescription('');
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
      console.error('Error updating task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditTitle('');
    setEditDescription('');
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
      <div className="left-panel">
        <h2>Add a Task</h2>
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
        <button
          className="add-button"
          onClick={handleAddTask}
          disabled={loading || !title.trim()}
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </div>

      <div className="right-panel">
        {displayedTasks.map((task) => (
          <div key={task.id} className="task-card">
            {editingTaskId === task.id ? (
              // Edit mode
              <div className="edit-form">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="edit-title-input"
                  placeholder="Task title"
                  disabled={loading}
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="edit-description-input"
                  placeholder="Task description"
                  rows={2}
                  disabled={loading}
                />
                <div className="edit-actions">
                  <button
                    className="save-button"
                    onClick={handleSaveEdit}
                    disabled={loading || !editTitle.trim()}
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    className="cancel-button"
                    onClick={handleCancelEdit}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View mode
              <>
                <div className="task-content" onClick={() => handleEditTask(task)}>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                </div>
                <div className="task-actions">
                  <button
                    className="edit-button"
                    onClick={() => handleEditTask(task)}
                    title="Edit task"
                    disabled={loading}
                  >
                    ✏️
                  </button>
                  <button
                    className="done-button"
                    onClick={() => handleMarkDone(task.id)}
                    disabled={loading}
                  >
                    {loading ? 'Done...' : 'Done'}
                  </button>
                </div>
              </>
            )}
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
    </div>
  );
};

export default TodoApp;

import axios from 'axios';
import type { AxiosResponse } from 'axios';

export interface Task {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  completed: boolean;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

class TaskService {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/tasks';
  }

  async getAllTasks(): Promise<Task[]> {
    try {
      const response: AxiosResponse<Task[]> = await axios.get(`${this.baseURL}/recent`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createTask(task: CreateTaskRequest): Promise<Task> {
    try {
      const response: AxiosResponse<Task> = await axios.post(this.baseURL, task);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async completeTask(id: number): Promise<Task> {
    try {
      const response: AxiosResponse<Task> = await axios.put(`${this.baseURL}/${id}/complete`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateTask(id: number, task: CreateTaskRequest): Promise<Task> {
    try {
      const response: AxiosResponse<Task> = await axios.put(`${this.baseURL}/${id}`, task);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteTask(id: number): Promise<void> {
    try {
      await axios.delete(`${this.baseURL}/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): ApiError {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        return {
          message: 'Unable to connect to the server. Please make sure the backend is running.',
          status: 0
        };
      }
      return {
        message: error.response?.data?.message || error.message || 'An error occurred',
        status: error.response?.status
      };
    }
    return {
      message: 'An unexpected error occurred',
      status: 500
    };
  }
}

export const taskService = new TaskService();

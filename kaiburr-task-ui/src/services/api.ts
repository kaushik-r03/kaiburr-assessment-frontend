import axios, { AxiosResponse } from 'axios';
import { Task, CreateTaskRequest } from '../types';

const API_BASE_URL = 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const taskAPI = {
  // Get all tasks
  getAllTasks: async (): Promise<Task[]> => {
    const response: AxiosResponse<Task[]> = await apiClient.get('/tasks');
    return Array.isArray(response.data) ? response.data : [];
  },

  // Get single task by ID
  getTaskById: async (id: string): Promise<Task> => {
    const response: AxiosResponse<Task> = await apiClient.get(`/tasks?id=${id}`);
    return response.data;
  },

  // Create task
  createTask: async (task: CreateTaskRequest): Promise<Task> => {
    const taskData = {
      ...task,
      id: task.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      taskExecutions: []
    };
    
    const response: AxiosResponse<Task> = await apiClient.put('/tasks', taskData);
    return response.data;
  },

  // Update existing task
  updateTask: async (task: Task): Promise<Task> => {
    const response: AxiosResponse<Task> = await apiClient.put('/tasks', task);
    return response.data;
  },

  // Delete task
  deleteTask: async (id: string): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },

  // Search tasks by name
  searchTasks: async (name: string): Promise<Task[]> => {
    if (!name.trim()) {
      return taskAPI.getAllTasks();
    }
    const response: AxiosResponse<Task[]> = await apiClient.get(`/tasks/search?name=${encodeURIComponent(name)}`);
    return Array.isArray(response.data) ? response.data : [];
  },

  // Execute task
  executeTask: async (id: string): Promise<Task> => {
    const response: AxiosResponse<Task> = await apiClient.put(`/tasks/${id}/execute`);
    return response.data;
  }
};

export default taskAPI;
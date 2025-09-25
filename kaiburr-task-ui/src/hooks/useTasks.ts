import { useState, useEffect, useCallback } from 'react';
import { Task, CreateTaskRequest } from '../types';
import { taskAPI } from '../services/api';
import { message } from 'antd';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await taskAPI.getAllTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      message.error('Failed to load tasks. Please try again.');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search tasks
  const searchTasks = useCallback(async (searchName: string) => {
    if (!searchName.trim()) {
      fetchTasks();
      return;
    }

    setLoading(true);
    try {
      const data = await taskAPI.searchTasks(searchName);
      setTasks(data);
    } catch (error) {
      console.error('Error searching tasks:', error);
      message.error('Failed to search tasks. Please try again.');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [fetchTasks]);

  // Create task
  const createTask = useCallback(async (taskData: CreateTaskRequest): Promise<boolean> => {
    try {
      const newTask = await taskAPI.createTask(taskData);
      setTasks(prev => [...prev, newTask]);
      message.success('Task created successfully!');
      return true;
    } catch (error) {
      console.error('Error creating task:', error);
      message.error('Failed to create task. Please try again.');
      return false;
    }
  }, []);

  // Update task
  const updateTask = useCallback(async (task: Task): Promise<boolean> => {
    try {
      const updatedTask = await taskAPI.updateTask(task);
      setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));
      message.success('Task updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating task:', error);
      message.error('Failed to update task. Please try again.');
      return false;
    }
  }, []);

  // Delete task
  const deleteTask = useCallback(async (id: string): Promise<boolean> => {
    try {
      await taskAPI.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      message.success('Task deleted successfully!');
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      message.error('Failed to delete task. Please try again.');
      return false;
    }
  }, []);

  // Execute task
  const executeTask = useCallback(async (id: string): Promise<boolean> => {
    try {
      const updatedTask = await taskAPI.executeTask(id);
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      message.success('Task executed successfully!');
      return true;
    } catch (error) {
      console.error('Error executing task:', error);
      message.error('Failed to execute task. Please try again.');
      return false;
    }
  }, []);

  // Load tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchTasks(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchTasks]);

  return {
    tasks,
    loading,
    searchTerm,
    setSearchTerm,
    createTask,
    updateTask,
    deleteTask,
    executeTask,
    refreshTasks: fetchTasks,
  };
};
'use client';

import { useState, useCallback, useEffect } from 'react';
import { TaskDTO, TaskStatus } from '../models/task.schema';
import { getTasks, updateTaskStatus, getTaskDetails } from '../services/task_actions';

export interface TaskFilters {
  status?: string;
  category?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export function useTasksViewModel(initialFilters: TaskFilters = { page: 1, pageSize: 10 }) {
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilters>(initialFilters);

  const [selectedTask, setSelectedTask] = useState<TaskDTO | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchTasks = useCallback(async (currentFilters: TaskFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getTasks(
        currentFilters.page, 
        currentFilters.status || 'all', 
        currentFilters.pageSize, 
        currentFilters.search
      );
      if (result.success) {
        setTasks(result.data.tasks);
        setTotalTasks(result.data.count);
      } else {
        setError(result.error);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const changeFilters = (newFilters: Partial<TaskFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: newFilters.page ?? 1 }));
  };

  const handleUpdateStatus = async (taskId: string, status: TaskStatus, reason: string) => {
    setIsUpdating(true);
    try {
      const result = await updateTaskStatus(taskId, status, reason);
      if (result.success) {
        await fetchTasks(filters); // Refresh
        return true;
      } else {
        setError(result.error);
        return false;
      }
    } catch (e: any) {
      setError(e.message);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const loadTaskDetails = async (taskId: string) => {
    setIsLoading(true);
    try {
        const result = await getTaskDetails(taskId);
        if (result.success) {
            setSelectedTask(result.data);
        } else {
            setError(result.error);
        }
    } catch (e: any) {
        setError(e.message);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(filters);
  }, [filters, fetchTasks]);

  return {
    tasks,
    totalTasks,
    isLoading,
    error,
    filters,
    selectedTask,
    isUpdating,
    changeFilters,
    handleUpdateStatus,
    loadTaskDetails,
    setSelectedTask,
    refreshTasks: () => fetchTasks(filters)
  };
}

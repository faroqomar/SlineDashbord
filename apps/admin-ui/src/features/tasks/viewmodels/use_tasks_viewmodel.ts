import { useState, useCallback, useEffect } from 'react';
import { TaskDTO, TaskStatus } from '../models/task.schema';
import { tasksApi } from '../services/tasks_api';
import type { TaskQueueAnalyticsData } from '@sline/shared';

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
  const [heroAnalytics, setHeroAnalytics] = useState<TaskQueueAnalyticsData | null>(null);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (currentFilters: TaskFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await tasksApi.getTasks({
        page: currentFilters.page, 
        status: currentFilters.status || 'all', 
        limit: currentFilters.pageSize, 
        query: currentFilters.search
      });
      setTasks(data.tasks);
      setTotalTasks(data.count);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const changeFilters = (newFilters: Partial<TaskFilters>) => {
    setFilters((prev: TaskFilters) => ({ ...prev, ...newFilters, page: newFilters.page ?? prev.page ?? 1 }));
  };

  const handleUpdateStatus = async (taskId: string, status: TaskStatus, reason: string) => {
    setIsUpdating(true);
    try {
      await tasksApi.updateTaskStatus(taskId, status, reason);
      await fetchTasks(filters); // Refresh
      return true;
    } catch (e: any) {
      setError(e.message);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const loadTaskDetails = async (taskId: string) => {
    setIsLoading(true);
    setError(null);
    try {
        const details = await tasksApi.getTaskDetails(taskId);
        setSelectedTask(details as any);
    } catch (e: any) {
        setError(e.message);
    } finally {
        setIsLoading(false);
    }
  };

  const fetchHeroAnalytics = useCallback(async () => {
    setIsAnalyticsLoading(true);
    setAnalyticsError(null);
    try {
      const data = await tasksApi.getTaskQueueAnalytics('7d');
      setHeroAnalytics(data);
    } catch (e: any) {
      setAnalyticsError(e.message);
    } finally {
      setIsAnalyticsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks(filters);
  }, [filters, fetchTasks]);

  useEffect(() => {
    fetchHeroAnalytics();
  }, [fetchHeroAnalytics]);

  const refreshTasks = async () => {
    await Promise.all([fetchTasks(filters), fetchHeroAnalytics()]);
  };

  return {
    tasks,
    totalTasks,
    isLoading,
    error,
    filters,
    selectedTask,
    isUpdating,
    heroAnalytics,
    isAnalyticsLoading,
    analyticsError,
    changeFilters,
    handleUpdateStatus,
    loadTaskDetails,
    setSelectedTask,
    refreshTasks,
  };
}

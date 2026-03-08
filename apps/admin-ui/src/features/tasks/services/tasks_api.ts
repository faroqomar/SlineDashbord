import { request } from "../../../lib/api";
import type { TaskActivityResponse, TaskQueueAnalyticsData } from '@sline/shared';
import type { TaskDTO, TaskDetailsDTO, TaskStatus } from '../models/task.schema';

export const tasksApi = {
  getTasks: async (params: { page?: number, limit?: number, status?: string, query?: string }) => {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') search.append(k, String(v));
    });
    
    const res = await request<{ tasks: TaskDTO[], count: number, totalPages: number }>('GET', `/tasks?${search.toString()}`);
    if (!res.ok) throw new Error(res.error?.message || 'Failed to fetch tasks');
    return res.data;
  },
  
  getTaskDetails: async (id: string) => {
    const res = await request<TaskDetailsDTO>('GET', `/tasks/${id}`);
    if (!res.ok) throw new Error(res.error?.message || 'Failed to fetch task');
    return res.data;
  },
  
  getTaskActivity: async (id: string) => {
    const res = await request<TaskActivityResponse>('GET', `/tasks/${id}/activity`);
    if (!res.ok) throw new Error(res.error?.message || 'Failed to fetch activity');
    return res.data;
  },

  getTaskQueueAnalytics: async (range: '7d' = '7d') => {
    const res = await request<TaskQueueAnalyticsData>('GET', `/tasks/queue-analytics?range=${range}`);
    if (!res.ok) throw new Error(res.error?.message || 'Failed to fetch queue analytics');
    return res.data;
  },
  
  updateTaskStatus: async (id: string, status: TaskStatus, reason: string) => {
    const res = await request<{ id: string }>('POST', `/tasks/${id}/status`, { status, reason });
    if (!res.ok) throw new Error(res.error?.message || 'Failed to update status');
    return res.data;
  }
};

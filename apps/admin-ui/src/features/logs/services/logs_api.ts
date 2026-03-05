import { request } from '@/lib/api';

export type LogStatus = 'success' | 'warning' | 'error' | 'info';

export interface LogListItem {
  id: string;
  action: string;
  actorUserId: string | null;
  actorName: string | null;
  entityType: string | null;
  entityId: string | null;
  status: LogStatus;
  createdAt: string;
  meta?: Record<string, unknown>;
}

export interface LogListResponse {
  logs: LogListItem[];
  count: number;
  totalPages: number;
}

export interface LogListQuery {
  page: number;
  limit: number;
  action?: string;
  actorUserId?: string;
  from?: string;
  to?: string;
}

export const logsApi = {
  getLogs: async (query: LogListQuery): Promise<LogListResponse> => {
    const params = new URLSearchParams();
    params.set('page', String(query.page));
    params.set('limit', String(query.limit));
    if (query.action) params.set('action', query.action);
    if (query.actorUserId) params.set('actorUserId', query.actorUserId);
    if (query.from) params.set('from', query.from);
    if (query.to) params.set('to', query.to);

    const res = await request<LogListResponse>('GET', `logs?${params.toString()}`);
    if (!res.ok) throw new Error(res.error?.message || 'Failed to fetch logs');
    return res.data;
  },
};

import type { LogExportQuery, LogListQuery, LogListResponse } from '@sline/shared';
import api, { request } from '@/lib/api';
import { createScopedLogger } from '@/lib/appLogger';

const log = createScopedLogger('Logs:API');

type LogQueryParams = Partial<LogExportQuery> & { page?: number };

function buildQueryParams(query: LogQueryParams) {
  const params = new URLSearchParams();
  if (query.page != null) params.set('page', String(query.page));
  if (query.limit != null) params.set('limit', String(query.limit));
  if (query.q) params.set('q', query.q);
  if (query.action) params.set('action', query.action);
  if (query.actorUserId) params.set('actorUserId', query.actorUserId);
  if (query.from) params.set('from', query.from);
  if (query.to) params.set('to', query.to);
  if (query.level && query.level !== 'all') params.set('level', query.level);
  if (query.source) params.set('source', query.source);
  if (query.sort) params.set('sort', query.sort);
  return params;
}

export const logsApi = {
  getLogs: async (query: LogListQuery): Promise<LogListResponse> => {
    const params = buildQueryParams(query);
    log.debug('getLogs request', { page: query.page, limit: query.limit, level: query.level, source: query.source });
    const res = await request<LogListResponse>('GET', `logs?${params.toString()}`);
    if (!res.ok) {
      log.error('getLogs failed', { code: res.error?.code, message: res.error?.message });
      throw new Error(res.error?.message || 'Failed to fetch logs');
    }
    log.info('getLogs success', { count: res.data?.count ?? 0, totalPages: res.data?.totalPages ?? 0 });
    return res.data;
  },

  exportLogs: async (query: Partial<LogExportQuery>): Promise<void> => {
    const params = buildQueryParams(query);
    log.info('exportLogs start', { level: query.level, source: query.source });
    try {
      const response = await api.get(`/logs/export?${params.toString()}`, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download =
        response.headers['content-disposition']?.match(/filename="?([^"]+)"?/)?.[1] ||
        'sline_system_logs.csv';
      anchor.click();
      URL.revokeObjectURL(url);
      log.info('exportLogs success', { filename: anchor.download });
    } catch (err) {
      log.error('exportLogs failed', { error: err instanceof Error ? err.message : String(err) });
      throw err;
    }
  },
};

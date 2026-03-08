import { request } from '../../../lib/api';
import type {
  AdminCase,
  AdminCaseDetail,
  AdminCasesHeroSeries,
  AdminCaseCreateInput,
  AdminCaseAttachEntityInput,
  AdminCaseAssignInput,
  AdminCaseStatusInput,
  AdminCaseNoteInput,
} from '@sline/shared';

export const casesApi = {
  listCases: async (params: {
    page?: number;
    limit?: number;
    q?: string;
    status?: string;
    priority?: string;
    source?: string;
    sort?: 'created_desc' | 'created_asc';
  } = {}) => {
    const search = new URLSearchParams();
    if (params.page != null) search.append('page', String(params.page));
    if (params.limit != null) search.append('limit', String(params.limit));
    if (params.q) search.append('q', params.q);
    if (params.status) search.append('status', params.status);
    if (params.priority) search.append('priority', params.priority);
    if (params.source) search.append('source', params.source);
    if (params.sort) search.append('sort', params.sort);
    const res = await request<{
      cases: AdminCase[];
      total: number;
      page: number;
      limit: number;
      totalPages?: number;
    }>('GET', `/cases?${search.toString()}`);
    if (!res.ok) throw new Error(res.error?.message ?? 'Failed to fetch cases');
    return res.data;
  },

  getCasesAnalytics: async (params: { window?: '7d' } = {}) => {
    const search = new URLSearchParams();
    if (params.window) search.append('window', params.window);
    const qs = search.toString();
    const res = await request<AdminCasesHeroSeries>('GET', `/cases/analytics${qs ? `?${qs}` : ''}`);
    if (!res.ok) throw new Error(res.error?.message ?? 'Failed to fetch cases analytics');
    return res.data;
  },

  getCase: async (caseId: string) => {
    const res = await request<AdminCaseDetail>('GET', `/cases/${caseId}`);
    if (!res.ok) throw new Error(res.error?.message ?? 'Failed to fetch case');
    return res.data;
  },

  createCase: async (input: AdminCaseCreateInput) => {
    const res = await request<AdminCase>('POST', '/cases', input);
    if (!res.ok) throw new Error(res.error?.message ?? 'Failed to create case');
    return res.data;
  },

  attachEntity: async (caseId: string, input: AdminCaseAttachEntityInput) => {
    const res = await request<{ id: string }>('POST', `/cases/${caseId}/entities`, input);
    if (!res.ok) throw new Error(res.error?.message ?? 'Failed to attach entity');
    return res.data;
  },

  assignCase: async (caseId: string, input: AdminCaseAssignInput) => {
    const res = await request<{ id: string; assignee_id?: string | null }>('POST', `/cases/${caseId}/assign`, input);
    if (!res.ok) throw new Error(res.error?.message ?? 'Failed to assign case');
    return res.data;
  },

  updateStatus: async (caseId: string, input: AdminCaseStatusInput) => {
    const res = await request<{ id: string; status: string }>('POST', `/cases/${caseId}/status`, input);
    if (!res.ok) throw new Error(res.error?.message ?? 'Failed to update status');
    return res.data;
  },

  addNote: async (caseId: string, input: AdminCaseNoteInput) => {
    const res = await request<{ id: string; note_id?: string }>('POST', `/cases/${caseId}/note`, input);
    if (!res.ok) throw new Error(res.error?.message ?? 'Failed to add note');
    return res.data;
  },
};

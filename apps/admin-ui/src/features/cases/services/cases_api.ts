import { request } from '../../../lib/api';
import type {
  AdminCase,
  AdminCaseDetail,
  AdminCaseCreateInput,
  AdminCaseAttachEntityInput,
} from '@sline/shared';

export const casesApi = {
  listCases: async (params: { page?: number; limit?: number } = {}) => {
    const search = new URLSearchParams();
    if (params.page != null) search.append('page', String(params.page));
    if (params.limit != null) search.append('limit', String(params.limit));
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
};

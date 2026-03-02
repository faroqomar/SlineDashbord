import { request } from '../../../lib/api';
import type {
  ReportListItem,
  ReportDetail,
  TriageReportInput,
  CloseReportInput,
  ReportStatus,
  ReportEntityType,
} from '@sline/shared';

export type ListReportsParams = {
  status?: ReportStatus;
  entity_type?: ReportEntityType;
  page?: number;
  limit?: number;
};

export type ListReportsResponse = {
  reports: ReportListItem[];
  total: number;
  page: number;
  limit: number;
};

export const reportsApi = {
  list: async (params: ListReportsParams = {}): Promise<ListReportsResponse> => {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && String(v) !== '') search.append(k, String(v));
    });
    const res = await request<ListReportsResponse>('GET', `/reports?${search.toString()}`);
    if (!res.ok) throw new Error(res.error?.message ?? 'Failed to fetch reports');
    return res.data;
  },

  getById: async (reportId: string): Promise<ReportDetail> => {
    const res = await request<ReportDetail>('GET', `/reports/${reportId}`);
    if (!res.ok) throw new Error(res.error?.message ?? 'Failed to fetch report');
    return res.data;
  },

  triage: async (reportId: string, body: TriageReportInput): Promise<{ id: string }> => {
    const res = await request<{ id: string }>('POST', `/reports/${reportId}/triage`, body);
    if (!res.ok) throw new Error(res.error?.message ?? 'Triage failed');
    return res.data;
  },

  close: async (reportId: string, body: CloseReportInput): Promise<{ id: string }> => {
    const res = await request<{ id: string }>('POST', `/reports/${reportId}/close`, body);
    if (!res.ok) throw new Error(res.error?.message ?? 'Close failed');
    return res.data;
  },
};

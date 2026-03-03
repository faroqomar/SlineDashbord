import { request } from '../../../lib/api';
import type {
  ReportListItem,
  ReportDetail,
  TriageReportInput,
  CloseReportInput,
  DismissReportInput,
  EscalateReportInput,
  ReportSeverity,
  ReportStatus,
  ReportEntityType,
} from '@sline/shared';

export type ListReportsParams = {
  status?: ReportStatus;
  entity_type?: ReportEntityType;
  severity?: ReportSeverity;
  assigned_admin_id?: string;
  assigned_to_me?: boolean;
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
    const res = await request<{ id: string; case_id?: string }>('POST', `/reports/${reportId}/triage`, body);
    if (!res.ok) throw new Error(res.error?.message ?? 'Triage failed');
    return res.data;
  },

  dismiss: async (reportId: string, body: DismissReportInput): Promise<{ id: string }> => {
    const res = await request<{ id: string }>('POST', `/reports/${reportId}/dismiss`, body);
    if (!res.ok) throw new Error(res.error?.message ?? 'Dismiss failed');
    return res.data;
  },

  escalate: async (reportId: string, body: EscalateReportInput): Promise<{ id: string; case_id: string }> => {
    const res = await request<{ id: string; case_id: string }>('POST', `/reports/${reportId}/escalate`, body);
    if (!res.ok) throw new Error(res.error?.message ?? 'Escalation failed');
    return res.data;
  },

  close: async (reportId: string, body: CloseReportInput): Promise<{ id: string }> => {
    const res = await request<{ id: string }>('POST', `/reports/${reportId}/close`, body);
    if (!res.ok) throw new Error(res.error?.message ?? 'Close failed');
    return res.data;
  },
};

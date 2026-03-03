import type { ApprovalRow, ApprovalRequest } from '@sline/shared';
import { request } from '@/lib/api';
import api from '@/lib/api';
import type {
  PlatformMetrics,
  JournalLedgerEntry,
  WithdrawalRequest,
  TransactionFilters,
  TransactionCursor,
  WalletSummary,
  AuditLogEntry,
} from '../models/finance.model';

export interface AuditLogFilters {
  action?: string;
  actor_user_id?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
}
export interface AuditLogCursor {
  created_at: string;
  id: string;
}
export interface UserFinanceLookupResult {
  wallet: WalletSummary | null;
  timeline: { data: JournalLedgerEntry[]; nextCursor?: undefined };
}

export const financeApi = {
  getMetrics: async () => {
    const res = await request<PlatformMetrics>('GET', 'finance/metrics');
    if (!res.ok) throw new Error(res.error?.message || 'Failed to fetch metrics');
    return res.data;
  },

  getTransactions: async (filters: TransactionFilters, cursor?: TransactionCursor) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.append(k, String(v));
    });
    if (cursor) {
      params.append('cursor_created_at', cursor.created_at);
      params.append('cursor_id', cursor.journal_id);
    }
    const res = await request<{ data: JournalLedgerEntry[]; nextCursor?: TransactionCursor }>(
      'GET',
      `finance/transactions?${params.toString()}`
    );
    if (!res.ok) throw new Error(res.error?.message || 'Failed to fetch transactions');
    return res.data;
  },

  getWithdrawals: async (filters: { status?: string; limit?: number }, cursor?: { created_at: string; id: string }) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.append(k, String(v));
    });
    if (cursor) {
      params.append('cursor_created_at', cursor.created_at);
      params.append('cursor_id', cursor.id);
    }
    const res = await request<{ data: WithdrawalRequest[]; nextCursor?: { created_at: string; id: string } }>(
      'GET',
      `finance/withdrawals?${params.toString()}`
    );
    if (!res.ok) throw new Error(res.error?.message || 'Failed to fetch withdrawals');
    return res.data;
  },

  /** Transaction detail; pass reveal: true to get meta_full (audit written server-side). */
  getTransactionDetail: async (journalId: string, reveal?: boolean) => {
    const url = reveal ? `finance/transactions/${journalId}?reveal=1` : `finance/transactions/${journalId}`;
    const res = await request<JournalLedgerEntry & Record<string, unknown>>('GET', url);
    if (!res.ok) throw new Error(res.error?.message || 'Failed to fetch transaction details');
    return res.data;
  },

  getTransactionDetails: async (journalId: string) => {
    return financeApi.getTransactionDetail(journalId);
  },

  getAuditLogs: async (
    filters: AuditLogFilters,
    cursor?: AuditLogCursor
  ): Promise<{ data: AuditLogEntry[]; nextCursor?: AuditLogCursor }> => {
    const params = new URLSearchParams();
    if (filters.action) params.set('action', filters.action);
    if (filters.actor_user_id) params.set('actor_user_id', filters.actor_user_id);
    if (filters.start_date) params.set('start_date', filters.start_date);
    if (filters.end_date) params.set('end_date', filters.end_date);
    if (filters.limit) params.set('limit', String(filters.limit));
    if (cursor) {
      params.set('cursor_created_at', cursor.created_at);
      params.set('cursor_id', cursor.id);
    }
    const res = await request<{ data: AuditLogEntry[]; nextCursor?: AuditLogCursor }>(
      'GET',
      `finance/audit?${params.toString()}`
    );
    if (!res.ok) throw new Error(res.error?.message || 'Failed to fetch audit logs');
    return res.data;
  },

  getAuditExport: async (filters: AuditLogFilters): Promise<void> => {
    const params = new URLSearchParams();
    if (filters.action) params.set('action', filters.action);
    if (filters.actor_user_id) params.set('actor_user_id', filters.actor_user_id);
    if (filters.start_date) params.set('start_date', filters.start_date);
    if (filters.end_date) params.set('end_date', filters.end_date);
    if (filters.limit) params.set('limit', String(Math.min(filters.limit ?? 10000, 10000)));
    const response = await api.get(`/finance/audit/export?${params.toString()}`, { responseType: 'blob' });
    const blob = new Blob([response.data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = response.headers['content-disposition']?.match(/filename="?([^"]+)"?/)?.[1] || 'sline_audit_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  },

  getUserFinanceLookup: async (userId: string): Promise<UserFinanceLookupResult> => {
    const res = await request<UserFinanceLookupResult>('GET', `finance/users/${userId}`);
    if (!res.ok) throw new Error(res.error?.message || 'Failed to fetch user finance');
    return res.data;
  },

  approveWithdrawal: async (requestId: string, reason?: string) => {
    const res = await request<{ requestId: string }>('POST', `finance/withdrawals/${requestId}/approve`, { reason });
    if (!res.ok) throw new Error(res.error?.message || 'Failed to approve withdrawal');
    return res.data;
  },

  rejectWithdrawal: async (requestId: string, reason: string) => {
    const res = await request<{ requestId: string }>('POST', `finance/withdrawals/${requestId}/reject`, { reason });
    if (!res.ok) throw new Error(res.error?.message || 'Failed to reject withdrawal');
    return res.data;
  },

  // PAGE 16 — Approval queue
  getApprovals: async (params?: { cursor?: string; limit?: number; status?: string }) => {
    const search = new URLSearchParams();
    if (params?.cursor) search.set('cursor', params.cursor);
    if (params?.limit != null) search.set('limit', String(params.limit));
    if (params?.status) search.set('status', params.status);
    const res = await request<{ items: ApprovalRow[]; next_cursor?: string | null }>(
      'GET',
      `finance/approvals?${search.toString()}`
    );
    if (!res.ok) throw new Error(res.error?.message || 'Failed to fetch approvals');
    return res.data;
  },

  createApproval: async (body: ApprovalRequest, idempotencyKey: string) => {
    const res = await api.post<{ ok: true; data: ApprovalRow }>('/finance/approvals', body, {
      headers: { 'Idempotency-Key': idempotencyKey },
    }).then((r) => r.data).catch((err: any) => ({
      ok: false as const,
      error: { code: err.response?.data?.error?.code || 'FETCH_ERROR', message: err.response?.data?.error?.message || err.message },
    }));
    if (!res.ok) throw new Error((res as any).error?.message || 'Failed to create approval');
    return (res as { data: ApprovalRow }).data;
  },

  approveApproval: async (id: string, reason?: string) => {
    const res = await request<ApprovalRow>('POST', `finance/approvals/${id}/approve`, { reason });
    if (!res.ok) throw new Error(res.error?.message || 'Failed to approve');
    return res.data;
  },

  rejectApproval: async (id: string, reason?: string) => {
    const res = await request<ApprovalRow>('POST', `finance/approvals/${id}/reject`, { reason });
    if (!res.ok) throw new Error(res.error?.message || 'Failed to reject');
    return res.data;
  },

  executeWalletAdjust: async (userId: string, amountCents: number, reason: string, approvalId: string, idempotencyKey: string) => {
    const res = await api.post<{ ok: true; data: { userId: string } }>(`/finance/wallets/${userId}/adjust`, {
      target_user_id: userId,
      amount_cents: amountCents,
      reason,
      approval_id: approvalId,
    }, { headers: { 'Idempotency-Key': idempotencyKey } })
      .then((r) => r.data)
      .catch((err: any) => ({
        ok: false as const,
        error: { code: err.response?.data?.error?.code || 'FETCH_ERROR', message: err.response?.data?.error?.message || err.message },
      }));
    if (!res.ok) throw new Error((res as any).error?.message || 'Failed to execute adjust');
    return (res as { data: { userId: string } }).data;
  },
};

// PAGE 16: re-export shared types for consumers
export type { ApprovalRow, ApprovalRequest };

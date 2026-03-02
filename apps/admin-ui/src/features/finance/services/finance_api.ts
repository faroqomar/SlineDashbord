import { request } from '@/lib/api';
import type { 
  PlatformMetrics, 
  JournalLedgerEntry, 
  WithdrawalRequest, 
  TransactionFilters, 
  TransactionCursor,
  WalletSummary
} from '../models/finance.model';

export const financeApi = {
  getMetrics: async () => {
    const res = await request<PlatformMetrics>('GET', '/finance/metrics');
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
    const res = await request<{ data: JournalLedgerEntry[], nextCursor?: TransactionCursor }>('GET', `/finance/transactions?${params.toString()}`);
    if (!res.ok) throw new Error(res.error?.message || 'Failed to fetch transactions');
    return res.data;
  },
  
  getWithdrawals: async (filters: { status?: string, limit?: number }, cursor?: { created_at: string, id: string }) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.append(k, String(v));
    });
    if (cursor) {
      params.append('cursor_created_at', cursor.created_at);
      params.append('cursor_id', cursor.id);
    }
    const res = await request<{ data: WithdrawalRequest[], nextCursor?: { created_at: string, id: string } }>('GET', `/finance/withdrawals?${params.toString()}`);
    if (!res.ok) throw new Error(res.error?.message || 'Failed to fetch withdrawals');
    return res.data;
  },

  getTransactionDetails: async (journalId: string) => {
    const res = await request<JournalLedgerEntry>('GET', `/finance/transactions/${journalId}`);
    if (!res.ok) throw new Error(res.error?.message || 'Failed to fetch transaction details');
    return res.data;
  },

  approveWithdrawal: async (requestId: string, reason?: string) => {
    const res = await request<{ requestId: string }>('POST', `/finance/withdrawals/${requestId}/approve`, { reason });
    if (!res.ok) throw new Error(res.error?.message || 'Failed to approve withdrawal');
    return res.data;
  },

  rejectWithdrawal: async (requestId: string, reason: string) => {
    const res = await request<{ requestId: string }>('POST', `/finance/withdrawals/${requestId}/reject`, { reason });
    if (!res.ok) throw new Error(res.error?.message || 'Failed to reject withdrawal');
    return res.data;
  }
};

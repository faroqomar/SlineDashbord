'use client';

import { useState, useCallback } from 'react';
import { financeApi, type ApprovalRow } from '../services/finance_api';
import { toast } from 'sonner';

export interface UseApprovalsVM {
  items: ApprovalRow[];
  nextCursor: string | null;
  loading: boolean;
  error: string | null;
  loadingActionId: string | null;
  loadApprovals: (cursor?: string) => Promise<void>;
  approve: (id: string, reason?: string) => Promise<void>;
  reject: (id: string, reason?: string) => Promise<void>;
  clearError: () => void;
}

export function useApprovalsVM(): UseApprovalsVM {
  const [items, setItems] = useState<ApprovalRow[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);

  const loadApprovals = useCallback(async (cursor?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await financeApi.getApprovals({ cursor, limit: 50 });
      setItems(data.items ?? []);
      setNextCursor(data.next_cursor ?? null);
    } catch (e: any) {
      setError(e?.message || 'Failed to load approvals');
      setItems([]);
      setNextCursor(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const approve = useCallback(async (id: string, reason?: string) => {
    setLoadingActionId(id);
    try {
      await financeApi.approveApproval(id, reason);
      toast.success('Approval approved.');
      await loadApprovals();
    } catch (e: any) {
      toast.error(e?.message || 'Failed to approve');
    } finally {
      setLoadingActionId(null);
    }
  }, [loadApprovals]);

  const reject = useCallback(async (id: string, reason?: string) => {
    setLoadingActionId(id);
    try {
      await financeApi.rejectApproval(id, reason);
      toast.success('Approval rejected.');
      await loadApprovals();
    } catch (e: any) {
      toast.error(e?.message || 'Failed to reject');
    } finally {
      setLoadingActionId(null);
    }
  }, [loadApprovals]);

  const clearError = useCallback(() => setError(null), []);

  return {
    items,
    nextCursor,
    loading,
    error,
    loadingActionId,
    loadApprovals,
    approve,
    reject,
    clearError,
  };
}

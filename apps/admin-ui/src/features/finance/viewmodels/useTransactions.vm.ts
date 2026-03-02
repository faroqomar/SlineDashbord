import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from '@/lib/navigation-shim';
import { TransactionCursor, TransactionFilters } from '../models/finance.model';

// ─── Interface ────────────────────────────────────────────
export interface UseTransactionsVM {
  selectedTxnId: string | null;
  hasActiveFilters: boolean;
  canGoBack: boolean;
  selectTransaction: (id: string) => void;
  clearSelection: () => void;
  goNextPage: () => void;
  clearFilters: () => void;
}

// ─── Hook ─────────────────────────────────────────────────
export function useTransactionsVM(
  nextCursor?: TransactionCursor,
  filters: TransactionFilters = {}
): UseTransactionsVM {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTxnId, setSelectedTxnId] = useState<string | null>(null);

  const hasActiveFilters = !!(filters.event_type || filters.status);
  const canGoBack = !!searchParams.get('cursor_id');

  const selectTransaction = useCallback((id: string) => {
    setSelectedTxnId(id);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedTxnId(null);
  }, []);

  const goNextPage = useCallback(() => {
    if (!nextCursor) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('cursor_created_at', nextCursor.created_at);
    params.set('cursor_id', nextCursor.journal_id);
    router.push(`?${params.toString()}`);
  }, [nextCursor, searchParams, router]);

  const clearFilters = useCallback(() => {
    router.push('/dashboard/finance/transactions');
  }, [router]);

  return {
    selectedTxnId,
    hasActiveFilters,
    canGoBack,
    selectTransaction,
    clearSelection,
    goNextPage,
    clearFilters,
  };
}

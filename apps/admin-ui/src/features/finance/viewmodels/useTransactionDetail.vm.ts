'use client';

import { useState, useCallback } from 'react';
import { financeApi } from '../services/finance_api';
import type { JournalLedgerEntry } from '../models/finance.model';

export interface UseTransactionDetailVM {
  detail: (JournalLedgerEntry & Record<string, unknown>) | null;
  loading: boolean;
  error: string | null;
  load: (journalId: string, reveal?: boolean) => Promise<void>;
  clear: () => void;
}

export function useTransactionDetailVM(): UseTransactionDetailVM {
  const [detail, setDetail] = useState<(JournalLedgerEntry & Record<string, unknown>) | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (journalId: string, reveal?: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const data = await financeApi.getTransactionDetail(journalId, reveal);
      setDetail(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load transaction');
      setDetail(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setDetail(null);
    setError(null);
  }, []);

  return { detail, loading, error, load, clear };
}

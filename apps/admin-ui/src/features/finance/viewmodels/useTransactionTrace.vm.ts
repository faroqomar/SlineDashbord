import { useState, useEffect } from 'react';
import { financeApi } from '../services/finance_api';
import { JournalLedgerEntry } from '../models/finance.model';

// ─── Interface ────────────────────────────────────────────
export interface UseTransactionTraceVM {
  data: JournalLedgerEntry | null;
  isLoading: boolean;
  error: string | null;
  isUnmasked: boolean;
}

// ─── Hook ─────────────────────────────────────────────────
export function useTransactionTraceVM(
  journalId: string,
  open: boolean
): UseTransactionTraceVM {
  const [data, setData] = useState<JournalLedgerEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUnmasked, setIsUnmasked] = useState(false);

  useEffect(() => {
    if (open && journalId) {
      setIsLoading(true);
      setError(null);
      financeApi.getTransactionDetails(journalId)
        .then(data => {
          setData(data);
          setIsUnmasked(!!data.meta_full && Object.keys(data.meta_full).length > 0);
        })
        .catch(err => setError(err instanceof Error ? err.message : 'Unknown error'))
        .finally(() => setIsLoading(false));
    }
  }, [journalId, open]);

  return { data, isLoading, error, isUnmasked };
}

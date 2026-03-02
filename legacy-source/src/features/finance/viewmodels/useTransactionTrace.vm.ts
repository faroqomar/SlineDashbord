import { useState, useEffect } from 'react';
import { getTransactionDetails } from '../actions/queries';
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
      getTransactionDetails(journalId)
        .then(result => {
          if (!result.success) {
            setError(result.error);
            return;
          }
          setData(result.data);
          setIsUnmasked(!!result.data.meta_full && Object.keys(result.data.meta_full).length > 0);
        })
        .catch(err => setError(err.message))
        .finally(() => setIsLoading(false));
    }
  }, [journalId, open]);

  return { data, isLoading, error, isUnmasked };
}

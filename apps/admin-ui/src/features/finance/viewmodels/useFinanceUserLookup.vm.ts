'use client';

import { useState, useCallback } from 'react';
import { financeApi } from '../services/finance_api';
import type { WalletSummary } from '../models/finance.model';
import type { WalletActivityEntry } from '@sline/shared';

export interface UseFinanceUserLookupVM {
  userId: string;
  wallet: WalletSummary | null;
  timeline: WalletActivityEntry[];
  loading: boolean;
  error: string | null;
  setUserId: (id: string) => void;
  search: () => Promise<void>;
}

export function useFinanceUserLookupVM(): UseFinanceUserLookupVM {
  const [userId, setUserIdState] = useState('');
  const [wallet, setWallet] = useState<WalletSummary | null>(null);
  const [timeline, setTimeline] = useState<WalletActivityEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setUserId = useCallback((id: string) => {
    setUserIdState(id);
    setWallet(null);
    setTimeline([]);
    setError(null);
  }, []);

  const search = useCallback(async () => {
    if (!userId.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await financeApi.getUserFinanceLookup(userId.trim());
      setWallet(result.wallet);
      setTimeline(result.timeline?.data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lookup failed');
      setWallet(null);
      setTimeline([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return {
    userId,
    wallet,
    timeline,
    loading,
    error,
    setUserId,
    search,
  };
}

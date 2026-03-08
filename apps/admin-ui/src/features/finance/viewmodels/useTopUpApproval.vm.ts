'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { financeApi, type ApprovalRow } from '../services/finance_api';
import {
  buildTopUpApprovalRequest,
  generateTopUpIdempotencyKey,
  type TopUpApprovalFormValues,
} from '../models/top-up-request.schema';

export interface UseTopUpApprovalVM {
  isSubmitting: boolean;
  error: string | null;
  requestTopUpApproval: (values: TopUpApprovalFormValues) => Promise<ApprovalRow>;
  clearError: () => void;
}

export function useTopUpApprovalVM(): UseTopUpApprovalVM {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestTopUpApproval = useCallback(async (values: TopUpApprovalFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const body = buildTopUpApprovalRequest(values);
      const approval = await financeApi.createApproval(body, generateTopUpIdempotencyKey());
      toast.success('Top-up approval request created.');
      return approval;
    } catch (err: any) {
      const message = err?.message || 'Failed to create top-up approval request';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    isSubmitting,
    error,
    requestTopUpApproval,
    clearError,
  };
}

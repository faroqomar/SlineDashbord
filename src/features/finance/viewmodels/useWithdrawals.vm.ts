import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { approveWithdrawal, rejectWithdrawal } from '../actions/mutations';
import { toast } from 'sonner';

// ─── Interface ────────────────────────────────────────────
export interface UseWithdrawalsVM {
  processingId: string | null;
  canGoBack: boolean;
  approveItem: (id: string) => Promise<void>;
  rejectItem: (id: string) => Promise<void>;
  goNextPage: () => void;
}

// ─── Hook ─────────────────────────────────────────────────
export function useWithdrawalsVM(
  nextCursor?: { created_at: string; id: string }
): UseWithdrawalsVM {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const canGoBack = !!searchParams.get('cursor_id');

  const approveItem = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to approve this withdrawal?')) return;

    setProcessingId(id);
    try {
      const result = await approveWithdrawal(id);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success('Withdrawal approved successfully.');
      router.refresh();
    } finally {
      setProcessingId(null);
    }
  }, [router]);

  const rejectItem = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to reject this withdrawal?')) return;

    const reason = prompt('Reason for rejection:') || 'Rejected by admin';
    setProcessingId(id);
    try {
      const result = await rejectWithdrawal(id, reason);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success('Withdrawal rejected successfully.');
      router.refresh();
    } finally {
      setProcessingId(null);
    }
  }, [router]);

  const goNextPage = useCallback(() => {
    if (!nextCursor) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('cursor_created_at', nextCursor.created_at);
    params.set('cursor_id', nextCursor.id);
    router.push(`?${params.toString()}`);
  }, [nextCursor, searchParams, router]);

  return {
    processingId,
    canGoBack,
    approveItem,
    rejectItem,
    goNextPage,
  };
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { QUERY_KEYS } from '@/lib/query-keys';
import {
  banUser,
  forceLogoutUser,
  getUserDetails,
  getUserInvestigation,
  getUserWalletLookup,
  suspendUser,
  unbanUser,
} from '../services/users_api';
import type { UserProfileActionKind } from '../views/user-profile.view';

const REQUIRED_REASON_MIN_LENGTH = 5;

const ACTION_SUCCESS_MESSAGE: Record<UserProfileActionKind, string> = {
  suspend: 'User suspended for 24h.',
  ban: 'User banned successfully.',
  unban: 'User unbanned successfully.',
  forceLogout: 'User forced to logout.',
};

const ACTION_ERROR_MESSAGE: Record<UserProfileActionKind, string> = {
  suspend: 'Failed to suspend user.',
  ban: 'Failed to ban user.',
  unban: 'Failed to unban user.',
  forceLogout: 'Failed to force logout user.',
};

interface ExecuteActionInput {
  kind: UserProfileActionKind;
  reason?: string;
}

interface ActionPayload {
  kind: UserProfileActionKind;
  reason?: string;
}

export function useUserProfileViewModel(userId: string) {
  const queryClient = useQueryClient();

  const detailQuery = useQuery({
    queryKey: QUERY_KEYS.users.detail(userId),
    enabled: Boolean(userId),
    queryFn: async () => {
      const result = await getUserDetails(userId);
      if (!result.success) {
        throw new Error(result.error || 'Failed to load user profile');
      }
      return result.data;
    },
  });

  const investigationQuery = useQuery({
    queryKey: QUERY_KEYS.users.investigation(userId),
    enabled: Boolean(userId),
    queryFn: async () => {
      const result = await getUserInvestigation(userId);
      if (!result.success) throw new Error(result.error || 'Failed to load user activity');
      return result.data;
    },
  });

  const walletQuery = useQuery({
    queryKey: ['finance', 'users', userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const result = await getUserWalletLookup(userId);
      if (result.success) {
        return { ...result.data, error: null as string | null };
      }
      return {
        wallet: null,
        timeline: { data: [] },
        error: result.error || 'Wallet data is unavailable for this role.',
      };
    },
  });

  const actionMutation = useMutation({
    mutationFn: async ({ kind, reason }: ActionPayload) => {
      if (kind === 'suspend') {
        const result = await suspendUser(userId, reason ?? '', '24h');
        if (!result.success) throw new Error(result.error || ACTION_ERROR_MESSAGE[kind]);
        return;
      }

      if (kind === 'ban') {
        const result = await banUser(userId, reason ?? '');
        if (!result.success) throw new Error(result.error || ACTION_ERROR_MESSAGE[kind]);
        return;
      }

      if (kind === 'unban') {
        const result = await unbanUser(userId);
        if (!result.success) throw new Error(result.error || ACTION_ERROR_MESSAGE[kind]);
        return;
      }

      const result = await forceLogoutUser(userId, reason);
      if (!result.success) throw new Error(result.error || ACTION_ERROR_MESSAGE[kind]);
    },
    onSuccess: async (_data, variables) => {
      toast.success(ACTION_SUCCESS_MESSAGE[variables.kind]);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.detail(userId) }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.investigation(userId) }),
        queryClient.invalidateQueries({ queryKey: ['finance', 'users', userId] }),
      ]);
    },
    onError: (error, variables) => {
      const fallback = ACTION_ERROR_MESSAGE[variables.kind];
      const message = error instanceof Error ? error.message : fallback;
      toast.error(message || fallback);
    },
  });

  const executeAction = async ({ kind, reason }: ExecuteActionInput): Promise<boolean> => {
    const trimmedReason = reason?.trim();

    if ((kind === 'suspend' || kind === 'ban') && (!trimmedReason || trimmedReason.length < REQUIRED_REASON_MIN_LENGTH)) {
      toast.error(`Reason must be at least ${REQUIRED_REASON_MIN_LENGTH} characters.`);
      return false;
    }

    try {
      await actionMutation.mutateAsync({
        kind,
        reason: trimmedReason && trimmedReason.length > 0 ? trimmedReason : undefined,
      });
      return true;
    } catch {
      return false;
    }
  };

  return {
    user: detailQuery.data,
    isLoading: detailQuery.isLoading,
    error: detailQuery.error,
    refetch: detailQuery.refetch,
    investigation: investigationQuery.data,
    isInvestigationLoading: investigationQuery.isLoading,
    investigationError:
      investigationQuery.error instanceof Error ? investigationQuery.error.message : null,
    wallet: walletQuery.data?.wallet ?? null,
    walletTimeline: walletQuery.data?.timeline?.data ?? [],
    isWalletLoading: walletQuery.isLoading,
    walletError: walletQuery.data?.error ?? null,
    isActionPending: actionMutation.isPending,
    pendingAction: actionMutation.variables?.kind,
    executeAction,
  };
}

'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import type { UserInvestigationResponse, UserDetailRevealed } from '@sline/shared';
import { request } from '../../../lib/api';
import { QUERY_KEYS } from '../../../lib/query-keys';

const REVEAL_PII_ROLES = ['admin', 'super_admin'];

export function useUserInvestigation(userId: string | undefined) {
  const [revealedProfile, setRevealedProfile] = useState<{ email?: string | null; phone?: string | null } | null>(null);

  const { data: me } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const result = await request<{ user: { role?: string } }>('GET', '/auth/me');
      if (!result.ok) return null;
      return result.data;
    },
  });

  const canRevealPii = Boolean(me?.user?.role && REVEAL_PII_ROLES.includes(me.user.role));

  const revealPiiMutation = useMutation({
    mutationFn: async (reason: string) => {
      const result = await request<UserDetailRevealed>('POST', `/users/${userId}/reveal-pii`, { reason });
      if (!result.ok) throw new Error(result.error?.message ?? 'Reveal failed');
      return result.data;
    },
    onSuccess: (data) => {
      setRevealedProfile({ email: data.email, phone: data.phone });
    },
  });

  const investigationQuery = useQuery({
    queryKey: QUERY_KEYS.users.investigation(userId ?? ''),
    queryFn: async () => {
      const result = await request<UserInvestigationResponse>('GET', `/users/${userId}/investigation`);
      if (!result.ok) throw new Error(result.error?.message ?? 'Failed to load investigation');
      return result.data;
    },
    enabled: Boolean(userId),
  });

  const evidencePackMutation = useMutation({
    mutationFn: async (format: 'json' | 'csv') => {
      const result = await request<Blob | UserInvestigationResponse>(
        'GET',
        `/users/${userId}/evidence-pack?format=${format}&limit=5000`
      );
      if (!result.ok) throw new Error(result.error?.message ?? 'Export failed');
      return { data: result.data, format };
    },
    onSuccess: ({ data, format }) => {
      if (format === 'json' && data && typeof data === 'object' && !(data instanceof Blob)) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `evidence-pack-${userId}-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    },
  });

  return {
    investigation: investigationQuery.data,
    isLoading: investigationQuery.isLoading,
    error: investigationQuery.error,
    refetch: investigationQuery.refetch,
    isSuccess: investigationQuery.isSuccess,
    canRevealPii,
    revealedProfile,
    setRevealedProfile,
    revealPiiMutation,
    evidencePackMutation,
  };
}

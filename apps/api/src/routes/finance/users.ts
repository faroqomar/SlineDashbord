import type { FastifyInstance } from 'fastify';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  UserLookupSchema,
  WalletSummarySchema,
  JournalLedgerEntrySchema,
  FINANCE_WRITE_ROLES,
  failure,
  success,
} from '@sline/shared';
import { requireAdminRole } from '../../middleware/rbac.js';

export async function registerFinanceUserRoutes(
  fastify: FastifyInstance,
  supabase: SupabaseClient
): Promise<void> {
  fastify.get('/users/:userId', { preHandler: [requireAdminRole(FINANCE_WRITE_ROLES)] }, async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const validation = UserLookupSchema.safeParse({ userId });
    if (!validation.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid userId', validation.error.format()));
    }
    const [balanceRes, timelineRes] = await Promise.all([
      supabase.from('vw_wallet_balances_user').select('*').eq('user_id', validation.data.userId).maybeSingle(),
      supabase
        .from('vw_wallet_activity_user')
        .select('*')
        .eq('user_id', validation.data.userId)
        .order('created_at', { ascending: false })
        .limit(20),
    ]);
    if (balanceRes.error && balanceRes.error.code !== 'PGRST116') {
      return reply.status(501).send(failure('DATABASE_ERROR', 'Wallet views not available'));
    }
    const wallet = balanceRes.data
      ? WalletSummarySchema.safeParse({
          available_balance: (balanceRes.data as Record<string, unknown>).available_balance ?? 0,
          held_balance: (balanceRes.data as Record<string, unknown>).held_balance ?? 0,
          pending_withdrawal_balance: (balanceRes.data as Record<string, unknown>).pending_withdrawal_balance ?? 0,
          currency: (balanceRes.data as Record<string, unknown>).currency ?? 'IQD',
          is_wallet_frozen: (balanceRes.data as Record<string, unknown>).is_wallet_frozen,
        })
      : null;
    const timelineData = timelineRes.data || [];
    const timeline = timelineData.map((r: Record<string, unknown>) => {
      const parsed = JournalLedgerEntrySchema.safeParse(r);
      return parsed.success ? parsed.data : r;
    });
    return reply.send(
      success({
        wallet: wallet?.success ? wallet.data : null,
        timeline: { data: timeline, nextCursor: undefined },
      })
    );
  });
}

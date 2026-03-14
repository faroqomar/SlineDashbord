import type { FastifyInstance } from 'fastify';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  UserLookupSchema,
  WalletSummarySchema,
  WalletActivityEntrySchema,
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
      supabase.from('vw_admin_wallet_balances').select('*').eq('user_id', validation.data.userId).maybeSingle(),
      supabase
        .from('vw_admin_wallet_activity')
        .select('*')
        .eq('user_id', validation.data.userId)
        .order('created_at', { ascending: false })
        .limit(20),
    ]);
    if (balanceRes.error && balanceRes.error.code !== 'PGRST116') {
      return reply.status(501).send(failure('DATABASE_ERROR', 'Admin wallet views not available'));
    }
    const wallet = balanceRes.data
      ? WalletSummarySchema.safeParse({
          available_balance: (balanceRes.data as Record<string, unknown>).available_balance ?? 0,
          held_balance: (balanceRes.data as Record<string, unknown>).held_balance ?? 0,
          pending_withdrawal_balance: (balanceRes.data as Record<string, unknown>).pending_withdrawal_balance ?? 0,
          freelancer_payables_balance: (balanceRes.data as Record<string, unknown>).freelancer_payables_balance ?? 0,
          other_wallet_liabilities_balance:
            (balanceRes.data as Record<string, unknown>).other_wallet_liabilities_balance ?? 0,
          currency: (balanceRes.data as Record<string, unknown>).currency ?? 'IQD',
          is_wallet_frozen: (balanceRes.data as Record<string, unknown>).is_wallet_frozen,
        })
      : null;
    const timelineData = timelineRes.data || [];
    const timeline = timelineData.map((r: Record<string, unknown>) => {
      const row = { ...r, created_at: typeof r.created_at === 'string' ? r.created_at : (r.created_at as Date)?.toISOString?.() ?? '' };
      const parsed = WalletActivityEntrySchema.safeParse(row);
      return parsed.success ? parsed.data : row;
    });
    return reply.send(
      success({
        wallet: wallet?.success ? wallet.data : null,
        timeline: { data: timeline, nextCursor: undefined },
      })
    );
  });
}

import type { FastifyInstance } from 'fastify';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  FreezeWalletSchema,
  AdjustWalletInputSchema,
  FINANCE_WRITE_ROLES,
  WALLET_ADJUST_DANGEROUS_MIN,
  failure,
  success,
} from '@sline/shared';
import { requireAdminRole } from '../../middleware/rbac.js';
import { withAudit } from '../../audit.js';

export async function registerWalletRoutes(
  fastify: FastifyInstance,
  supabase: SupabaseClient
): Promise<void> {
  fastify.post('/wallets/:userId/freeze', {
    preHandler: [requireAdminRole(FINANCE_WRITE_ROLES)],
  }, async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const body = request.body;
    const validation = FreezeWalletSchema.safeParse({ ...(body as object), targetUserId: userId });
    if (!validation.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid input', validation.error.format()));
    }
    return withAudit(request, 'admin.finance.wallet_freeze', 'profile', userId, async () => {
      const { error } = await supabase.rpc('admin_process_wallet_freeze', {
        p_user_id: validation.data.targetUserId,
        p_freeze: true,
        p_reason: validation.data.reason,
        p_admin_id: (request as any).user.id,
      });
      if (error) return failure('DATABASE_ERROR', error.message);
      return success({ userId: validation.data.targetUserId });
    });
  });

  fastify.get('/metrics', { preHandler: [requireAdminRole(['admin', 'super_admin'])] }, async (request, reply) => {
    const { data, error } = await supabase.from('vw_financial_metrics_realtime').select('*').single();
    if (error) return reply.status(500).send(failure('DATABASE_ERROR', error.message));
    return reply.send(success({
      platform_cash: data?.platform_cash_iqd || 0,
      escrow_held: data?.escrow_held_iqd || 0,
      lifetime_revenue: data?.revenue_iqd || 0,
      pending_withdrawals: 0,
    }));
  });

  fastify.post('/wallets/:userId/adjust', {
    preHandler: [requireAdminRole(FINANCE_WRITE_ROLES)],
  }, async (request, reply) => {
    const { userId: targetUserId } = request.params as { userId: string };
    const body = request.body as Record<string, unknown>;
    const validation = AdjustWalletInputSchema.safeParse({ ...body, target_user_id: targetUserId });
    if (!validation.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid body', validation.error.format()));
    }
    const idempotencyKey = (request.headers['idempotency-key'] as string)?.trim() || null;
    const userId = (request as any).user?.id;
    if (!userId) return reply.status(401).send(failure('UNAUTHORIZED', 'Not authenticated'));
    const amountCents = validation.data.amount_cents;
    const isDangerous = Math.abs(amountCents) >= WALLET_ADJUST_DANGEROUS_MIN;
    if (isDangerous && !validation.data.approval_id) {
      return reply.status(403).send(failure('FORBIDDEN', 'Approval required for this amount; request an approval first'));
    }
    if (!isDangerous) {
      return reply.status(501).send(failure('NOT_IMPLEMENTED', 'Single-admin wallet adjust not implemented; use approval flow for all adjusts'));
    }
    const { error } = await supabase.rpc('admin_adjust_wallet', {
      p_approval_id: validation.data.approval_id,
      p_actor_id: userId,
      p_target_user_id: targetUserId,
      p_amount_cents: amountCents,
      p_reason: validation.data.reason,
      p_idempotency_key: idempotencyKey,
    });
    if (error) {
      if (error.message?.includes('not found')) return reply.status(404).send(failure('NOT_FOUND', 'Approval not found'));
      if (error.message?.includes('not approved')) return reply.status(403).send(failure('FORBIDDEN', 'Approval not approved'));
      if (error.message?.includes('Only the requester')) return reply.status(403).send(failure('FORBIDDEN', 'Only the requester may execute this approval'));
      if (error.message?.includes('already consumed')) return reply.status(409).send(failure('CONFLICT', 'Approval already consumed'));
      return reply.status(500).send(failure('DATABASE_ERROR', error.message));
    }
    return reply.send(success({ userId: targetUserId }));
  });
}

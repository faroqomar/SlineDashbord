import type { FastifyInstance } from 'fastify';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  FreezeWalletSchema,
  UnfreezeWalletSchema,
  AdjustWalletInputSchema,
  FINANCE_WRITE_ROLES,
  WALLET_ADJUST_DANGEROUS_MIN,
  failure,
  success,
} from '@sline/shared';
import { requireAdminRole } from '../../middleware/rbac.js';
import { withAudit } from '../../audit.js';
import { getFinanceMetricsSnapshot } from './metrics-summary.js';

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
    const result = await withAudit(request, 'admin.finance.wallet_freeze', 'profile', userId, async () => {
      const { error } = await supabase.rpc('admin_process_wallet_freeze', {
        p_user_id: validation.data.targetUserId,
        p_freeze: true,
        p_reason: validation.data.reason,
        p_admin_id: (request as any).user.id,
      });
      if (error) return failure('DATABASE_ERROR', error.message);
      return success({ userId: validation.data.targetUserId });
    });
    return reply.send(result);
  });

  fastify.post('/wallets/:userId/unfreeze', {
    preHandler: [requireAdminRole(FINANCE_WRITE_ROLES)],
  }, async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const body = request.body;
    const validation = UnfreezeWalletSchema.safeParse({ ...(body as object), targetUserId: userId });
    if (!validation.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid input', validation.error.format()));
    }
    const result = await withAudit(request, 'admin.finance.wallet_unfreeze', 'profile', userId, async () => {
      const { error } = await supabase.rpc('admin_process_wallet_freeze', {
        p_user_id: validation.data.targetUserId,
        p_freeze: false,
        p_reason: validation.data.reason,
        p_admin_id: (request as any).user.id,
      });
      if (error) return failure('DATABASE_ERROR', error.message);
      return success({ userId: validation.data.targetUserId });
    });
    return reply.send(result);
  });

  fastify.get('/metrics', { preHandler: [requireAdminRole(['admin', 'super_admin'])] }, async (request, reply) => {
    const { data, error } = await getFinanceMetricsSnapshot(supabase);
    if (error || !data) return reply.status(500).send(failure('DATABASE_ERROR', error ?? 'Failed to load finance metrics'));
    return reply.send(success(data));
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
    // Wallet-adjust execute is unavailable: admin_adjust_wallet only consumes approval + audit; no ledger mutation. See Docs/CANONICAL_FINANCE_DEPENDENCY_MATRIX.md
    return reply.status(501).send(failure('NOT_IMPLEMENTED', 'Wallet adjust execute is not available; ledger mutation not yet implemented. Use approval queue for request/approve only.'));
  });
}

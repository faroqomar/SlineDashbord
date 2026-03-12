import type { FastifyInstance } from 'fastify';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  FinanceWorkflowOverviewSchema,
  FinanceWorkflowCaseDetailSchema,
  type WorkflowBucket,
  failure,
  success,
} from '@sline/shared';
import { requireAdminRole } from '../../middleware/rbac.js';

const WORKFLOW_ROLES = ['admin', 'super_admin'] as const;

export async function registerWorkflowRoutes(
  fastify: FastifyInstance,
  supabase: SupabaseClient
): Promise<void> {
  fastify.get('/workflow/overview', {
    preHandler: [requireAdminRole([...WORKFLOW_ROLES])],
  }, async (request, reply) => {
    const { data: metrics, error } = await supabase.from('vw_financial_metrics_realtime').select('*').single();
    if (error) return reply.status(500).send(failure('DATABASE_ERROR', error.message));
    const overview = FinanceWorkflowOverviewSchema.safeParse({
      platform_cash: (metrics as Record<string, unknown>)?.platform_cash_iqd ?? 0,
      escrow_held: (metrics as Record<string, unknown>)?.escrow_held_iqd ?? 0,
      delivered_awaiting_count: 0,
      disputed_count: 0,
      stuck_direct_offer_count: 0,
      pending_withdrawals_count: 0,
      stub: true,
    });
    if (!overview.success) return reply.status(500).send(failure('VALIDATION_ERROR', 'Overview shape invalid', overview.error.format()));
    return reply.send(success(overview.data));
  });

  fastify.get('/workflow/cases', {
    preHandler: [requireAdminRole([...WORKFLOW_ROLES])],
  }, async (request, reply) => {
    const query = request.query as { bucket?: string; limit?: string };
    const limit = Math.min(parseInt(query.limit ?? '50', 10) || 50, 200);
    const bucket = query.bucket as WorkflowBucket | undefined;
    // Stub: return empty list; real implementation would query disputed bookings, stuck direct offers, etc.
    return reply.send(success({ cases: [], nextCursor: undefined }));
  });

  fastify.get<{ Params: { entityType: string; entityId: string } }>('/workflow/cases/:entityType/:entityId', {
    preHandler: [requireAdminRole([...WORKFLOW_ROLES])],
  }, async (request, reply) => {
    const { entityType, entityId } = request.params;
    const validation = FinanceWorkflowCaseDetailSchema.safeParse({
      entityType,
      entityId,
      bucket: 'held_funds' as const,
      state: {},
      journal_links: [],
      available_actions: [],
    });
    if (!validation.success) return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid entity', validation.error.format()));
    // Stub: return minimal detail; real implementation would load entity state and journal links
    return reply.send(success({ ...validation.data, stub: true }));
  });
}

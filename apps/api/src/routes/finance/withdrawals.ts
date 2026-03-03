import type { FastifyInstance } from 'fastify';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  ApproveWithdrawalSchema,
  RejectWithdrawalSchema,
  FINANCE_SUPERADMIN_ROLES,
  failure,
  success,
} from '@sline/shared';
import { requireAdminRole } from '../../middleware/rbac.js';

export async function registerWithdrawalRoutes(
  fastify: FastifyInstance,
  supabase: SupabaseClient
): Promise<void> {
  fastify.post('/withdrawals/:requestId/approve', {
    preHandler: [requireAdminRole(FINANCE_SUPERADMIN_ROLES)],
  }, async (request, reply) => {
    const { requestId } = request.params as { requestId: string };
    const body = request.body;
    const validation = ApproveWithdrawalSchema.safeParse({ ...(body as object), requestId });
    if (!validation.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid input', validation.error.format()));
    }
    const { error } = await supabase.rpc('admin_process_withdrawal', {
      p_request_id: validation.data.requestId,
      p_decision: 'approve',
      p_reason: validation.data.reason,
      p_admin_id: (request as any).user.id,
    });
    if (error) return reply.send(failure('DATABASE_ERROR', error.message));
    return reply.send(success({ requestId: validation.data.requestId }));
  });

  fastify.post('/withdrawals/:requestId/reject', {
    preHandler: [requireAdminRole(FINANCE_SUPERADMIN_ROLES)],
  }, async (request, reply) => {
    const { requestId } = request.params as { requestId: string };
    const body = request.body;
    const validation = RejectWithdrawalSchema.safeParse({ ...(body as object), requestId });
    if (!validation.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid input', validation.error.format()));
    }
    const { error } = await supabase.rpc('admin_process_withdrawal', {
      p_request_id: validation.data.requestId,
      p_decision: 'reject',
      p_reason: validation.data.reason,
      p_admin_id: (request as any).user.id,
    });
    if (error) return reply.send(failure('DATABASE_ERROR', error.message));
    return reply.send(success({ requestId: validation.data.requestId }));
  });

  fastify.get('/withdrawals', { preHandler: [requireAdminRole(['admin', 'super_admin'])] }, async (request, reply) => {
    const query = (request.query as Record<string, string | undefined>) || {};
    const limit = query.limit ? parseInt(query.limit, 10) : 50;
    let dbQuery = supabase
      .from('withdrawal_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .order('id', { ascending: false });
    if (query.status) dbQuery = dbQuery.eq('status', query.status);
    if (query.cursor_created_at && query.cursor_id) {
      dbQuery = dbQuery.or(
        `created_at.lt.${query.cursor_created_at},and(created_at.eq.${query.cursor_created_at},id.lt.${query.cursor_id})`
      );
    }
    const { data, error } = await dbQuery.limit(limit);
    if (error) return reply.status(500).send(failure('DATABASE_ERROR', error.message));
    const nextCursor =
      data.length === limit ? { created_at: data[data.length - 1].created_at, id: data[data.length - 1].id } : undefined;
    return reply.send(success({ data, nextCursor }));
  });
}

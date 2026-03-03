import type { FastifyInstance } from 'fastify';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  ApprovalRequestSchema,
  ApprovalListQuerySchema,
  ApproveRejectSchema,
  FINANCE_WRITE_ROLES,
  failure,
  success,
} from '@sline/shared';
import { requireAdminRole } from '../../middleware/rbac.js';

export async function registerApprovalRoutes(
  fastify: FastifyInstance,
  supabase: SupabaseClient
): Promise<void> {
  fastify.get('/approvals', { preHandler: [requireAdminRole(FINANCE_WRITE_ROLES)] }, async (request, reply) => {
    const query = (request.query as Record<string, string | number | undefined>) || {};
    const parsed = ApprovalListQuerySchema.safeParse({
      cursor: query.cursor,
      limit: query.limit != null ? Number(query.limit) : 50,
      status: query.status,
    });
    if (!parsed.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid query', parsed.error.format()));
    }
    const limit = Math.min(parsed.data.limit, 100);
    let q = supabase
      .from('admin_approvals')
      .select('*')
      .order('created_at', { ascending: false })
      .order('id', { ascending: false });
    if (parsed.data.status) q = q.eq('status', parsed.data.status);
    if (parsed.data.cursor) {
      const parts = parsed.data.cursor.split(',');
      if (parts.length >= 2) {
        const [createdAt, cursorId] = parts;
        q = q.or(`created_at.lt.${createdAt},and(created_at.eq.${createdAt},id.lt.${cursorId})`);
      }
    }
    const { data: items, error } = await q.limit(limit + 1);
    if (error) return reply.status(500).send(failure('DATABASE_ERROR', error.message));
    const hasMore = (items?.length ?? 0) > limit;
    const list = hasMore ? items!.slice(0, limit) : items ?? [];
    const last = list[list.length - 1] as Record<string, unknown> | undefined;
    const next_cursor =
      hasMore && last && last.created_at != null && last.id != null ? `${last.created_at},${last.id}` : null;
    return reply.send(success({ items: list, next_cursor }));
  });

  fastify.post('/approvals', { preHandler: [requireAdminRole(FINANCE_WRITE_ROLES)] }, async (request, reply) => {
    const idempotencyKey = (request.headers['idempotency-key'] as string)?.trim();
    if (!idempotencyKey) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Idempotency-Key header required'));
    }
    const validation = ApprovalRequestSchema.safeParse(request.body);
    if (!validation.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid body', validation.error.format()));
    }
    const userId = (request as any).user?.id;
    if (!userId) return reply.status(401).send(failure('UNAUTHORIZED', 'Not authenticated'));
    const { data: row, error } = await supabase.rpc('admin_request_approval', {
      p_operation_type: validation.data.operation_type,
      p_target_entity_type: validation.data.target_entity_type,
      p_target_entity_id: validation.data.target_entity_id,
      p_requested_by: userId,
      p_idempotency_key: idempotencyKey,
      p_payload: validation.data.payload ?? {},
      p_reason: validation.data.reason ?? null,
    });
    if (error) return reply.status(500).send(failure('DATABASE_ERROR', error.message));
    return reply.status(201).send(success(row));
  });

  fastify.post('/approvals/:id/approve', { preHandler: [requireAdminRole(FINANCE_WRITE_ROLES)] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = (request.body as Record<string, unknown>) || {};
    const validation = ApproveRejectSchema.safeParse({ ...body, decision: 'approved' });
    if (!validation.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid body', validation.error.format()));
    }
    const userId = (request as any).user?.id;
    if (!userId) return reply.status(401).send(failure('UNAUTHORIZED', 'Not authenticated'));
    const { data: row, error } = await supabase.rpc('admin_approve_or_reject_approval', {
      p_approval_id: id,
      p_actor_id: userId,
      p_decision: 'approved',
      p_reason: validation.data.reason ?? null,
    });
    if (error) {
      if (error.message?.includes('different from requester')) return reply.status(403).send(failure('FORBIDDEN', 'Approver must be different from requester'));
      if (error.message?.includes('not found')) return reply.status(404).send(failure('NOT_FOUND', 'Approval not found'));
      if (error.message?.includes('already resolved')) return reply.status(422).send(failure('INVALID_STATE', 'Approval already resolved'));
      return reply.status(500).send(failure('DATABASE_ERROR', error.message));
    }
    return reply.send(success(row));
  });

  fastify.post('/approvals/:id/reject', { preHandler: [requireAdminRole(FINANCE_WRITE_ROLES)] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = (request.body as Record<string, unknown>) || {};
    const validation = ApproveRejectSchema.safeParse({ ...body, decision: 'rejected' });
    if (!validation.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid body', validation.error.format()));
    }
    const userId = (request as any).user?.id;
    if (!userId) return reply.status(401).send(failure('UNAUTHORIZED', 'Not authenticated'));
    const { data: row, error } = await supabase.rpc('admin_approve_or_reject_approval', {
      p_approval_id: id,
      p_actor_id: userId,
      p_decision: 'rejected',
      p_reason: validation.data.reason ?? null,
    });
    if (error) {
      if (error.message?.includes('different from requester')) return reply.status(403).send(failure('FORBIDDEN', 'Approver must be different from requester'));
      if (error.message?.includes('not found')) return reply.status(404).send(failure('NOT_FOUND', 'Approval not found'));
      if (error.message?.includes('already resolved')) return reply.status(422).send(failure('INVALID_STATE', 'Approval already resolved'));
      return reply.status(500).send(failure('DATABASE_ERROR', error.message));
    }
    return reply.send(success(row));
  });
}

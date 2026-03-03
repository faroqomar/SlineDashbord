import type { FastifyInstance } from 'fastify';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  TransactionDetailsSchema,
  TransactionListQuerySchema,
  FINANCE_WRITE_ROLES,
  failure,
  success,
} from '@sline/shared';
import { requireAdminRole } from '../../middleware/rbac.js';

export async function registerTransactionRoutes(
  fastify: FastifyInstance,
  supabase: SupabaseClient
): Promise<void> {
  fastify.get('/transactions/:journalId', { preHandler: [requireAdminRole(FINANCE_WRITE_ROLES)] }, async (request, reply) => {
    const { journalId } = request.params as { journalId: string };
    const query = (request.query as { reveal?: string }) || {};
    const validation = TransactionDetailsSchema.safeParse({ journalId });
    if (!validation.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid journalId', validation.error.format()));
    }
    const { data: row, error } = await supabase
      .from('vw_admin_journal_ledger')
      .select('*')
      .eq('journal_id', validation.data.journalId)
      .single();
    if (error || !row) return reply.status(404).send(failure('NOT_FOUND', 'Transaction not found'));
    const user = (request as any).user;
    const reveal = query.reveal === '1';
    if (reveal && user?.id) {
      const { error: auditError } = await supabase.from('audit_logs').insert({
        action: 'admin.finance.tx_view_sensitive_meta',
        actor_user_id: user.id,
        related_entity_type: 'journal_entry',
        related_entity_id: validation.data.journalId,
        meta: { viewed_at: new Date().toISOString() },
      });
      if (auditError) return reply.status(500).send(failure('DATABASE_ERROR', auditError.message));
      return reply.send(success(row));
    }
    const { meta_full: _, ...masked } = row as Record<string, unknown>;
    return reply.send(success(masked));
  });

  fastify.get('/transactions', { preHandler: [requireAdminRole(['admin', 'super_admin'])] }, async (request, reply) => {
    const raw = (request.query as Record<string, string | undefined>) || {};
    const parsed = TransactionListQuerySchema.safeParse({
      ...raw,
      limit: raw.limit != null ? parseInt(raw.limit, 10) : 50,
    });
    if (!parsed.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid query', parsed.error.format()));
    }
    const { limit = 50, cursor_created_at, cursor_id, event_type, status, payer_user_id, payee_user_id, entity_type, entity_id } = parsed.data;

    let dbQuery = supabase
      .from('vw_admin_journal_ledger')
      .select('*')
      .order('created_at', { ascending: false })
      .order('journal_id', { ascending: false });

    if (event_type) dbQuery = dbQuery.eq('event_type', event_type);
    if (status) dbQuery = dbQuery.eq('status', status);
    if (payer_user_id) dbQuery = dbQuery.eq('payer_user_id', payer_user_id);
    if (payee_user_id) dbQuery = dbQuery.eq('payee_user_id', payee_user_id);
    if (entity_type) dbQuery = dbQuery.eq('entity_type', entity_type);
    if (entity_id) dbQuery = dbQuery.eq('entity_id', entity_id);

    if (cursor_created_at && cursor_id) {
      dbQuery = dbQuery.or(
        `created_at.lt.${cursor_created_at},and(created_at.eq.${cursor_created_at},journal_id.lt.${cursor_id})`
      );
    }

    const { data, error } = await dbQuery.limit(limit);
    if (error) return reply.status(500).send(failure('DATABASE_ERROR', error.message));

    const nextCursor = data.length === limit
      ? { created_at: data[data.length - 1].created_at, journal_id: data[data.length - 1].journal_id }
      : undefined;

    return reply.send(success({ data, nextCursor }));
  });
}

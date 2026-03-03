import type { FastifyInstance } from 'fastify';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  AuditLogListFiltersSchema,
  AuditExportQuerySchema,
  type AuditLogListFilters,
  type AuditExportQuery,
  FINANCE_WRITE_ROLES,
  failure,
  success,
} from '@sline/shared';
import { requireAdminRole } from '../../middleware/rbac.js';

function buildAuditQuery(
  client: SupabaseClient,
  filters: AuditLogListFilters | AuditExportQuery,
  options: { cursor?: { created_at: string; id: string }; limit: number }
) {
  let q = client
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .order('id', { ascending: false });

  if (filters.action) q = q.eq('action', filters.action);
  if (filters.actor_user_id) q = q.eq('actor_user_id', filters.actor_user_id);
  if (filters.start_date) q = q.gte('created_at', filters.start_date);
  if (filters.end_date) q = q.lte('created_at', filters.end_date);
  if (options.cursor) {
    q = q.or(
      `created_at.lt.${options.cursor.created_at},and(created_at.eq.${options.cursor.created_at},id.lt.${options.cursor.id})`
    );
  }
  return q.limit(options.limit);
}

export async function registerAuditRoutes(
  fastify: FastifyInstance,
  supabase: SupabaseClient
): Promise<void> {
  fastify.get('/audit/export', { preHandler: [requireAdminRole(FINANCE_WRITE_ROLES)] }, async (request, reply) => {
    const query = (request.query as Record<string, string | undefined>) || {};
    const parsed = AuditExportQuerySchema.safeParse({
      action: query.action,
      actor_user_id: query.actor_user_id,
      start_date: query.start_date,
      end_date: query.end_date,
      limit: query.limit ? parseInt(query.limit, 10) : 10000,
    });
    const limit = parsed.success ? Math.min(parsed.data.limit ?? 10000, 10000) : 10000;
    const filters: AuditExportQuery = parsed.success ? parsed.data : {};
    const q = buildAuditQuery(supabase, filters, { limit });
    const { data: rows, error } = await q;
    if (error) return reply.status(500).send(failure('DATABASE_ERROR', error.message));
    const header = 'ID,Date,Actor,Action,Entity Type,Entity ID,Journal ID,Meta (redacted)\n';
    const lines = (rows || []).map(
      (r: Record<string, unknown>) => {
        const metaRedacted = {
          action: r.action ?? '',
          related_entity_type: r.related_entity_type ?? '',
          related_entity_id: r.related_entity_id ?? '',
          journal_entry_id: r.journal_entry_id ?? '',
        };
        return [
          r.id,
          r.created_at,
          r.actor_user_id ?? '',
          r.action,
          r.related_entity_type ?? '',
          r.related_entity_id ?? '',
          r.journal_entry_id ?? '',
          JSON.stringify(metaRedacted).replace(/"/g, '""'),
        ]
          .map((f) => `"${String(f)}"`)
          .join(',');
      }
    );
    const csv = header + lines.join('\n');
    const filename = `sline_audit_export_${new Date().toISOString().split('T')[0]}.csv`;
    return reply
      .header('Content-Type', 'text/csv')
      .header('Content-Disposition', `attachment; filename="${filename}"`)
      .send(csv);
  });

  fastify.get('/audit', { preHandler: [requireAdminRole(FINANCE_WRITE_ROLES)] }, async (request, reply) => {
    const query = (request.query as Record<string, string | undefined>) || {};
    const parsed = AuditLogListFiltersSchema.safeParse({
      action: query.action,
      actor_user_id: query.actor_user_id,
      start_date: query.start_date,
      end_date: query.end_date,
      limit: query.limit ? parseInt(query.limit, 10) : 50,
      cursor_created_at: query.cursor_created_at,
      cursor_id: query.cursor_id,
    });
    if (!parsed.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid audit filters', parsed.error.format()));
    }
    const limit = parsed.data.limit ?? 50;
    const cursor =
      parsed.data.cursor_created_at && parsed.data.cursor_id
        ? { created_at: parsed.data.cursor_created_at, id: parsed.data.cursor_id }
        : undefined;
    const q = buildAuditQuery(supabase, parsed.data, { cursor, limit });
    const { data, error } = await q;
    if (error) return reply.status(500).send(failure('DATABASE_ERROR', error.message));
    const nextCursor =
      data && data.length === limit
        ? { created_at: data[data.length - 1].created_at, id: (data[data.length - 1] as Record<string, unknown>).id }
        : undefined;
    return reply.send(success({ data: data || [], nextCursor }));
  });
}

import type { FastifyInstance } from 'fastify';
import { createClient } from '@supabase/supabase-js';
import {
  failure,
  LogListQuerySchema,
  LogListResponseSchema,
  LOGS_READ_ROLES,
  success,
} from '@sline/shared';
import { requireAdminRole } from '../middleware/rbac.js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function mapLogStatus(action: string): 'success' | 'warning' | 'error' | 'info' {
  const normalized = action.toLowerCase();
  if (/(fail|error|reject|deny|blocked|forbid)/.test(normalized)) return 'error';
  if (/(warn|pending|degrad|retry)/.test(normalized)) return 'warning';
  if (/(create|update|approve|resolve|complete|success)/.test(normalized)) return 'success';
  return 'info';
}

export default async function logsRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/',
    { preHandler: [requireAdminRole([...LOGS_READ_ROLES])] },
    async (request, reply) => {
      try {
        const parsedQuery = LogListQuerySchema.safeParse(request.query);
        if (!parsedQuery.success) {
          return reply
            .status(400)
            .send(failure('VALIDATION_ERROR', 'Invalid logs query', parsedQuery.error.format()));
        }

        const { page, limit, action, actorUserId, from, to } = parsedQuery.data;
        const fromIndex = (page - 1) * limit;
        const toIndex = fromIndex + limit - 1;

        let query = supabase
          .from('audit_logs')
          .select(
            'id, action, actor_user_id, related_entity_type, related_entity_id, created_at, meta',
            { count: 'exact' }
          )
          .order('created_at', { ascending: false })
          .order('id', { ascending: false })
          .range(fromIndex, toIndex);

        if (action) query = query.ilike('action', `%${action}%`);
        if (actorUserId) query = query.eq('actor_user_id', actorUserId);
        if (from) query = query.gte('created_at', from);
        if (to) query = query.lte('created_at', to);

        const { data: rows, error, count } = await query;
        if (error) return reply.status(500).send(failure('DATABASE_ERROR', error.message));

        const actorIds = Array.from(
          new Set(
            (rows || [])
              .map((row: any) => row.actor_user_id)
              .filter((id: unknown): id is string => typeof id === 'string' && id.length > 0)
          )
        );

        const actorNames = new Map<string, string>();
        if (actorIds.length > 0) {
          const { data: actors } = await supabase
            .from('profiles')
            .select('id, full_name')
            .in('id', actorIds);
          (actors || []).forEach((actor: any) => {
            actorNames.set(actor.id, actor.full_name || actor.id);
          });
        }

        const payload = {
          logs: (rows || []).map((row: any) => ({
            id: String(row.id),
            action: String(row.action || 'system.event'),
            actorUserId: row.actor_user_id || null,
            actorName: row.actor_user_id ? actorNames.get(row.actor_user_id) || null : null,
            entityType: row.related_entity_type || null,
            entityId: row.related_entity_id || null,
            status: mapLogStatus(String(row.action || '')),
            createdAt: String(row.created_at || new Date().toISOString()),
            meta: row.meta || undefined,
          })),
          count: count || 0,
          totalPages: count ? Math.ceil(count / limit) : 0,
        };

        const parsedPayload = LogListResponseSchema.safeParse(payload);
        if (!parsedPayload.success) {
          return reply
            .status(500)
            .send(failure('INTERNAL_ERROR', 'Invalid logs payload', parsedPayload.error.format()));
        }

        return reply.status(200).send(success(parsedPayload.data));
      } catch (error: unknown) {
        fastify.log.error({ err: error }, 'logs route failed');
        return reply.status(500).send(failure('INTERNAL_ERROR', 'Failed to load logs'));
      }
    }
  );
}

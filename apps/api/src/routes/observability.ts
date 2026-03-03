/**
 * Observability / System Health — PAGE 14.
 * GET /api/v1/observability: DB connectivity, RPC availability (or N/A), queue status (N/A), error rates (from audit_logs or zeros).
 * RBAC: support, moderator, admin, super_admin (read-only).
 * No raw error messages or internal table/RPC names in response.
 */
import type { FastifyInstance } from 'fastify';
import { createClient } from '@supabase/supabase-js';
import { requireAdminRole } from '../middleware/rbac.js';
import { failure } from '@sline/shared';
import {
  ObservabilityResponseSchema,
  type ServiceStatusItem,
} from '@sline/shared';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const DB_CHECK_TABLE = 'admin_users'; // neutral admin table; replace with app-repo-agreed table if needed
export default async function observabilityRoutes(fastify: FastifyInstance) {
  fastify.addHook(
    'preHandler',
    requireAdminRole(['support', 'moderator', 'admin', 'super_admin'])
  );

  fastify.get('/', async (request, reply) => {
    try {
      const services: ServiceStatusItem[] = [];
      const now = new Date().toISOString();

      // 1. DB connectivity — neutral check (single row read)
      const dbStart = Date.now();
      try {
        const { error } = await supabase
          .from(DB_CHECK_TABLE)
          .select('id')
          .limit(1)
          .maybeSingle();
        const latencyMs = Math.round(Date.now() - dbStart);
        services.push({
          name: 'Database (Postgres)',
          status: error ? 'degraded' : 'operational',
          latencyMs,
          lastChecked: now,
        });
      } catch (e) {
        services.push({
          name: 'Database (Postgres)',
          status: 'down',
          latencyMs: 0,
          lastChecked: now,
        });
      }

      // 2. Auth (Supabase Auth API)
      const authStart = Date.now();
      try {
        const { error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
        const latencyMs = Math.round(Date.now() - authStart);
        services.push({
          name: 'Auth Service',
          status: error ? 'degraded' : 'operational',
          latencyMs,
          lastChecked: now,
        });
      } catch (e) {
        services.push({
          name: 'Auth Service',
          status: 'down',
          latencyMs: 0,
          lastChecked: now,
        });
      }

      // 3. Storage
      const storageStart = Date.now();
      try {
        const { error } = await supabase.storage.listBuckets();
        const latencyMs = Math.round(Date.now() - storageStart);
        services.push({
          name: 'Storage',
          status: error ? 'degraded' : 'operational',
          latencyMs,
          lastChecked: now,
        });
      } catch (e) {
        services.push({
          name: 'Storage',
          status: 'down',
          latencyMs: 0,
          lastChecked: now,
        });
      }

      // RPC availability: not implemented (no read-only ping RPC in repo; avoid calling mutating RPCs)
      const rpcStatus = undefined;

      // Queue status: not implemented
      const queueStatus = { status: 'not_implemented' as const };

      // Error rates: optional counts from audit_logs (e.g. failure-like actions); else zeros
      let errorRates: { last1h?: number; last24h?: number } = {};
      try {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const [res1h, res24h] = await Promise.all([
          supabase
            .from('audit_logs')
            .select('id', { count: 'exact', head: true })
            .gte('created_at', oneHourAgo)
            .ilike('action', '%fail%'),
          supabase
            .from('audit_logs')
            .select('id', { count: 'exact', head: true })
            .gte('created_at', oneDayAgo)
            .ilike('action', '%fail%'),
        ]);
        errorRates = {
          last1h: res1h.count ?? 0,
          last24h: res24h.count ?? 0,
        };
      } catch {
        errorRates = { last1h: 0, last24h: 0 };
      }

      const payload = {
        ok: true as const,
        data: {
          services,
          rpcStatus,
          queueStatus,
          errorRates,
        },
      };

      const parsed = ObservabilityResponseSchema.safeParse(payload);
      if (!parsed.success) {
        fastify.log.warn({ err: parsed.error }, 'Observability response schema validation failed');
        return reply.status(500).send(failure('INTERNAL_ERROR', 'Invalid observability payload'));
      }

      return reply.status(200).send(parsed.data);
    } catch (err: unknown) {
      fastify.log.error({ err }, 'Observability route error');
      return reply.status(500).send(failure('INTERNAL_ERROR', 'An error occurred'));
    }
  });
}

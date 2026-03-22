/**
 * Observability / System Health — PAGE 14.
 * GET /api/v1/observability: 12 services, summary, KPIs, 90-day uptime (mock/derived where no metrics pipeline).
 * RBAC: support, moderator, admin, super_admin (read-only).
 * No raw error messages or internal table/RPC names in response.
 *
 * Data sources (mock vs real):
 * - services: DB, Auth, Storage are real checks; others inherit a derived platform status with mock latency and uptime.
 * - summary: computed from 12-service list (real counts; overallUptimePct derived from per-service uptime or single source).
 * - kpis: MOCK until metrics pipeline exists (uptime30d, avgLatencyMs, errorRatePct, requestsPerMin + deltas/sparklines).
 * - uptime90Day: MOCK/derived (90 days; mostly operational, few degraded/outage for demo).
 * - per-service uptimePct/sparkline: derived or mock.
 */
import type { FastifyInstance } from 'fastify';
import { createClient } from '@supabase/supabase-js';
import { requireAdminRole } from '../middleware/rbac.js';
import { failure } from '@sline/shared';
import {
  ObservabilityResponseSchema,
  type ServiceStatusItem,
  type Summary,
  type SystemHealthKpis,
  type UptimeDay,
} from '@sline/shared';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const DB_CHECK_TABLE = 'admin_users';

/** Fixed list of 12 services for Figma parity; order and keys for mapping real checks. */
const SERVICE_DEFINITIONS: Array<{
  key: string;
  name: string;
  description: string;
}> = [
  { key: 'api_gateway', name: 'API Gateway', description: 'Primary request routing & load balancing' },
  { key: 'auth', name: 'Auth Service', description: 'JWT issuance, token validation & 2FA' },
  { key: 'booking', name: 'Booking Service', description: 'Booking lifecycle & state management' },
  { key: 'storage', name: 'File Storage (S3)', description: 'Object storage for uploads & backups' },
  { key: 'cron', name: 'Cron Scheduler', description: 'Scheduled jobs & background task runner' },
  { key: 'cdn', name: 'CDN Edge Network', description: 'Static asset delivery & edge caching' },
  { key: 'database', name: 'Database (Postgres)', description: 'Primary data store - read/write cluster' },
  { key: 'payment', name: 'Payment Engine', description: 'Transaction processing & escrow management' },
  { key: 'notification', name: 'Notification Service', description: 'Push, SMS & email delivery pipeline' },
  { key: 'search', name: 'Search Index (ES)', description: 'Elasticsearch cluster – full-text search' },
  { key: 'redis', name: 'Rate Limiter (Redis)', description: 'Request throttling & session cache' },
  { key: 'admin_panel', name: 'Admin Panel', description: 'Dashboard API & internal tooling' },
];

function mockSparkline(points = 7, base = 99): number[] {
  return Array.from({ length: points }, (_, i) => base + (i % 3) * 0.5 - 0.5);
}

function buildUptime90Day(): UptimeDay[] {
  const days: UptimeDay[] = [];
  for (let i = 89; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const date = d.toISOString().slice(0, 10);
    const status = i % 15 === 0 ? 'degraded' : i % 30 === 1 ? 'outage' : 'operational';
    days.push({ date, status: status as 'operational' | 'degraded' | 'outage' });
  }
  return days;
}

function derivePlatformStatus(
  realChecks: Record<string, { status: 'operational' | 'degraded' | 'down'; latencyMs: number }>
): 'operational' | 'degraded' {
  const statuses = Object.values(realChecks).map((check) => check.status);
  if (statuses.some((status) => status === 'down' || status === 'degraded')) return 'degraded';
  return 'operational';
}

function derivePlatformLatency(
  realChecks: Record<string, { status: 'operational' | 'degraded' | 'down'; latencyMs: number }>
): number {
  const latencies = Object.values(realChecks)
    .map((check) => check.latencyMs)
    .filter((latencyMs) => latencyMs > 0);

  if (latencies.length === 0) return 0;
  return Math.round(latencies.reduce((sum, latencyMs) => sum + latencyMs, 0) / latencies.length);
}

export default async function observabilityRoutes(fastify: FastifyInstance) {
  fastify.addHook(
    'preHandler',
    requireAdminRole(['support', 'moderator', 'admin', 'super_admin'])
  );

  fastify.get('/', async (request, reply) => {
    const log = fastify.log.child({ route: 'observability' });
    log.info('GET /observability start');

    try {
      const now = new Date().toISOString();
      const realChecks: Record<string, { status: 'operational' | 'degraded' | 'down'; latencyMs: number }> = {};

      // 1. Database (Postgres)
      const dbStart = Date.now();
      try {
        const { error } = await supabase.from(DB_CHECK_TABLE).select('id').limit(1).maybeSingle();
        realChecks.database = {
          status: error ? 'degraded' : 'operational',
          latencyMs: Math.round(Date.now() - dbStart),
        };
      } catch {
        realChecks.database = { status: 'down', latencyMs: 0 };
      }

      // 2. Auth Service
      const authStart = Date.now();
      try {
        const { error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
        realChecks.auth = {
          status: error ? 'degraded' : 'operational',
          latencyMs: Math.round(Date.now() - authStart),
        };
      } catch {
        realChecks.auth = { status: 'down', latencyMs: 0 };
      }

      // 3. Storage (File Storage)
      const storageStart = Date.now();
      try {
        const { error } = await supabase.storage.listBuckets();
        realChecks.storage = {
          status: error ? 'degraded' : 'operational',
          latencyMs: Math.round(Date.now() - storageStart),
        };
      } catch {
        realChecks.storage = { status: 'down', latencyMs: 0 };
      }

      const derivedPlatformStatus = derivePlatformStatus(realChecks);
      const derivedPlatformLatency = derivePlatformLatency(realChecks);

      // Build 12 services with descriptions and optional metrics
      const services: ServiceStatusItem[] = SERVICE_DEFINITIONS.map((def) => {
        const real = realChecks[def.key];
        const status = real?.status ?? derivedPlatformStatus;
        const latencyMs = real?.latencyMs ?? derivedPlatformLatency;
        const uptimePct = real
          ? real.status === 'operational'
            ? 99.5
            : real.status === 'degraded'
              ? 98
              : 95
          : derivedPlatformStatus === 'operational'
            ? 99.88
            : 98.4;
        return {
          name: def.name,
          status,
          latencyMs,
          lastChecked: now,
          description: def.description,
          uptimePct: Math.round(uptimePct * 100) / 100,
          sparkline: mockSparkline(7, uptimePct),
        };
      });

      let errorRates = { last1h: 0, last24h: 0 };
      try {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const [res1h, res24h] = await Promise.all([
          supabase.from('audit_logs').select('id', { count: 'exact', head: true }).gte('created_at', oneHourAgo).ilike('action', '%fail%'),
          supabase.from('audit_logs').select('id', { count: 'exact', head: true }).gte('created_at', oneDayAgo).ilike('action', '%fail%'),
        ]);
        errorRates = { last1h: res1h.count ?? 0, last24h: res24h.count ?? 0 };
      } catch {
        // keep zeros
      }

      const operationalCount = services.filter((s) => s.status === 'operational').length;
      const degradedCount = services.filter((s) => s.status === 'degraded' || s.status === 'down').length;
      const maintenanceCount = services.filter((s) => s.status === 'maintenance').length;
      const overallUptimePct = services.length
        ? services.reduce((sum, s) => sum + (s.uptimePct ?? 99), 0) / services.length
        : 99.93;

      const summary: Summary = {
        overallUptimePct: Math.round(overallUptimePct * 100) / 100,
        operationalCount,
        degradedCount,
        maintenanceCount,
      };

      const avgLatencyMs = services.filter((s) => s.latencyMs > 0).length
        ? Math.round(services.reduce((a, s) => a + s.latencyMs, 0) / services.filter((s) => s.latencyMs > 0).length)
        : 83;
      const kpis: SystemHealthKpis = {
        uptime30d: summary.overallUptimePct,
        uptime30dDelta: 0.02,
        avgLatencyMs,
        avgLatencyDeltaMs: 3,
        errorRatePct: errorRates.last24h > 0 ? Math.round((errorRates.last24h / 1000) * 100) / 100 : 0.62,
        errorRateDeltaPct: 0.17,
        requestsPerMin: 9100,
        requestsPerMinDelta: 14,
        sparklineUptime: mockSparkline(7, 99.9),
        sparklineLatency: [80, 82, 81, 83, 84, 83, 83],
        sparklineError: [0.5, 0.55, 0.6, 0.62, 0.6, 0.58, 0.62],
        sparklineReqMin: [8000, 8500, 8700, 9000, 9100, 9050, 9100],
      };

      const uptime90Day = buildUptime90Day();

      const payload = {
        ok: true as const,
        data: {
          services,
          rpcStatus: undefined,
          queueStatus: { status: 'not_implemented' as const },
          errorRates,
          summary,
          kpis,
          uptime90Day,
        },
      };

      const parsed = ObservabilityResponseSchema.safeParse(payload);
      if (!parsed.success) {
        log.warn({ err: parsed.error.flatten() }, 'Observability response schema validation failed');
        return reply.status(500).send(failure('INTERNAL_ERROR', 'Invalid observability payload'));
      }

      log.info(
        { servicesCount: services.length, operationalCount, degradedCount, maintenanceCount },
        'GET /observability success'
      );
      return reply.status(200).send(parsed.data);
    } catch (err: unknown) {
      log.error({ err }, 'Observability route error');
      return reply.status(500).send(failure('INTERNAL_ERROR', 'An error occurred'));
    }
  });
}

import type { FastifyInstance } from 'fastify';
import { createClient } from '@supabase/supabase-js';
import {
  AdminGlobalSearchQuerySchema,
  AdminGlobalSearchResultSchema,
  AdminSearchInsightsQuerySchema,
  AdminSearchInsightsResultSchema,
  type AdminGlobalSearchResultItem,
  type AdminSearchEntityType,
  failure,
  success,
} from '@sline/shared';
import { requireAdminRole } from '../middleware/rbac.js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const DEFAULT_SEARCH_TIMEOUT_MS = 8000;
function getSearchTimeoutMs(): number {
  return Number(process.env.SEARCH_TIMEOUT_MS) || DEFAULT_SEARCH_TIMEOUT_MS;
}
const ALL_ENTITY_TYPES: AdminSearchEntityType[] = ['user', 'task', 'booking', 'dispute', 'transaction'];
const SEARCH_INSIGHTS_WINDOW_HOURS = 24;
const SEARCH_SPARKLINE_BUCKETS = 6;
const INSTANT_MATCH_THRESHOLD_MS = 300;

function isUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

async function searchWithTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Search timeout')), ms)
  );
  return Promise.race([promise, timeout]);
}

type SearchEventInsert = {
  adminUserId: string | null;
  query: string;
  types: AdminSearchEntityType[];
  resultCount: number;
  durationMs: number;
  timedOut: boolean;
};

type SearchEventRow = {
  created_at: string;
  result_count: number;
  duration_ms: number;
  timed_out: boolean | null;
};

function safeRound(value: number, digits = 2): number {
  const p = 10 ** digits;
  return Math.round(value * p) / p;
}

function deltaPercent(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return safeRound(((current - previous) / previous) * 100);
}

function zeroSparkline() {
  return Array.from({ length: SEARCH_SPARKLINE_BUCKETS }, () => 0);
}

function toUtcDayWindow(now = new Date()) {
  const currentStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
  const currentEnd = new Date(currentStart.getTime() + SEARCH_INSIGHTS_WINDOW_HOURS * 60 * 60 * 1000);
  const previousStart = new Date(currentStart.getTime() - SEARCH_INSIGHTS_WINDOW_HOURS * 60 * 60 * 1000);
  const previousEnd = currentStart;

  return { currentStart, currentEnd, previousStart, previousEnd };
}

function bucketIndexForDate(value: string, start: Date, bucketMs: number) {
  const ts = Date.parse(value);
  if (Number.isNaN(ts)) return -1;
  return Math.floor((ts - start.getTime()) / bucketMs);
}

function buildSparklineCount(rows: SearchEventRow[], start: Date): number[] {
  const result = zeroSparkline();
  const bucketMs = (SEARCH_INSIGHTS_WINDOW_HOURS * 60 * 60 * 1000) / SEARCH_SPARKLINE_BUCKETS;

  for (const row of rows) {
    const index = bucketIndexForDate(row.created_at, start, bucketMs);
    if (index >= 0 && index < result.length) result[index] += 1;
  }
  return result;
}

function buildSparklineAverage(rows: SearchEventRow[], start: Date): number[] {
  const sums = zeroSparkline();
  const counts = zeroSparkline();
  const bucketMs = (SEARCH_INSIGHTS_WINDOW_HOURS * 60 * 60 * 1000) / SEARCH_SPARKLINE_BUCKETS;

  for (const row of rows) {
    const index = bucketIndexForDate(row.created_at, start, bucketMs);
    if (index >= 0 && index < sums.length) {
      sums[index] += Math.max(0, row.result_count || 0);
      counts[index] += 1;
    }
  }

  return sums.map((sum, index) => (counts[index] > 0 ? Math.round(sum / counts[index]) : 0));
}

function buildSparklineInstantRate(rows: SearchEventRow[], start: Date): number[] {
  const matches = zeroSparkline();
  const totals = zeroSparkline();
  const bucketMs = (SEARCH_INSIGHTS_WINDOW_HOURS * 60 * 60 * 1000) / SEARCH_SPARKLINE_BUCKETS;

  for (const row of rows) {
    const index = bucketIndexForDate(row.created_at, start, bucketMs);
    if (index < 0 || index >= matches.length) continue;
    totals[index] += 1;
    if (!row.timed_out && row.result_count > 0 && row.duration_ms <= INSTANT_MATCH_THRESHOLD_MS) {
      matches[index] += 1;
    }
  }

  return matches.map((count, index) => {
    if (totals[index] === 0) return 0;
    return Math.round((count / totals[index]) * 100);
  });
}

function buildStaleInsights() {
  return {
    windowHours: 24 as const,
    generatedAt: new Date().toISOString(),
    stale: true,
    metrics: {
      searchesToday: { value: 0, deltaPercent: 0, sparkline: zeroSparkline(), stale: true },
      avgResultsPerQuery: { value: 0, deltaPercent: 0, sparkline: zeroSparkline(), stale: true },
      instantMatchRate: { value: 0, deltaPercent: 0, sparkline: zeroSparkline(), stale: true },
      zeroResultQueries: { value: 0, deltaPercent: 0, sparkline: zeroSparkline(), stale: true },
    },
  };
}

async function insertSearchEvent(payload: SearchEventInsert): Promise<void> {
  try {
    await supabase.from('admin_search_events').insert({
      admin_user_id: payload.adminUserId,
      query_text: payload.query.slice(0, 200),
      entity_types: payload.types,
      result_count: Math.max(0, payload.resultCount),
      duration_ms: Math.max(0, payload.durationMs),
      timed_out: payload.timedOut,
    });
  } catch {
    // Event logging must never break search reads.
  }
}

async function loadSearchInsights() {
  const { currentStart, currentEnd, previousStart, previousEnd } = toUtcDayWindow();

  const [currentWindow, previousWindow] = await Promise.all([
    supabase
      .from('admin_search_events')
      .select('created_at, result_count, duration_ms, timed_out')
      .gte('created_at', currentStart.toISOString())
      .lt('created_at', currentEnd.toISOString()),
    supabase
      .from('admin_search_events')
      .select('created_at, result_count, duration_ms, timed_out')
      .gte('created_at', previousStart.toISOString())
      .lt('created_at', previousEnd.toISOString()),
  ]);

  if (currentWindow.error || previousWindow.error) return buildStaleInsights();

  const currentRows = (currentWindow.data ?? []) as SearchEventRow[];
  const previousRows = (previousWindow.data ?? []) as SearchEventRow[];

  const currentTotal = currentRows.length;
  const previousTotal = previousRows.length;

  const currentAvgResults = currentTotal > 0
    ? safeRound(currentRows.reduce((sum, row) => sum + Math.max(0, row.result_count || 0), 0) / currentTotal)
    : 0;
  const previousAvgResults = previousTotal > 0
    ? safeRound(previousRows.reduce((sum, row) => sum + Math.max(0, row.result_count || 0), 0) / previousTotal)
    : 0;

  const currentInstantRate = currentTotal > 0
    ? safeRound(
        (currentRows.filter((row) => !row.timed_out && row.result_count > 0 && row.duration_ms <= INSTANT_MATCH_THRESHOLD_MS).length / currentTotal) * 100
      )
    : 0;
  const previousInstantRate = previousTotal > 0
    ? safeRound(
        (previousRows.filter((row) => !row.timed_out && row.result_count > 0 && row.duration_ms <= INSTANT_MATCH_THRESHOLD_MS).length / previousTotal) * 100
      )
    : 0;

  const currentZeroResults = currentRows.filter((row) => (row.result_count || 0) === 0).length;
  const previousZeroResults = previousRows.filter((row) => (row.result_count || 0) === 0).length;

  return {
    windowHours: 24 as const,
    generatedAt: new Date().toISOString(),
    stale: false,
    metrics: {
      searchesToday: {
        value: currentTotal,
        deltaPercent: deltaPercent(currentTotal, previousTotal),
        sparkline: buildSparklineCount(currentRows, currentStart),
        stale: false,
      },
      avgResultsPerQuery: {
        value: currentAvgResults,
        deltaPercent: deltaPercent(currentAvgResults, previousAvgResults),
        sparkline: buildSparklineAverage(currentRows, currentStart),
        stale: false,
      },
      instantMatchRate: {
        value: currentInstantRate,
        deltaPercent: deltaPercent(currentInstantRate, previousInstantRate),
        sparkline: buildSparklineInstantRate(currentRows, currentStart),
        stale: false,
      },
      zeroResultQueries: {
        value: currentZeroResults,
        deltaPercent: deltaPercent(currentZeroResults, previousZeroResults),
        sparkline: buildSparklineCount(
          currentRows.filter((row) => (row.result_count || 0) === 0),
          currentStart
        ),
        stale: false,
      },
    },
  };
}

export default async function searchRoutes(fastify: FastifyInstance) {
  /** Any authenticated admin role may call GET /api/v1/search. No per-entity restriction. Read-only; no audit_logs. */
  fastify.addHook('preHandler', requireAdminRole(['support', 'moderator', 'admin', 'super_admin']));

  /**
   * GET /api/v1/search/insights?window=24h&tz=UTC
   * Returns Search KPI insights backed by admin_search_events telemetry.
   */
  fastify.get('/insights', async (request, reply) => {
    const query = request.query as Record<string, string | undefined>;
    const parsed = AdminSearchInsightsQuerySchema.safeParse({
      window: query.window,
      tz: query.tz,
    });
    if (!parsed.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid insights params', parsed.error.format()));
    }

    const insights = await loadSearchInsights();
    const validated = AdminSearchInsightsResultSchema.safeParse(insights);
    if (!validated.success) {
      fastify.log?.error?.(validated.error);
      if (request.id) reply.header('x-request-id', request.id);
      return reply.status(503).send(failure('INTERNAL_ERROR', 'Search insights validation failed'));
    }

    if (request.id) reply.header('x-request-id', request.id);
    return reply.send(success(validated.data));
  });

  /**
   * GET /api/v1/search?q=...&types=user,task&limit=20
   * Returns aggregated results from profiles, tasks, bookings, disputes, vw_admin_journal_ledger.
   */
  fastify.get('/', async (request, reply) => {
    const query = request.query as Record<string, string | undefined>;
    const parsed = AdminGlobalSearchQuerySchema.safeParse({
      q: query.q ?? '',
      types: query.types,
      limit: query.limit ?? '20',
    });
    if (!parsed.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid search params', parsed.error.format()));
    }
    const { q, types, limit } = parsed.data;
    const typesToSearch = types?.length ? types : ALL_ENTITY_TYPES;
    const searchStartedAt = Date.now();
    // Escape for PostgREST ilike: % _ and single quote (prevent filter break/injection)
    const escaped = q
      .replace(/%/g, '\\%')
      .replace(/_/g, '\\_')
      .replace(/'/g, "''");

    const runSearch = async (): Promise<AdminGlobalSearchResultItem[]> => {
      const perType = Math.max(1, Math.ceil(limit / typesToSearch.length));

      const runUser = async () => {
        if (!typesToSearch.includes('user')) return [];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .or(`full_name.ilike.%${escaped}%,email.ilike.%${escaped}%`)
          .limit(perType);
        return (profiles || []).map((p: { id: string; full_name?: string; email?: string }) => ({
          entityType: 'user' as const,
          id: p.id,
          title: (p.full_name || p.email || p.id).slice(0, 100),
          subtitle: p.email && p.full_name ? p.email : undefined,
          link: `/users/${p.id}`,
        }));
      };

      const runTask = async () => {
        if (!typesToSearch.includes('task')) return [];
        const { data: tasks } = await supabase
          .from('tasks')
          .select('id, title')
          .or(isUuid(q) ? `id.eq.${q},title.ilike.%${escaped}%` : `title.ilike.%${escaped}%`)
          .limit(perType);
        return (tasks || []).map((t: { id: string; title?: string }) => ({
          entityType: 'task' as const,
          id: t.id,
          title: (t.title || t.id).slice(0, 100),
          link: `/tasks/${t.id}`,
        }));
      };

      const runBooking = async () => {
        if (!typesToSearch.includes('booking')) return [];
        let builder = supabase.from('bookings').select('id, task_id').limit(perType);
        if (isUuid(q)) builder = builder.eq('id', q).limit(1);
        const { data: bookings } = await builder;
        return (bookings || []).map((b: { id: string; task_id?: string }) => ({
          entityType: 'booking' as const,
          id: b.id,
          title: `Booking ${b.id.slice(0, 8)}`,
          subtitle: b.task_id ? `Task ${b.task_id.slice(0, 8)}` : undefined,
          link: `/bookings/${b.id}`,
        }));
      };

      const runDispute = async () => {
        if (!typesToSearch.includes('dispute')) return [];
        let builder = supabase.from('disputes').select('id').limit(perType);
        if (isUuid(q)) builder = builder.eq('id', q).limit(1);
        const { data: disputes } = await builder;
        return (disputes || []).map((d: { id: string }) => ({
          entityType: 'dispute' as const,
          id: d.id,
          title: `Dispute ${d.id.slice(0, 8)}`,
          link: `/disputes/${d.id}`,
        }));
      };

      const runTransaction = async () => {
        if (!typesToSearch.includes('transaction')) return [];
        let builder = supabase
          .from('vw_admin_journal_ledger')
          .select('journal_id, entity_id, entity_type')
          .limit(perType);
        if (isUuid(q)) {
          builder = builder.or(`journal_id.eq.${q},entity_id.eq.${q}`);
        }
        const { data: rows } = await builder;
        return (rows || [])
          .filter((r: { journal_id?: string; entity_id?: string }) => r.journal_id || r.entity_id)
          .map((r: { journal_id: string; entity_id?: string; entity_type?: string }) => {
            const id = r.journal_id || r.entity_id!;
            return {
              entityType: 'transaction' as const,
              id,
              title: `Transaction ${id.slice(0, 8)}`,
              subtitle: r.entity_type ? `${r.entity_type}` : undefined,
              link: `/finance/transactions?journal=${id}`,
            };
          });
      };

      const [userItems, taskItems, bookingItems, disputeItems, transactionItems] = await Promise.all([
        runUser(),
        runTask(),
        runBooking(),
        runDispute(),
        runTransaction(),
      ]);
      return [...userItems, ...taskItems, ...bookingItems, ...disputeItems, ...transactionItems].slice(0, limit);
    };

    try {
      const items = await searchWithTimeout(runSearch(), getSearchTimeoutMs());
      const response = { items };
      const validated = AdminGlobalSearchResultSchema.safeParse(response);
      if (!validated.success) {
        fastify.log?.error?.(validated.error);
        return reply.status(503).send(failure('INTERNAL_ERROR', 'Search response validation failed'));
      }

      void insertSearchEvent({
        adminUserId: ((request as any).user?.id as string | undefined) ?? null,
        query: q,
        types: typesToSearch,
        resultCount: validated.data.items.length,
        durationMs: Date.now() - searchStartedAt,
        timedOut: false,
      });

      if (request.id) reply.header('x-request-id', request.id);
      return reply.send(success(validated.data));
    } catch (err: any) {
      fastify.log?.error?.(err);
      void insertSearchEvent({
        adminUserId: ((request as any).user?.id as string | undefined) ?? null,
        query: q,
        types: typesToSearch,
        resultCount: 0,
        durationMs: Date.now() - searchStartedAt,
        timedOut: String(err?.message || '').toLowerCase().includes('timeout'),
      });
      if (request.id) reply.header('x-request-id', request.id);
      return reply.status(503).send(failure('SERVICE_UNAVAILABLE', err?.message || 'Search failed'));
    }
  });
}

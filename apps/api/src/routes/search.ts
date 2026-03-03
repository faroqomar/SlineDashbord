import type { FastifyInstance } from 'fastify';
import { createClient } from '@supabase/supabase-js';
import {
  AdminGlobalSearchQuerySchema,
  AdminGlobalSearchResultSchema,
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

function isUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

async function searchWithTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Search timeout')), ms)
  );
  return Promise.race([promise, timeout]);
}

export default async function searchRoutes(fastify: FastifyInstance) {
  /** Any authenticated admin role may call GET /api/v1/search. No per-entity restriction. Read-only; no audit_logs. */
  fastify.addHook('preHandler', requireAdminRole(['support', 'moderator', 'admin', 'super_admin']));

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
    // Escape for PostgREST ilike: % _ and single quote (prevent filter break/injection)
    const escaped = q
      .replace(/%/g, '\\%')
      .replace(/_/g, '\\_')
      .replace(/'/g, "''");

    const runSearch = async (): Promise<AdminGlobalSearchResultItem[]> => {
      const items: AdminGlobalSearchResultItem[] = [];
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
      if (request.id) reply.header('x-request-id', request.id);
      return reply.send(success(validated.data));
    } catch (err: any) {
      fastify.log?.error?.(err);
      if (request.id) reply.header('x-request-id', request.id);
      return reply.status(503).send(failure('SERVICE_UNAVAILABLE', err?.message || 'Search failed'));
    }
  });
}

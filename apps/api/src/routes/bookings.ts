import type { FastifyInstance } from 'fastify';
import { createClient } from '@supabase/supabase-js';
import {
  BookingAnalyticsSeriesQuerySchema,
  BookingAnalyticsSeriesSchema,
  BookingAnalyticsKpisSchema,
  type BookingListQuery,
  BookingListQuerySchema,
  BookingListResponseSchema,
  AdminBookingCancelInputSchema,
  AdminBookingRefundInputSchema,
  failure,
  success,
} from '@sline/shared';
import { requireAdminRole } from '../middleware/rbac.js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BOOKING_LIST_ROLES = ['moderator', 'admin', 'super_admin'];
const BOOKING_CANCEL_ROLES = ['moderator', 'admin', 'super_admin'];
const BOOKING_REFUND_ROLES = ['admin', 'super_admin'];
const DAY_MS = 24 * 60 * 60 * 1000;
const BOOKING_ANALYTICS_BUCKETS = 7;

function toUtcDayStart(value: Date): Date {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate(), 0, 0, 0, 0));
}

function buildDailyBucketStarts(start: Date, days: number): string[] {
  return Array.from({ length: days }, (_, index) => new Date(start.getTime() + index * DAY_MS).toISOString());
}

function toBucketStartIso(value: unknown): string | null {
  if (typeof value !== 'string' && !(value instanceof Date)) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return toUtcDayStart(date).toISOString();
}

function countByBucket(bucketStarts: string[], values: unknown[]): Map<string, number> {
  const counts = new Map<string, number>(bucketStarts.map((bucketStart) => [bucketStart, 0]));
  const knownBuckets = new Set(bucketStarts);

  for (const value of values) {
    const bucketStart = toBucketStartIso(value);
    if (!bucketStart || !knownBuckets.has(bucketStart)) continue;
    counts.set(bucketStart, (counts.get(bucketStart) ?? 0) + 1);
  }

  return counts;
}

function buildStaleAnalyticsPayload(bucketStarts: string[]) {
  return {
    window: '7d' as const,
    timezone: 'UTC' as const,
    points: bucketStarts.map((bucketStart) => ({
      bucket_start: bucketStart,
      booked: 0,
      completed: 0,
    })),
    updated_at: new Date().toISOString(),
    is_stale: true,
  };
}

function buildStaleKpisPayload() {
  const empty = Array.from({ length: 7 }, () => 0);
  return {
    window: '7d' as const,
    currency: 'IQD' as const,
    cards: [
      { id: 'total_bookings' as const, value: 0, delta: 0, sparkline: [...empty], tone: 'violet' as const },
      { id: 'completed' as const, value: 0, delta: 0, sparkline: [...empty], tone: 'green' as const },
      { id: 'revenue' as const, value: 0, delta: 0, sparkline: [...empty], tone: 'amber' as const },
      { id: 'canceled' as const, value: 0, delta: 0, sparkline: [...empty], tone: 'red' as const },
    ],
    updated_at: new Date().toISOString(),
    is_stale: true,
  };
}

function formatBookingCode(id: string): string {
  return `BK-${id.replace(/-/g, '').slice(0, 6).toUpperCase()}`;
}

function shortName(name: string | null | undefined): string | null {
  const value = (name ?? '').trim();
  if (!value) return null;
  return value.split(/\s+/)[0] ?? value;
}

function normalizeSearchValue(value: string | null | undefined): string {
  return (value ?? '').toLowerCase();
}

function resolveOrder(sort: BookingListQuery['sort']): { column: 'created_at' | 'price'; ascending: boolean } {
  if (sort === 'created_asc') return { column: 'created_at', ascending: true };
  if (sort === 'price_desc') return { column: 'price', ascending: false };
  if (sort === 'price_asc') return { column: 'price', ascending: true };
  return { column: 'created_at', ascending: false };
}

function isUuidLike(value: string): boolean {
  return /^[0-9a-f-]{36}$/i.test(value);
}

export default async function bookingsRoutes(fastify: FastifyInstance) {
  /**
   * GET /analytics/series — Hero analytics series (last 7 days, UTC)
   */
  fastify.get('/analytics/series', { preHandler: [requireAdminRole(BOOKING_LIST_ROLES)] }, async (request, reply) => {
    const query = BookingAnalyticsSeriesQuerySchema.safeParse(request.query ?? {});
    if (!query.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid analytics query', query.error.format()));
    }

    const now = new Date();
    const todayUtcStart = toUtcDayStart(now);
    const startUtc = new Date(todayUtcStart.getTime() - (BOOKING_ANALYTICS_BUCKETS - 1) * DAY_MS);
    const endUtcExclusive = new Date(todayUtcStart.getTime() + DAY_MS);
    const startIso = startUtc.toISOString();
    const endIso = endUtcExclusive.toISOString();
    const bucketStarts = buildDailyBucketStarts(startUtc, BOOKING_ANALYTICS_BUCKETS);

    const [bookedRes, completedRes, deliveredFallbackRes] = await Promise.all([
      supabase
        .from('bookings')
        .select('created_at')
        .gte('created_at', startIso)
        .lt('created_at', endIso),
      supabase
        .from('bookings')
        .select('completed_at')
        .not('completed_at', 'is', null)
        .gte('completed_at', startIso)
        .lt('completed_at', endIso),
      supabase
        .from('bookings')
        .select('delivered_at')
        .is('completed_at', null)
        .not('delivered_at', 'is', null)
        .gte('delivered_at', startIso)
        .lt('delivered_at', endIso),
    ]);

    if (bookedRes.error || completedRes.error || deliveredFallbackRes.error) {
      fastify.log.warn(
        {
          route: '/api/v1/bookings/analytics/series',
          bookedQueryFailed: Boolean(bookedRes.error),
          completedQueryFailed: Boolean(completedRes.error),
          deliveredFallbackQueryFailed: Boolean(deliveredFallbackRes.error),
        },
        'Booking analytics query failed; returning stale fallback series'
      );
      return reply.send(success(buildStaleAnalyticsPayload(bucketStarts)));
    }

    const bookedCounts = countByBucket(
      bucketStarts,
      (bookedRes.data ?? []).map((row: { created_at?: unknown }) => row.created_at)
    );
    const completedCounts = countByBucket(
      bucketStarts,
      [
        ...(completedRes.data ?? []).map((row: { completed_at?: unknown }) => row.completed_at),
        ...(deliveredFallbackRes.data ?? []).map((row: { delivered_at?: unknown }) => row.delivered_at),
      ]
    );

    const payload = {
      window: query.data.window,
      timezone: query.data.tz,
      points: bucketStarts.map((bucketStart) => ({
        bucket_start: bucketStart,
        booked: bookedCounts.get(bucketStart) ?? 0,
        completed: completedCounts.get(bucketStart) ?? 0,
      })),
      updated_at: now.toISOString(),
      is_stale: false,
    };
    const validated = BookingAnalyticsSeriesSchema.safeParse(payload);
    if (!validated.success) {
      fastify.log.error({ err: validated.error }, 'Booking analytics response validation failed');
      return reply.status(500).send(failure('INTERNAL_ERROR', 'Failed to build booking analytics response'));
    }

    return reply.send(success(validated.data));
  });

  /**
   * GET /analytics/kpis — KPI cards with trend and sparkline (last 7 days)
   */
  fastify.get('/analytics/kpis', { preHandler: [requireAdminRole(BOOKING_LIST_ROLES)] }, async (_request, reply) => {
    const now = new Date();
    const todayUtcStart = toUtcDayStart(now);
    const currentStart = new Date(todayUtcStart.getTime() - (BOOKING_ANALYTICS_BUCKETS - 1) * DAY_MS);
    const previousStart = new Date(currentStart.getTime() - BOOKING_ANALYTICS_BUCKETS * DAY_MS);
    const endUtcExclusive = new Date(todayUtcStart.getTime() + DAY_MS);

    const currentBuckets = buildDailyBucketStarts(currentStart, BOOKING_ANALYTICS_BUCKETS);
    const previousBuckets = buildDailyBucketStarts(previousStart, BOOKING_ANALYTICS_BUCKETS);
    const currentIndexByBucket = new Map(currentBuckets.map((bucket, index) => [bucket, index]));
    const previousIndexByBucket = new Map(previousBuckets.map((bucket, index) => [bucket, index]));

    const rowsRes = await supabase
      .from('bookings')
      .select('created_at, status, payment_status, price, completed_at, delivered_at')
      .gte('created_at', previousStart.toISOString())
      .lt('created_at', endUtcExclusive.toISOString());

    if (rowsRes.error) {
      fastify.log.warn(
        { route: '/api/v1/bookings/analytics/kpis' },
        'Booking KPI query failed; returning stale fallback cards'
      );
      return reply.send(success(buildStaleKpisPayload()));
    }

    const mkSeries = () => Array.from({ length: BOOKING_ANALYTICS_BUCKETS }, () => 0);
    const current = {
      total_bookings: mkSeries(),
      completed: mkSeries(),
      revenue: mkSeries(),
      canceled: mkSeries(),
    };
    const previous = {
      total_bookings: mkSeries(),
      completed: mkSeries(),
      revenue: mkSeries(),
      canceled: mkSeries(),
    };

    for (const row of rowsRes.data ?? []) {
      const createdBucket = toBucketStartIso((row as { created_at?: unknown }).created_at);
      const completedAt =
        (row as { completed_at?: unknown }).completed_at ?? (row as { delivered_at?: unknown }).delivered_at;
      const completedBucket = toBucketStartIso(completedAt);
      const price = Number((row as { price?: unknown }).price ?? 0) || 0;
      const isCanceled = String((row as { status?: unknown }).status ?? '') === 'canceled';
      const isRevenue = String((row as { payment_status?: unknown }).payment_status ?? '') === 'released';

      const currentCreatedIndex = createdBucket ? currentIndexByBucket.get(createdBucket) : undefined;
      const previousCreatedIndex = createdBucket ? previousIndexByBucket.get(createdBucket) : undefined;
      const currentCompletedIndex = completedBucket ? currentIndexByBucket.get(completedBucket) : undefined;
      const previousCompletedIndex = completedBucket ? previousIndexByBucket.get(completedBucket) : undefined;

      if (currentCreatedIndex != null) {
        current.total_bookings[currentCreatedIndex] += 1;
        if (isCanceled) current.canceled[currentCreatedIndex] += 1;
        if (isRevenue) current.revenue[currentCreatedIndex] += Math.max(0, price);
      } else if (previousCreatedIndex != null) {
        previous.total_bookings[previousCreatedIndex] += 1;
        if (isCanceled) previous.canceled[previousCreatedIndex] += 1;
        if (isRevenue) previous.revenue[previousCreatedIndex] += Math.max(0, price);
      }

      if (currentCompletedIndex != null) {
        current.completed[currentCompletedIndex] += 1;
      } else if (previousCompletedIndex != null) {
        previous.completed[previousCompletedIndex] += 1;
      }
    }

    const sum = (values: number[]) => values.reduce((acc, value) => acc + value, 0);
    const deltaPct = (currentValue: number, previousValue: number) => {
      if (previousValue <= 0) return currentValue > 0 ? 100 : 0;
      return Number((((currentValue - previousValue) / previousValue) * 100).toFixed(1));
    };

    const totals = {
      total_bookings: sum(current.total_bookings),
      completed: sum(current.completed),
      revenue: sum(current.revenue),
      canceled: sum(current.canceled),
    };
    const previousTotals = {
      total_bookings: sum(previous.total_bookings),
      completed: sum(previous.completed),
      revenue: sum(previous.revenue),
      canceled: sum(previous.canceled),
    };

    const payload = {
      window: '7d' as const,
      currency: 'IQD' as const,
      cards: [
        {
          id: 'total_bookings' as const,
          value: totals.total_bookings,
          delta: deltaPct(totals.total_bookings, previousTotals.total_bookings),
          sparkline: current.total_bookings,
          tone: 'violet' as const,
        },
        {
          id: 'completed' as const,
          value: totals.completed,
          delta: deltaPct(totals.completed, previousTotals.completed),
          sparkline: current.completed,
          tone: 'green' as const,
        },
        {
          id: 'revenue' as const,
          value: totals.revenue,
          delta: deltaPct(totals.revenue, previousTotals.revenue),
          sparkline: current.revenue,
          tone: 'amber' as const,
        },
        {
          id: 'canceled' as const,
          value: totals.canceled,
          delta: deltaPct(totals.canceled, previousTotals.canceled),
          sparkline: current.canceled,
          tone: 'red' as const,
        },
      ],
      updated_at: now.toISOString(),
      is_stale: false,
    };

    const validated = BookingAnalyticsKpisSchema.safeParse(payload);
    if (!validated.success) {
      fastify.log.error({ err: validated.error }, 'Booking KPI response validation failed');
      return reply.status(500).send(failure('INTERNAL_ERROR', 'Failed to build booking KPI response'));
    }

    return reply.send(success(validated.data));
  });

  /**
   * GET / — List bookings (paginated, optional status filter)
   */
  fastify.get('/', { preHandler: [requireAdminRole(BOOKING_LIST_ROLES)] }, async (request, reply) => {
    const query = BookingListQuerySchema.safeParse(request.query);
    if (!query.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid query', query.error.format()));
    }
    const { page, pageSize, status, q, sort } = query.data;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const normalizedQ = normalizeSearchValue(q);
    const order = resolveOrder(sort);

    let builder = supabase
      .from('bookings')
      .select('id, task_id, client_id, provider_id, status, payment_status, price, created_at, completed_at, delivered_at', { count: 'exact' })
      .order(order.column, { ascending: order.ascending });

    if (status) builder = builder.eq('status', status);
    if (!normalizedQ) builder = builder.range(from, to);

    const { data: rows, error, count } = await builder;
    if (error) return reply.status(500).send(failure('DATABASE_ERROR', error.message));

    const baseRows = rows ?? [];
    const taskIds = Array.from(new Set(baseRows.map((row: any) => row.task_id).filter(Boolean) as string[]));
    const profileIds = Array.from(
      new Set(
        baseRows
          .flatMap((row: any) => [row.client_id, row.provider_id])
          .filter(Boolean) as string[]
      )
    );

    const [tasksRes, profilesRes] = await Promise.all([
      taskIds.length > 0
        ? supabase.from('tasks').select('id, title, category').in('id', taskIds)
        : Promise.resolve({ data: [], error: null }),
      profileIds.length > 0
        ? supabase.from('profiles').select('id, full_name').in('id', profileIds)
        : Promise.resolve({ data: [], error: null }),
    ]);

    if (tasksRes.error) return reply.status(500).send(failure('DATABASE_ERROR', tasksRes.error.message));
    if (profilesRes.error) return reply.status(500).send(failure('DATABASE_ERROR', profilesRes.error.message));

    const tasksById = new Map((tasksRes.data ?? []).map((row: any) => [row.id, row]));
    const profilesById = new Map((profilesRes.data ?? []).map((row: any) => [row.id, row]));

    const enrichedRows = baseRows.map((r: any) => {
      const task = r.task_id ? tasksById.get(r.task_id) : null;
      const clientProfile = profilesById.get(r.client_id);
      const providerProfile = profilesById.get(r.provider_id);

      return {
        id: r.id,
        task_id: r.task_id ?? null,
        client_id: r.client_id,
        provider_id: r.provider_id,
        status: r.status,
        payment_status: r.payment_status ?? null,
        price: r.price ?? null,
        created_at: r.created_at,
        completed_at: r.completed_at ?? null,
        delivered_at: r.delivered_at ?? null,
        booking_code: formatBookingCode(r.id),
        service_title: task?.title ?? null,
        category_label: task?.category ?? null,
        client_display_name: clientProfile?.full_name ?? null,
        provider_display_name: providerProfile?.full_name ?? null,
        provider_short_name: shortName(providerProfile?.full_name) ?? null,
      };
    });

    const searchedRows = normalizedQ
      ? enrichedRows.filter((row) => {
          const searchable = [
            row.id,
            row.task_id,
            row.client_id,
            row.provider_id,
            row.booking_code,
            row.service_title,
            row.category_label,
            row.client_display_name,
            row.provider_display_name,
            row.provider_short_name,
          ]
            .map((value) => normalizeSearchValue(typeof value === 'string' ? value : null))
            .join(' ');

          if (!normalizedQ) return true;
          if (isUuidLike(normalizedQ)) return searchable.includes(normalizedQ);
          return searchable.includes(normalizedQ);
        })
      : enrichedRows;

    const sortedRows = [...searchedRows].sort((a, b) => {
      if (sort === 'price_desc' || sort === 'price_asc') {
        const av = a.price ?? 0;
        const bv = b.price ?? 0;
        if (av !== bv) return sort === 'price_asc' ? av - bv : bv - av;
      } else {
        const av = new Date(a.created_at).getTime();
        const bv = new Date(b.created_at).getTime();
        if (av !== bv) return sort === 'created_asc' ? av - bv : bv - av;
      }

      return a.id.localeCompare(b.id);
    });

    const pagedRows = normalizedQ ? sortedRows.slice(from, to + 1) : sortedRows;
    const resolvedCount = normalizedQ ? sortedRows.length : (count ?? sortedRows.length);

    const bookings = pagedRows.map((r) => ({
      id: r.id,
      task_id: r.task_id ?? null,
      client_id: r.client_id,
      provider_id: r.provider_id,
      status: r.status,
      payment_status: r.payment_status ?? null,
      price: r.price ?? null,
      created_at: r.created_at,
      completed_at: r.completed_at ?? null,
      delivered_at: r.delivered_at ?? null,
      booking_code: r.booking_code ?? null,
      service_title: r.service_title ?? null,
      category_label: r.category_label ?? null,
      client_display_name: r.client_display_name ?? null,
      provider_display_name: r.provider_display_name ?? null,
      provider_short_name: r.provider_short_name ?? null,
    }));

    const payload = {
      bookings,
      count: resolvedCount,
      totalPages: resolvedCount > 0 ? Math.ceil(resolvedCount / pageSize) : 0,
    };
    const parsed = BookingListResponseSchema.safeParse(payload);
    if (!parsed.success) return reply.status(500).send(failure('DATABASE_ERROR', 'Invalid response shape'));
    return reply.send(success(parsed.data));
  });

  /**
   * GET /:bookingId — Booking detail
   */
  fastify.get('/:bookingId', { preHandler: [requireAdminRole(BOOKING_LIST_ROLES)] }, async (request, reply) => {
    const { bookingId } = request.params as { bookingId: string };
    if (!/^[0-9a-f-]{36}$/i.test(bookingId)) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid booking ID'));
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (error || !booking) return reply.status(404).send(failure('NOT_FOUND', 'Booking not found'));

    return reply.send(
      success({
        id: booking.id,
        task_id: booking.task_id ?? null,
        client_id: booking.client_id,
        provider_id: booking.provider_id,
        status: booking.status,
        payment_status: booking.payment_status ?? null,
        price: booking.price ?? null,
        created_at: booking.created_at,
        completed_at: booking.completed_at ?? null,
        delivered_at: booking.delivered_at ?? null,
        note: booking.note ?? null,
        requirements: booking.requirements ?? null,
        revision_note: booking.revision_note ?? null,
        revision_requested_at: booking.revision_requested_at ?? null,
        revisions_total: booking.revisions_total ?? null,
        revisions_used: booking.revisions_used ?? null,
        review_expires_at: booking.review_expires_at ?? null,
        slot_id: booking.slot_id ?? null,
      })
    );
  });

  /**
   * POST /:bookingId/cancel — Cancel booking (RPC writes audit atomically)
   */
  fastify.post('/:bookingId/cancel', { preHandler: [requireAdminRole(BOOKING_CANCEL_ROLES)] }, async (request, reply) => {
    const { bookingId } = request.params as { bookingId: string };
    if (!/^[0-9a-f-]{36}$/i.test(bookingId)) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid booking ID'));
    }

    const body = AdminBookingCancelInputSchema.safeParse(request.body);
    if (!body.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid input', body.error.format()));
    }

    const { error } = await supabase.rpc('admin_cancel_booking', {
      p_booking_id: bookingId,
      p_admin_id: (request as any).user.id,
      p_reason: body.data.reason,
    });

    if (error) {
      if (error.message?.includes('not found')) return reply.status(404).send(failure('NOT_FOUND', error.message));
      if (error.message?.includes('already canceled') || error.message?.includes('already refunded')) {
        return reply.status(409).send(failure('CONFLICT', error.message));
      }
      return reply.send(failure('DATABASE_ERROR', error.message));
    }
    return reply.send(success({ id: bookingId }));
  });

  /**
   * POST /:bookingId/refund — Refund booking (idempotent; RPC writes audit atomically)
   */
  fastify.post('/:bookingId/refund', { preHandler: [requireAdminRole(BOOKING_REFUND_ROLES)] }, async (request, reply) => {
    const { bookingId } = request.params as { bookingId: string };
    if (!/^[0-9a-f-]{36}$/i.test(bookingId)) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid booking ID'));
    }

    const body = AdminBookingRefundInputSchema.safeParse(request.body);
    if (!body.success) {
      return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid input', body.error.format()));
    }

    const { error } = await supabase.rpc('admin_refund_booking', {
      p_booking_id: bookingId,
      p_admin_id: (request as any).user.id,
      p_reason: body.data.reason,
      p_idempotency_key: body.data.idempotency_key ?? null,
    });

    if (error) {
      if (error.message?.includes('not found')) return reply.status(404).send(failure('NOT_FOUND', error.message));
      return reply.send(failure('DATABASE_ERROR', error.message));
    }
    return reply.send(success({ id: bookingId }));
  });
}

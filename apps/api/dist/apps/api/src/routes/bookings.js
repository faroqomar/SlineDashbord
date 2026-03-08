import { createClient } from '@supabase/supabase-js';
import { BookingAnalyticsSeriesQuerySchema, BookingAnalyticsSeriesSchema, BookingListQuerySchema, BookingListResponseSchema, AdminBookingCancelInputSchema, AdminBookingRefundInputSchema, failure, success, } from '@sline/shared';
import { requireAdminRole } from '../middleware/rbac.js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const BOOKING_LIST_ROLES = ['moderator', 'admin', 'super_admin'];
const BOOKING_CANCEL_ROLES = ['moderator', 'admin', 'super_admin'];
const BOOKING_REFUND_ROLES = ['admin', 'super_admin'];
const DAY_MS = 24 * 60 * 60 * 1000;
const BOOKING_ANALYTICS_BUCKETS = 7;
function toUtcDayStart(value) {
    return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate(), 0, 0, 0, 0));
}
function buildDailyBucketStarts(start, days) {
    return Array.from({ length: days }, (_, index) => new Date(start.getTime() + index * DAY_MS).toISOString());
}
function toBucketStartIso(value) {
    if (typeof value !== 'string' && !(value instanceof Date))
        return null;
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime()))
        return null;
    return toUtcDayStart(date).toISOString();
}
function countByBucket(bucketStarts, values) {
    const counts = new Map(bucketStarts.map((bucketStart) => [bucketStart, 0]));
    const knownBuckets = new Set(bucketStarts);
    for (const value of values) {
        const bucketStart = toBucketStartIso(value);
        if (!bucketStart || !knownBuckets.has(bucketStart))
            continue;
        counts.set(bucketStart, (counts.get(bucketStart) ?? 0) + 1);
    }
    return counts;
}
function buildStaleAnalyticsPayload(bucketStarts) {
    return {
        window: '7d',
        timezone: 'UTC',
        points: bucketStarts.map((bucketStart) => ({
            bucket_start: bucketStart,
            booked: 0,
            completed: 0,
        })),
        updated_at: new Date().toISOString(),
        is_stale: true,
    };
}
export default async function bookingsRoutes(fastify) {
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
            fastify.log.warn({
                route: '/api/v1/bookings/analytics/series',
                bookedQueryFailed: Boolean(bookedRes.error),
                completedQueryFailed: Boolean(completedRes.error),
                deliveredFallbackQueryFailed: Boolean(deliveredFallbackRes.error),
            }, 'Booking analytics query failed; returning stale fallback series');
            return reply.send(success(buildStaleAnalyticsPayload(bucketStarts)));
        }
        const bookedCounts = countByBucket(bucketStarts, (bookedRes.data ?? []).map((row) => row.created_at));
        const completedCounts = countByBucket(bucketStarts, [
            ...(completedRes.data ?? []).map((row) => row.completed_at),
            ...(deliveredFallbackRes.data ?? []).map((row) => row.delivered_at),
        ]);
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
     * GET / — List bookings (paginated, optional status filter)
     */
    fastify.get('/', { preHandler: [requireAdminRole(BOOKING_LIST_ROLES)] }, async (request, reply) => {
        const query = BookingListQuerySchema.safeParse(request.query);
        if (!query.success) {
            return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid query', query.error.format()));
        }
        const { page, pageSize, status } = query.data;
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        let builder = supabase
            .from('bookings')
            .select('id, task_id, client_id, provider_id, status, payment_status, price, created_at, completed_at, delivered_at', { count: 'exact' })
            .range(from, to)
            .order('created_at', { ascending: false });
        if (status)
            builder = builder.eq('status', status);
        const { data: rows, error, count } = await builder;
        if (error)
            return reply.status(500).send(failure('DATABASE_ERROR', error.message));
        const bookings = (rows || []).map((r) => ({
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
        }));
        const payload = {
            bookings,
            count: count ?? 0,
            totalPages: count ? Math.ceil(count / pageSize) : 0,
        };
        const parsed = BookingListResponseSchema.safeParse(payload);
        if (!parsed.success)
            return reply.status(500).send(failure('DATABASE_ERROR', 'Invalid response shape'));
        return reply.send(success(parsed.data));
    });
    /**
     * GET /:bookingId — Booking detail
     */
    fastify.get('/:bookingId', { preHandler: [requireAdminRole(BOOKING_LIST_ROLES)] }, async (request, reply) => {
        const { bookingId } = request.params;
        if (!/^[0-9a-f-]{36}$/i.test(bookingId)) {
            return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid booking ID'));
        }
        const { data: booking, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', bookingId)
            .single();
        if (error || !booking)
            return reply.status(404).send(failure('NOT_FOUND', 'Booking not found'));
        return reply.send(success({
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
        }));
    });
    /**
     * POST /:bookingId/cancel — Cancel booking (RPC writes audit atomically)
     */
    fastify.post('/:bookingId/cancel', { preHandler: [requireAdminRole(BOOKING_CANCEL_ROLES)] }, async (request, reply) => {
        const { bookingId } = request.params;
        if (!/^[0-9a-f-]{36}$/i.test(bookingId)) {
            return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid booking ID'));
        }
        const body = AdminBookingCancelInputSchema.safeParse(request.body);
        if (!body.success) {
            return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid input', body.error.format()));
        }
        const { error } = await supabase.rpc('admin_cancel_booking', {
            p_booking_id: bookingId,
            p_admin_id: request.user.id,
            p_reason: body.data.reason,
        });
        if (error) {
            if (error.message?.includes('not found'))
                return reply.status(404).send(failure('NOT_FOUND', error.message));
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
        const { bookingId } = request.params;
        if (!/^[0-9a-f-]{36}$/i.test(bookingId)) {
            return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid booking ID'));
        }
        const body = AdminBookingRefundInputSchema.safeParse(request.body);
        if (!body.success) {
            return reply.status(400).send(failure('VALIDATION_ERROR', 'Invalid input', body.error.format()));
        }
        const { error } = await supabase.rpc('admin_refund_booking', {
            p_booking_id: bookingId,
            p_admin_id: request.user.id,
            p_reason: body.data.reason,
            p_idempotency_key: body.data.idempotency_key ?? null,
        });
        if (error) {
            if (error.message?.includes('not found'))
                return reply.status(404).send(failure('NOT_FOUND', error.message));
            return reply.send(failure('DATABASE_ERROR', error.message));
        }
        return reply.send(success({ id: bookingId }));
    });
}

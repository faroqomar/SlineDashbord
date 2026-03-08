import { z } from 'zod';
import { MutationAckSchema } from './audit.js';
const uuid = z.string().uuid();
const reasonField = z.string().min(1, 'Reason is required').max(500, 'Reason too long');
/** Booking status enum (matches DB booking_status_enum). */
export const BookingStatusEnum = z.enum([
    'pending',
    'confirmed',
    'in_progress',
    'canceled',
    'completed',
    'paid_request_pending',
    'active',
    'delivered',
    'refunded',
    'expired_unanswered',
]);
/** Payment status for list/detail (matches payment_status_enum). */
export const PaymentStatusEnum = z.enum(['unpaid', 'held', 'released', 'refunded']);
export const BookingListSortEnum = z.enum(['created_desc', 'created_asc', 'price_desc', 'price_asc']);
/** Analytics query for bookings hero series. */
export const BookingAnalyticsSeriesQuerySchema = z.object({
    window: z.enum(['7d']).default('7d'),
    tz: z.enum(['UTC']).default('UTC'),
});
/** Single analytics point containing booked and completed values for one day bucket. */
export const BookingAnalyticsSeriesPointSchema = z.object({
    bucket_start: z.string().datetime({ offset: true }),
    booked: z.number().int().nonnegative(),
    completed: z.number().int().nonnegative(),
});
/** Hero analytics payload for booking trends (last 7 days). */
export const BookingAnalyticsSeriesSchema = z.object({
    window: z.literal('7d'),
    timezone: z.literal('UTC'),
    points: z.array(BookingAnalyticsSeriesPointSchema).length(7),
    updated_at: z.string().datetime({ offset: true }),
    is_stale: z.boolean().optional(),
});
export const BookingKpiCardIdSchema = z.enum(['total_bookings', 'completed', 'revenue', 'canceled']);
export const BookingKpiToneSchema = z.enum(['violet', 'green', 'amber', 'red']);
export const BookingAnalyticsKpiCardSchema = z.object({
    id: BookingKpiCardIdSchema,
    value: z.number().nonnegative(),
    delta: z.number(),
    sparkline: z.array(z.number().nonnegative()).length(7),
    tone: BookingKpiToneSchema,
});
export const BookingAnalyticsKpisSchema = z.object({
    window: z.literal('7d'),
    currency: z.literal('IQD'),
    cards: z.array(BookingAnalyticsKpiCardSchema).length(4),
    updated_at: z.string().datetime({ offset: true }),
    is_stale: z.boolean().optional(),
});
/** List query: pagination + optional status filter. */
export const BookingListQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(10),
    q: z.string().trim().max(120).optional(),
    status: BookingStatusEnum.optional(),
    sort: BookingListSortEnum.default('created_desc'),
});
/** Single booking row (list item). */
export const BookingRowSchema = z.object({
    id: uuid,
    task_id: z.string().uuid().nullable(),
    client_id: uuid,
    provider_id: uuid,
    status: BookingStatusEnum,
    payment_status: PaymentStatusEnum.nullable(),
    price: z.number().nullable(),
    created_at: z.string(),
    completed_at: z.string().nullable().optional(),
    delivered_at: z.string().nullable().optional(),
    booking_code: z.string().nullable().optional(),
    service_title: z.string().nullable().optional(),
    category_label: z.string().nullable().optional(),
    client_display_name: z.string().nullable().optional(),
    provider_display_name: z.string().nullable().optional(),
    provider_short_name: z.string().nullable().optional(),
});
/** Booking detail (full row for GET /:bookingId). */
export const BookingDetailSchema = BookingRowSchema.extend({
    note: z.string().nullable().optional(),
    requirements: z.record(z.unknown()).nullable().optional(),
    revision_note: z.string().nullable().optional(),
    revision_requested_at: z.string().nullable().optional(),
    revisions_total: z.number().nullable().optional(),
    revisions_used: z.number().nullable().optional(),
    review_expires_at: z.string().nullable().optional(),
    slot_id: z.string().uuid().nullable().optional(),
});
/** List response shape. */
export const BookingListResponseSchema = z.object({
    bookings: z.array(BookingRowSchema),
    count: z.number().int().min(0),
    totalPages: z.number().int().min(0),
});
/** Cancel input: reason required; optional idempotency key (header or body). */
export const AdminBookingCancelInputSchema = z.object({
    reason: reasonField,
    idempotency_key: z.string().max(128).optional(),
});
/** Refund input: reason required; optional idempotency key. */
export const AdminBookingRefundInputSchema = z.object({
    reason: reasonField,
    idempotency_key: z.string().max(128).optional(),
});
/** Cancel/refund response: use MutationAckSchema with id = bookingId. */
export { MutationAckSchema as BookingMutationResponseSchema };

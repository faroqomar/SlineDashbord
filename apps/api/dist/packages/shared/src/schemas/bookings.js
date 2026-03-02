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
/** List query: pagination + optional status filter. */
export const BookingListQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(10),
    status: BookingStatusEnum.optional(),
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

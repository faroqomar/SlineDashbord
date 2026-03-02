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
export type BookingStatus = z.infer<typeof BookingStatusEnum>;

/** Payment status for list/detail (matches payment_status_enum). */
export const PaymentStatusEnum = z.enum(['unpaid', 'held', 'released', 'refunded']);
export type PaymentStatus = z.infer<typeof PaymentStatusEnum>;

/** List query: pagination + optional status filter. */
export const BookingListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  status: BookingStatusEnum.optional(),
});
export type BookingListQuery = z.infer<typeof BookingListQuerySchema>;

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
export type BookingRow = z.infer<typeof BookingRowSchema>;

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
export type BookingDetail = z.infer<typeof BookingDetailSchema>;

/** List response shape. */
export const BookingListResponseSchema = z.object({
  bookings: z.array(BookingRowSchema),
  count: z.number().int().min(0),
  totalPages: z.number().int().min(0),
});
export type BookingListResponse = z.infer<typeof BookingListResponseSchema>;

/** Cancel input: reason required; optional idempotency key (header or body). */
export const AdminBookingCancelInputSchema = z.object({
  reason: reasonField,
  idempotency_key: z.string().max(128).optional(),
});
export type AdminBookingCancelInput = z.infer<typeof AdminBookingCancelInputSchema>;

/** Refund input: reason required; optional idempotency key. */
export const AdminBookingRefundInputSchema = z.object({
  reason: reasonField,
  idempotency_key: z.string().max(128).optional(),
});
export type AdminBookingRefundInput = z.infer<typeof AdminBookingRefundInputSchema>;

/** Cancel/refund response: use MutationAckSchema with id = bookingId. */
export { MutationAckSchema as BookingMutationResponseSchema };

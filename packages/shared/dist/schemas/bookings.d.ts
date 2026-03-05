import { z } from 'zod';
import { MutationAckSchema } from './audit.js';
/** Booking status enum (matches DB booking_status_enum). */
export declare const BookingStatusEnum: z.ZodEnum<["pending", "confirmed", "in_progress", "canceled", "completed", "paid_request_pending", "active", "delivered", "refunded", "expired_unanswered"]>;
export type BookingStatus = z.infer<typeof BookingStatusEnum>;
/** Payment status for list/detail (matches payment_status_enum). */
export declare const PaymentStatusEnum: z.ZodEnum<["unpaid", "held", "released", "refunded"]>;
export type PaymentStatus = z.infer<typeof PaymentStatusEnum>;
/** List query: pagination + optional status filter. */
export declare const BookingListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
    status: z.ZodOptional<z.ZodEnum<["pending", "confirmed", "in_progress", "canceled", "completed", "paid_request_pending", "active", "delivered", "refunded", "expired_unanswered"]>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    pageSize: number;
    status?: "pending" | "confirmed" | "in_progress" | "canceled" | "completed" | "paid_request_pending" | "active" | "delivered" | "refunded" | "expired_unanswered" | undefined;
}, {
    status?: "pending" | "confirmed" | "in_progress" | "canceled" | "completed" | "paid_request_pending" | "active" | "delivered" | "refunded" | "expired_unanswered" | undefined;
    page?: number | undefined;
    pageSize?: number | undefined;
}>;
export type BookingListQuery = z.infer<typeof BookingListQuerySchema>;
/** Single booking row (list item). */
export declare const BookingRowSchema: z.ZodObject<{
    id: z.ZodString;
    task_id: z.ZodNullable<z.ZodString>;
    client_id: z.ZodString;
    provider_id: z.ZodString;
    status: z.ZodEnum<["pending", "confirmed", "in_progress", "canceled", "completed", "paid_request_pending", "active", "delivered", "refunded", "expired_unanswered"]>;
    payment_status: z.ZodNullable<z.ZodEnum<["unpaid", "held", "released", "refunded"]>>;
    price: z.ZodNullable<z.ZodNumber>;
    created_at: z.ZodString;
    completed_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    delivered_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "confirmed" | "in_progress" | "canceled" | "completed" | "paid_request_pending" | "active" | "delivered" | "refunded" | "expired_unanswered";
    id: string;
    created_at: string;
    task_id: string | null;
    client_id: string;
    provider_id: string;
    payment_status: "refunded" | "held" | "unpaid" | "released" | null;
    price: number | null;
    completed_at?: string | null | undefined;
    delivered_at?: string | null | undefined;
}, {
    status: "pending" | "confirmed" | "in_progress" | "canceled" | "completed" | "paid_request_pending" | "active" | "delivered" | "refunded" | "expired_unanswered";
    id: string;
    created_at: string;
    task_id: string | null;
    client_id: string;
    provider_id: string;
    payment_status: "refunded" | "held" | "unpaid" | "released" | null;
    price: number | null;
    completed_at?: string | null | undefined;
    delivered_at?: string | null | undefined;
}>;
export type BookingRow = z.infer<typeof BookingRowSchema>;
/** Booking detail (full row for GET /:bookingId). */
export declare const BookingDetailSchema: z.ZodObject<{
    id: z.ZodString;
    task_id: z.ZodNullable<z.ZodString>;
    client_id: z.ZodString;
    provider_id: z.ZodString;
    status: z.ZodEnum<["pending", "confirmed", "in_progress", "canceled", "completed", "paid_request_pending", "active", "delivered", "refunded", "expired_unanswered"]>;
    payment_status: z.ZodNullable<z.ZodEnum<["unpaid", "held", "released", "refunded"]>>;
    price: z.ZodNullable<z.ZodNumber>;
    created_at: z.ZodString;
    completed_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    delivered_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
} & {
    note: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    requirements: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    revision_note: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    revision_requested_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    revisions_total: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    revisions_used: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    review_expires_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    slot_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "confirmed" | "in_progress" | "canceled" | "completed" | "paid_request_pending" | "active" | "delivered" | "refunded" | "expired_unanswered";
    id: string;
    created_at: string;
    task_id: string | null;
    client_id: string;
    provider_id: string;
    payment_status: "refunded" | "held" | "unpaid" | "released" | null;
    price: number | null;
    completed_at?: string | null | undefined;
    delivered_at?: string | null | undefined;
    note?: string | null | undefined;
    requirements?: Record<string, unknown> | null | undefined;
    revision_note?: string | null | undefined;
    revision_requested_at?: string | null | undefined;
    revisions_total?: number | null | undefined;
    revisions_used?: number | null | undefined;
    review_expires_at?: string | null | undefined;
    slot_id?: string | null | undefined;
}, {
    status: "pending" | "confirmed" | "in_progress" | "canceled" | "completed" | "paid_request_pending" | "active" | "delivered" | "refunded" | "expired_unanswered";
    id: string;
    created_at: string;
    task_id: string | null;
    client_id: string;
    provider_id: string;
    payment_status: "refunded" | "held" | "unpaid" | "released" | null;
    price: number | null;
    completed_at?: string | null | undefined;
    delivered_at?: string | null | undefined;
    note?: string | null | undefined;
    requirements?: Record<string, unknown> | null | undefined;
    revision_note?: string | null | undefined;
    revision_requested_at?: string | null | undefined;
    revisions_total?: number | null | undefined;
    revisions_used?: number | null | undefined;
    review_expires_at?: string | null | undefined;
    slot_id?: string | null | undefined;
}>;
export type BookingDetail = z.infer<typeof BookingDetailSchema>;
/** List response shape. */
export declare const BookingListResponseSchema: z.ZodObject<{
    bookings: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        task_id: z.ZodNullable<z.ZodString>;
        client_id: z.ZodString;
        provider_id: z.ZodString;
        status: z.ZodEnum<["pending", "confirmed", "in_progress", "canceled", "completed", "paid_request_pending", "active", "delivered", "refunded", "expired_unanswered"]>;
        payment_status: z.ZodNullable<z.ZodEnum<["unpaid", "held", "released", "refunded"]>>;
        price: z.ZodNullable<z.ZodNumber>;
        created_at: z.ZodString;
        completed_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        delivered_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        status: "pending" | "confirmed" | "in_progress" | "canceled" | "completed" | "paid_request_pending" | "active" | "delivered" | "refunded" | "expired_unanswered";
        id: string;
        created_at: string;
        task_id: string | null;
        client_id: string;
        provider_id: string;
        payment_status: "refunded" | "held" | "unpaid" | "released" | null;
        price: number | null;
        completed_at?: string | null | undefined;
        delivered_at?: string | null | undefined;
    }, {
        status: "pending" | "confirmed" | "in_progress" | "canceled" | "completed" | "paid_request_pending" | "active" | "delivered" | "refunded" | "expired_unanswered";
        id: string;
        created_at: string;
        task_id: string | null;
        client_id: string;
        provider_id: string;
        payment_status: "refunded" | "held" | "unpaid" | "released" | null;
        price: number | null;
        completed_at?: string | null | undefined;
        delivered_at?: string | null | undefined;
    }>, "many">;
    count: z.ZodNumber;
    totalPages: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    bookings: {
        status: "pending" | "confirmed" | "in_progress" | "canceled" | "completed" | "paid_request_pending" | "active" | "delivered" | "refunded" | "expired_unanswered";
        id: string;
        created_at: string;
        task_id: string | null;
        client_id: string;
        provider_id: string;
        payment_status: "refunded" | "held" | "unpaid" | "released" | null;
        price: number | null;
        completed_at?: string | null | undefined;
        delivered_at?: string | null | undefined;
    }[];
    count: number;
    totalPages: number;
}, {
    bookings: {
        status: "pending" | "confirmed" | "in_progress" | "canceled" | "completed" | "paid_request_pending" | "active" | "delivered" | "refunded" | "expired_unanswered";
        id: string;
        created_at: string;
        task_id: string | null;
        client_id: string;
        provider_id: string;
        payment_status: "refunded" | "held" | "unpaid" | "released" | null;
        price: number | null;
        completed_at?: string | null | undefined;
        delivered_at?: string | null | undefined;
    }[];
    count: number;
    totalPages: number;
}>;
export type BookingListResponse = z.infer<typeof BookingListResponseSchema>;
/** Cancel input: reason required; optional idempotency key (header or body). */
export declare const AdminBookingCancelInputSchema: z.ZodObject<{
    reason: z.ZodString;
    idempotency_key: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    reason: string;
    idempotency_key?: string | undefined;
}, {
    reason: string;
    idempotency_key?: string | undefined;
}>;
export type AdminBookingCancelInput = z.infer<typeof AdminBookingCancelInputSchema>;
/** Refund input: reason required; optional idempotency key. */
export declare const AdminBookingRefundInputSchema: z.ZodObject<{
    reason: z.ZodString;
    idempotency_key: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    reason: string;
    idempotency_key?: string | undefined;
}, {
    reason: string;
    idempotency_key?: string | undefined;
}>;
export type AdminBookingRefundInput = z.infer<typeof AdminBookingRefundInputSchema>;
/** Cancel/refund response: use MutationAckSchema with id = bookingId. */
export { MutationAckSchema as BookingMutationResponseSchema };

import { z } from 'zod';
import { MutationAckSchema } from './audit.js';
/** Booking status enum (matches DB booking_status_enum). */
export declare const BookingStatusEnum: z.ZodEnum<["pending", "confirmed", "in_progress", "canceled", "completed", "paid_request_pending", "active", "delivered", "refunded", "expired_unanswered"]>;
export type BookingStatus = z.infer<typeof BookingStatusEnum>;
/** Payment status for list/detail (matches payment_status_enum). */
export declare const PaymentStatusEnum: z.ZodEnum<["unpaid", "held", "released", "refunded"]>;
export type PaymentStatus = z.infer<typeof PaymentStatusEnum>;
export declare const BookingListSortEnum: z.ZodEnum<["created_desc", "created_asc", "price_desc", "price_asc"]>;
export type BookingListSort = z.infer<typeof BookingListSortEnum>;
/** Analytics query for bookings hero series. */
export declare const BookingAnalyticsSeriesQuerySchema: z.ZodObject<{
    window: z.ZodDefault<z.ZodEnum<["7d"]>>;
    tz: z.ZodDefault<z.ZodEnum<["UTC"]>>;
}, "strip", z.ZodTypeAny, {
    window: "7d";
    tz: "UTC";
}, {
    window?: "7d" | undefined;
    tz?: "UTC" | undefined;
}>;
export type BookingAnalyticsSeriesQuery = z.infer<typeof BookingAnalyticsSeriesQuerySchema>;
/** Single analytics point containing booked and completed values for one day bucket. */
export declare const BookingAnalyticsSeriesPointSchema: z.ZodObject<{
    bucket_start: z.ZodString;
    booked: z.ZodNumber;
    completed: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    completed: number;
    bucket_start: string;
    booked: number;
}, {
    completed: number;
    bucket_start: string;
    booked: number;
}>;
export type BookingAnalyticsSeriesPoint = z.infer<typeof BookingAnalyticsSeriesPointSchema>;
/** Hero analytics payload for booking trends (last 7 days). */
export declare const BookingAnalyticsSeriesSchema: z.ZodObject<{
    window: z.ZodLiteral<"7d">;
    timezone: z.ZodLiteral<"UTC">;
    points: z.ZodArray<z.ZodObject<{
        bucket_start: z.ZodString;
        booked: z.ZodNumber;
        completed: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        completed: number;
        bucket_start: string;
        booked: number;
    }, {
        completed: number;
        bucket_start: string;
        booked: number;
    }>, "many">;
    updated_at: z.ZodString;
    is_stale: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    updated_at: string;
    window: "7d";
    timezone: "UTC";
    points: {
        completed: number;
        bucket_start: string;
        booked: number;
    }[];
    is_stale?: boolean | undefined;
}, {
    updated_at: string;
    window: "7d";
    timezone: "UTC";
    points: {
        completed: number;
        bucket_start: string;
        booked: number;
    }[];
    is_stale?: boolean | undefined;
}>;
export type BookingAnalyticsSeries = z.infer<typeof BookingAnalyticsSeriesSchema>;
export declare const BookingKpiCardIdSchema: z.ZodEnum<["total_bookings", "completed", "revenue", "canceled"]>;
export type BookingKpiCardId = z.infer<typeof BookingKpiCardIdSchema>;
export declare const BookingKpiToneSchema: z.ZodEnum<["violet", "green", "amber", "red"]>;
export type BookingKpiTone = z.infer<typeof BookingKpiToneSchema>;
export declare const BookingAnalyticsKpiCardSchema: z.ZodObject<{
    id: z.ZodEnum<["total_bookings", "completed", "revenue", "canceled"]>;
    value: z.ZodNumber;
    delta: z.ZodNumber;
    sparkline: z.ZodArray<z.ZodNumber, "many">;
    tone: z.ZodEnum<["violet", "green", "amber", "red"]>;
}, "strip", z.ZodTypeAny, {
    value: number;
    id: "completed" | "canceled" | "total_bookings" | "revenue";
    delta: number;
    sparkline: number[];
    tone: "violet" | "green" | "amber" | "red";
}, {
    value: number;
    id: "completed" | "canceled" | "total_bookings" | "revenue";
    delta: number;
    sparkline: number[];
    tone: "violet" | "green" | "amber" | "red";
}>;
export type BookingAnalyticsKpiCard = z.infer<typeof BookingAnalyticsKpiCardSchema>;
export declare const BookingAnalyticsKpisSchema: z.ZodObject<{
    window: z.ZodLiteral<"7d">;
    currency: z.ZodLiteral<"IQD">;
    cards: z.ZodArray<z.ZodObject<{
        id: z.ZodEnum<["total_bookings", "completed", "revenue", "canceled"]>;
        value: z.ZodNumber;
        delta: z.ZodNumber;
        sparkline: z.ZodArray<z.ZodNumber, "many">;
        tone: z.ZodEnum<["violet", "green", "amber", "red"]>;
    }, "strip", z.ZodTypeAny, {
        value: number;
        id: "completed" | "canceled" | "total_bookings" | "revenue";
        delta: number;
        sparkline: number[];
        tone: "violet" | "green" | "amber" | "red";
    }, {
        value: number;
        id: "completed" | "canceled" | "total_bookings" | "revenue";
        delta: number;
        sparkline: number[];
        tone: "violet" | "green" | "amber" | "red";
    }>, "many">;
    updated_at: z.ZodString;
    is_stale: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    updated_at: string;
    currency: "IQD";
    window: "7d";
    cards: {
        value: number;
        id: "completed" | "canceled" | "total_bookings" | "revenue";
        delta: number;
        sparkline: number[];
        tone: "violet" | "green" | "amber" | "red";
    }[];
    is_stale?: boolean | undefined;
}, {
    updated_at: string;
    currency: "IQD";
    window: "7d";
    cards: {
        value: number;
        id: "completed" | "canceled" | "total_bookings" | "revenue";
        delta: number;
        sparkline: number[];
        tone: "violet" | "green" | "amber" | "red";
    }[];
    is_stale?: boolean | undefined;
}>;
export type BookingAnalyticsKpis = z.infer<typeof BookingAnalyticsKpisSchema>;
/** List query: pagination + optional status filter. */
export declare const BookingListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
    q: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["pending", "confirmed", "in_progress", "canceled", "completed", "paid_request_pending", "active", "delivered", "refunded", "expired_unanswered"]>>;
    sort: z.ZodDefault<z.ZodEnum<["created_desc", "created_asc", "price_desc", "price_asc"]>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    sort: "created_desc" | "created_asc" | "price_desc" | "price_asc";
    pageSize: number;
    status?: "active" | "completed" | "canceled" | "in_progress" | "pending" | "confirmed" | "paid_request_pending" | "delivered" | "refunded" | "expired_unanswered" | undefined;
    q?: string | undefined;
}, {
    page?: number | undefined;
    sort?: "created_desc" | "created_asc" | "price_desc" | "price_asc" | undefined;
    status?: "active" | "completed" | "canceled" | "in_progress" | "pending" | "confirmed" | "paid_request_pending" | "delivered" | "refunded" | "expired_unanswered" | undefined;
    q?: string | undefined;
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
    booking_code: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    service_title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    category_label: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    client_display_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    provider_display_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    provider_short_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    status: "active" | "completed" | "canceled" | "in_progress" | "pending" | "confirmed" | "paid_request_pending" | "delivered" | "refunded" | "expired_unanswered";
    id: string;
    created_at: string;
    task_id: string | null;
    client_id: string;
    provider_id: string;
    payment_status: "refunded" | "unpaid" | "held" | "released" | null;
    price: number | null;
    completed_at?: string | null | undefined;
    delivered_at?: string | null | undefined;
    booking_code?: string | null | undefined;
    service_title?: string | null | undefined;
    category_label?: string | null | undefined;
    client_display_name?: string | null | undefined;
    provider_display_name?: string | null | undefined;
    provider_short_name?: string | null | undefined;
}, {
    status: "active" | "completed" | "canceled" | "in_progress" | "pending" | "confirmed" | "paid_request_pending" | "delivered" | "refunded" | "expired_unanswered";
    id: string;
    created_at: string;
    task_id: string | null;
    client_id: string;
    provider_id: string;
    payment_status: "refunded" | "unpaid" | "held" | "released" | null;
    price: number | null;
    completed_at?: string | null | undefined;
    delivered_at?: string | null | undefined;
    booking_code?: string | null | undefined;
    service_title?: string | null | undefined;
    category_label?: string | null | undefined;
    client_display_name?: string | null | undefined;
    provider_display_name?: string | null | undefined;
    provider_short_name?: string | null | undefined;
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
    booking_code: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    service_title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    category_label: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    client_display_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    provider_display_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    provider_short_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
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
    status: "active" | "completed" | "canceled" | "in_progress" | "pending" | "confirmed" | "paid_request_pending" | "delivered" | "refunded" | "expired_unanswered";
    id: string;
    created_at: string;
    task_id: string | null;
    client_id: string;
    provider_id: string;
    payment_status: "refunded" | "unpaid" | "held" | "released" | null;
    price: number | null;
    completed_at?: string | null | undefined;
    delivered_at?: string | null | undefined;
    booking_code?: string | null | undefined;
    service_title?: string | null | undefined;
    category_label?: string | null | undefined;
    client_display_name?: string | null | undefined;
    provider_display_name?: string | null | undefined;
    provider_short_name?: string | null | undefined;
    note?: string | null | undefined;
    requirements?: Record<string, unknown> | null | undefined;
    revision_note?: string | null | undefined;
    revision_requested_at?: string | null | undefined;
    revisions_total?: number | null | undefined;
    revisions_used?: number | null | undefined;
    review_expires_at?: string | null | undefined;
    slot_id?: string | null | undefined;
}, {
    status: "active" | "completed" | "canceled" | "in_progress" | "pending" | "confirmed" | "paid_request_pending" | "delivered" | "refunded" | "expired_unanswered";
    id: string;
    created_at: string;
    task_id: string | null;
    client_id: string;
    provider_id: string;
    payment_status: "refunded" | "unpaid" | "held" | "released" | null;
    price: number | null;
    completed_at?: string | null | undefined;
    delivered_at?: string | null | undefined;
    booking_code?: string | null | undefined;
    service_title?: string | null | undefined;
    category_label?: string | null | undefined;
    client_display_name?: string | null | undefined;
    provider_display_name?: string | null | undefined;
    provider_short_name?: string | null | undefined;
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
        booking_code: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        service_title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        category_label: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        client_display_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        provider_display_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        provider_short_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        status: "active" | "completed" | "canceled" | "in_progress" | "pending" | "confirmed" | "paid_request_pending" | "delivered" | "refunded" | "expired_unanswered";
        id: string;
        created_at: string;
        task_id: string | null;
        client_id: string;
        provider_id: string;
        payment_status: "refunded" | "unpaid" | "held" | "released" | null;
        price: number | null;
        completed_at?: string | null | undefined;
        delivered_at?: string | null | undefined;
        booking_code?: string | null | undefined;
        service_title?: string | null | undefined;
        category_label?: string | null | undefined;
        client_display_name?: string | null | undefined;
        provider_display_name?: string | null | undefined;
        provider_short_name?: string | null | undefined;
    }, {
        status: "active" | "completed" | "canceled" | "in_progress" | "pending" | "confirmed" | "paid_request_pending" | "delivered" | "refunded" | "expired_unanswered";
        id: string;
        created_at: string;
        task_id: string | null;
        client_id: string;
        provider_id: string;
        payment_status: "refunded" | "unpaid" | "held" | "released" | null;
        price: number | null;
        completed_at?: string | null | undefined;
        delivered_at?: string | null | undefined;
        booking_code?: string | null | undefined;
        service_title?: string | null | undefined;
        category_label?: string | null | undefined;
        client_display_name?: string | null | undefined;
        provider_display_name?: string | null | undefined;
        provider_short_name?: string | null | undefined;
    }>, "many">;
    count: z.ZodNumber;
    totalPages: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    totalPages: number;
    count: number;
    bookings: {
        status: "active" | "completed" | "canceled" | "in_progress" | "pending" | "confirmed" | "paid_request_pending" | "delivered" | "refunded" | "expired_unanswered";
        id: string;
        created_at: string;
        task_id: string | null;
        client_id: string;
        provider_id: string;
        payment_status: "refunded" | "unpaid" | "held" | "released" | null;
        price: number | null;
        completed_at?: string | null | undefined;
        delivered_at?: string | null | undefined;
        booking_code?: string | null | undefined;
        service_title?: string | null | undefined;
        category_label?: string | null | undefined;
        client_display_name?: string | null | undefined;
        provider_display_name?: string | null | undefined;
        provider_short_name?: string | null | undefined;
    }[];
}, {
    totalPages: number;
    count: number;
    bookings: {
        status: "active" | "completed" | "canceled" | "in_progress" | "pending" | "confirmed" | "paid_request_pending" | "delivered" | "refunded" | "expired_unanswered";
        id: string;
        created_at: string;
        task_id: string | null;
        client_id: string;
        provider_id: string;
        payment_status: "refunded" | "unpaid" | "held" | "released" | null;
        price: number | null;
        completed_at?: string | null | undefined;
        delivered_at?: string | null | undefined;
        booking_code?: string | null | undefined;
        service_title?: string | null | undefined;
        category_label?: string | null | undefined;
        client_display_name?: string | null | undefined;
        provider_display_name?: string | null | undefined;
        provider_short_name?: string | null | undefined;
    }[];
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

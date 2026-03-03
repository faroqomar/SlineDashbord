import { z } from 'zod';
/** Dangerous-op thresholds (cents). Above these, dual approval is required. */
export declare const WALLET_ADJUST_DANGEROUS_MIN = 100000;
export declare const LARGE_REFUND_THRESHOLD = 50000;
export declare const ApprovalOperationTypeEnum: z.ZodEnum<["wallet_adjust", "reversal", "large_refund_override"]>;
export type ApprovalOperationType = z.infer<typeof ApprovalOperationTypeEnum>;
export declare const ApprovalStatusEnum: z.ZodEnum<["pending", "approved", "rejected", "consumed"]>;
export type ApprovalStatus = z.infer<typeof ApprovalStatusEnum>;
/** Body for creating an approval request. idempotency_key comes from header in API. */
export declare const ApprovalRequestSchema: z.ZodObject<{
    operation_type: z.ZodEnum<["wallet_adjust", "reversal", "large_refund_override"]>;
    target_entity_type: z.ZodString;
    target_entity_id: z.ZodString;
    payload: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    operation_type: "wallet_adjust" | "reversal" | "large_refund_override";
    target_entity_type: string;
    target_entity_id: string;
    payload: Record<string, unknown>;
    reason?: string | undefined;
}, {
    operation_type: "wallet_adjust" | "reversal" | "large_refund_override";
    target_entity_type: string;
    target_entity_id: string;
    reason?: string | undefined;
    payload?: Record<string, unknown> | undefined;
}>;
export type ApprovalRequest = z.infer<typeof ApprovalRequestSchema>;
/** Single row from admin_approvals (API response). */
export declare const ApprovalRowSchema: z.ZodObject<{
    id: z.ZodString;
    operation_type: z.ZodEnum<["wallet_adjust", "reversal", "large_refund_override"]>;
    target_entity_type: z.ZodString;
    target_entity_id: z.ZodString;
    requested_by: z.ZodString;
    approved_by: z.ZodNullable<z.ZodString>;
    status: z.ZodEnum<["pending", "approved", "rejected", "consumed"]>;
    idempotency_key: z.ZodString;
    payload: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    reason: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    created_at: z.ZodString;
    resolved_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    consumed_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "approved" | "rejected" | "consumed";
    id: string;
    idempotency_key: string;
    created_at: string;
    operation_type: "wallet_adjust" | "reversal" | "large_refund_override";
    target_entity_type: string;
    target_entity_id: string;
    payload: Record<string, unknown>;
    requested_by: string;
    approved_by: string | null;
    reason?: string | null | undefined;
    resolved_at?: string | null | undefined;
    consumed_at?: string | null | undefined;
}, {
    status: "pending" | "approved" | "rejected" | "consumed";
    id: string;
    idempotency_key: string;
    created_at: string;
    operation_type: "wallet_adjust" | "reversal" | "large_refund_override";
    target_entity_type: string;
    target_entity_id: string;
    requested_by: string;
    approved_by: string | null;
    reason?: string | null | undefined;
    payload?: Record<string, unknown> | undefined;
    resolved_at?: string | null | undefined;
    consumed_at?: string | null | undefined;
}>;
export type ApprovalRow = z.infer<typeof ApprovalRowSchema>;
/** Body for approve or reject. */
export declare const ApproveRejectSchema: z.ZodObject<{
    decision: z.ZodEnum<["approved", "rejected"]>;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    decision: "approved" | "rejected";
    reason?: string | undefined;
}, {
    decision: "approved" | "rejected";
    reason?: string | undefined;
}>;
export type ApproveReject = z.infer<typeof ApproveRejectSchema>;
/** Query params for GET /finance/approvals. */
export declare const ApprovalListQuerySchema: z.ZodObject<{
    cursor: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    status: z.ZodOptional<z.ZodEnum<["pending", "approved", "rejected", "consumed"]>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    status?: "pending" | "approved" | "rejected" | "consumed" | undefined;
    cursor?: string | undefined;
}, {
    status?: "pending" | "approved" | "rejected" | "consumed" | undefined;
    limit?: number | undefined;
    cursor?: string | undefined;
}>;
export type ApprovalListQuery = z.infer<typeof ApprovalListQuerySchema>;
/** Response for GET /finance/approvals. */
export declare const ApprovalListResponseSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        operation_type: z.ZodEnum<["wallet_adjust", "reversal", "large_refund_override"]>;
        target_entity_type: z.ZodString;
        target_entity_id: z.ZodString;
        requested_by: z.ZodString;
        approved_by: z.ZodNullable<z.ZodString>;
        status: z.ZodEnum<["pending", "approved", "rejected", "consumed"]>;
        idempotency_key: z.ZodString;
        payload: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        reason: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        created_at: z.ZodString;
        resolved_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        consumed_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        status: "pending" | "approved" | "rejected" | "consumed";
        id: string;
        idempotency_key: string;
        created_at: string;
        operation_type: "wallet_adjust" | "reversal" | "large_refund_override";
        target_entity_type: string;
        target_entity_id: string;
        payload: Record<string, unknown>;
        requested_by: string;
        approved_by: string | null;
        reason?: string | null | undefined;
        resolved_at?: string | null | undefined;
        consumed_at?: string | null | undefined;
    }, {
        status: "pending" | "approved" | "rejected" | "consumed";
        id: string;
        idempotency_key: string;
        created_at: string;
        operation_type: "wallet_adjust" | "reversal" | "large_refund_override";
        target_entity_type: string;
        target_entity_id: string;
        requested_by: string;
        approved_by: string | null;
        reason?: string | null | undefined;
        payload?: Record<string, unknown> | undefined;
        resolved_at?: string | null | undefined;
        consumed_at?: string | null | undefined;
    }>, "many">;
    next_cursor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    items: {
        status: "pending" | "approved" | "rejected" | "consumed";
        id: string;
        idempotency_key: string;
        created_at: string;
        operation_type: "wallet_adjust" | "reversal" | "large_refund_override";
        target_entity_type: string;
        target_entity_id: string;
        payload: Record<string, unknown>;
        requested_by: string;
        approved_by: string | null;
        reason?: string | null | undefined;
        resolved_at?: string | null | undefined;
        consumed_at?: string | null | undefined;
    }[];
    next_cursor?: string | null | undefined;
}, {
    items: {
        status: "pending" | "approved" | "rejected" | "consumed";
        id: string;
        idempotency_key: string;
        created_at: string;
        operation_type: "wallet_adjust" | "reversal" | "large_refund_override";
        target_entity_type: string;
        target_entity_id: string;
        requested_by: string;
        approved_by: string | null;
        reason?: string | null | undefined;
        payload?: Record<string, unknown> | undefined;
        resolved_at?: string | null | undefined;
        consumed_at?: string | null | undefined;
    }[];
    next_cursor?: string | null | undefined;
}>;
export type ApprovalListResponse = z.infer<typeof ApprovalListResponseSchema>;

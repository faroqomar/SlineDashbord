import { z } from 'zod';
const uuidField = z.string().uuid('Invalid UUID format');
const uuidNullable = z.string().uuid().nullable();
/** Dangerous-op thresholds (cents). Above these, dual approval is required. */
export const WALLET_ADJUST_DANGEROUS_MIN = 100_000; // 1000.00 units
export const LARGE_REFUND_THRESHOLD = 50_000; // 500.00 units
export const ApprovalOperationTypeEnum = z.enum([
    'wallet_adjust',
    'reversal',
    'large_refund_override',
]);
export const ApprovalStatusEnum = z.enum([
    'pending',
    'approved',
    'rejected',
    'consumed',
]);
/** Body for creating an approval request. idempotency_key comes from header in API. */
export const ApprovalRequestSchema = z.object({
    operation_type: ApprovalOperationTypeEnum,
    target_entity_type: z.string().min(1),
    target_entity_id: uuidField,
    payload: z.record(z.unknown()).default({}),
    reason: z.string().max(500).optional(),
});
/** Single row from admin_approvals (API response). */
export const ApprovalRowSchema = z.object({
    id: uuidField,
    operation_type: ApprovalOperationTypeEnum,
    target_entity_type: z.string(),
    target_entity_id: uuidField,
    requested_by: uuidField,
    approved_by: uuidNullable,
    status: ApprovalStatusEnum,
    idempotency_key: z.string(),
    payload: z.record(z.unknown()).default({}),
    reason: z.string().nullable().optional(),
    created_at: z.string(),
    resolved_at: z.string().nullable().optional(),
    consumed_at: z.string().nullable().optional(),
});
/** Body for approve or reject. */
export const ApproveRejectSchema = z.object({
    decision: z.enum(['approved', 'rejected']),
    reason: z.string().max(500).optional(),
});
/** Query params for GET /finance/approvals. */
export const ApprovalListQuerySchema = z.object({
    cursor: z.string().optional(),
    limit: z.number().int().min(1).max(100).default(50),
    status: ApprovalStatusEnum.optional(),
});
/** Response for GET /finance/approvals. */
export const ApprovalListResponseSchema = z.object({
    items: z.array(ApprovalRowSchema),
    next_cursor: z.string().nullable().optional(),
});

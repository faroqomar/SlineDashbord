import { describe, it, expect } from 'vitest';
import { ApprovalOperationTypeEnum, ApprovalRequestSchema, ApprovalRowSchema, ApproveRejectSchema, ApprovalListQuerySchema, ApprovalListResponseSchema, WALLET_ADJUST_DANGEROUS_MIN, LARGE_REFUND_THRESHOLD, } from './approvals.js';
describe('approvals schemas', () => {
    describe('threshold constants', () => {
        it('export numeric thresholds', () => {
            expect(WALLET_ADJUST_DANGEROUS_MIN).toBe(100_000);
            expect(LARGE_REFUND_THRESHOLD).toBe(50_000);
        });
    });
    describe('ApprovalOperationTypeEnum', () => {
        it('accepts wallet_adjust, reversal, large_refund_override', () => {
            expect(ApprovalOperationTypeEnum.safeParse('wallet_adjust').success).toBe(true);
            expect(ApprovalOperationTypeEnum.safeParse('reversal').success).toBe(true);
            expect(ApprovalOperationTypeEnum.safeParse('large_refund_override').success).toBe(true);
        });
        it('rejects invalid', () => {
            expect(ApprovalOperationTypeEnum.safeParse('other').success).toBe(false);
        });
    });
    describe('ApprovalRequestSchema', () => {
        it('parses valid request', () => {
            const body = {
                operation_type: 'wallet_adjust',
                target_entity_type: 'profile',
                target_entity_id: '00000000-0000-0000-0000-000000000001',
                payload: { amount_cents: 150000 },
                reason: 'Adjustment',
            };
            expect(ApprovalRequestSchema.safeParse(body).success).toBe(true);
        });
        it('rejects invalid operation_type', () => {
            const body = {
                operation_type: 'invalid',
                target_entity_type: 'profile',
                target_entity_id: '00000000-0000-0000-0000-000000000001',
            };
            expect(ApprovalRequestSchema.safeParse(body).success).toBe(false);
        });
    });
    describe('ApprovalRowSchema', () => {
        it('parses full row', () => {
            const row = {
                id: '00000000-0000-0000-0000-000000000001',
                operation_type: 'wallet_adjust',
                target_entity_type: 'profile',
                target_entity_id: '00000000-0000-0000-0000-000000000002',
                requested_by: '00000000-0000-0000-0000-000000000003',
                approved_by: null,
                status: 'pending',
                idempotency_key: 'key-1',
                payload: {},
                reason: null,
                created_at: '2025-01-01T00:00:00Z',
                resolved_at: null,
                consumed_at: null,
            };
            expect(ApprovalRowSchema.safeParse(row).success).toBe(true);
        });
    });
    describe('ApproveRejectSchema', () => {
        it('accepts approved and rejected', () => {
            expect(ApproveRejectSchema.safeParse({ decision: 'approved' }).success).toBe(true);
            expect(ApproveRejectSchema.safeParse({ decision: 'rejected', reason: 'No' }).success).toBe(true);
        });
    });
    describe('ApprovalListQuerySchema', () => {
        it('defaults limit to 50', () => {
            const r = ApprovalListQuerySchema.safeParse({});
            expect(r.success).toBe(true);
            if (r.success)
                expect(r.data.limit).toBe(50);
        });
        it('caps limit at 100', () => {
            expect(ApprovalListQuerySchema.safeParse({ limit: 101 }).success).toBe(false);
            expect(ApprovalListQuerySchema.safeParse({ limit: 100 }).success).toBe(true);
        });
    });
    describe('ApprovalListResponseSchema', () => {
        it('parses items and next_cursor', () => {
            const res = { items: [], next_cursor: null };
            expect(ApprovalListResponseSchema.safeParse(res).success).toBe(true);
        });
    });
});

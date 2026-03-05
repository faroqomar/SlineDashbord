import { describe, it, expect } from 'vitest';
import { ForceLogoutInputSchema, GetUsersResultSchema, GetUsersSchema, UsersKpiCountsSchema, UsersTabCountsSchema, } from './users.js';
const validUuid = '00000000-0000-0000-0000-000000000001';
describe('users schemas (PAGE 06 force-logout)', () => {
    describe('ForceLogoutInputSchema', () => {
        it('accepts valid userId only', () => {
            const r = ForceLogoutInputSchema.safeParse({ userId: validUuid });
            expect(r.success).toBe(true);
            if (r.success) {
                expect(r.data.userId).toBe(validUuid);
                expect(r.data.reason).toBeUndefined();
                expect(r.data.idempotency_key).toBeUndefined();
            }
        });
        it('accepts userId with optional reason and idempotency_key', () => {
            const r = ForceLogoutInputSchema.safeParse({
                userId: validUuid,
                reason: 'Security incident',
                idempotency_key: 'key-123',
            });
            expect(r.success).toBe(true);
            if (r.success) {
                expect(r.data.reason).toBe('Security incident');
                expect(r.data.idempotency_key).toBe('key-123');
            }
        });
        it('rejects invalid userId', () => {
            expect(ForceLogoutInputSchema.safeParse({ userId: 'not-a-uuid' }).success).toBe(false);
            expect(ForceLogoutInputSchema.safeParse({ userId: '' }).success).toBe(false);
        });
        it('rejects missing userId', () => {
            expect(ForceLogoutInputSchema.safeParse({}).success).toBe(false);
        });
    });
    describe('UsersKpiCountsSchema', () => {
        it('accepts non-negative integer KPI counts', () => {
            const result = UsersKpiCountsSchema.safeParse({
                activeUsers: 14,
                inactiveUsers: 2,
                joinedThisMonth: 5,
            });
            expect(result.success).toBe(true);
        });
        it('rejects negative KPI values', () => {
            const result = UsersKpiCountsSchema.safeParse({
                activeUsers: -1,
                inactiveUsers: 2,
                joinedThisMonth: 5,
            });
            expect(result.success).toBe(false);
        });
    });
    describe('UsersTabCountsSchema', () => {
        it('accepts non-negative integer tab counts', () => {
            const result = UsersTabCountsSchema.safeParse({
                all: 25,
                active: 20,
                inactive: 5,
            });
            expect(result.success).toBe(true);
        });
        it('rejects negative tab count values', () => {
            const result = UsersTabCountsSchema.safeParse({
                all: 25,
                active: -1,
                inactive: 5,
            });
            expect(result.success).toBe(false);
        });
    });
    describe('GetUsersSchema', () => {
        it('defaults statusTab to all when omitted', () => {
            const result = GetUsersSchema.safeParse({ page: 1, query: '', role: 'all' });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.statusTab).toBe('all');
            }
        });
        it('rejects unsupported statusTab values', () => {
            const result = GetUsersSchema.safeParse({
                page: 1,
                query: '',
                role: 'all',
                statusTab: 'paused',
            });
            expect(result.success).toBe(false);
        });
    });
    describe('GetUsersResultSchema', () => {
        it('accepts a response with kpiCounts', () => {
            const result = GetUsersResultSchema.safeParse({
                users: [{ id: validUuid }],
                totalUsers: 24,
                totalPages: 3,
                kpiCounts: {
                    activeUsers: 20,
                    inactiveUsers: 4,
                    joinedThisMonth: 2,
                },
                tabCounts: {
                    all: 24,
                    active: 20,
                    inactive: 4,
                },
            });
            expect(result.success).toBe(true);
        });
        it('rejects response when kpiCounts is missing', () => {
            const result = GetUsersResultSchema.safeParse({
                users: [],
                totalUsers: 0,
                totalPages: 0,
                tabCounts: {
                    all: 0,
                    active: 0,
                    inactive: 0,
                },
            });
            expect(result.success).toBe(false);
        });
        it('rejects response when tabCounts is missing', () => {
            const result = GetUsersResultSchema.safeParse({
                users: [],
                totalUsers: 0,
                totalPages: 0,
                kpiCounts: {
                    activeUsers: 0,
                    inactiveUsers: 0,
                    joinedThisMonth: 0,
                },
            });
            expect(result.success).toBe(false);
        });
    });
});

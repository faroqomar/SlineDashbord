import { describe, it, expect } from 'vitest';
import { AdminGlobalSearchRequestSchema, AdminGlobalSearchQuerySchema, AdminGlobalSearchResultSchema, AdminSearchInsightsQuerySchema, AdminSearchInsightsResultSchema, AdminSearchEntityTypeEnum, } from './search.js';
describe('AdminGlobalSearchRequestSchema', () => {
    it('accepts valid request with q and default limit', () => {
        const r = AdminGlobalSearchRequestSchema.safeParse({ q: 'ab', limit: 20 });
        expect(r.success).toBe(true);
        if (r.success) {
            expect(r.data.q).toBe('ab');
            expect(r.data.limit).toBe(20);
        }
    });
    it('rejects q shorter than 2 chars', () => {
        const r = AdminGlobalSearchRequestSchema.safeParse({ q: 'a' });
        expect(r.success).toBe(false);
    });
    it('rejects q longer than 200 chars', () => {
        const r = AdminGlobalSearchRequestSchema.safeParse({ q: 'x'.repeat(201) });
        expect(r.success).toBe(false);
    });
    it('rejects limit > 50', () => {
        const r = AdminGlobalSearchRequestSchema.safeParse({ q: 'ab', limit: 51 });
        expect(r.success).toBe(false);
    });
    it('accepts valid types array', () => {
        const r = AdminGlobalSearchRequestSchema.safeParse({
            q: 'test',
            types: ['user', 'task'],
            limit: 10,
        });
        expect(r.success).toBe(true);
    });
});
describe('AdminGlobalSearchQuerySchema (query string parsing)', () => {
    it('parses q and coerces limit', () => {
        const r = AdminGlobalSearchQuerySchema.safeParse({ q: 'hello', limit: '15' });
        expect(r.success).toBe(true);
        if (r.success) {
            expect(r.data.q).toBe('hello');
            expect(r.data.limit).toBe(15);
        }
    });
    it('rejects empty q', () => {
        const r = AdminGlobalSearchQuerySchema.safeParse({ q: 'x' });
        expect(r.success).toBe(false);
    });
    it('rejects limit > 50', () => {
        const r = AdminGlobalSearchQuerySchema.safeParse({ q: 'ab', limit: '51' });
        expect(r.success).toBe(false);
    });
});
describe('AdminGlobalSearchResultSchema', () => {
    it('parses empty items', () => {
        const r = AdminGlobalSearchResultSchema.safeParse({ items: [] });
        expect(r.success).toBe(true);
    });
    it('parses one item per entity type', () => {
        const items = [
            { entityType: 'user', id: '00000000-0000-0000-0000-000000000001', title: 'User A', link: '/users/00000000-0000-0000-0000-000000000001' },
            { entityType: 'task', id: '00000000-0000-0000-0000-000000000002', title: 'Task B', link: '/tasks/00000000-0000-0000-0000-000000000002' },
            { entityType: 'booking', id: '00000000-0000-0000-0000-000000000003', title: 'Booking C', link: '/bookings/00000000-0000-0000-0000-000000000003' },
            { entityType: 'dispute', id: '00000000-0000-0000-0000-000000000004', title: 'Dispute D', link: '/disputes/00000000-0000-0000-0000-000000000004' },
            { entityType: 'transaction', id: '00000000-0000-0000-0000-000000000005', title: 'Journal E', link: '/finance/transactions?journal=00000000-0000-0000-0000-000000000005' },
        ];
        const r = AdminGlobalSearchResultSchema.safeParse({ items });
        expect(r.success).toBe(true);
    });
    it('rejects invalid entityType', () => {
        const r = AdminGlobalSearchResultSchema.safeParse({
            items: [{ entityType: 'unknown', id: '00000000-0000-0000-0000-000000000001', title: 'X', link: '/x' }],
        });
        expect(r.success).toBe(false);
    });
    it('rejects invalid uuid', () => {
        const r = AdminGlobalSearchResultSchema.safeParse({
            items: [{ entityType: 'user', id: 'not-a-uuid', title: 'X', link: '/x' }],
        });
        expect(r.success).toBe(false);
    });
});
describe('AdminSearchEntityTypeEnum', () => {
    it('accepts all five types', () => {
        ['user', 'task', 'booking', 'dispute', 'transaction'].forEach((t) => {
            expect(AdminSearchEntityTypeEnum.safeParse(t).success).toBe(true);
        });
    });
    it('rejects invalid type', () => {
        expect(AdminSearchEntityTypeEnum.safeParse('other').success).toBe(false);
    });
});
describe('AdminSearchInsightsQuerySchema', () => {
    it('applies defaults when query params are missing', () => {
        const r = AdminSearchInsightsQuerySchema.safeParse({});
        expect(r.success).toBe(true);
        if (r.success) {
            expect(r.data.window).toBe('24h');
            expect(r.data.tz).toBe('UTC');
        }
    });
    it('rejects unsupported window/tz values', () => {
        expect(AdminSearchInsightsQuerySchema.safeParse({ window: '7d', tz: 'UTC' }).success).toBe(false);
        expect(AdminSearchInsightsQuerySchema.safeParse({ window: '24h', tz: 'Europe/Istanbul' }).success).toBe(false);
    });
});
describe('AdminSearchInsightsResultSchema', () => {
    const validMetric = {
        value: 12,
        deltaPercent: 5.4,
        sparkline: [1, 2, 3, 4, 5, 6],
        stale: false,
    };
    it('parses valid insights payload', () => {
        const r = AdminSearchInsightsResultSchema.safeParse({
            windowHours: 24,
            generatedAt: '2026-03-05T00:00:00.000Z',
            stale: false,
            metrics: {
                searchesToday: validMetric,
                avgResultsPerQuery: validMetric,
                instantMatchRate: validMetric,
                zeroResultQueries: validMetric,
            },
        });
        expect(r.success).toBe(true);
    });
    it('rejects metric sparkline lengths other than 6', () => {
        const r = AdminSearchInsightsResultSchema.safeParse({
            windowHours: 24,
            generatedAt: '2026-03-05T00:00:00.000Z',
            stale: false,
            metrics: {
                searchesToday: { ...validMetric, sparkline: [1, 2, 3] },
                avgResultsPerQuery: validMetric,
                instantMatchRate: validMetric,
                zeroResultQueries: validMetric,
            },
        });
        expect(r.success).toBe(false);
    });
});

import { describe, it, expect } from 'vitest';
import { BookingAnalyticsSeriesQuerySchema, BookingAnalyticsSeriesSchema, BookingListQuerySchema, BookingRowSchema, BookingListResponseSchema, AdminBookingCancelInputSchema, AdminBookingRefundInputSchema, } from './bookings.js';
const validUuid = '00000000-0000-0000-0000-000000000001';
describe('bookings schemas (PAGE 07 contracts)', () => {
    describe('BookingAnalyticsSeriesQuerySchema', () => {
        it('defaults analytics query fields', () => {
            const parsed = BookingAnalyticsSeriesQuerySchema.safeParse({});
            expect(parsed.success).toBe(true);
            if (parsed.success) {
                expect(parsed.data.window).toBe('7d');
                expect(parsed.data.tz).toBe('UTC');
            }
        });
        it('rejects unsupported analytics window', () => {
            expect(BookingAnalyticsSeriesQuerySchema.safeParse({ window: '24h' }).success).toBe(false);
        });
        it('rejects unsupported timezone values', () => {
            expect(BookingAnalyticsSeriesQuerySchema.safeParse({ tz: 'Europe/Istanbul' }).success).toBe(false);
        });
    });
    describe('BookingAnalyticsSeriesSchema', () => {
        it('accepts deterministic 7-day analytics payload', () => {
            const parsed = BookingAnalyticsSeriesSchema.safeParse({
                window: '7d',
                timezone: 'UTC',
                points: Array.from({ length: 7 }, (_, index) => ({
                    bucket_start: `2026-03-0${index + 1}T00:00:00Z`,
                    booked: index + 1,
                    completed: index,
                })),
                updated_at: '2026-03-07T12:00:00Z',
                is_stale: false,
            });
            expect(parsed.success).toBe(true);
        });
        it('rejects payload when points length is not 7', () => {
            const parsed = BookingAnalyticsSeriesSchema.safeParse({
                window: '7d',
                timezone: 'UTC',
                points: [
                    {
                        bucket_start: '2026-03-01T00:00:00Z',
                        booked: 1,
                        completed: 1,
                    },
                ],
                updated_at: '2026-03-07T12:00:00Z',
            });
            expect(parsed.success).toBe(false);
        });
    });
    describe('BookingListQuerySchema', () => {
        it('accepts empty object with defaults', () => {
            const r = BookingListQuerySchema.safeParse({});
            expect(r.success).toBe(true);
            if (r.success) {
                expect(r.data.page).toBe(1);
                expect(r.data.pageSize).toBe(10);
                expect(r.data.status).toBeUndefined();
            }
        });
        it('accepts page, pageSize, status', () => {
            const r = BookingListQuerySchema.safeParse({ page: 2, pageSize: 20, status: 'confirmed' });
            expect(r.success).toBe(true);
            if (r.success) {
                expect(r.data.page).toBe(2);
                expect(r.data.pageSize).toBe(20);
                expect(r.data.status).toBe('confirmed');
            }
        });
        it('rejects invalid status', () => {
            expect(BookingListQuerySchema.safeParse({ status: 'invalid' }).success).toBe(false);
        });
    });
    describe('AdminBookingCancelInputSchema', () => {
        it('accepts reason only', () => {
            const r = AdminBookingCancelInputSchema.safeParse({ reason: 'Admin cancelled' });
            expect(r.success).toBe(true);
        });
        it('accepts reason and idempotency_key', () => {
            const r = AdminBookingCancelInputSchema.safeParse({
                reason: 'Duplicate',
                idempotency_key: 'key-123',
            });
            expect(r.success).toBe(true);
        });
        it('rejects empty reason', () => {
            expect(AdminBookingCancelInputSchema.safeParse({ reason: '' }).success).toBe(false);
        });
        it('rejects missing reason', () => {
            expect(AdminBookingCancelInputSchema.safeParse({}).success).toBe(false);
        });
    });
    describe('AdminBookingRefundInputSchema', () => {
        it('accepts reason only', () => {
            const r = AdminBookingRefundInputSchema.safeParse({ reason: 'Refund approved' });
            expect(r.success).toBe(true);
        });
        it('rejects empty reason', () => {
            expect(AdminBookingRefundInputSchema.safeParse({ reason: '' }).success).toBe(false);
        });
    });
    describe('BookingRowSchema', () => {
        it('accepts valid row shape', () => {
            const row = {
                id: validUuid,
                task_id: validUuid,
                client_id: validUuid,
                provider_id: validUuid,
                status: 'confirmed',
                payment_status: 'held',
                price: 100,
                created_at: '2025-01-01T00:00:00Z',
            };
            expect(BookingRowSchema.safeParse(row).success).toBe(true);
        });
        it('rejects invalid status', () => {
            const row = {
                id: validUuid,
                task_id: null,
                client_id: validUuid,
                provider_id: validUuid,
                status: 'invalid_status',
                payment_status: null,
                price: null,
                created_at: '2025-01-01T00:00:00Z',
            };
            expect(BookingRowSchema.safeParse(row).success).toBe(false);
        });
    });
    describe('BookingListResponseSchema', () => {
        it('accepts empty list response', () => {
            const r = BookingListResponseSchema.safeParse({ bookings: [], count: 0, totalPages: 0 });
            expect(r.success).toBe(true);
        });
        it('accepts list with one item', () => {
            const r = BookingListResponseSchema.safeParse({
                bookings: [
                    {
                        id: validUuid,
                        task_id: null,
                        client_id: validUuid,
                        provider_id: validUuid,
                        status: 'canceled',
                        payment_status: 'refunded',
                        price: null,
                        created_at: '2025-01-01T00:00:00Z',
                    },
                ],
                count: 1,
                totalPages: 1,
            });
            expect(r.success).toBe(true);
        });
    });
});

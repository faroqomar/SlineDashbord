import { describe, it, expect } from 'vitest';
import {
  BookingAnalyticsSeriesQuerySchema,
  BookingAnalyticsSeriesSchema,
  BookingAnalyticsKpisSchema,
  BookingListQuerySchema,
  BookingRowSchema,
  BookingListResponseSchema,
  AdminBookingCancelInputSchema,
  AdminBookingRefundInputSchema,
} from './bookings.js';

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
        expect(r.data.sort).toBe('created_desc');
        expect(r.data.status).toBeUndefined();
      }
    });
    it('accepts page, pageSize, status, q, sort', () => {
      const r = BookingListQuerySchema.safeParse({
        page: 2,
        pageSize: 20,
        status: 'confirmed',
        q: 'cleaning',
        sort: 'price_desc',
      });
      expect(r.success).toBe(true);
      if (r.success) {
        expect(r.data.page).toBe(2);
        expect(r.data.pageSize).toBe(20);
        expect(r.data.status).toBe('confirmed');
        expect(r.data.q).toBe('cleaning');
        expect(r.data.sort).toBe('price_desc');
      }
    });
    it('rejects invalid status', () => {
      expect(BookingListQuerySchema.safeParse({ status: 'invalid' }).success).toBe(false);
    });
    it('rejects invalid sort value', () => {
      expect(BookingListQuerySchema.safeParse({ sort: 'unknown' }).success).toBe(false);
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
        booking_code: 'BK-123456',
        service_title: 'Full Car Detailing',
        category_label: 'Auto Care',
        client_display_name: 'Tariq',
        provider_display_name: 'Shine Auto IQ',
        provider_short_name: 'Shine',
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

  describe('BookingAnalyticsKpisSchema', () => {
    it('accepts deterministic KPI payload', () => {
      const parsed = BookingAnalyticsKpisSchema.safeParse({
        window: '7d',
        currency: 'IQD',
        cards: [
          { id: 'total_bookings', value: 10, delta: 12.5, sparkline: [1, 2, 1, 2, 1, 2, 1], tone: 'violet' },
          { id: 'completed', value: 4, delta: 5, sparkline: [0, 1, 0, 1, 0, 1, 1], tone: 'green' },
          { id: 'revenue', value: 120000, delta: -3.4, sparkline: [10, 12, 11, 13, 10, 9, 12], tone: 'amber' },
          { id: 'canceled', value: 2, delta: 0, sparkline: [0, 1, 0, 0, 1, 0, 0], tone: 'red' },
        ],
        updated_at: '2026-03-07T12:00:00Z',
      });
      expect(parsed.success).toBe(true);
    });

    it('rejects payload when card count is not 4', () => {
      const parsed = BookingAnalyticsKpisSchema.safeParse({
        window: '7d',
        currency: 'IQD',
        cards: [{ id: 'total_bookings', value: 10, delta: 12.5, sparkline: [1, 2, 1, 2, 1, 2, 1], tone: 'violet' }],
        updated_at: '2026-03-07T12:00:00Z',
      });
      expect(parsed.success).toBe(false);
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

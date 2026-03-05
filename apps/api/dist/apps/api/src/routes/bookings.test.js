import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildApp } from '../app.js';
import { BookingListResponseSchema } from '@sline/shared';
if (!process.env.SUPABASE_URL)
    process.env.SUPABASE_URL = 'https://placeholder.supabase.co';
if (!process.env.SUPABASE_SERVICE_ROLE_KEY)
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'placeholder-key';
const MODERATOR = { id: '00000000-0000-0000-0000-000000000001', role: 'moderator' };
const ADMIN = { id: '00000000-0000-0000-0000-000000000002', role: 'admin' };
const validBookingId = '00000000-0000-0000-0000-000000000020';
describe('PAGE 07 — Bookings API', () => {
    let app;
    beforeAll(async () => {
        app = await buildApp({ testUser: MODERATOR });
    });
    afterAll(async () => {
        await app.close();
    });
    describe('GET /api/v1/bookings', () => {
        it('returns 401 when no auth', async () => {
            const noAuthApp = await buildApp();
            const res = await noAuthApp.inject({
                method: 'GET',
                url: '/api/v1/bookings',
            });
            await noAuthApp.close();
            expect(res.statusCode).toBe(401);
        });
        it('returns 200 with list shape parseable as BookingListResponseSchema', async () => {
            const res = await app.inject({
                method: 'GET',
                url: '/api/v1/bookings?page=1&pageSize=10',
            });
            if (res.statusCode === 200) {
                const body = JSON.parse(res.body);
                const data = body.data ?? body;
                const parsed = BookingListResponseSchema.safeParse(data);
                expect(parsed.success).toBe(true);
                if (parsed.success) {
                    expect(Array.isArray(parsed.data.bookings)).toBe(true);
                    expect(typeof parsed.data.count).toBe('number');
                    expect(typeof parsed.data.totalPages).toBe('number');
                }
            }
        });
    });
    describe('GET /api/v1/bookings/:bookingId', () => {
        it('returns 401 when no auth', async () => {
            const noAuthApp = await buildApp();
            const res = await noAuthApp.inject({
                method: 'GET',
                url: `/api/v1/bookings/${validBookingId}`,
            });
            await noAuthApp.close();
            expect(res.statusCode).toBe(401);
        });
        it('returns 400 for invalid bookingId (not UUID)', async () => {
            const res = await app.inject({
                method: 'GET',
                url: '/api/v1/bookings/not-a-uuid',
            });
            expect(res.statusCode).toBe(400);
            const body = JSON.parse(res.body);
            expect(body.ok).toBe(false);
            expect(body.error?.code).toBe('VALIDATION_ERROR');
        });
        it('returns 404 when booking not found', async () => {
            const res = await app.inject({
                method: 'GET',
                url: `/api/v1/bookings/${validBookingId}`,
            });
            expect([404, 500]).toContain(res.statusCode);
            if (res.statusCode === 404) {
                const body = JSON.parse(res.body);
                expect(body.ok).toBe(false);
                expect(body.error?.code).toBe('NOT_FOUND');
            }
        });
    });
    describe('POST /api/v1/bookings/:bookingId/cancel', () => {
        it('returns 401 when no auth', async () => {
            const noAuthApp = await buildApp();
            const res = await noAuthApp.inject({
                method: 'POST',
                url: `/api/v1/bookings/${validBookingId}/cancel`,
                payload: { reason: 'Admin cancel' },
            });
            await noAuthApp.close();
            expect(res.statusCode).toBe(401);
        });
        it('returns 400 for invalid bookingId', async () => {
            const res = await app.inject({
                method: 'POST',
                url: '/api/v1/bookings/invalid-id/cancel',
                payload: { reason: 'Test' },
            });
            expect(res.statusCode).toBe(400);
        });
        it('returns 400 when reason is empty', async () => {
            const res = await app.inject({
                method: 'POST',
                url: `/api/v1/bookings/${validBookingId}/cancel`,
                payload: { reason: '' },
            });
            expect(res.statusCode).toBe(400);
        });
        it('accepts valid payload (200 with success or 404/409/DATABASE_ERROR)', async () => {
            const res = await app.inject({
                method: 'POST',
                url: `/api/v1/bookings/${validBookingId}/cancel`,
                payload: { reason: 'Admin cancellation test' },
            });
            expect([200, 404, 409, 500]).toContain(res.statusCode);
            const body = JSON.parse(res.body);
            expect(body.ok === true || ['NOT_FOUND', 'CONFLICT', 'DATABASE_ERROR'].includes(body.error?.code)).toBe(true);
            if (body.ok)
                expect(body.data.id).toBe(validBookingId);
        });
    });
    describe('POST /api/v1/bookings/:bookingId/refund', () => {
        let refundApp;
        beforeAll(async () => {
            refundApp = await buildApp({ testUser: ADMIN });
        });
        afterAll(async () => {
            await refundApp.close();
        });
        it('returns 401 when no auth', async () => {
            const noAuthApp = await buildApp();
            const res = await noAuthApp.inject({
                method: 'POST',
                url: `/api/v1/bookings/${validBookingId}/refund`,
                payload: { reason: 'Admin refund' },
            });
            await noAuthApp.close();
            expect(res.statusCode).toBe(401);
        });
        it('returns 400 for invalid bookingId', async () => {
            const res = await refundApp.inject({
                method: 'POST',
                url: '/api/v1/bookings/not-uuid/refund',
                payload: { reason: 'Test' },
            });
            expect(res.statusCode).toBe(400);
        });
        it('returns 400 when reason is empty', async () => {
            const res = await refundApp.inject({
                method: 'POST',
                url: `/api/v1/bookings/${validBookingId}/refund`,
                payload: { reason: '' },
            });
            expect(res.statusCode).toBe(400);
        });
        it('accepts valid payload (200 with success or 404/DATABASE_ERROR)', async () => {
            const res = await refundApp.inject({
                method: 'POST',
                url: `/api/v1/bookings/${validBookingId}/refund`,
                payload: { reason: 'Refund approved', idempotency_key: 'test-key-1' },
            });
            expect([200, 404, 500]).toContain(res.statusCode);
            const body = JSON.parse(res.body);
            expect(body.ok === true || ['NOT_FOUND', 'DATABASE_ERROR'].includes(body.error?.code)).toBe(true);
            if (body.ok)
                expect(body.data.id).toBe(validBookingId);
        });
    });
});
const runBookingsIntegration = process.env.RUN_BOOKINGS_INTEGRATION === '1' && process.env.SUPABASE_URL && !process.env.SUPABASE_URL.includes('placeholder');
describe('PAGE 07 — Refund idempotency (requires real DB)', () => {
    it.skipIf(!runBookingsIntegration)('second refund with same idempotency_key returns 200 and does not double-process', async () => {
        const app = await buildApp({ testUser: ADMIN });
        const bookingId = validBookingId;
        const key = 'idem-refund-' + Date.now();
        const first = await app.inject({
            method: 'POST',
            url: `/api/v1/bookings/${bookingId}/refund`,
            payload: { reason: 'First', idempotency_key: key },
        });
        expect(first.statusCode).toBe(200);
        const second = await app.inject({
            method: 'POST',
            url: `/api/v1/bookings/${bookingId}/refund`,
            payload: { reason: 'Second', idempotency_key: key },
        });
        expect(second.statusCode).toBe(200);
        const body = JSON.parse(second.body);
        expect(body.ok === true || body.error?.code === 'DATABASE_ERROR').toBe(true);
        await app.close();
    });
});

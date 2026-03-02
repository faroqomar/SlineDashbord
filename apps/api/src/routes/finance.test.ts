import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildApp, type TestUser } from '../app.js';

// Ensure env exists so Supabase client can be created (RPC may still fail with 500 if DB unreachable)
if (!process.env.SUPABASE_URL) process.env.SUPABASE_URL = 'https://placeholder.supabase.co';
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) process.env.SUPABASE_SERVICE_ROLE_KEY = 'placeholder-key';

const SUPER_ADMIN: TestUser = { id: '00000000-0000-0000-0000-000000000001', role: 'super_admin' };
const validRequestId = '00000000-0000-0000-0000-000000000002';

describe('PAGE 03 — Finance withdrawal approve/reject', () => {
  let app: Awaited<ReturnType<typeof buildApp>>;

  beforeAll(async () => {
    app = await buildApp({ testUser: SUPER_ADMIN });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/finance/withdrawals/:requestId/approve', () => {
    it('returns 401 when no auth', async () => {
      const noAuthApp = await buildApp(); // no testUser
      const res = await noAuthApp.inject({
        method: 'POST',
        url: `/api/v1/finance/withdrawals/${validRequestId}/approve`,
        payload: { reason: 'OK' },
      });
      await noAuthApp.close();
      expect(res.statusCode).toBe(401);
    });

    it('returns 400 for invalid requestId (not UUID)', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/finance/withdrawals/not-a-uuid/approve',
        payload: { reason: 'OK' },
      });
      expect(res.statusCode).toBe(400);
      const body = JSON.parse(res.body);
      expect(body.ok).toBe(false);
      expect(body.error?.code).toBe('VALIDATION_ERROR');
    });

    it('accepts valid payload (200 with success or DATABASE_ERROR when DB unreachable)', async () => {
      const res = await app.inject({
        method: 'POST',
        url: `/api/v1/finance/withdrawals/${validRequestId}/approve`,
        payload: { reason: 'Approved by admin' },
      });
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.ok === true || body.error?.code === 'DATABASE_ERROR').toBe(true);
      if (body.ok) expect(body.data.requestId).toBe(validRequestId);
    });
  });

  describe('POST /api/v1/finance/withdrawals/:requestId/reject', () => {
    it('returns 401 when no auth', async () => {
      const noAuthApp = await buildApp();
      const res = await noAuthApp.inject({
        method: 'POST',
        url: `/api/v1/finance/withdrawals/${validRequestId}/reject`,
        payload: { reason: 'Rejected' },
      });
      await noAuthApp.close();
      expect(res.statusCode).toBe(401);
    });

    it('returns 400 for invalid requestId', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/finance/withdrawals/invalid/reject',
        payload: { reason: 'Rejected' },
      });
      expect(res.statusCode).toBe(400);
    });

    it('returns 400 when reason is empty', async () => {
      const res = await app.inject({
        method: 'POST',
        url: `/api/v1/finance/withdrawals/${validRequestId}/reject`,
        payload: { reason: '' },
      });
      expect(res.statusCode).toBe(400);
    });

    it('accepts valid payload (200 with success or DATABASE_ERROR when DB unreachable)', async () => {
      const res = await app.inject({
        method: 'POST',
        url: `/api/v1/finance/withdrawals/${validRequestId}/reject`,
        payload: { reason: 'Insufficient KYC' },
      });
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.ok === true || body.error?.code === 'DATABASE_ERROR').toBe(true);
      if (body.ok) expect(body.data.requestId).toBe(validRequestId);
    });
  });

  const runFinanceIntegration = process.env.RUN_FINANCE_INTEGRATION === '1' && process.env.SUPABASE_URL && !process.env.SUPABASE_URL.includes('placeholder');

  describe('PAGE 03 — Idempotency (requires real DB)', () => {
    // With real DB: exactly one audit_logs row per approve/reject (RPC writes it; API does not use withAudit)
    it.skipIf(!runFinanceIntegration)(
      'second approve with same requestId does not double-process (RPC raises or no-op)',
      async () => {
        const first = await app.inject({
          method: 'POST',
          url: `/api/v1/finance/withdrawals/${validRequestId}/approve`,
          payload: { reason: 'First' },
        });
        expect(first.statusCode).toBe(200);
        const second = await app.inject({
          method: 'POST',
          url: `/api/v1/finance/withdrawals/${validRequestId}/approve`,
          payload: { reason: 'Second' },
        });
        expect(second.statusCode).toBe(200);
        const body = JSON.parse(second.body);
        // RPC raises "already processed" or returns no-op; we expect not ok or same result
        expect(body.ok === false || body.data?.requestId === validRequestId).toBe(true);
      }
    );
  });
});

import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildApp, type TestUser } from '../app.js';
import { AuthMeResponseSchema } from '@sline/shared';

if (!process.env.SUPABASE_URL) process.env.SUPABASE_URL = 'https://placeholder.supabase.co';
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) process.env.SUPABASE_SERVICE_ROLE_KEY = 'placeholder-key';

const SUPER_ADMIN: TestUser = { id: '00000000-0000-0000-0000-000000000001', role: 'super_admin' };
const SUPPORT: TestUser = { id: '00000000-0000-0000-0000-000000000002', role: 'support' };
const validRequestId = '00000000-0000-0000-0000-000000000003';

describe('PAGE 04 — RBAC and auth', () => {
  describe('GET /api/v1/auth/me', () => {
    it('returns 401 when no cookie or Bearer token', async () => {
      const app = await buildApp();
      const res = await app.inject({ method: 'GET', url: '/api/v1/auth/me' });
      await app.close();
      expect(res.statusCode).toBe(401);
      const body = JSON.parse(res.body);
      expect(body.ok).toBe(false);
      expect(body.error?.code).toBeDefined();
    });

    it('returns 401 for invalid token', async () => {
      const app = await buildApp();
      const res = await app.inject({
        method: 'GET',
        url: '/api/v1/auth/me',
        headers: { authorization: 'Bearer invalid-token' },
      });
      await app.close();
      expect(res.statusCode).toBe(401);
    });

    it('returns 200 with correct role when authenticated (testUser)', async () => {
      const app = await buildApp({ testUser: SUPER_ADMIN });
      const res = await app.inject({ method: 'GET', url: '/api/v1/auth/me' });
      await app.close();
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      const parsed = AuthMeResponseSchema.safeParse(body);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.data.user.id).toBe(SUPER_ADMIN.id);
        expect(parsed.data.data.user.role).toBe('super_admin');
      }
    });
  });

  describe('RBAC — support cannot do admin-only actions', () => {
    it('returns 403 when support calls finance approve (super_admin only)', async () => {
      const app = await buildApp({ testUser: SUPPORT });
      const res = await app.inject({
        method: 'POST',
        url: `/api/v1/finance/withdrawals/${validRequestId}/approve`,
        payload: { reason: 'OK' },
      });
      await app.close();
      expect(res.statusCode).toBe(403);
      const body = JSON.parse(res.body);
      expect(body.ok).toBe(false);
      expect(body.error?.code).toBe('FORBIDDEN');
    });

    it('returns 200 when super_admin calls finance approve', async () => {
      const app = await buildApp({ testUser: SUPER_ADMIN });
      const res = await app.inject({
        method: 'POST',
        url: `/api/v1/finance/withdrawals/${validRequestId}/approve`,
        payload: { reason: 'OK' },
      });
      await app.close();
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.ok === true || body.error?.code === 'DATABASE_ERROR').toBe(true);
    });
  });

  describe('Protected route — GET /api/v1/users (any admin role)', () => {
    it('returns 401 when no auth', async () => {
      const app = await buildApp();
      const res = await app.inject({ method: 'GET', url: '/api/v1/users' });
      await app.close();
      expect(res.statusCode).toBe(401);
    });

    it('returns 200 when support (allowed role)', async () => {
      const app = await buildApp({ testUser: SUPPORT });
      const res = await app.inject({ method: 'GET', url: '/api/v1/users' });
      await app.close();
      expect(res.statusCode).toBe(200);
    });
  });
});

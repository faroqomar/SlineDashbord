import 'dotenv/config';
import { describe, it, expect } from 'vitest';
import { buildApp, type TestUser } from '../app.js';

if (!process.env.SUPABASE_URL) process.env.SUPABASE_URL = 'https://placeholder.supabase.co';
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) process.env.SUPABASE_SERVICE_ROLE_KEY = 'placeholder-key';

const SUPER_ADMIN: TestUser = { id: '00000000-0000-0000-0000-000000000001', role: 'super_admin' };
const SUPPORT: TestUser = { id: '00000000-0000-0000-0000-000000000002', role: 'support' };

describe('PAGE 13 — Settings / system config', () => {
  describe('GET /api/v1/settings/config', () => {
    it('returns 401 when no auth', async () => {
      const app = await buildApp();
      const res = await app.inject({ method: 'GET', url: '/api/v1/settings/config' });
      await app.close();
      expect(res.statusCode).toBe(401);
      const body = JSON.parse(res.body);
      expect(body.ok).toBe(false);
      expect(body.error?.code).toBeDefined();
    });

    it('returns 200 with array when authenticated (or 500 if system_config table missing)', async () => {
      const app = await buildApp({ testUser: SUPPORT });
      const res = await app.inject({ method: 'GET', url: '/api/v1/settings/config' });
      await app.close();
      expect([200, 500]).toContain(res.statusCode);
      const body = JSON.parse(res.body);
      if (res.statusCode === 200) {
        expect(body.ok).toBe(true);
        expect(Array.isArray(body.data)).toBe(true);
      } else {
        expect(['DATABASE_ERROR', 'INTERNAL_ERROR']).toContain(body.error?.code);
      }
    });
  });

  describe('PATCH /api/v1/settings/config', () => {
    it('returns 401 when no auth', async () => {
      const app = await buildApp();
      const res = await app.inject({
        method: 'PATCH',
        url: '/api/v1/settings/config',
        payload: { key: 'maintenance_mode', value: { enabled: false } },
      });
      await app.close();
      expect(res.statusCode).toBe(401);
    });

    it('returns 403 when support (only super_admin can PATCH)', async () => {
      const app = await buildApp({ testUser: SUPPORT });
      const res = await app.inject({
        method: 'PATCH',
        url: '/api/v1/settings/config',
        payload: { key: 'maintenance_mode', value: { enabled: false } },
      });
      await app.close();
      expect(res.statusCode).toBe(403);
      const body = JSON.parse(res.body);
      expect(body.ok).toBe(false);
      expect(body.error?.code).toBe('FORBIDDEN');
    });

    it('returns 400 for invalid body (missing key)', async () => {
      const app = await buildApp({ testUser: SUPER_ADMIN });
      const res = await app.inject({
        method: 'PATCH',
        url: '/api/v1/settings/config',
        payload: { value: { enabled: true } },
      });
      await app.close();
      expect(res.statusCode).toBe(400);
      const body = JSON.parse(res.body);
      expect(body.ok).toBe(false);
      expect(body.error?.code).toBe('VALIDATION_ERROR');
    });

    it('returns 200 or DATABASE_ERROR when super_admin PATCHes (RPC may fail without real DB)', async () => {
      const app = await buildApp({ testUser: SUPER_ADMIN });
      const res = await app.inject({
        method: 'PATCH',
        url: '/api/v1/settings/config',
        payload: { key: 'maintenance_mode', value: { enabled: false, message: '' } },
      });
      await app.close();
      expect([200, 500]).toContain(res.statusCode);
      const body = JSON.parse(res.body);
      if (res.statusCode === 200) {
        expect(body.ok).toBe(true);
        expect(body.data?.key).toBe('maintenance_mode');
      } else {
        expect(body.error?.code).toBe('DATABASE_ERROR');
      }
    });

    it('returns 429 when PATCH rate limit exceeded (5 per 60s per user)', async () => {
      const app = await buildApp({ testUser: SUPER_ADMIN });
      const payload = { key: 'maintenance_mode', value: { enabled: false, message: '' } };
      const url = '/api/v1/settings/config';
      // Limiter state can already be warm from earlier tests; 429 may appear before the 6th request.
      let rateLimited: Awaited<ReturnType<typeof app.inject>> | null = null;
      for (let i = 0; i < 8; i++) {
        const res = await app.inject({ method: 'PATCH', url, payload });
        expect([200, 429, 500]).toContain(res.statusCode);
        if (res.statusCode === 429) {
          rateLimited = res;
          break;
        }
      }
      await app.close();
      expect(rateLimited, 'Rate limit (429) should be triggered within 8 PATCH requests').not.toBeNull();
      const body = JSON.parse(rateLimited!.body);
      expect(body.ok).toBe(false);
      expect(body.error?.code).toBe('RATE_LIMIT');
    });
  });
});

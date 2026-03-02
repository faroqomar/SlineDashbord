import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildApp, type TestUser } from '../app.js';

if (!process.env.SUPABASE_URL) process.env.SUPABASE_URL = 'https://placeholder.supabase.co';
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) process.env.SUPABASE_SERVICE_ROLE_KEY = 'placeholder-key';

const SUPER_ADMIN: TestUser = { id: '00000000-0000-0000-0000-000000000001', role: 'super_admin' };
const validUserId = '00000000-0000-0000-0000-000000000002';

describe('PAGE 05 — User moderation (ban / unban / suspend)', () => {
  let app: Awaited<ReturnType<typeof buildApp>>;

  beforeAll(async () => {
    app = await buildApp({ testUser: SUPER_ADMIN });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/users/:userId/ban', () => {
    it('returns 401 when no auth', async () => {
      const noAuthApp = await buildApp();
      const res = await noAuthApp.inject({
        method: 'POST',
        url: `/api/v1/users/${validUserId}/ban`,
        payload: { reason: 'Valid reason for ban' },
      });
      await noAuthApp.close();
      expect(res.statusCode).toBe(401);
    });

    it('returns 400 for invalid userId (not UUID)', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/users/not-a-uuid/ban',
        payload: { reason: 'Valid reason for ban' },
      });
      expect(res.statusCode).toBe(400);
      const body = JSON.parse(res.body);
      expect(body.ok).toBe(false);
      expect(body.error?.code).toBe('VALIDATION_ERROR');
    });

    it('returns 400 when reason is too short', async () => {
      const res = await app.inject({
        method: 'POST',
        url: `/api/v1/users/${validUserId}/ban`,
        payload: { reason: 'x' },
      });
      expect(res.statusCode).toBe(400);
      const body = JSON.parse(res.body);
      expect(body.ok).toBe(false);
      expect(body.error?.code).toBe('VALIDATION_ERROR');
    });

    it('accepts valid payload (200 with success or 500/DATABASE_ERROR when DB unreachable)', async () => {
      const res = await app.inject({
        method: 'POST',
        url: `/api/v1/users/${validUserId}/ban`,
        payload: { reason: 'Valid reason for ban' },
      });
      const body = JSON.parse(res.body);
      expect([200, 500]).toContain(res.statusCode);
      expect(body.ok === true || body.error?.code === 'DATABASE_ERROR').toBe(true);
      if (body.ok) expect(body.data.userId).toBe(validUserId);
    });
  });

  describe('POST /api/v1/users/:userId/unban', () => {
    it('returns 401 when no auth', async () => {
      const noAuthApp = await buildApp();
      const res = await noAuthApp.inject({
        method: 'POST',
        url: `/api/v1/users/${validUserId}/unban`,
      });
      await noAuthApp.close();
      expect(res.statusCode).toBe(401);
    });

    it('returns 400 for invalid userId (not UUID)', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/users/not-a-uuid/unban',
      });
      expect(res.statusCode).toBe(400);
      const body = JSON.parse(res.body);
      expect(body.ok).toBe(false);
      expect(body.error?.code).toBe('VALIDATION_ERROR');
    });

    it('accepts valid request (200 with success or 500/DATABASE_ERROR when DB unreachable)', async () => {
      const res = await app.inject({
        method: 'POST',
        url: `/api/v1/users/${validUserId}/unban`,
      });
      const body = JSON.parse(res.body);
      expect([200, 500]).toContain(res.statusCode);
      expect(body.ok === true || body.error?.code === 'DATABASE_ERROR').toBe(true);
      if (body.ok) expect(body.data.userId).toBe(validUserId);
    });
  });

  describe('POST /api/v1/users/:userId/suspend', () => {
    it('returns 401 when no auth', async () => {
      const noAuthApp = await buildApp();
      const res = await noAuthApp.inject({
        method: 'POST',
        url: `/api/v1/users/${validUserId}/suspend`,
        payload: { reason: 'Valid reason for suspend', duration: '24h' },
      });
      await noAuthApp.close();
      expect(res.statusCode).toBe(401);
    });

    it('returns 400 for invalid userId (not UUID)', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/users/not-a-uuid/suspend',
        payload: { reason: 'Valid reason for suspend', duration: '24h' },
      });
      expect(res.statusCode).toBe(400);
      const body = JSON.parse(res.body);
      expect(body.ok).toBe(false);
      expect(body.error?.code).toBe('VALIDATION_ERROR');
    });

    it('returns 400 when reason is too short', async () => {
      const res = await app.inject({
        method: 'POST',
        url: `/api/v1/users/${validUserId}/suspend`,
        payload: { reason: 'x', duration: '24h' },
      });
      expect(res.statusCode).toBe(400);
      const body = JSON.parse(res.body);
      expect(body.ok).toBe(false);
      expect(body.error?.code).toBe('VALIDATION_ERROR');
    });

    it('accepts valid payload (200 with success or 500/DATABASE_ERROR when DB unreachable)', async () => {
      const res = await app.inject({
        method: 'POST',
        url: `/api/v1/users/${validUserId}/suspend`,
        payload: { reason: 'Valid reason for suspend', duration: '30d' },
      });
      const body = JSON.parse(res.body);
      expect([200, 500]).toContain(res.statusCode);
      expect(body.ok === true || body.error?.code === 'DATABASE_ERROR').toBe(true);
      if (body.ok) {
        expect(body.data.userId).toBe(validUserId);
        expect(body.data.duration).toBe('30d');
      }
    });
  });
});

describe('PAGE 06 — Force logout', () => {
  const targetUserId = '00000000-0000-0000-0000-000000000002';
  let appAdmin: Awaited<ReturnType<typeof buildApp>>;
  let appSupport: Awaited<ReturnType<typeof buildApp>>;
  let appNoAuth: Awaited<ReturnType<typeof buildApp>>;

  beforeAll(async () => {
    appAdmin = await buildApp({ testUser: { id: '00000000-0000-0000-0000-000000000001', role: 'super_admin' } });
    appSupport = await buildApp({ testUser: { id: '00000000-0000-0000-0000-000000000003', role: 'support' } });
    appNoAuth = await buildApp();
  });

  afterAll(async () => {
    await appAdmin.close();
    await appSupport.close();
    await appNoAuth.close();
  });

  describe('POST /api/v1/users/:userId/force-logout', () => {
    it('returns 401 when no auth', async () => {
      const res = await appNoAuth.inject({
        method: 'POST',
        url: `/api/v1/users/${targetUserId}/force-logout`,
        payload: {},
      });
      expect(res.statusCode).toBe(401);
      const body = JSON.parse(res.body);
      expect(body.ok).toBe(false);
      expect(body.error?.code).toBe('UNAUTHORIZED');
    });

    it('returns 403 for support role (only admin/super_admin allowed)', async () => {
      const res = await appSupport.inject({
        method: 'POST',
        url: `/api/v1/users/${targetUserId}/force-logout`,
        payload: {},
      });
      expect(res.statusCode).toBe(403);
      const body = JSON.parse(res.body);
      expect(body.ok).toBe(false);
      expect(body.error?.code).toBe('FORBIDDEN');
    });

    it('returns 400 for invalid userId (not UUID)', async () => {
      const res = await appAdmin.inject({
        method: 'POST',
        url: '/api/v1/users/not-a-uuid/force-logout',
        payload: {},
      });
      expect(res.statusCode).toBe(400);
      const body = JSON.parse(res.body);
      expect(body.ok).toBe(false);
      expect(body.error?.code).toBe('VALIDATION_ERROR');
    });

    it('returns 200 with userId or 404/500 (success / not found / DB error)', async () => {
      const res = await appAdmin.inject({
        method: 'POST',
        url: `/api/v1/users/${targetUserId}/force-logout`,
        payload: { reason: 'Security review' },
      });
      expect([200, 404, 500]).toContain(res.statusCode);
      const body = JSON.parse(res.body);
      if (res.statusCode === 200) {
        expect(body.ok).toBe(true);
        expect(body.data.userId).toBe(targetUserId);
      } else {
        expect(body.ok).toBe(false);
        expect(body.error?.code === 'NOT_FOUND' || body.error?.code === 'DATABASE_ERROR').toBe(true);
      }
    });
  });
});

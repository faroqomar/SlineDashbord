import 'dotenv/config';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildApp } from '../app.js';

if (!process.env.SUPABASE_URL) process.env.SUPABASE_URL = 'https://placeholder.supabase.co';
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) process.env.SUPABASE_SERVICE_ROLE_KEY = 'placeholder-key';

describe('Team invite route', () => {
  let appSuperAdmin: Awaited<ReturnType<typeof buildApp>>;
  let appSupport: Awaited<ReturnType<typeof buildApp>>;
  let appNoAuth: Awaited<ReturnType<typeof buildApp>>;

  beforeAll(async () => {
    appSuperAdmin = await buildApp({
      testUser: { id: '00000000-0000-0000-0000-000000000001', role: 'super_admin' },
    });
    appSupport = await buildApp({
      testUser: { id: '00000000-0000-0000-0000-000000000002', role: 'support' },
    });
    appNoAuth = await buildApp();
  });

  afterAll(async () => {
    await appSuperAdmin.close();
    await appSupport.close();
    await appNoAuth.close();
  });

  it('returns 401 when unauthenticated', async () => {
    const res = await appNoAuth.inject({
      method: 'POST',
      url: '/api/v1/team/invite',
      payload: {
        email: 'invitee@example.com',
        role: 'support',
        fullName: 'Invitee User',
      },
    });

    expect(res.statusCode).toBe(401);
    const body = JSON.parse(res.body);
    expect(body.ok).toBe(false);
    expect(body.error?.code).toBe('UNAUTHORIZED');
  });

  it('returns 403 for non-super-admin roles', async () => {
    const res = await appSupport.inject({
      method: 'POST',
      url: '/api/v1/team/invite',
      payload: {
        email: 'invitee@example.com',
        role: 'support',
        fullName: 'Invitee User',
      },
    });

    expect(res.statusCode).toBe(403);
    const body = JSON.parse(res.body);
    expect(body.ok).toBe(false);
    expect(body.error?.code).toBe('FORBIDDEN');
  });

  it('returns 400 for invalid payload', async () => {
    const res = await appSuperAdmin.inject({
      method: 'POST',
      url: '/api/v1/team/invite',
      payload: {
        email: 'bad-email',
        role: 'support',
        fullName: 'x',
      },
    });

    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.body);
    expect(body.ok).toBe(false);
    expect(body.error?.code).toBe('VALIDATION_ERROR');
  });

  it('accepts valid payload (200, 400/AUTH_ERROR, or 500 depending external service state)', async () => {
    const res = await appSuperAdmin.inject({
      method: 'POST',
      url: '/api/v1/team/invite',
      payload: {
        email: `invitee+${Date.now()}@example.com`,
        role: 'support',
        fullName: 'Invitee User',
      },
    });

    expect([200, 400, 500]).toContain(res.statusCode);
    const body = JSON.parse(res.body);
    if (res.statusCode === 200) {
      expect(body.ok).toBe(true);
      expect(typeof body.data.id).toBe('string');
    } else {
      expect(body.ok).toBe(false);
      expect(['AUTH_ERROR', 'DATABASE_ERROR', 'INTERNAL_ERROR']).toContain(body.error?.code);
    }
  });
});

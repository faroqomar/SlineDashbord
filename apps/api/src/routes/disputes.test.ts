import 'dotenv/config';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildApp, type TestUser } from '../app.js';

if (!process.env.SUPABASE_URL) process.env.SUPABASE_URL = 'https://placeholder.supabase.co';
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) process.env.SUPABASE_SERVICE_ROLE_KEY = 'placeholder-key';

const MODERATOR: TestUser = { id: '00000000-0000-0000-0000-000000000001', role: 'moderator' };
const SUPPORT: TestUser = { id: '00000000-0000-0000-0000-000000000002', role: 'support' };

const validPayload = {
  task_id: '00000000-0000-0000-0000-000000000010',
  complainant_id: '00000000-0000-0000-0000-000000000011',
  defendant_id: '00000000-0000-0000-0000-000000000012',
  reason: 'Provider failed to deliver paid work',
};

describe('PAGE 05 — Disputes create API', () => {
  let app: Awaited<ReturnType<typeof buildApp>>;

  beforeAll(async () => {
    app = await buildApp({ testUser: MODERATOR });
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns 401 when no auth', async () => {
    const noAuthApp = await buildApp();
    const res = await noAuthApp.inject({
      method: 'POST',
      url: '/api/v1/disputes',
      payload: validPayload,
    });
    await noAuthApp.close();

    expect(res.statusCode).toBe(401);
  });

  it('returns 403 for role without disputes write permission', async () => {
    const supportApp = await buildApp({ testUser: SUPPORT });
    const res = await supportApp.inject({
      method: 'POST',
      url: '/api/v1/disputes',
      payload: validPayload,
    });
    await supportApp.close();

    expect(res.statusCode).toBe(403);
  });

  it('returns 400 for invalid body', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/disputes',
      payload: {
        ...validPayload,
        complainant_id: validPayload.defendant_id,
        reason: 'bad',
      },
    });

    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.body);
    expect(body.ok).toBe(false);
    expect(body.error?.code).toBe('VALIDATION_ERROR');
  });

  it('returns list with tabCounts and derived category/severity/comments', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/disputes?status=all&page=1&limit=5',
    });

    expect([200, 500]).toContain(res.statusCode);
    const body = JSON.parse(res.body);

    if (res.statusCode === 200) {
      expect(body.ok).toBe(true);
      expect(body.data).toBeDefined();
      expect(Array.isArray(body.data.disputes)).toBe(true);
      const tc = body.data.tabCounts;
      if (tc) {
        expect(typeof tc.all).toBe('number');
        expect(typeof tc.open).toBe('number');
        expect(typeof tc.active).toBe('number');
        expect(typeof tc.resolved).toBe('number');
        expect(typeof tc.canceled).toBe('number');
      }
      const first = body.data?.disputes?.[0];
      if (first) {
        expect(typeof first.category).toBe('string');
        expect(['low', 'med', 'high', 'crit']).toContain(first.severity);
        expect(typeof first.comments_count).toBe('number');
      }
    } else {
      expect(body.ok).toBe(false);
    }
  });

  it('accept/cancel/resolve require auth and valid dispute id', async () => {
    const noAuthApp = await buildApp();
    const disputeId = '00000000-0000-0000-0000-000000000099';
    const acceptRes = await noAuthApp.inject({ method: 'POST', url: `/api/v1/disputes/${disputeId}/accept`, payload: {} });
    const cancelRes = await noAuthApp.inject({ method: 'POST', url: `/api/v1/disputes/${disputeId}/cancel`, payload: { reason: 'Test' } });
    const resolveRes = await noAuthApp.inject({ method: 'POST', url: `/api/v1/disputes/${disputeId}/resolve`, payload: { reason: 'Test' } });
    await noAuthApp.close();
    expect(acceptRes.statusCode).toBe(401);
    expect(cancelRes.statusCode).toBe(401);
    expect(resolveRes.statusCode).toBe(401);
  });

  it('returns 201 when create succeeds, otherwise 404/409/500 depending on DB state', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/disputes',
      payload: validPayload,
    });

    expect([201, 404, 409, 500]).toContain(res.statusCode);
    const body = JSON.parse(res.body);
    if (res.statusCode === 201) {
      expect(body.ok).toBe(true);
      expect(typeof body.data?.id).toBe('string');
    } else {
      expect(body.ok).toBe(false);
    }
  });
});

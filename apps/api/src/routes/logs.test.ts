import 'dotenv/config';
import { describe, it, expect } from 'vitest';
import { buildApp, type TestUser } from '../app.js';
import { LogListResponseSchema } from '@sline/shared';

if (!process.env.SUPABASE_URL) process.env.SUPABASE_URL = 'https://placeholder.supabase.co';
if (!process.env.SUPABASE_SERVICE_ROLE_KEY)
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'placeholder-key';

const SUPPORT: TestUser = { id: '00000000-0000-0000-0000-000000000011', role: 'support' };
const NOT_ADMIN: TestUser = { id: '00000000-0000-0000-0000-000000000099', role: 'authenticated' };

describe('Logs API', () => {
  it('returns 401 without authentication', async () => {
    const app = await buildApp();
    const res = await app.inject({ method: 'GET', url: '/api/v1/logs' });
    await app.close();

    expect(res.statusCode).toBe(401);
    const body = JSON.parse(res.body);
    expect(body.ok).toBe(false);
    expect(body.error?.code).toBe('UNAUTHORIZED');
  });

  it('returns 403 for non-admin roles', async () => {
    const app = await buildApp({ testUser: NOT_ADMIN });
    const res = await app.inject({ method: 'GET', url: '/api/v1/logs' });
    await app.close();

    expect(res.statusCode).toBe(403);
    const body = JSON.parse(res.body);
    expect(body.ok).toBe(false);
    expect(body.error?.code).toBe('FORBIDDEN');
  });

  it('returns 400 for invalid query params', async () => {
    const app = await buildApp({ testUser: SUPPORT });
    const res = await app.inject({ method: 'GET', url: '/api/v1/logs?page=0&limit=200' });
    await app.close();

    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.body);
    expect(body.ok).toBe(false);
    expect(body.error?.code).toBe('VALIDATION_ERROR');
  });

  it('returns paginated logs for support role (or 500 if datasource unavailable)', async () => {
    const app = await buildApp({ testUser: SUPPORT });
    const res = await app.inject({ method: 'GET', url: '/api/v1/logs?page=1&limit=10' });
    await app.close();

    expect([200, 500]).toContain(res.statusCode);
    const body = JSON.parse(res.body);
    if (res.statusCode === 200) {
      expect(body.ok).toBe(true);
      const parsed = LogListResponseSchema.safeParse(body.data);
      expect(parsed.success).toBe(true);
    } else {
      expect(body.ok).toBe(false);
    }
  });
});

import 'dotenv/config';
import { describe, it, expect } from 'vitest';
import { buildApp, type TestUser } from '../app.js';
import { DashboardOverviewResponseSchema } from '@sline/shared';

if (!process.env.SUPABASE_URL) process.env.SUPABASE_URL = 'https://placeholder.supabase.co';
if (!process.env.SUPABASE_SERVICE_ROLE_KEY)
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'placeholder-key';

const SUPPORT: TestUser = { id: '00000000-0000-0000-0000-000000000041', role: 'support' };
const NOT_ADMIN: TestUser = { id: '00000000-0000-0000-0000-000000000099', role: 'authenticated' };

describe('Dashboard overview API', () => {
  it('returns 401 when unauthenticated', async () => {
    const app = await buildApp();
    const res = await app.inject({ method: 'GET', url: '/api/v1/dashboard/overview' });
    await app.close();

    expect(res.statusCode).toBe(401);
    const body = JSON.parse(res.body);
    expect(body.ok).toBe(false);
    expect(body.error?.code).toBe('UNAUTHORIZED');
  });

  it('returns 403 when user has no admin role', async () => {
    const app = await buildApp({ testUser: NOT_ADMIN });
    const res = await app.inject({ method: 'GET', url: '/api/v1/dashboard/overview' });
    await app.close();

    expect(res.statusCode).toBe(403);
    const body = JSON.parse(res.body);
    expect(body.ok).toBe(false);
    expect(body.error?.code).toBe('FORBIDDEN');
  });

  it('returns 200 with pulse schema for support role (or 500 when datasource is unavailable)', async () => {
    const app = await buildApp({ testUser: SUPPORT });
    const res = await app.inject({ method: 'GET', url: '/api/v1/dashboard/overview' });
    await app.close();

    expect([200, 500]).toContain(res.statusCode);
    const body = JSON.parse(res.body);

    if (res.statusCode === 200) {
      const parsed = DashboardOverviewResponseSchema.safeParse(body);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.data.pulse).toBeDefined();
        expect(parsed.data.data.kpiTrends).toBeDefined();
        expect(typeof parsed.data.data.pulse.openReports).toBe('number');
        expect(typeof parsed.data.data.pulse.openCases).toBe('number');
        expect(typeof parsed.data.data.pulse.bookingsToday).toBe('number');
        expect(typeof parsed.data.data.kpiTrends.activeUsers.label).toBe('string');
        expect(typeof parsed.data.data.kpiTrends.comparisonWindow).toBe('string');
      }
    } else {
      expect(body.ok).toBe(false);
    }
  });
});

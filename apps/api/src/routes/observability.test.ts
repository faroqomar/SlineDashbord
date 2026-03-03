import 'dotenv/config';
import { describe, it, expect } from 'vitest';
import { buildApp, type TestUser } from '../app.js';
import { ObservabilityResponseSchema } from '@sline/shared';

if (!process.env.SUPABASE_URL) process.env.SUPABASE_URL = 'https://placeholder.supabase.co';
if (!process.env.SUPABASE_SERVICE_ROLE_KEY)
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'placeholder-key';

const SUPER_ADMIN: TestUser = { id: '00000000-0000-0000-0000-000000000001', role: 'super_admin' };
const SUPPORT: TestUser = { id: '00000000-0000-0000-0000-000000000002', role: 'support' };
const NOT_ADMIN: TestUser = { id: '00000000-0000-0000-0000-000000000099', role: 'authenticated' };

describe('PAGE 14 — Observability / System Health', () => {
  describe('GET /api/v1/observability', () => {
    it('returns 401 when no auth', async () => {
      const app = await buildApp();
      const res = await app.inject({ method: 'GET', url: '/api/v1/observability' });
      await app.close();
      expect(res.statusCode).toBe(401);
      const body = JSON.parse(res.body);
      expect(body.ok).toBe(false);
      expect(body.error?.code).toBe('UNAUTHORIZED');
    });

    it('returns 403 when user is not an admin role', async () => {
      const app = await buildApp({ testUser: NOT_ADMIN });
      const res = await app.inject({ method: 'GET', url: '/api/v1/observability' });
      await app.close();
      expect(res.statusCode).toBe(403);
      const body = JSON.parse(res.body);
      expect(body.ok).toBe(false);
      expect(body.error?.code).toBe('FORBIDDEN');
    });

    it('returns 200 with body matching ObservabilityResponseSchema when admin', async () => {
      const app = await buildApp({ testUser: SUPPORT });
      const res = await app.inject({ method: 'GET', url: '/api/v1/observability' });
      await app.close();
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      const parsed = ObservabilityResponseSchema.safeParse(body);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.ok).toBe(true);
        expect(Array.isArray(parsed.data.data.services)).toBe(true);
        expect(parsed.data.data.services.length).toBeGreaterThan(0);
        // queueStatus and errorRates may be present or N/A
        expect(parsed.data.data.queueStatus).toBeDefined();
      }
    });

    it('returns 200 when super_admin', async () => {
      const app = await buildApp({ testUser: SUPER_ADMIN });
      const res = await app.inject({ method: 'GET', url: '/api/v1/observability' });
      await app.close();
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(ObservabilityResponseSchema.safeParse(body).success).toBe(true);
    });
  });
});

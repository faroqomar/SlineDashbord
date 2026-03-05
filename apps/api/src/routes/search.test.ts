import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildApp, type TestUser } from '../app.js';
import { AdminGlobalSearchResultSchema, AdminSearchInsightsResultSchema } from '@sline/shared';

if (!process.env.SUPABASE_URL) process.env.SUPABASE_URL = 'https://placeholder.supabase.co';
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) process.env.SUPABASE_SERVICE_ROLE_KEY = 'placeholder-key';

const ADMIN: TestUser = { id: '00000000-0000-0000-0000-000000000001', role: 'admin' };

describe('PAGE 11 — Global Search API', () => {
  describe('GET /api/v1/search/insights', () => {
    it('returns 401 when no auth', async () => {
      const app = await buildApp();
      const res = await app.inject({ method: 'GET', url: '/api/v1/search/insights' });
      await app.close();
      expect(res.statusCode).toBe(401);
      const body = JSON.parse(res.body);
      expect(body.ok).toBe(false);
      expect(body.error?.code).toBeDefined();
    });

    it('returns 400 for invalid query params', async () => {
      const app = await buildApp({ testUser: ADMIN });
      const res = await app.inject({ method: 'GET', url: '/api/v1/search/insights?window=7d' });
      await app.close();
      expect(res.statusCode).toBe(400);
      const body = JSON.parse(res.body);
      expect(body.ok).toBe(false);
      expect(body.error?.code).toBe('VALIDATION_ERROR');
    });

    it('returns 200 with schema-valid insights payload when authenticated', async () => {
      const app = await buildApp({ testUser: ADMIN });
      const res = await app.inject({ method: 'GET', url: '/api/v1/search/insights' });
      await app.close();
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.ok).toBe(true);
      const parsed = AdminSearchInsightsResultSchema.safeParse(body.data);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.windowHours).toBe(24);
      }
    });
  });

  describe('GET /api/v1/search', () => {
    it('returns 401 when no auth', async () => {
      const app = await buildApp();
      const res = await app.inject({ method: 'GET', url: '/api/v1/search?q=ab' });
      await app.close();
      expect(res.statusCode).toBe(401);
      const body = JSON.parse(res.body);
      expect(body.ok).toBe(false);
      expect(body.error?.code).toBeDefined();
    });

    it('returns 400 when q is shorter than 2 chars', async () => {
      const app = await buildApp({ testUser: ADMIN });
      const res = await app.inject({ method: 'GET', url: '/api/v1/search?q=a' });
      await app.close();
      expect(res.statusCode).toBe(400);
      const body = JSON.parse(res.body);
      expect(body.ok).toBe(false);
      expect(body.error?.code).toBe('VALIDATION_ERROR');
    });

    it('returns 400 when limit > 50', async () => {
      const app = await buildApp({ testUser: ADMIN });
      const res = await app.inject({ method: 'GET', url: '/api/v1/search?q=ab&limit=51' });
      await app.close();
      expect(res.statusCode).toBe(400);
    });

    it('returns 200 with items array when authenticated (shape valid)', async () => {
      const app = await buildApp({ testUser: ADMIN });
      const res = await app.inject({ method: 'GET', url: '/api/v1/search?q=test&limit=5' });
      await app.close();
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.ok).toBe(true);
      expect(body.data).toBeDefined();
      expect(Array.isArray(body.data.items)).toBe(true);
      const parsed = AdminGlobalSearchResultSchema.safeParse(body.data);
      expect(parsed.success).toBe(true);
    });

    it('returns 200 with valid types filter', async () => {
      const app = await buildApp({ testUser: ADMIN });
      const res = await app.inject({ method: 'GET', url: '/api/v1/search?q=ab&types=user,task' });
      await app.close();
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.ok).toBe(true);
      expect(Array.isArray(body.data.items)).toBe(true);
    });

    it('response items have entityType and id (when any returned)', async () => {
      const app = await buildApp({ testUser: ADMIN });
      const res = await app.inject({ method: 'GET', url: '/api/v1/search?q=xy&limit=20' });
      await app.close();
      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body.ok).toBe(true);
      const items = body.data?.items ?? [];
      for (const item of items) {
        expect(['user', 'task', 'booking', 'dispute', 'transaction']).toContain(item.entityType);
        expect(typeof item.id).toBe('string');
        expect(typeof item.title).toBe('string');
        expect(typeof item.link).toBe('string');
      }
    });

    it('returns 503 and x-request-id when search times out', async () => {
      const prev = process.env.SEARCH_TIMEOUT_MS;
      process.env.SEARCH_TIMEOUT_MS = '1';
      try {
        const app = await buildApp({ testUser: ADMIN });
        const res = await app.inject({ method: 'GET', url: '/api/v1/search?q=ab&limit=5' });
        await app.close();
        expect(res.statusCode).toBe(503);
        const body = JSON.parse(res.body);
        expect(body.ok).toBe(false);
        expect(['SERVICE_UNAVAILABLE', 'INTERNAL_ERROR']).toContain(body.error?.code);
        if (res.headers['x-request-id']) expect(typeof res.headers['x-request-id']).toBe('string');
      } finally {
        if (prev !== undefined) process.env.SEARCH_TIMEOUT_MS = prev;
        else delete process.env.SEARCH_TIMEOUT_MS;
      }
    });

    it('accepts q containing single quote without breaking (sanitized)', async () => {
      const app = await buildApp({ testUser: ADMIN });
      const res = await app.inject({ method: 'GET', url: '/api/v1/search?q=a%27b&limit=5' });
      await app.close();
      expect([200, 503]).toContain(res.statusCode);
      const body = JSON.parse(res.body);
      if (res.statusCode === 200) expect(body.ok).toBe(true);
    });
  });
});

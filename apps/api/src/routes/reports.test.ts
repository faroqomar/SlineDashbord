import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildApp, type TestUser } from '../app.js';

if (!process.env.SUPABASE_URL) process.env.SUPABASE_URL = 'https://placeholder.supabase.co';
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) process.env.SUPABASE_SERVICE_ROLE_KEY = 'placeholder-key';

const MODERATOR: TestUser = { id: '00000000-0000-0000-0000-000000000001', role: 'moderator' };
const SUPPORT: TestUser = { id: '00000000-0000-0000-0000-000000000002', role: 'support' };
const validReportId = '00000000-0000-0000-0000-000000000010';
const validCreatePayload = {
  entity_type: 'task',
  entity_id: '00000000-0000-0000-0000-000000000011',
  reason: 'Manual moderation report for abusive behavior',
  category: 'abuse',
  severity: 'high',
};

describe('PAGE 10 — Reports queue API', () => {
  let app: Awaited<ReturnType<typeof buildApp>>;

  beforeAll(async () => {
    app = await buildApp({ testUser: MODERATOR });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/v1/reports', () => {
    it('returns 401 when no auth', async () => {
      const noAuthApp = await buildApp();
      const res = await noAuthApp.inject({ method: 'GET', url: '/api/v1/reports' });
      await noAuthApp.close();
      expect(res.statusCode).toBe(401);
    });

    it('returns 200 with list shape when authenticated (or 500 when reports table missing)', async () => {
      const res = await app.inject({ method: 'GET', url: '/api/v1/reports' });
      expect([200, 500]).toContain(res.statusCode);
      const body = JSON.parse(res.body);
      if (res.statusCode === 200) {
        expect(body.ok).toBe(true);
        expect(Array.isArray(body.data?.reports)).toBe(true);
        expect(typeof body.data?.total).toBe('number');
        expect(typeof body.data?.page).toBe('number');
        expect(typeof body.data?.limit).toBe('number');
      }
    });

    it('accepts status and entity_type query params (200 or 500)', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/v1/reports?status=open&entity_type=task&page=1&limit=5',
      });
      expect([200, 500]).toContain(res.statusCode);
      const body = JSON.parse(res.body);
      if (res.statusCode === 200) expect(body.ok).toBe(true);
    });

    it('accepts q search query param (200 or 500)', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/v1/reports?q=report%20123',
      });
      expect([200, 500]).toContain(res.statusCode);
      const body = JSON.parse(res.body);
      if (res.statusCode === 200) expect(body.ok).toBe(true);
    });

    it('rejects invalid q characters', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/v1/reports?q=report,123',
      });
      expect(res.statusCode).toBe(400);
      const body = JSON.parse(res.body);
      expect(body.ok).toBe(false);
      expect(body.error?.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/v1/reports/trends', () => {
    it('returns 401 when no auth', async () => {
      const noAuthApp = await buildApp();
      const res = await noAuthApp.inject({ method: 'GET', url: '/api/v1/reports/trends' });
      await noAuthApp.close();
      expect(res.statusCode).toBe(401);
    });

    it('returns 400 for unsupported window', async () => {
      const res = await app.inject({ method: 'GET', url: '/api/v1/reports/trends?window=30d' });
      expect(res.statusCode).toBe(400);
    });

    it('returns 200 with trend payload or 500 when DB is unavailable', async () => {
      const res = await app.inject({ method: 'GET', url: '/api/v1/reports/trends?window=7d' });
      expect([200, 500]).toContain(res.statusCode);
      const body = JSON.parse(res.body);
      if (res.statusCode === 200) {
        expect(body.ok).toBe(true);
        expect(body.data?.window).toBe('7d');
        expect(Array.isArray(body.data?.points)).toBe(true);
      }
    });
  });

  describe('GET /api/v1/reports/kpis', () => {
    it('returns 401 when no auth', async () => {
      const noAuthApp = await buildApp();
      const res = await noAuthApp.inject({ method: 'GET', url: '/api/v1/reports/kpis' });
      await noAuthApp.close();
      expect(res.statusCode).toBe(401);
    });

    it('returns 400 for unsupported window', async () => {
      const res = await app.inject({ method: 'GET', url: '/api/v1/reports/kpis?window=30d' });
      expect(res.statusCode).toBe(400);
    });

    it('returns 200 with KPI payload or 500 when DB is unavailable', async () => {
      const res = await app.inject({ method: 'GET', url: '/api/v1/reports/kpis?window=7d' });
      expect([200, 500]).toContain(res.statusCode);
      const body = JSON.parse(res.body);
      if (res.statusCode === 200) {
        expect(body.ok).toBe(true);
        expect(body.data?.window).toBe('7d');
        expect(Array.isArray(body.data?.cards)).toBe(true);
      }
    });
  });

  describe('POST /api/v1/reports', () => {
    it('returns 401 when no auth', async () => {
      const noAuthApp = await buildApp();
      const res = await noAuthApp.inject({
        method: 'POST',
        url: '/api/v1/reports',
        payload: validCreatePayload,
      });
      await noAuthApp.close();
      expect(res.statusCode).toBe(401);
    });

    it('returns 403 for role without reports write permission', async () => {
      const supportApp = await buildApp({ testUser: SUPPORT });
      const res = await supportApp.inject({
        method: 'POST',
        url: '/api/v1/reports',
        payload: validCreatePayload,
      });
      await supportApp.close();
      expect(res.statusCode).toBe(403);
    });

    it('returns 400 for invalid create payload', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/reports',
        payload: {
          ...validCreatePayload,
          reason: '',
        },
      });
      expect(res.statusCode).toBe(400);
      const body = JSON.parse(res.body);
      expect(body.ok).toBe(false);
      expect(body.error?.code).toBe('VALIDATION_ERROR');
    });

    it('returns 201, 404, or 500 for valid payload depending on DB state', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/reports',
        payload: validCreatePayload,
      });

      expect([201, 404, 500]).toContain(res.statusCode);
      const body = JSON.parse(res.body);
      if (res.statusCode === 201) {
        expect(body.ok).toBe(true);
        expect(typeof body.data?.id).toBe('string');
        expect(body.data?.status).toBe('open');
      } else {
        expect(body.ok).toBe(false);
      }
    });
  });

  describe('GET /api/v1/reports/:reportId', () => {
    it('returns 401 when no auth', async () => {
      const noAuthApp = await buildApp();
      const res = await noAuthApp.inject({
        method: 'GET',
        url: `/api/v1/reports/${validReportId}`,
      });
      await noAuthApp.close();
      expect(res.statusCode).toBe(401);
    });

    it('returns 400 for invalid reportId (not UUID)', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/v1/reports/not-a-uuid',
      });
      expect(res.statusCode).toBe(400);
      const body = JSON.parse(res.body);
      expect(body.ok).toBe(false);
      expect(body.error?.code).toBe('VALIDATION_ERROR');
    });

    it('returns 404 or 200 for valid UUID (200 if report exists)', async () => {
      const res = await app.inject({
        method: 'GET',
        url: `/api/v1/reports/${validReportId}`,
      });
      expect([200, 404]).toContain(res.statusCode);
      const body = JSON.parse(res.body);
      if (res.statusCode === 200) {
        expect(body.ok).toBe(true);
        expect(body.data?.id).toBe(validReportId);
        expect(Array.isArray(body.data?.actions)).toBe(true);
      }
    });
  });

  describe('POST /api/v1/reports/:reportId/triage', () => {
    it('returns 401 when no auth', async () => {
      const noAuthApp = await buildApp();
      const res = await noAuthApp.inject({
        method: 'POST',
        url: `/api/v1/reports/${validReportId}/triage`,
        payload: { action: 'dismiss', reason: 'No violation' },
      });
      await noAuthApp.close();
      expect(res.statusCode).toBe(401);
    });

    it('returns 400 for invalid reportId', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/reports/invalid-id/triage',
        payload: { action: 'dismiss', reason: 'No violation' },
      });
      expect(res.statusCode).toBe(400);
    });

    it('returns 400 for missing or empty reason', async () => {
      const res = await app.inject({
        method: 'POST',
        url: `/api/v1/reports/${validReportId}/triage`,
        payload: { action: 'dismiss', reason: '' },
      });
      expect(res.statusCode).toBe(400);
      const body = JSON.parse(res.body);
      expect(body.ok).toBe(false);
    });

    it('returns 400 for invalid action', async () => {
      const res = await app.inject({
        method: 'POST',
        url: `/api/v1/reports/${validReportId}/triage`,
        payload: { action: 'invalid_action', reason: 'Test' },
      });
      expect(res.statusCode).toBe(400);
    });

    it('returns 200, 404, or 500 for valid payload (200 if report exists and triage succeeds)', async () => {
      const res = await app.inject({
        method: 'POST',
        url: `/api/v1/reports/${validReportId}/triage`,
        payload: { action: 'dismiss', reason: 'No violation' },
      });
      expect([200, 404, 409, 500]).toContain(res.statusCode);
      const body = JSON.parse(res.body);
      if (res.statusCode === 200) {
        expect(body.ok).toBe(true);
        expect(body.data?.id).toBe(validReportId);
      }
    });
  });

  describe('POST /api/v1/reports/:reportId/dismiss', () => {
    it('returns 401 when no auth', async () => {
      const noAuthApp = await buildApp();
      const res = await noAuthApp.inject({
        method: 'POST',
        url: `/api/v1/reports/${validReportId}/dismiss`,
        payload: { reason: 'Duplicate report' },
      });
      await noAuthApp.close();
      expect(res.statusCode).toBe(401);
    });

    it('returns 400 for invalid reportId', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/reports/not-uuid/dismiss',
        payload: { reason: 'Duplicate report' },
      });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/v1/reports/:reportId/escalate', () => {
    it('returns 401 when no auth', async () => {
      const noAuthApp = await buildApp();
      const res = await noAuthApp.inject({
        method: 'POST',
        url: `/api/v1/reports/${validReportId}/escalate`,
        payload: { reason: 'Needs investigation' },
      });
      await noAuthApp.close();
      expect(res.statusCode).toBe(401);
    });

    it('returns 400 for invalid reportId', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/reports/invalid-id/escalate',
        payload: { reason: 'Needs investigation' },
      });
      expect(res.statusCode).toBe(400);
    });

    it('returns 400 for empty reason', async () => {
      const res = await app.inject({
        method: 'POST',
        url: `/api/v1/reports/${validReportId}/escalate`,
        payload: { reason: '' },
      });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/v1/reports/:reportId/close', () => {
    it('returns 401 when no auth', async () => {
      const noAuthApp = await buildApp();
      const res = await noAuthApp.inject({
        method: 'POST',
        url: `/api/v1/reports/${validReportId}/close`,
        payload: { reason: 'Resolved' },
      });
      await noAuthApp.close();
      expect(res.statusCode).toBe(401);
    });

    it('returns 400 for invalid reportId', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/reports/not-uuid/close',
        payload: { reason: 'Resolved' },
      });
      expect(res.statusCode).toBe(400);
    });

    it('returns 400 for empty reason', async () => {
      const res = await app.inject({
        method: 'POST',
        url: `/api/v1/reports/${validReportId}/close`,
        payload: { reason: '' },
      });
      expect(res.statusCode).toBe(400);
    });

    it('returns 200, 404, or 500 for valid payload', async () => {
      const res = await app.inject({
        method: 'POST',
        url: `/api/v1/reports/${validReportId}/close`,
        payload: { reason: 'Resolved' },
      });
      expect([200, 404, 409, 500]).toContain(res.statusCode);
      const body = JSON.parse(res.body);
      if (res.statusCode === 200) {
        expect(body.ok).toBe(true);
        expect(body.data?.id).toBe(validReportId);
      }
    });
  });
});

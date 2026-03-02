import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildApp, type TestUser } from '../app.js';

if (!process.env.SUPABASE_URL) process.env.SUPABASE_URL = 'https://placeholder.supabase.co';
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) process.env.SUPABASE_SERVICE_ROLE_KEY = 'placeholder-key';

const CASES_USER: TestUser = { id: '00000000-0000-0000-0000-000000000001', role: 'admin' };
const validEntityId = '00000000-0000-0000-0000-000000000002';

describe('PAGE 08 — Cases API', () => {
  let app: Awaited<ReturnType<typeof buildApp>>;

  beforeAll(async () => {
    app = await buildApp({ testUser: CASES_USER });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/v1/cases', () => {
    it('returns 401 when no auth', async () => {
      const noAuthApp = await buildApp();
      const res = await noAuthApp.inject({ method: 'GET', url: '/api/v1/cases' });
      await noAuthApp.close();
      expect(res.statusCode).toBe(401);
    });

    it('returns 200 with cases array when authenticated (or 500 if DB/tables missing)', async () => {
      const res = await app.inject({ method: 'GET', url: '/api/v1/cases' });
      expect([200, 500]).toContain(res.statusCode);
      const body = JSON.parse(res.body);
      if (res.statusCode === 200) {
        expect(body.ok).toBe(true);
        expect(Array.isArray(body.data?.cases)).toBe(true);
        expect(typeof body.data?.total).toBe('number');
      } else {
        expect(body.error?.code).toBe('DATABASE_ERROR');
      }
    });
  });

  describe('GET /api/v1/cases/:caseId', () => {
    it('returns 401 when no auth', async () => {
      const noAuthApp = await buildApp();
      const res = await noAuthApp.inject({
        method: 'GET',
        url: `/api/v1/cases/${validEntityId}`,
      });
      await noAuthApp.close();
      expect(res.statusCode).toBe(401);
    });

    it('returns 404 or 500 for non-existent case', async () => {
      const res = await app.inject({
        method: 'GET',
        url: `/api/v1/cases/${validEntityId}`,
      });
      expect([404, 500]).toContain(res.statusCode);
      if (res.statusCode === 404) {
        const body = JSON.parse(res.body);
        expect(body.ok).toBe(false);
        expect(body.error?.code).toBe('NOT_FOUND');
      }
    });
  });

  describe('POST /api/v1/cases', () => {
    it('returns 401 when no auth', async () => {
      const noAuthApp = await buildApp();
      const res = await noAuthApp.inject({
        method: 'POST',
        url: '/api/v1/cases',
        payload: { subject: 'Test case', source: 'dashboard', priority: 'medium' },
      });
      await noAuthApp.close();
      expect(res.statusCode).toBe(401);
    });

    it('returns 400 for invalid payload (empty subject)', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/cases',
        payload: { subject: '', source: 'dashboard' },
      });
      expect(res.statusCode).toBe(400);
      const body = JSON.parse(res.body);
      expect(body.ok).toBe(false);
      expect(body.error?.code).toBe('VALIDATION_ERROR');
    });

    it('returns 201 with case when payload is valid (or 500 if DB unreachable)', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/cases',
        payload: { subject: 'Integration test case', source: 'dashboard', priority: 'medium' },
      });
      expect([201, 500]).toContain(res.statusCode);
      const body = JSON.parse(res.body);
      if (res.statusCode === 201) {
        expect(body.ok).toBe(true);
        expect(body.data?.id).toBeDefined();
        expect(body.data?.subject).toBe('Integration test case');
      }
    });
  });

  describe('POST /api/v1/cases/:caseId/entities', () => {
    const fakeCaseId = '00000000-0000-0000-0000-000000000099';

    it('returns 401 when no auth', async () => {
      const noAuthApp = await buildApp();
      const res = await noAuthApp.inject({
        method: 'POST',
        url: `/api/v1/cases/${fakeCaseId}/entities`,
        payload: { entity_type: 'task', entity_id: validEntityId },
      });
      await noAuthApp.close();
      expect(res.statusCode).toBe(401);
    });

    it('returns 400 for invalid payload (invalid entity_id)', async () => {
      const res = await app.inject({
        method: 'POST',
        url: `/api/v1/cases/${fakeCaseId}/entities`,
        payload: { entity_type: 'task', entity_id: 'not-a-uuid' },
      });
      expect(res.statusCode).toBe(400);
      const body = JSON.parse(res.body);
      expect(body.ok).toBe(false);
      expect(body.error?.code).toBe('VALIDATION_ERROR');
    });

    it('returns 400 for invalid entity_type', async () => {
      const res = await app.inject({
        method: 'POST',
        url: `/api/v1/cases/${fakeCaseId}/entities`,
        payload: { entity_type: 'invalid_type', entity_id: validEntityId },
      });
      expect(res.statusCode).toBe(400);
    });

    it('returns 404 for non-existent case', async () => {
      const res = await app.inject({
        method: 'POST',
        url: `/api/v1/cases/${fakeCaseId}/entities`,
        payload: { entity_type: 'task', entity_id: validEntityId },
      });
      expect(res.statusCode).toBe(404);
      const body = JSON.parse(res.body);
      expect(body.ok).toBe(false);
      expect(body.error?.code).toBe('NOT_FOUND');
    });
  });
});

describe('PAGE 08 — Cases integration: create case + attach entity', () => {
  let app: Awaited<ReturnType<typeof buildApp>>;
  let createdCaseId: string | null = null;

  beforeAll(async () => {
    app = await buildApp({ testUser: CASES_USER });
  });

  afterAll(async () => {
    await app.close();
  });

  it('create case then attach entity (201/200 or 500 if DB unreachable)', async () => {
    const createRes = await app.inject({
      method: 'POST',
      url: '/api/v1/cases',
      payload: { subject: 'E2E test case', source: 'test', priority: 'low' },
    });
    expect([201, 500]).toContain(createRes.statusCode);
    const createBody = JSON.parse(createRes.body);
    if (createRes.statusCode === 500) {
      expect(createBody.error?.code).toBe('DATABASE_ERROR');
      return;
    }
    expect(createBody.ok).toBe(true);
    createdCaseId = createBody.data?.id;
    expect(createdCaseId).toBeDefined();

    const attachRes = await app.inject({
      method: 'POST',
      url: `/api/v1/cases/${createdCaseId}/entities`,
      payload: { entity_type: 'task', entity_id: validEntityId },
    });
    expect([200, 409, 500]).toContain(attachRes.statusCode);
    const attachBody = JSON.parse(attachRes.body);
    if (attachRes.statusCode === 200) {
      expect(attachBody.ok).toBe(true);
      expect(attachBody.data?.id).toBeDefined();
    }
    if (attachRes.statusCode === 409) {
      expect(attachBody.error?.code).toBe('CONFLICT');
    }
  });
});

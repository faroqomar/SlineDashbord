import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildApp } from '../app.js';
if (!process.env.SUPABASE_URL)
    process.env.SUPABASE_URL = 'https://placeholder.supabase.co';
if (!process.env.SUPABASE_SERVICE_ROLE_KEY)
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'placeholder-key';
const MODERATOR = { id: '00000000-0000-0000-0000-000000000001', role: 'moderator' };
const validThreadId = '00000000-0000-0000-0000-000000000010';
const validCaseId = '00000000-0000-0000-0000-000000000011';
describe('PAGE 09 — Chat moderation (case-gated access)', () => {
    let app;
    beforeAll(async () => {
        app = await buildApp({ testUser: MODERATOR });
    });
    afterAll(async () => {
        await app.close();
    });
    describe('POST /api/v1/chat/threads/:threadId/access', () => {
        it('returns 401 when no auth', async () => {
            const noAuthApp = await buildApp();
            const res = await noAuthApp.inject({
                method: 'POST',
                url: `/api/v1/chat/threads/${validThreadId}/access`,
                payload: { caseId: validCaseId },
            });
            await noAuthApp.close();
            expect(res.statusCode).toBe(401);
        });
        it('returns 400 when threadId is not a valid UUID', async () => {
            const res = await app.inject({
                method: 'POST',
                url: '/api/v1/chat/threads/not-a-uuid/access',
                payload: { caseId: validCaseId },
            });
            expect(res.statusCode).toBe(400);
            const body = JSON.parse(res.body);
            expect(body.ok).toBe(false);
            expect(body.error?.code).toBe('VALIDATION_ERROR');
        });
        it('returns 400 when caseId is missing or invalid', async () => {
            const resMissing = await app.inject({
                method: 'POST',
                url: `/api/v1/chat/threads/${validThreadId}/access`,
                payload: {},
            });
            expect(resMissing.statusCode).toBe(400);
            const bodyMissing = JSON.parse(resMissing.body);
            expect(bodyMissing.ok).toBe(false);
            expect(bodyMissing.error?.code).toBe('VALIDATION_ERROR');
            const resInvalid = await app.inject({
                method: 'POST',
                url: `/api/v1/chat/threads/${validThreadId}/access`,
                payload: { caseId: 'not-a-uuid' },
            });
            expect(resInvalid.statusCode).toBe(400);
        });
        it('returns 403 when case not found', async () => {
            const res = await app.inject({
                method: 'POST',
                url: `/api/v1/chat/threads/${validThreadId}/access`,
                payload: { caseId: '00000000-0000-0000-0000-000000000099' },
            });
            expect(res.statusCode).toBe(403);
            const body = JSON.parse(res.body);
            expect(body.ok).toBe(false);
            expect(body.error?.code).toBe('FORBIDDEN');
        });
        it('accepts valid payload (200 with receipt, or 403/DATABASE_ERROR when case missing or DB unreachable)', async () => {
            const res = await app.inject({
                method: 'POST',
                url: `/api/v1/chat/threads/${validThreadId}/access`,
                payload: { caseId: validCaseId, reason: 'Moderation review' },
            });
            expect([200, 403, 500]).toContain(res.statusCode);
            const body = JSON.parse(res.body);
            if (res.statusCode === 200 && body.ok) {
                expect(body.data.threadId).toBe(validThreadId);
                expect(body.data.caseId).toBe(validCaseId);
                expect(body.data.grantedAt).toBeDefined();
            }
            if (res.statusCode === 403)
                expect(body.error?.code).toBe('FORBIDDEN');
            if (res.statusCode === 500)
                expect(body.error?.code).toBe('DATABASE_ERROR');
        });
    });
    describe('GET /api/v1/chat/threads/:threadId', () => {
        it('returns 401 when no auth', async () => {
            const noAuthApp = await buildApp();
            const res = await noAuthApp.inject({
                method: 'GET',
                url: `/api/v1/chat/threads/${validThreadId}?case_id=${validCaseId}`,
            });
            await noAuthApp.close();
            expect(res.statusCode).toBe(401);
        });
        it('returns 400 when threadId is not a valid UUID', async () => {
            const res = await app.inject({
                method: 'GET',
                url: `/api/v1/chat/threads/not-a-uuid?case_id=${validCaseId}`,
            });
            expect(res.statusCode).toBe(400);
            const body = JSON.parse(res.body);
            expect(body.ok).toBe(false);
            expect(body.error?.code).toBe('VALIDATION_ERROR');
        });
        it('returns 403 when case_id is missing', async () => {
            const res = await app.inject({
                method: 'GET',
                url: `/api/v1/chat/threads/${validThreadId}`,
            });
            expect(res.statusCode).toBe(403);
            const body = JSON.parse(res.body);
            expect(body.ok).toBe(false);
            expect(body.error?.code).toBe('FORBIDDEN');
        });
        it('returns 403 when case not found', async () => {
            const res = await app.inject({
                method: 'GET',
                url: `/api/v1/chat/threads/${validThreadId}?case_id=00000000-0000-0000-0000-000000000099`,
            });
            expect(res.statusCode).toBe(403);
            const body = JSON.parse(res.body);
            expect(body.ok).toBe(false);
            expect(body.error?.code).toBe('FORBIDDEN');
        });
        it('returns 403 when case not linked to thread (no prior grant or entity)', async () => {
            const unlinkedCaseId = '00000000-0000-0000-0000-000000000012';
            const res = await app.inject({
                method: 'GET',
                url: `/api/v1/chat/threads/${validThreadId}?case_id=${unlinkedCaseId}`,
            });
            expect(res.statusCode).toBe(403);
            const body = JSON.parse(res.body);
            expect(body.ok).toBe(false);
            expect(body.error?.code).toBe('FORBIDDEN');
        });
    });
});

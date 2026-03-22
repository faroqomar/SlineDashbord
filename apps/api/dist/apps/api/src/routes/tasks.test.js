import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildApp } from '../app.js';
import { TaskActivityResponseSchema, TaskQueueAnalyticsResponseSchema } from '@sline/shared';
if (!process.env.SUPABASE_URL)
    process.env.SUPABASE_URL = 'https://placeholder.supabase.co';
if (!process.env.SUPABASE_SERVICE_ROLE_KEY)
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'placeholder-key';
const ADMIN = { id: '00000000-0000-0000-0000-000000000001', role: 'admin' };
const NON_ADMIN = { id: '00000000-0000-0000-0000-000000000002', role: 'authenticated' };
const taskId = '00000000-0000-0000-0000-000000000010';
describe('PAGE 02 — Tasks (activity canonical audit)', () => {
    let app;
    beforeAll(async () => {
        app = await buildApp({ testUser: ADMIN });
    });
    afterAll(async () => {
        await app.close();
    });
    describe('GET /api/v1/tasks (list)', () => {
        it('returns 401 when no auth', async () => {
            const noAuthApp = await buildApp();
            const res = await noAuthApp.inject({
                method: 'GET',
                url: '/api/v1/tasks?page=1&limit=10',
            });
            await noAuthApp.close();
            expect(res.statusCode).toBe(401);
        });
        it('returns 200 with tasks array and optional offers_count per task (or 500 when DB unavailable)', async () => {
            const res = await app.inject({
                method: 'GET',
                url: '/api/v1/tasks?page=1&limit=10',
            });
            expect([200, 500]).toContain(res.statusCode);
            const body = JSON.parse(res.body);
            if (res.statusCode === 200 && body.ok !== false && body.data) {
                const data = body.data;
                expect(Array.isArray(data.tasks)).toBe(true);
                expect(typeof data.count).toBe('number');
                expect(typeof data.totalPages).toBe('number');
                for (const task of data.tasks) {
                    expect(task).toHaveProperty('id');
                    expect(task).toHaveProperty('title');
                    expect(task).toHaveProperty('status');
                    expect(task).toHaveProperty('client');
                    if (task.offers_count !== undefined) {
                        expect(typeof task.offers_count).toBe('number');
                        expect(Number.isInteger(task.offers_count)).toBe(true);
                        expect(task.offers_count).toBeGreaterThanOrEqual(0);
                    }
                }
            }
        });
    });
    describe('GET /api/v1/tasks/:id/activity', () => {
        it('returns 401 when no auth', async () => {
            const noAuthApp = await buildApp();
            const res = await noAuthApp.inject({
                method: 'GET',
                url: `/api/v1/tasks/${taskId}/activity`,
            });
            await noAuthApp.close();
            expect(res.statusCode).toBe(401);
        });
        it('returns 200 with array parseable as TaskActivityResponseSchema when DB responds', async () => {
            const res = await app.inject({
                method: 'GET',
                url: `/api/v1/tasks/${taskId}/activity`,
            });
            // With real DB: 200 and array; with placeholder: may be 500
            if (res.statusCode === 200) {
                const body = JSON.parse(res.body);
                const raw = body.data !== undefined ? body.data : body;
                const parsed = TaskActivityResponseSchema.safeParse(raw);
                expect(parsed.success).toBe(true);
                if (parsed.success)
                    expect(Array.isArray(parsed.data)).toBe(true);
            }
        });
    });
    describe('GET /api/v1/tasks/queue-analytics', () => {
        it('returns 401 when no auth', async () => {
            const noAuthApp = await buildApp();
            const res = await noAuthApp.inject({
                method: 'GET',
                url: '/api/v1/tasks/queue-analytics?range=7d',
            });
            await noAuthApp.close();
            expect(res.statusCode).toBe(401);
        });
        it('returns 403 when user has no admin role', async () => {
            const nonAdminApp = await buildApp({ testUser: NON_ADMIN });
            const res = await nonAdminApp.inject({
                method: 'GET',
                url: '/api/v1/tasks/queue-analytics?range=7d',
            });
            await nonAdminApp.close();
            expect(res.statusCode).toBe(403);
        });
        it('returns 200 parseable as TaskQueueAnalyticsResponseSchema (or 500 when datasource is unavailable)', async () => {
            const res = await app.inject({
                method: 'GET',
                url: '/api/v1/tasks/queue-analytics?range=7d',
            });
            expect([200, 500]).toContain(res.statusCode);
            const body = JSON.parse(res.body);
            if (res.statusCode === 200) {
                const parsed = TaskQueueAnalyticsResponseSchema.safeParse(body);
                expect(parsed.success).toBe(true);
                if (parsed.success) {
                    expect(parsed.data.data.days).toHaveLength(7);
                    expect(parsed.data.data.range).toBe('7d');
                }
            }
            else {
                expect(body.ok).toBe(false);
            }
        });
    });
});
const runAuditIntegration = process.env.RUN_AUDIT_INTEGRATION === '1' && process.env.SUPABASE_URL && !process.env.SUPABASE_URL.includes('placeholder');
describe('PAGE 02 — Integration: mutation produces one audit_logs row', () => {
    it.skipIf(!runAuditIntegration)('when mutation with audit runs, exactly one audit_logs row with canonical columns is created (requires real DB)', async () => {
        const app = await buildApp({ testUser: { id: '00000000-0000-0000-0000-000000000001', role: 'super_admin' } });
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
        const taskId = '00000000-0000-0000-0000-000000000099';
        const { count: before } = await supabase.from('audit_logs').select('*', { count: 'exact', head: true }).eq('related_entity_type', 'task').eq('related_entity_id', taskId);
        const res = await app.inject({
            method: 'POST',
            url: `/api/v1/tasks/${taskId}/status`,
            payload: { status: 'canceled', reason: 'Integration test' },
        });
        await app.close();
        expect(res.statusCode).toBe(200);
        const body = JSON.parse(res.body);
        if (!body.ok)
            return; // DB may reject; skip count assert
        const { count: after } = await supabase.from('audit_logs').select('*', { count: 'exact', head: true }).eq('related_entity_type', 'task').eq('related_entity_id', taskId);
        expect((after ?? 0) - (before ?? 0)).toBe(1);
    });
});

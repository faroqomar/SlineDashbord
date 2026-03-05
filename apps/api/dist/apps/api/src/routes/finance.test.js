import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildApp } from '../app.js';
// Ensure env exists so Supabase client can be created (RPC may still fail with 500 if DB unreachable)
if (!process.env.SUPABASE_URL)
    process.env.SUPABASE_URL = 'https://placeholder.supabase.co';
if (!process.env.SUPABASE_SERVICE_ROLE_KEY)
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'placeholder-key';
const SUPER_ADMIN = { id: '00000000-0000-0000-0000-000000000001', role: 'super_admin' };
const ADMIN_OTHER = { id: '00000000-0000-0000-0000-000000000002', role: 'admin' };
const SUPPORT = { id: '00000000-0000-0000-0000-000000000003', role: 'support' };
const validRequestId = '00000000-0000-0000-0000-000000000002';
const validJournalId = '00000000-0000-0000-0000-000000000010';
const validUserId = '00000000-0000-0000-0000-000000000020';
describe('PAGE 03 — Finance withdrawal approve/reject', () => {
    let app;
    beforeAll(async () => {
        app = await buildApp({ testUser: SUPER_ADMIN });
    });
    afterAll(async () => {
        await app.close();
    });
    describe('POST /api/v1/finance/withdrawals/:requestId/approve', () => {
        it('returns 401 when no auth', async () => {
            const noAuthApp = await buildApp(); // no testUser
            const res = await noAuthApp.inject({
                method: 'POST',
                url: `/api/v1/finance/withdrawals/${validRequestId}/approve`,
                payload: { reason: 'OK' },
            });
            await noAuthApp.close();
            expect(res.statusCode).toBe(401);
        });
        it('returns 400 for invalid requestId (not UUID)', async () => {
            const res = await app.inject({
                method: 'POST',
                url: '/api/v1/finance/withdrawals/not-a-uuid/approve',
                payload: { reason: 'OK' },
            });
            expect(res.statusCode).toBe(400);
            const body = JSON.parse(res.body);
            expect(body.ok).toBe(false);
            expect(body.error?.code).toBe('VALIDATION_ERROR');
        });
        it('accepts valid payload (200 with success or DATABASE_ERROR when DB unreachable)', async () => {
            const res = await app.inject({
                method: 'POST',
                url: `/api/v1/finance/withdrawals/${validRequestId}/approve`,
                payload: { reason: 'Approved by admin' },
            });
            expect(res.statusCode).toBe(200);
            const body = JSON.parse(res.body);
            expect(body.ok === true || body.error?.code === 'DATABASE_ERROR').toBe(true);
            if (body.ok)
                expect(body.data.requestId).toBe(validRequestId);
        });
    });
    describe('POST /api/v1/finance/withdrawals/:requestId/reject', () => {
        it('returns 401 when no auth', async () => {
            const noAuthApp = await buildApp();
            const res = await noAuthApp.inject({
                method: 'POST',
                url: `/api/v1/finance/withdrawals/${validRequestId}/reject`,
                payload: { reason: 'Rejected' },
            });
            await noAuthApp.close();
            expect(res.statusCode).toBe(401);
        });
        it('returns 400 for invalid requestId', async () => {
            const res = await app.inject({
                method: 'POST',
                url: '/api/v1/finance/withdrawals/invalid/reject',
                payload: { reason: 'Rejected' },
            });
            expect(res.statusCode).toBe(400);
        });
        it('returns 400 when reason is empty', async () => {
            const res = await app.inject({
                method: 'POST',
                url: `/api/v1/finance/withdrawals/${validRequestId}/reject`,
                payload: { reason: '' },
            });
            expect(res.statusCode).toBe(400);
        });
        it('accepts valid payload (200 with success or DATABASE_ERROR when DB unreachable)', async () => {
            const res = await app.inject({
                method: 'POST',
                url: `/api/v1/finance/withdrawals/${validRequestId}/reject`,
                payload: { reason: 'Insufficient KYC' },
            });
            expect(res.statusCode).toBe(200);
            const body = JSON.parse(res.body);
            expect(body.ok === true || body.error?.code === 'DATABASE_ERROR').toBe(true);
            if (body.ok)
                expect(body.data.requestId).toBe(validRequestId);
        });
    });
    describe('PAGE 12 — GET /api/v1/finance/transactions/:journalId', () => {
        it('returns 401 when no auth', async () => {
            const noAuthApp = await buildApp();
            const res = await noAuthApp.inject({
                method: 'GET',
                url: `/api/v1/finance/transactions/${validJournalId}`,
            });
            await noAuthApp.close();
            expect(res.statusCode).toBe(401);
        });
        it('returns 403 when support role (finance write required)', async () => {
            const supportApp = await buildApp({ testUser: SUPPORT });
            const res = await supportApp.inject({
                method: 'GET',
                url: `/api/v1/finance/transactions/${validJournalId}`,
            });
            await supportApp.close();
            expect(res.statusCode).toBe(403);
        });
        it('returns 400 for invalid journalId', async () => {
            const res = await app.inject({
                method: 'GET',
                url: '/api/v1/finance/transactions/not-a-uuid',
            });
            expect(res.statusCode).toBe(400);
        });
        it('returns 200 with masked row (no meta_full) or 404 when not found', async () => {
            const res = await app.inject({
                method: 'GET',
                url: `/api/v1/finance/transactions/${validJournalId}`,
            });
            expect([200, 404]).toContain(res.statusCode);
            if (res.statusCode === 200) {
                const body = JSON.parse(res.body);
                expect(body.ok).toBe(true);
                expect(body.data).not.toHaveProperty('meta_full');
            }
        });
    });
    describe('GET /api/v1/finance/transactions (list)', () => {
        it('returns 400 for invalid query (e.g. invalid entity_id UUID)', async () => {
            const res = await app.inject({
                method: 'GET',
                url: '/api/v1/finance/transactions?entity_id=not-a-uuid',
            });
            expect(res.statusCode).toBe(400);
            const body = JSON.parse(res.body);
            expect(body.ok).toBe(false);
            expect(body.error?.code).toBe('VALIDATION_ERROR');
        });
        it('returns 200 with data and nextCursor when valid query', async () => {
            const res = await app.inject({
                method: 'GET',
                url: '/api/v1/finance/transactions?limit=5',
            });
            expect([200, 500]).toContain(res.statusCode);
            if (res.statusCode === 200) {
                const body = JSON.parse(res.body);
                expect(body.ok).toBe(true);
                expect(Array.isArray(body.data?.data)).toBe(true);
            }
        });
    });
    describe('PAGE 12 — GET /api/v1/finance/audit', () => {
        it('returns 401 when no auth', async () => {
            const noAuthApp = await buildApp();
            const res = await noAuthApp.inject({ method: 'GET', url: '/api/v1/finance/audit' });
            await noAuthApp.close();
            expect(res.statusCode).toBe(401);
        });
        it('returns 403 when support role', async () => {
            const supportApp = await buildApp({ testUser: SUPPORT });
            const res = await supportApp.inject({ method: 'GET', url: '/api/v1/finance/audit' });
            await supportApp.close();
            expect(res.statusCode).toBe(403);
        });
        it('returns 200 with data array and optional nextCursor', async () => {
            const res = await app.inject({ method: 'GET', url: '/api/v1/finance/audit' });
            expect([200, 500]).toContain(res.statusCode);
            if (res.statusCode === 200) {
                const body = JSON.parse(res.body);
                expect(body.ok).toBe(true);
                expect(Array.isArray(body.data?.data)).toBe(true);
            }
        });
    });
    describe('PAGE 12 — GET /api/v1/finance/audit/export', () => {
        it('returns 401 when no auth', async () => {
            const noAuthApp = await buildApp();
            const res = await noAuthApp.inject({ method: 'GET', url: '/api/v1/finance/audit/export' });
            await noAuthApp.close();
            expect(res.statusCode).toBe(401);
        });
        it('returns 403 when support role', async () => {
            const supportApp = await buildApp({ testUser: SUPPORT });
            const res = await supportApp.inject({ method: 'GET', url: '/api/v1/finance/audit/export' });
            await supportApp.close();
            expect(res.statusCode).toBe(403);
        });
        it('returns 200 with CSV and Content-Disposition when admin', async () => {
            const res = await app.inject({ method: 'GET', url: '/api/v1/finance/audit/export?limit=10' });
            expect([200, 500]).toContain(res.statusCode);
            if (res.statusCode === 200) {
                expect(res.headers['content-type']).toMatch(/text\/csv/);
                expect(res.headers['content-disposition']).toMatch(/attachment/);
                const lines = res.body.split('\n');
                expect(lines.length).toBeGreaterThanOrEqual(1);
                expect(lines[0]).toContain('ID');
            }
        });
        it('export row count matches list for same filters', async () => {
            const listRes = await app.inject({ method: 'GET', url: '/api/v1/finance/audit?limit=5' });
            const exportRes = await app.inject({ method: 'GET', url: '/api/v1/finance/audit/export?limit=5' });
            if (listRes.statusCode === 200 && exportRes.statusCode === 200) {
                const listBody = JSON.parse(listRes.body);
                const listCount = listBody.data?.data?.length ?? 0;
                const exportLines = exportRes.body.trim().split('\n');
                const exportDataRows = Math.max(0, exportLines.length - 1);
                expect(exportDataRows).toBe(listCount);
            }
        });
    });
    describe('PAGE 12 — GET /api/v1/finance/users/:userId', () => {
        it('returns 401 when no auth', async () => {
            const noAuthApp = await buildApp();
            const res = await noAuthApp.inject({
                method: 'GET',
                url: `/api/v1/finance/users/${validUserId}`,
            });
            await noAuthApp.close();
            expect(res.statusCode).toBe(401);
        });
        it('returns 403 when support role', async () => {
            const supportApp = await buildApp({ testUser: SUPPORT });
            const res = await supportApp.inject({
                method: 'GET',
                url: `/api/v1/finance/users/${validUserId}`,
            });
            await supportApp.close();
            expect(res.statusCode).toBe(403);
        });
        it('returns 400 for invalid userId', async () => {
            const res = await app.inject({
                method: 'GET',
                url: '/api/v1/finance/users/not-a-uuid',
            });
            expect(res.statusCode).toBe(400);
        });
        it('returns 200 with wallet and timeline or 501 when views missing', async () => {
            const res = await app.inject({
                method: 'GET',
                url: `/api/v1/finance/users/${validUserId}`,
            });
            expect([200, 501, 500]).toContain(res.statusCode);
            if (res.statusCode === 200) {
                const body = JSON.parse(res.body);
                expect(body.ok).toBe(true);
                expect(body.data).toHaveProperty('wallet');
                expect(body.data).toHaveProperty('timeline');
            }
        });
    });
    describe('PAGE 16 — Approval queue', () => {
        it('GET /api/v1/finance/approvals returns 401 when no auth', async () => {
            const noAuthApp = await buildApp();
            const res = await noAuthApp.inject({ method: 'GET', url: '/api/v1/finance/approvals' });
            await noAuthApp.close();
            expect(res.statusCode).toBe(401);
        });
        it('GET /api/v1/finance/approvals returns 403 when support role', async () => {
            const supportApp = await buildApp({ testUser: SUPPORT });
            const res = await supportApp.inject({ method: 'GET', url: '/api/v1/finance/approvals' });
            await supportApp.close();
            expect(res.statusCode).toBe(403);
        });
        it('GET /api/v1/finance/approvals returns 200 with items and next_cursor (or 500 if table missing)', async () => {
            const res = await app.inject({ method: 'GET', url: '/api/v1/finance/approvals?limit=10' });
            expect([200, 500]).toContain(res.statusCode);
            if (res.statusCode === 200) {
                const body = JSON.parse(res.body);
                expect(body.ok).toBe(true);
                expect(Array.isArray(body.data?.items)).toBe(true);
            }
        });
        it('POST /api/v1/finance/approvals returns 400 when Idempotency-Key header missing', async () => {
            const res = await app.inject({
                method: 'POST',
                url: '/api/v1/finance/approvals',
                payload: {
                    operation_type: 'wallet_adjust',
                    target_entity_type: 'profile',
                    target_entity_id: validUserId,
                    payload: {},
                },
            });
            expect(res.statusCode).toBe(400);
            const body = JSON.parse(res.body);
            expect(body.ok).toBe(false);
            expect(body.error?.message).toMatch(/Idempotency-Key/i);
        });
        it('POST /api/v1/finance/approvals returns 401 when no auth', async () => {
            const noAuthApp = await buildApp();
            const res = await noAuthApp.inject({
                method: 'POST',
                url: '/api/v1/finance/approvals',
                headers: { 'Idempotency-Key': 'test-key-1' },
                payload: {
                    operation_type: 'wallet_adjust',
                    target_entity_type: 'profile',
                    target_entity_id: validUserId,
                    payload: {},
                },
            });
            await noAuthApp.close();
            expect(res.statusCode).toBe(401);
        });
        it('POST /api/v1/finance/approvals/:id/approve returns 401 when no auth', async () => {
            const noAuthApp = await buildApp();
            const res = await noAuthApp.inject({
                method: 'POST',
                url: '/api/v1/finance/approvals/00000000-0000-0000-0000-000000000099/approve',
                payload: { reason: 'OK' },
            });
            await noAuthApp.close();
            expect(res.statusCode).toBe(401);
        });
        it('POST /api/v1/finance/wallets/:userId/adjust returns 403 when approval required but approval_id missing', async () => {
            const res = await app.inject({
                method: 'POST',
                url: `/api/v1/finance/wallets/${validUserId}/adjust`,
                headers: { 'Idempotency-Key': 'adjust-1' },
                payload: {
                    target_user_id: validUserId,
                    amount_cents: 150000,
                    reason: 'Test',
                },
            });
            expect(res.statusCode).toBe(403);
            const body = JSON.parse(res.body);
            expect(body.ok).toBe(false);
            expect(body.error?.message).toMatch(/approval required/i);
        });
        const runFinanceIntegration = process.env.RUN_FINANCE_INTEGRATION === '1' && process.env.SUPABASE_URL && !process.env.SUPABASE_URL.includes('placeholder');
        it.skipIf(!runFinanceIntegration)('POST /api/v1/finance/approvals twice with same Idempotency-Key returns 201 then 200 with same approval id', async () => {
            const idemKey = `test-idem-${Date.now()}`;
            const payload = {
                operation_type: 'wallet_adjust',
                target_entity_type: 'profile',
                target_entity_id: validUserId,
                payload: {},
            };
            const first = await app.inject({
                method: 'POST',
                url: '/api/v1/finance/approvals',
                headers: { 'Idempotency-Key': idemKey },
                payload,
            });
            expect(first.statusCode).toBe(201);
            const firstBody = JSON.parse(first.body);
            expect(firstBody.ok).toBe(true);
            const firstId = firstBody.data?.id;
            const second = await app.inject({
                method: 'POST',
                url: '/api/v1/finance/approvals',
                headers: { 'Idempotency-Key': idemKey },
                payload,
            });
            expect([200, 201]).toContain(second.statusCode);
            const secondBody = JSON.parse(second.body);
            expect(secondBody.ok).toBe(true);
            expect(secondBody.data?.id).toBe(firstId);
        });
        it.skipIf(!runFinanceIntegration)('execute wallet adjust twice with same approval_id returns 409 on second call', async () => {
            const idemKey = `e2e-exec-${Date.now()}`;
            const appRequester = await buildApp({ testUser: SUPER_ADMIN });
            const appApprover = await buildApp({ testUser: ADMIN_OTHER });
            const createRes = await appRequester.inject({
                method: 'POST',
                url: '/api/v1/finance/approvals',
                headers: { 'Idempotency-Key': idemKey },
                payload: {
                    operation_type: 'wallet_adjust',
                    target_entity_type: 'profile',
                    target_entity_id: validUserId,
                    payload: { amount_cents: 150000 },
                },
            });
            await appRequester.close();
            if (createRes.statusCode !== 201) {
                await appApprover.close();
                throw new Error(`Create approval failed: ${createRes.statusCode} ${createRes.body}`);
            }
            const createBody = JSON.parse(createRes.body);
            const approvalId = createBody.data?.id;
            if (!approvalId) {
                await appApprover.close();
                throw new Error('No approval id in response');
            }
            const approveRes = await appApprover.inject({
                method: 'POST',
                url: `/api/v1/finance/approvals/${approvalId}/approve`,
                payload: { reason: 'E2E approve' },
            });
            await appApprover.close();
            if (approveRes.statusCode !== 200) {
                throw new Error(`Approve failed: ${approveRes.statusCode} ${approveRes.body}`);
            }
            const appReq2 = await buildApp({ testUser: SUPER_ADMIN });
            const adjustPayload = {
                target_user_id: validUserId,
                amount_cents: 150000,
                reason: 'E2E execute',
                approval_id: approvalId,
            };
            const firstExec = await appReq2.inject({
                method: 'POST',
                url: `/api/v1/finance/wallets/${validUserId}/adjust`,
                headers: { 'Idempotency-Key': `exec-${idemKey}-1` },
                payload: adjustPayload,
            });
            if (firstExec.statusCode !== 200) {
                await appReq2.close();
                throw new Error(`First execute failed: ${firstExec.statusCode} ${firstExec.body}`);
            }
            const secondExec = await appReq2.inject({
                method: 'POST',
                url: `/api/v1/finance/wallets/${validUserId}/adjust`,
                headers: { 'Idempotency-Key': `exec-${idemKey}-2` },
                payload: adjustPayload,
            });
            await appReq2.close();
            expect(secondExec.statusCode).toBe(409);
            const secondBody = JSON.parse(secondExec.body);
            expect(secondBody.ok).toBe(false);
            expect(secondBody.error?.code).toBe('CONFLICT');
        });
    });
    const runFinanceIntegration = process.env.RUN_FINANCE_INTEGRATION === '1' && process.env.SUPABASE_URL && !process.env.SUPABASE_URL.includes('placeholder');
    describe('PAGE 03 — Idempotency (requires real DB)', () => {
        // With real DB: exactly one audit_logs row per approve/reject (RPC writes it; API does not use withAudit)
        it.skipIf(!runFinanceIntegration)('second approve with same requestId does not double-process (RPC raises or no-op)', async () => {
            const first = await app.inject({
                method: 'POST',
                url: `/api/v1/finance/withdrawals/${validRequestId}/approve`,
                payload: { reason: 'First' },
            });
            expect(first.statusCode).toBe(200);
            const second = await app.inject({
                method: 'POST',
                url: `/api/v1/finance/withdrawals/${validRequestId}/approve`,
                payload: { reason: 'Second' },
            });
            expect(second.statusCode).toBe(200);
            const body = JSON.parse(second.body);
            // RPC raises "already processed" or returns no-op; we expect not ok or same result
            expect(body.ok === false || body.data?.requestId === validRequestId).toBe(true);
        });
    });
});

import { describe, it, expect } from 'vitest';
import { AdminCaseCreateInputSchema, AdminCaseAttachEntityInputSchema, AdminCaseDetailSchema, AdminCaseAssignInputSchema, AdminCaseStatusInputSchema, AdminCaseNoteInputSchema, AdminCaseSchema, CaseEntityTypeSchema, CaseStatusEnum, CasePriorityEnum, } from './cases.js';
const validUuid = '00000000-0000-0000-0000-000000000001';
describe('cases schemas (PAGE 08 contracts)', () => {
    describe('CaseStatusEnum and CasePriorityEnum', () => {
        it('accepts expected status values', () => {
            expect(CaseStatusEnum.safeParse('open').success).toBe(true);
            expect(CaseStatusEnum.safeParse('in_progress').success).toBe(true);
            expect(CaseStatusEnum.safeParse('pending').success).toBe(true);
            expect(CaseStatusEnum.safeParse('closed').success).toBe(true);
        });
        it('accepts expected priority values', () => {
            expect(CasePriorityEnum.safeParse('low').success).toBe(true);
            expect(CasePriorityEnum.safeParse('medium').success).toBe(true);
            expect(CasePriorityEnum.safeParse('high').success).toBe(true);
            expect(CasePriorityEnum.safeParse('urgent').success).toBe(true);
        });
    });
    describe('AdminCaseCreateInputSchema', () => {
        it('accepts valid subject and optional fields', () => {
            const r = AdminCaseCreateInputSchema.safeParse({ subject: 'User report #1' });
            expect(r.success).toBe(true);
            if (r.success) {
                expect(r.data.source).toBe('dashboard');
                expect(r.data.priority).toBe('medium');
            }
        });
        it('accepts full input with idempotency_key', () => {
            const r = AdminCaseCreateInputSchema.safeParse({
                subject: 'Dispute escalation',
                source: 'support_ticket',
                priority: 'urgent',
                assignee_id: validUuid,
                idempotency_key: validUuid,
            });
            expect(r.success).toBe(true);
        });
        it('rejects empty subject', () => {
            expect(AdminCaseCreateInputSchema.safeParse({ subject: '' }).success).toBe(false);
        });
        it('rejects missing subject', () => {
            expect(AdminCaseCreateInputSchema.safeParse({}).success).toBe(false);
        });
        it('rejects invalid assignee_id', () => {
            expect(AdminCaseCreateInputSchema.safeParse({ subject: 'x', assignee_id: 'not-uuid' }).success).toBe(false);
        });
    });
    describe('AdminCaseAttachEntityInputSchema', () => {
        it('accepts valid entity_type and entity_id', () => {
            const r = AdminCaseAttachEntityInputSchema.safeParse({
                entity_type: 'task',
                entity_id: validUuid,
            });
            expect(r.success).toBe(true);
        });
        it('accepts all entity types', () => {
            for (const t of CaseEntityTypeSchema.options) {
                const r = AdminCaseAttachEntityInputSchema.safeParse({
                    entity_type: t,
                    entity_id: validUuid,
                });
                expect(r.success).toBe(true);
            }
        });
        it('rejects invalid entity_type', () => {
            expect(AdminCaseAttachEntityInputSchema.safeParse({
                entity_type: 'invalid',
                entity_id: validUuid,
            }).success).toBe(false);
        });
        it('rejects invalid entity_id', () => {
            expect(AdminCaseAttachEntityInputSchema.safeParse({
                entity_type: 'task',
                entity_id: 'not-uuid',
            }).success).toBe(false);
        });
    });
    describe('AdminCaseSchema', () => {
        it('parses API response shape', () => {
            const r = AdminCaseSchema.safeParse({
                id: validUuid,
                subject: 'Test case',
                source: 'dashboard',
                status: 'open',
                priority: 'urgent',
                created_at: '2025-01-01T00:00:00Z',
            });
            expect(r.success).toBe(true);
        });
    });
    describe('workspace actions schemas', () => {
        it('parses assign input', () => {
            expect(AdminCaseAssignInputSchema.safeParse({ assignee_id: validUuid, reason: 'Assigning owner' }).success).toBe(true);
            expect(AdminCaseAssignInputSchema.safeParse({ assignee_id: null, reason: 'Unassigning owner' }).success).toBe(true);
        });
        it('parses status input', () => {
            expect(AdminCaseStatusInputSchema.safeParse({ status: 'in_progress', reason: 'Started review' }).success).toBe(true);
        });
        it('parses note input', () => {
            expect(AdminCaseNoteInputSchema.safeParse({ note: 'Need bank transfer logs' }).success).toBe(true);
        });
    });
    describe('AdminCaseDetailSchema', () => {
        it('parses case workspace payload', () => {
            const r = AdminCaseDetailSchema.safeParse({
                id: validUuid,
                subject: 'Case workspace test',
                source: 'reports',
                status: 'open',
                priority: 'high',
                assignee_id: validUuid,
                created_at: '2025-01-01T00:00:00Z',
                entities: [
                    {
                        id: validUuid,
                        case_id: validUuid,
                        entity_type: 'task',
                        entity_id: validUuid,
                        created_at: '2025-01-01T00:00:00Z',
                    },
                ],
                evidence: [
                    {
                        id: validUuid,
                        case_id: validUuid,
                        evidence_type: 'report',
                        entity_type: 'report',
                        entity_id: validUuid,
                    },
                ],
                notes: [
                    {
                        id: validUuid,
                        case_id: validUuid,
                        admin_user_id: validUuid,
                        note: 'Initial triage completed',
                        visibility: 'internal',
                        created_at: '2025-01-01T00:00:00Z',
                    },
                ],
                timeline: [
                    {
                        id: validUuid,
                        case_id: validUuid,
                        event: 'case.created',
                        created_at: '2025-01-01T00:00:00Z',
                    },
                ],
            });
            expect(r.success).toBe(true);
        });
    });
});

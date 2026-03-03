import { describe, it, expect } from 'vitest';
import { ReportEntityTypeEnum, ReportStatusEnum, TriageActionEnum, TriageReportInputSchema, CloseReportInputSchema, ListReportsQuerySchema, ReportListItemSchema, ReportDetailSchema, } from './reports.js';
const validUuid = '00000000-0000-0000-0000-000000000001';
describe('reports schemas (PAGE 10 contracts)', () => {
    describe('ReportEntityTypeEnum', () => {
        it('accepts task, user, chat', () => {
            expect(ReportEntityTypeEnum.safeParse('task').success).toBe(true);
            expect(ReportEntityTypeEnum.safeParse('user').success).toBe(true);
            expect(ReportEntityTypeEnum.safeParse('chat').success).toBe(true);
        });
        it('rejects invalid entity type', () => {
            expect(ReportEntityTypeEnum.safeParse('booking').success).toBe(false);
        });
    });
    describe('ReportStatusEnum', () => {
        it('accepts open, triaged, closed', () => {
            expect(ReportStatusEnum.safeParse('open').success).toBe(true);
            expect(ReportStatusEnum.safeParse('triaged').success).toBe(true);
            expect(ReportStatusEnum.safeParse('closed').success).toBe(true);
        });
    });
    describe('TriageActionEnum', () => {
        it('accepts dismiss, warn_user, escalate, close', () => {
            expect(TriageActionEnum.safeParse('dismiss').success).toBe(true);
            expect(TriageActionEnum.safeParse('warn_user').success).toBe(true);
            expect(TriageActionEnum.safeParse('escalate').success).toBe(true);
            expect(TriageActionEnum.safeParse('close').success).toBe(true);
        });
    });
    describe('TriageReportInputSchema', () => {
        it('accepts valid action and reason', () => {
            const r = TriageReportInputSchema.safeParse({ action: 'dismiss', reason: 'No violation' });
            expect(r.success).toBe(true);
        });
        it('rejects empty reason', () => {
            expect(TriageReportInputSchema.safeParse({ action: 'dismiss', reason: '' }).success).toBe(false);
        });
        it('rejects invalid action', () => {
            expect(TriageReportInputSchema.safeParse({ action: 'invalid', reason: 'x' }).success).toBe(false);
        });
    });
    describe('CloseReportInputSchema', () => {
        it('accepts valid reason', () => {
            expect(CloseReportInputSchema.safeParse({ reason: 'Resolved' }).success).toBe(true);
        });
        it('rejects empty reason', () => {
            expect(CloseReportInputSchema.safeParse({ reason: '' }).success).toBe(false);
        });
    });
    describe('ListReportsQuerySchema', () => {
        it('accepts empty query with defaults', () => {
            const r = ListReportsQuerySchema.safeParse({});
            expect(r.success).toBe(true);
            if (r.success) {
                expect(r.data.page).toBe(1);
                expect(r.data.limit).toBe(20);
            }
        });
        it('accepts status and entity_type filters', () => {
            const r = ListReportsQuerySchema.safeParse({ status: 'open', entity_type: 'task' });
            expect(r.success).toBe(true);
        });
        it('rejects limit > 100', () => {
            expect(ListReportsQuerySchema.safeParse({ limit: 101 }).success).toBe(false);
        });
    });
    describe('ReportListItemSchema', () => {
        it('parses valid list item', () => {
            const item = {
                id: validUuid,
                reporter_user_id: validUuid,
                entity_type: 'task',
                entity_id: validUuid,
                status: 'open',
                created_at: '2025-01-01T00:00:00Z',
                updated_at: '2025-01-01T00:00:00Z',
            };
            expect(ReportListItemSchema.safeParse(item).success).toBe(true);
        });
    });
    describe('ReportDetailSchema', () => {
        it('parses valid detail with actions', () => {
            const detail = {
                id: validUuid,
                reporter_user_id: validUuid,
                entity_type: 'user',
                entity_id: validUuid,
                status: 'triaged',
                created_at: '2025-01-01T00:00:00Z',
                updated_at: '2025-01-01T00:00:00Z',
                actions: [
                    {
                        id: validUuid,
                        report_id: validUuid,
                        admin_user_id: validUuid,
                        action: 'dismiss',
                        reason: 'No violation',
                        created_at: '2025-01-01T01:00:00Z',
                    },
                ],
            };
            expect(ReportDetailSchema.safeParse(detail).success).toBe(true);
        });
    });
});

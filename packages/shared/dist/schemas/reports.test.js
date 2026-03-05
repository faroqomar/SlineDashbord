import { describe, it, expect } from 'vitest';
import { ReportEntityTypeEnum, ReportStatusEnum, ReportResolutionEnum, ReportSeverityEnum, TriageActionEnum, DismissReportInputSchema, EscalateReportInputSchema, TriageReportInputSchema, CloseReportInputSchema, ListReportsQuerySchema, ReportListItemSchema, ReportDetailSchema, } from './reports.js';
const validUuid = '00000000-0000-0000-0000-000000000001';
describe('reports schemas (PAGE 10 contracts)', () => {
    describe('ReportEntityTypeEnum', () => {
        it('accepts task, user, chat, booking', () => {
            expect(ReportEntityTypeEnum.safeParse('task').success).toBe(true);
            expect(ReportEntityTypeEnum.safeParse('user').success).toBe(true);
            expect(ReportEntityTypeEnum.safeParse('chat').success).toBe(true);
            expect(ReportEntityTypeEnum.safeParse('booking').success).toBe(true);
        });
    });
    describe('ReportStatusEnum', () => {
        it('accepts open, triaged, escalated, closed', () => {
            expect(ReportStatusEnum.safeParse('open').success).toBe(true);
            expect(ReportStatusEnum.safeParse('triaged').success).toBe(true);
            expect(ReportStatusEnum.safeParse('escalated').success).toBe(true);
            expect(ReportStatusEnum.safeParse('closed').success).toBe(true);
        });
    });
    describe('ReportSeverityEnum', () => {
        it('accepts low, medium, high, critical', () => {
            expect(ReportSeverityEnum.safeParse('low').success).toBe(true);
            expect(ReportSeverityEnum.safeParse('medium').success).toBe(true);
            expect(ReportSeverityEnum.safeParse('high').success).toBe(true);
            expect(ReportSeverityEnum.safeParse('critical').success).toBe(true);
        });
    });
    describe('ReportResolutionEnum', () => {
        it('accepts dismissed/resolved/case_opened/case_attached', () => {
            expect(ReportResolutionEnum.safeParse('dismissed').success).toBe(true);
            expect(ReportResolutionEnum.safeParse('resolved').success).toBe(true);
            expect(ReportResolutionEnum.safeParse('case_opened').success).toBe(true);
            expect(ReportResolutionEnum.safeParse('case_attached').success).toBe(true);
        });
    });
    describe('TriageActionEnum', () => {
        it('accepts dismiss, warn_user, escalate, close, close_resolved', () => {
            expect(TriageActionEnum.safeParse('dismiss').success).toBe(true);
            expect(TriageActionEnum.safeParse('warn_user').success).toBe(true);
            expect(TriageActionEnum.safeParse('escalate').success).toBe(true);
            expect(TriageActionEnum.safeParse('close').success).toBe(true);
            expect(TriageActionEnum.safeParse('close_resolved').success).toBe(true);
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
        it('accepts explicit resolution', () => {
            expect(CloseReportInputSchema.safeParse({ reason: 'No violation', resolution: 'dismissed' }).success).toBe(true);
        });
        it('rejects empty reason', () => {
            expect(CloseReportInputSchema.safeParse({ reason: '' }).success).toBe(false);
        });
    });
    describe('DismissReportInputSchema', () => {
        it('accepts valid reason', () => {
            expect(DismissReportInputSchema.safeParse({ reason: 'Duplicate report' }).success).toBe(true);
        });
        it('rejects empty reason', () => {
            expect(DismissReportInputSchema.safeParse({ reason: '' }).success).toBe(false);
        });
    });
    describe('EscalateReportInputSchema', () => {
        it('accepts reason only', () => {
            expect(EscalateReportInputSchema.safeParse({ reason: 'Requires deeper review' }).success).toBe(true);
        });
        it('accepts optional case and assignee fields', () => {
            expect(EscalateReportInputSchema.safeParse({
                reason: 'Attach to existing case',
                case_id: validUuid,
                assignee_id: validUuid,
                priority: 'high',
            }).success).toBe(true);
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
        it('accepts severity and assignment filters', () => {
            const r = ListReportsQuerySchema.safeParse({ severity: 'critical', assigned_to_me: true, assigned_admin_id: validUuid });
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
                severity: 'high',
                resolution: 'case_opened',
                case_id: validUuid,
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
                severity: 'critical',
                resolution: 'case_attached',
                case_id: validUuid,
                created_at: '2025-01-01T00:00:00Z',
                updated_at: '2025-01-01T00:00:00Z',
                actions: [
                    {
                        id: validUuid,
                        report_id: validUuid,
                        admin_user_id: validUuid,
                        action: 'dismiss',
                        reason: 'No violation',
                        status_after: 'closed',
                        resolution: 'dismissed',
                        case_id: validUuid,
                        created_at: '2025-01-01T01:00:00Z',
                    },
                ],
                timeline: [
                    {
                        id: validUuid,
                        event: 'report.escalated',
                        created_at: '2025-01-01T01:00:00Z',
                    },
                ],
            };
            expect(ReportDetailSchema.safeParse(detail).success).toBe(true);
        });
    });
});

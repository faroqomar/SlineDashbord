import { z } from 'zod';
const uuid = z.string().uuid();
const uuidOptional = z.string().uuid().optional();
/** Entity type that can be reported. */
export const ReportEntityTypeEnum = z.enum(['task', 'user', 'chat', 'booking']);
/** Report queue status. */
export const ReportStatusEnum = z.enum(['open', 'triaged', 'escalated', 'closed']);
/** Report severity used for queue prioritization. */
export const ReportSeverityEnum = z.enum(['low', 'medium', 'high', 'critical']);
/** Final resolution once report closes or is escalated. */
export const ReportResolutionEnum = z.enum([
    'dismissed',
    'resolved',
    'case_opened',
    'case_attached',
]);
/**
 * Backward-compatible triage action enum.
 * Keep legacy actions while introducing close_resolved semantics.
 */
export const TriageActionEnum = z.enum([
    'dismiss',
    'warn_user',
    'escalate',
    'close',
    'close_resolved',
]);
/** Explicit moderation actions used by dedicated endpoints. */
export const ReportDecisionActionEnum = z.enum(['dismiss', 'escalate', 'close_resolved']);
/** Lightweight reporter summary for list/detail contexts. */
export const ReportReporterSummarySchema = z.object({
    user_id: uuid.optional().nullable(),
    full_name: z.string().optional().nullable(),
    username: z.string().optional().nullable(),
    avatar_url: z.string().optional().nullable(),
    trust_level: z.string().optional().nullable(),
    valid_reports_count: z.number().int().nonnegative().optional(),
    total_reports_count: z.number().int().nonnegative().optional(),
    relationship_to_entity: z.string().optional().nullable(),
});
/** Lightweight entity summary for decision-ready report views. */
export const ReportEntitySummarySchema = z.object({
    entity_type: ReportEntityTypeEnum,
    title: z.string().optional().nullable(),
    subtitle: z.string().optional().nullable(),
    status: z.string().optional().nullable(),
    avatar_url: z.string().optional().nullable(),
    participants: z.array(z.string()).optional(),
    link_hint: z.string().optional().nullable(),
    meta: z.record(z.unknown()).optional().default({}),
});
/** Timeline entry for report lifecycle/history view. */
export const ReportTimelineItemSchema = z.object({
    id: uuid,
    event: z.string(),
    actor_user_id: z.string().uuid().nullable().optional(),
    actor_name: z.string().nullable().optional(),
    reason: z.string().nullable().optional(),
    created_at: z.string(),
    meta: z.record(z.unknown()).optional().default({}),
});
/** Single report row (DB shape). */
export const ReportRowSchema = z.object({
    id: uuid,
    reporter_user_id: z.string().uuid().nullable(),
    entity_type: ReportEntityTypeEnum,
    entity_id: uuid,
    reason: z.string().optional(),
    category: z.string().optional(),
    status: ReportStatusEnum,
    severity: ReportSeverityEnum.optional().nullable(),
    resolution: ReportResolutionEnum.optional().nullable(),
    case_id: uuidOptional.nullable(),
    assigned_admin_id: uuidOptional.nullable(),
    sla_due_at: z.string().optional().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
    meta: z.record(z.unknown()).optional().default({}),
});
/** Single report action (admin triage/close) row. */
export const ReportActionRowSchema = z.object({
    id: uuid,
    report_id: uuid,
    admin_user_id: uuid,
    action: z.string(),
    reason: z.string().optional().nullable(),
    case_id: uuidOptional.nullable(),
    resolution: ReportResolutionEnum.optional().nullable(),
    status_after: ReportStatusEnum.optional(),
    created_at: z.string(),
});
/** List item for GET /reports response. */
export const ReportListItemSchema = z.object({
    id: uuid,
    reporter_user_id: z.string().uuid().nullable(),
    entity_type: ReportEntityTypeEnum,
    entity_id: uuid,
    reason: z.string().optional().nullable(),
    category: z.string().optional().nullable(),
    status: ReportStatusEnum,
    severity: ReportSeverityEnum.optional().nullable(),
    resolution: ReportResolutionEnum.optional().nullable(),
    case_id: uuidOptional.nullable(),
    assigned_admin_id: uuidOptional.nullable(),
    sla_due_at: z.string().optional().nullable(),
    reporter: ReportReporterSummarySchema.optional(),
    entity: ReportEntitySummarySchema.optional(),
    created_at: z.string(),
    updated_at: z.string(),
});
/** Detail for GET /reports/:reportId (report + actions). */
export const ReportDetailSchema = z.object({
    id: uuid,
    reporter_user_id: z.string().uuid().nullable(),
    entity_type: ReportEntityTypeEnum,
    entity_id: uuid,
    reason: z.string().optional().nullable(),
    category: z.string().optional().nullable(),
    status: ReportStatusEnum,
    severity: ReportSeverityEnum.optional().nullable(),
    resolution: ReportResolutionEnum.optional().nullable(),
    case_id: uuidOptional.nullable(),
    assigned_admin_id: uuidOptional.nullable(),
    sla_due_at: z.string().optional().nullable(),
    reporter: ReportReporterSummarySchema.optional(),
    entity: ReportEntitySummarySchema.optional(),
    evidence: z.array(z.record(z.unknown())).default([]),
    timeline: z.array(ReportTimelineItemSchema).default([]),
    created_at: z.string(),
    updated_at: z.string(),
    meta: z.record(z.unknown()).optional().nullable(),
    actions: z.array(ReportActionRowSchema).default([]),
});
/** Query params for GET /reports list. */
export const ListReportsQuerySchema = z.object({
    status: ReportStatusEnum.optional(),
    entity_type: ReportEntityTypeEnum.optional(),
    severity: ReportSeverityEnum.optional(),
    assigned_admin_id: z.string().uuid().optional(),
    assigned_to_me: z.coerce.boolean().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
});
/** Body for POST /reports/:reportId/triage */
export const TriageReportInputSchema = z.object({
    action: TriageActionEnum,
    reason: z.string().min(1, 'Reason is required for triage'),
    case_id: z.string().uuid().optional(),
});
/** Body for POST /reports/:reportId/close */
export const CloseReportInputSchema = z.object({
    reason: z.string().min(1, 'Reason is required to close'),
    resolution: z.enum(['resolved', 'dismissed']).default('resolved'),
});
/** Body for POST /reports/:reportId/dismiss */
export const DismissReportInputSchema = z.object({
    reason: z.string().min(1, 'Reason is required to dismiss'),
});
/** Body for POST /reports/:reportId/escalate */
export const EscalateReportInputSchema = z.object({
    reason: z.string().min(1, 'Reason is required to escalate'),
    case_id: z.string().uuid().optional(),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
    assignee_id: z.string().uuid().optional(),
});
/** Generic ack payload for report mutations. */
export const ReportMutationAckSchema = z.object({
    id: uuid,
    status: ReportStatusEnum.optional(),
    resolution: ReportResolutionEnum.optional().nullable(),
    case_id: z.string().uuid().optional(),
});
export const ListReportsResponseSchema = z.object({
    reports: z.array(ReportListItemSchema),
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
});
/** Roles allowed to read reports (list/detail). */
export const REPORTS_READ_ROLES = ['support', 'moderator', 'admin', 'super_admin'];
/** Roles allowed to triage/close reports. */
export const REPORTS_WRITE_ROLES = ['moderator', 'admin', 'super_admin'];

import { z } from 'zod';
const uuid = z.string().uuid();
/** Case id for case-gated operations (e.g. chat access). */
export const CaseIdSchema = z.string().uuid();
/** Entity types that can be attached to a case. */
export const CaseEntityTypeSchema = z.enum(['task', 'user', 'conversation', 'booking', 'dispute', 'report']);
/** Case workflow statuses. */
export const CaseStatusEnum = z.enum(['open', 'in_progress', 'pending', 'closed']);
/** Case priority levels. */
export const CasePriorityEnum = z.enum(['low', 'medium', 'high', 'urgent']);
/** Minimal case reference for API responses. */
export const AdminCaseRefSchema = z.object({
    id: uuid,
    subject: z.string().nullable().optional(),
    status: z.union([CaseStatusEnum, z.string()]).optional(),
});
/** Case as returned by API (PAGE 08). */
export const AdminCaseSchema = z.object({
    id: uuid,
    subject: z.string(),
    source: z.string().optional(),
    status: z.union([CaseStatusEnum, z.string()]).optional(),
    priority: z.union([CasePriorityEnum, z.string()]).optional(),
    case_code: z.string().optional(),
    links_count: z.number().int().nonnegative().optional(),
    created_at: z.string(),
    updated_at: z.string().optional(),
    assignee_id: z.string().uuid().nullable().optional(),
    assignee_name: z.string().nullable().optional(),
    severity: z.enum(['low', 'medium', 'high', 'critical']).optional().nullable(),
    sla_due_at: z.string().nullable().optional(),
    tags: z.array(z.string()).optional(),
});
/** Create case input (PAGE 08). */
export const AdminCaseCreateInputSchema = z.object({
    subject: z.string().min(1, 'Subject is required').max(500),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
    source: z.string().max(100).default('dashboard'),
    assignee_id: uuid.optional(),
    idempotency_key: uuid.optional(),
});
/** Attach entity to case input. */
export const AdminCaseAttachEntityInputSchema = z.object({
    entity_type: CaseEntityTypeSchema,
    entity_id: uuid,
});
/** Safe query contract for server-side list filtering/sorting. */
export const AdminCasesListQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    q: z.string().trim().max(200).optional(),
    status: z.enum(['all', 'open', 'in_progress', 'escalated', 'closed']).default('all'),
    priority: z.enum(['all', 'low', 'medium', 'high', 'critical']).default('all'),
    source: z.string().trim().max(100).default('all'),
    sort: z.enum(['created_desc', 'created_asc']).default('created_desc'),
});
/** List response for GET /cases */
export const AdminCaseListResponseSchema = z.object({
    cases: z.array(AdminCaseSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number().optional(),
});
/** Query string for hero analytics chart. */
export const AdminCasesAnalyticsQuerySchema = z.object({
    window: z.enum(['7d']).default('7d'),
});
/** Single analytics point for a day bucket. */
export const AdminCasesAnalyticsPointSchema = z.object({
    bucket_start: z.string().datetime({ offset: true }),
    value: z.number().int().nonnegative(),
});
/** KPI ids rendered on the cases page cards. */
export const AdminCasesKpiIdSchema = z.enum(['total', 'open', 'in_progress', 'escalated']);
/** KPI trend directions for visual indicators. */
export const AdminCasesKpiTrendSchema = z.enum(['up', 'down', 'neutral']);
/** Live KPI trend payload used by Cases KPI cards. */
export const AdminCasesKpiItemSchema = z.object({
    id: AdminCasesKpiIdSchema,
    value: z.number().int().nonnegative(),
    delta: z.string(),
    trend: AdminCasesKpiTrendSchema,
    sparkline: z.array(z.number().int().nonnegative()).length(7),
});
/** Hero chart payload for opened vs closed cases. */
export const AdminCasesHeroSeriesSchema = z.object({
    window: z.literal('7d'),
    opened: z.array(AdminCasesAnalyticsPointSchema).length(7),
    closed: z.array(AdminCasesAnalyticsPointSchema).length(7),
    kpis: z.array(AdminCasesKpiItemSchema).length(4),
    is_stale: z.boolean().optional(),
    generated_at: z.string().datetime({ offset: true }).optional(),
});
/** Attached entity row in case detail. */
export const AdminCaseEntitySchema = z.object({
    id: uuid,
    case_id: uuid,
    entity_type: CaseEntityTypeSchema,
    entity_id: uuid,
    label: z.string().optional().nullable(),
    meta: z.record(z.unknown()).optional().default({}),
    created_at: z.string().optional(),
});
/** Case note visibility. */
export const CaseNoteVisibilityEnum = z.enum(['internal', 'system']);
/** Case note item. */
export const AdminCaseNoteSchema = z.object({
    id: uuid,
    case_id: uuid,
    admin_user_id: uuid,
    note: z.string(),
    visibility: CaseNoteVisibilityEnum.default('internal'),
    created_at: z.string(),
    updated_at: z.string().optional(),
});
/** Evidence linked to a case (reports, chats, bookings, etc.). */
export const AdminCaseEvidenceSchema = z.object({
    id: uuid,
    case_id: uuid,
    evidence_type: z.string(),
    entity_type: z.string(),
    entity_id: uuid,
    title: z.string().nullable().optional(),
    created_at: z.string().optional(),
    meta: z.record(z.unknown()).optional().default({}),
});
/** Timeline event emitted while case lifecycle changes. */
export const AdminCaseTimelineItemSchema = z.object({
    id: uuid,
    case_id: uuid,
    event: z.string(),
    actor_user_id: uuid.nullable().optional(),
    reason: z.string().nullable().optional(),
    created_at: z.string(),
    meta: z.record(z.unknown()).optional().default({}),
});
/** Case detail (case + entities + workspace details). */
export const AdminCaseDetailSchema = AdminCaseSchema.extend({
    entities: z.array(AdminCaseEntitySchema).default([]),
    evidence: z.array(AdminCaseEvidenceSchema).default([]),
    notes: z.array(AdminCaseNoteSchema).default([]),
    timeline: z.array(AdminCaseTimelineItemSchema).default([]),
});
/** Assign case input. */
export const AdminCaseAssignInputSchema = z.object({
    assignee_id: z.string().uuid().nullable(),
    reason: z.string().min(1, 'Reason is required'),
});
/** Status transition input. */
export const AdminCaseStatusInputSchema = z.object({
    status: CaseStatusEnum,
    reason: z.string().min(1, 'Reason is required'),
});
/** Add note input. */
export const AdminCaseNoteInputSchema = z.object({
    note: z.string().min(1, 'Note is required').max(4000),
    visibility: CaseNoteVisibilityEnum.default('internal'),
});
/** Roles allowed to read/write cases. */
export const CASES_ROLES = ['support', 'moderator', 'admin', 'super_admin'];
export const CASES_WRITE_ROLES = ['moderator', 'admin', 'super_admin'];
export const CASES_DESTRUCTIVE_ROLES = ['admin', 'super_admin'];

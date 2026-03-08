import { z } from 'zod';

const uuid = z.string().uuid();
const uuidOptional = z.string().uuid().optional();

/** Entity type that can be reported. */
export const ReportEntityTypeEnum = z.enum(['task', 'user', 'chat', 'booking']);
export type ReportEntityType = z.infer<typeof ReportEntityTypeEnum>;

/** Report queue status. */
export const ReportStatusEnum = z.enum(['open', 'triaged', 'escalated', 'closed']);
export type ReportStatus = z.infer<typeof ReportStatusEnum>;

/** Report severity used for queue prioritization. */
export const ReportSeverityEnum = z.enum(['low', 'medium', 'high', 'critical']);
export type ReportSeverity = z.infer<typeof ReportSeverityEnum>;

/** Final resolution once report closes or is escalated. */
export const ReportResolutionEnum = z.enum([
  'dismissed',
  'resolved',
  'case_opened',
  'case_attached',
]);
export type ReportResolution = z.infer<typeof ReportResolutionEnum>;

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
export type TriageAction = z.infer<typeof TriageActionEnum>;

/** Explicit moderation actions used by dedicated endpoints. */
export const ReportDecisionActionEnum = z.enum(['dismiss', 'escalate', 'close_resolved']);
export type ReportDecisionAction = z.infer<typeof ReportDecisionActionEnum>;

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
export type ReportReporterSummary = z.infer<typeof ReportReporterSummarySchema>;

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
export type ReportEntitySummary = z.infer<typeof ReportEntitySummarySchema>;

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
export type ReportTimelineItem = z.infer<typeof ReportTimelineItemSchema>;

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
export type ReportRow = z.infer<typeof ReportRowSchema>;

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
export type ReportActionRow = z.infer<typeof ReportActionRowSchema>;

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
export type ReportListItem = z.infer<typeof ReportListItemSchema>;

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
export type ReportDetail = z.infer<typeof ReportDetailSchema>;

/** Query params for GET /reports list. */
export const ListReportsQuerySchema = z.object({
  status: ReportStatusEnum.optional(),
  entity_type: ReportEntityTypeEnum.optional(),
  severity: ReportSeverityEnum.optional(),
  assigned_admin_id: z.string().uuid().optional(),
  assigned_to_me: z.coerce.boolean().optional(),
  q: z
    .string()
    .trim()
    .min(2, 'Search query must be at least 2 characters')
    .max(80, 'Search query is too long')
    .regex(/^[a-zA-Z0-9 _.:@#-]+$/, 'Search query contains unsupported characters')
    .optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
export type ListReportsQuery = z.infer<typeof ListReportsQuerySchema>;

/** Body for POST /reports/:reportId/triage */
export const TriageReportInputSchema = z.object({
  action: TriageActionEnum,
  reason: z.string().min(1, 'Reason is required for triage'),
  case_id: z.string().uuid().optional(),
});
export type TriageReportInput = z.infer<typeof TriageReportInputSchema>;

/** Body for POST /reports/:reportId/close */
export const CloseReportInputSchema = z.object({
  reason: z.string().min(1, 'Reason is required to close'),
  resolution: z.enum(['resolved', 'dismissed']).default('resolved'),
});
export type CloseReportInput = z.infer<typeof CloseReportInputSchema>;

/** Body for POST /reports/:reportId/dismiss */
export const DismissReportInputSchema = z.object({
  reason: z.string().min(1, 'Reason is required to dismiss'),
});
export type DismissReportInput = z.infer<typeof DismissReportInputSchema>;

/** Body for POST /reports/:reportId/escalate */
export const EscalateReportInputSchema = z.object({
  reason: z.string().min(1, 'Reason is required to escalate'),
  case_id: z.string().uuid().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assignee_id: z.string().uuid().optional(),
});
export type EscalateReportInput = z.infer<typeof EscalateReportInputSchema>;

/** Body for POST /reports */
export const CreateReportInputSchema = z.object({
  entity_type: ReportEntityTypeEnum,
  entity_id: uuid,
  reason: z.string().min(1, 'Reason is required to create report').max(1000, 'Reason is too long'),
  category: z.string().max(120, 'Category is too long').optional(),
  severity: ReportSeverityEnum.optional(),
  reporter_user_id: z.string().uuid().optional(),
  meta: z.record(z.unknown()).optional(),
});
export type CreateReportInput = z.infer<typeof CreateReportInputSchema>;

/** Generic ack payload for report mutations. */
export const ReportMutationAckSchema = z.object({
  id: uuid,
  status: ReportStatusEnum.optional(),
  resolution: ReportResolutionEnum.optional().nullable(),
  case_id: z.string().uuid().optional(),
});
export type ReportMutationAck = z.infer<typeof ReportMutationAckSchema>;

/** Response for POST /reports create flow. */
export const CreateReportResponseSchema = z.object({
  id: uuid,
  status: ReportStatusEnum,
  resolution: ReportResolutionEnum.optional().nullable(),
});
export type CreateReportResponse = z.infer<typeof CreateReportResponseSchema>;

export const ReportsTrendPointSchema = z.object({
  date: z.string(),
  incoming: z.number().int().nonnegative(),
  resolved: z.number().int().nonnegative(),
});
export type ReportsTrendPoint = z.infer<typeof ReportsTrendPointSchema>;

export const ReportsTrendResponseSchema = z.object({
  window: z.literal('7d'),
  timezone: z.literal('UTC'),
  points: z.array(ReportsTrendPointSchema).length(7),
});
export type ReportsTrendResponse = z.infer<typeof ReportsTrendResponseSchema>;

export const ReportsKpiKeyEnum = z.enum(['total', 'open', 'escalated', 'closed']);
export type ReportsKpiKey = z.infer<typeof ReportsKpiKeyEnum>;

export const ReportsKpiCardAnalyticsSchema = z.object({
  key: ReportsKpiKeyEnum,
  count: z.number().int().nonnegative(),
  delta_absolute: z.number().int(),
  delta_percent: z.number().nullable(),
  trend: z.array(z.number().int().nonnegative()).length(7),
});
export type ReportsKpiCardAnalytics = z.infer<typeof ReportsKpiCardAnalyticsSchema>;

export const ReportsKpisResponseSchema = z.object({
  window: z.literal('7d'),
  comparison_window: z.literal('previous_7d'),
  cards: z.array(ReportsKpiCardAnalyticsSchema).length(4),
});
export type ReportsKpisResponse = z.infer<typeof ReportsKpisResponseSchema>;

export const ListReportsResponseSchema = z.object({
  reports: z.array(ReportListItemSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
});
export type ListReportsResponse = z.infer<typeof ListReportsResponseSchema>;

/** Roles allowed to read reports (list/detail). */
export const REPORTS_READ_ROLES = ['support', 'moderator', 'admin', 'super_admin'];

/** Roles allowed to triage/close reports. */
export const REPORTS_WRITE_ROLES = ['moderator', 'admin', 'super_admin'];

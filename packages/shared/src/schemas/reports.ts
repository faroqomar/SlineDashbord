import { z } from 'zod';

const uuid = z.string().uuid();
const uuidOptional = z.string().uuid().optional();

/** Entity type that can be reported (task, user, chat). */
export const ReportEntityTypeEnum = z.enum(['task', 'user', 'chat']);
export type ReportEntityType = z.infer<typeof ReportEntityTypeEnum>;

/** Report queue status. */
export const ReportStatusEnum = z.enum(['open', 'triaged', 'closed']);
export type ReportStatus = z.infer<typeof ReportStatusEnum>;

/** Triage action taken by admin (dismiss, warn_user, escalate, close). */
export const TriageActionEnum = z.enum(['dismiss', 'warn_user', 'escalate', 'close']);
export type TriageAction = z.infer<typeof TriageActionEnum>;

/** Single report row (DB shape). */
export const ReportRowSchema = z.object({
  id: uuid,
  reporter_user_id: uuid,
  entity_type: ReportEntityTypeEnum,
  entity_id: uuid,
  reason: z.string().optional(),
  category: z.string().optional(),
  status: ReportStatusEnum,
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
  created_at: z.string(),
});
export type ReportActionRow = z.infer<typeof ReportActionRowSchema>;

/** List item for GET /reports response. */
export const ReportListItemSchema = z.object({
  id: uuid,
  reporter_user_id: uuid,
  entity_type: ReportEntityTypeEnum,
  entity_id: uuid,
  reason: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  status: ReportStatusEnum,
  created_at: z.string(),
  updated_at: z.string(),
});
export type ReportListItem = z.infer<typeof ReportListItemSchema>;

/** Detail for GET /reports/:reportId (report + actions). */
export const ReportDetailSchema = z.object({
  id: uuid,
  reporter_user_id: uuid,
  entity_type: ReportEntityTypeEnum,
  entity_id: uuid,
  reason: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  status: ReportStatusEnum,
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
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
export type ListReportsQuery = z.infer<typeof ListReportsQuerySchema>;

/** Body for POST /reports/:reportId/triage */
export const TriageReportInputSchema = z.object({
  action: TriageActionEnum,
  reason: z.string().min(1, 'Reason is required for triage'),
});
export type TriageReportInput = z.infer<typeof TriageReportInputSchema>;

/** Body for POST /reports/:reportId/close */
export const CloseReportInputSchema = z.object({
  reason: z.string().min(1, 'Reason is required to close'),
});
export type CloseReportInput = z.infer<typeof CloseReportInputSchema>;

/** Roles allowed to read reports (list/detail). */
export const REPORTS_READ_ROLES = ['support', 'moderator', 'admin', 'super_admin'];

/** Roles allowed to triage/close reports. */
export const REPORTS_WRITE_ROLES = ['moderator', 'admin', 'super_admin'];

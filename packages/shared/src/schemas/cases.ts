import { z } from 'zod';

const uuid = z.string().uuid();

/** Case id for case-gated operations (e.g. chat access). */
export const CaseIdSchema = z.string().uuid();
export type CaseId = z.infer<typeof CaseIdSchema>;

/** Entity types that can be attached to a case. */
export const CaseEntityTypeSchema = z.enum(['task', 'user', 'conversation', 'booking', 'dispute', 'report']);
export type CaseEntityType = z.infer<typeof CaseEntityTypeSchema>;

/** Case workflow statuses. */
export const CaseStatusEnum = z.enum(['open', 'in_progress', 'pending', 'closed']);
export type CaseStatus = z.infer<typeof CaseStatusEnum>;

/** Case priority levels. */
export const CasePriorityEnum = z.enum(['low', 'medium', 'high', 'urgent']);
export type CasePriority = z.infer<typeof CasePriorityEnum>;

/** Minimal case reference for API responses. */
export const AdminCaseRefSchema = z.object({
  id: uuid,
  subject: z.string().nullable().optional(),
  status: z.union([CaseStatusEnum, z.string()]).optional(),
});
export type AdminCaseRef = z.infer<typeof AdminCaseRefSchema>;

/** Case as returned by API (PAGE 08). */
export const AdminCaseSchema = z.object({
  id: uuid,
  subject: z.string(),
  source: z.string().optional(),
  status: z.union([CaseStatusEnum, z.string()]).optional(),
  priority: z.union([CasePriorityEnum, z.string()]).optional(),
  created_at: z.string(),
  updated_at: z.string().optional(),
  assignee_id: z.string().uuid().nullable().optional(),
  assignee_name: z.string().nullable().optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']).optional().nullable(),
  sla_due_at: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
});
export type AdminCase = z.infer<typeof AdminCaseSchema>;

/** Create case input (PAGE 08). */
export const AdminCaseCreateInputSchema = z.object({
  subject: z.string().min(1, 'Subject is required').max(500),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  source: z.string().max(100).default('dashboard'),
  assignee_id: uuid.optional(),
  idempotency_key: uuid.optional(),
});
export type AdminCaseCreateInput = z.infer<typeof AdminCaseCreateInputSchema>;

/** Attach entity to case input. */
export const AdminCaseAttachEntityInputSchema = z.object({
  entity_type: CaseEntityTypeSchema,
  entity_id: uuid,
});
export type AdminCaseAttachEntityInput = z.infer<typeof AdminCaseAttachEntityInputSchema>;

/** List response for GET /cases */
export const AdminCaseListResponseSchema = z.object({
  cases: z.array(AdminCaseSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number().optional(),
});
export type AdminCaseListResponse = z.infer<typeof AdminCaseListResponseSchema>;

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
export type AdminCaseEntity = z.infer<typeof AdminCaseEntitySchema>;

/** Case note visibility. */
export const CaseNoteVisibilityEnum = z.enum(['internal', 'system']);
export type CaseNoteVisibility = z.infer<typeof CaseNoteVisibilityEnum>;

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
export type AdminCaseNote = z.infer<typeof AdminCaseNoteSchema>;

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
export type AdminCaseEvidence = z.infer<typeof AdminCaseEvidenceSchema>;

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
export type AdminCaseTimelineItem = z.infer<typeof AdminCaseTimelineItemSchema>;

/** Case detail (case + entities + workspace details). */
export const AdminCaseDetailSchema = AdminCaseSchema.extend({
  entities: z.array(AdminCaseEntitySchema).default([]),
  evidence: z.array(AdminCaseEvidenceSchema).default([]),
  notes: z.array(AdminCaseNoteSchema).default([]),
  timeline: z.array(AdminCaseTimelineItemSchema).default([]),
});
export type AdminCaseDetail = z.infer<typeof AdminCaseDetailSchema>;

/** Assign case input. */
export const AdminCaseAssignInputSchema = z.object({
  assignee_id: z.string().uuid().nullable(),
  reason: z.string().min(1, 'Reason is required'),
});
export type AdminCaseAssignInput = z.infer<typeof AdminCaseAssignInputSchema>;

/** Status transition input. */
export const AdminCaseStatusInputSchema = z.object({
  status: CaseStatusEnum,
  reason: z.string().min(1, 'Reason is required'),
});
export type AdminCaseStatusInput = z.infer<typeof AdminCaseStatusInputSchema>;

/** Add note input. */
export const AdminCaseNoteInputSchema = z.object({
  note: z.string().min(1, 'Note is required').max(4000),
  visibility: CaseNoteVisibilityEnum.default('internal'),
});
export type AdminCaseNoteInput = z.infer<typeof AdminCaseNoteInputSchema>;

/** Roles allowed to read/write cases. */
export const CASES_ROLES = ['support', 'moderator', 'admin', 'super_admin'];
export const CASES_WRITE_ROLES = ['moderator', 'admin', 'super_admin'];
export const CASES_DESTRUCTIVE_ROLES = ['admin', 'super_admin'];

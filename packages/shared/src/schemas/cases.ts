import { z } from 'zod';

const uuid = z.string().uuid();

/** Case id for case-gated operations (e.g. chat access). */
export const CaseIdSchema = z.string().uuid();
export type CaseId = z.infer<typeof CaseIdSchema>;

/** Entity types that can be attached to a case. */
export const CaseEntityTypeSchema = z.enum(['task', 'user', 'conversation', 'booking', 'dispute']);
export type CaseEntityType = z.infer<typeof CaseEntityTypeSchema>;

/** Minimal case reference for API responses. */
export const AdminCaseRefSchema = z.object({
  id: uuid,
  subject: z.string().nullable().optional(),
  status: z.string().optional(),
});
export type AdminCaseRef = z.infer<typeof AdminCaseRefSchema>;

/** Case as returned by API (PAGE 08). */
export const AdminCaseSchema = z.object({
  id: uuid,
  subject: z.string(),
  source: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string().optional(),
  assignee_id: z.string().uuid().nullable().optional(),
});
export type AdminCase = z.infer<typeof AdminCaseSchema>;

/** Create case input (PAGE 08). */
export const AdminCaseCreateInputSchema = z.object({
  subject: z.string().min(1, 'Subject is required').max(500),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
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
  created_at: z.string().optional(),
});
export type AdminCaseEntity = z.infer<typeof AdminCaseEntitySchema>;

/** Case detail (case + entities). */
export type AdminCaseDetail = AdminCase & { entities?: AdminCaseEntity[] };

/** Roles allowed to read/write cases. */
export const CASES_ROLES = ['support', 'moderator', 'admin', 'super_admin'];

import { z } from 'zod';
const uuid = z.string().uuid();
/** Case id for case-gated operations (e.g. chat access). */
export const CaseIdSchema = z.string().uuid();
/** Entity types that can be attached to a case. */
export const CaseEntityTypeSchema = z.enum(['task', 'user', 'conversation', 'booking', 'dispute']);
/** Minimal case reference for API responses. */
export const AdminCaseRefSchema = z.object({
    id: uuid,
    subject: z.string().nullable().optional(),
    status: z.string().optional(),
});
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
/** Create case input (PAGE 08). */
export const AdminCaseCreateInputSchema = z.object({
    subject: z.string().min(1).max(500).optional(),
    priority: z.enum(['low', 'medium', 'high']).default('medium'),
    source: z.string().max(100).default('dashboard'),
    assignee_id: uuid.optional(),
    idempotency_key: uuid.optional(),
});
/** Attach entity to case input. */
export const AdminCaseAttachEntityInputSchema = z.object({
    entity_type: CaseEntityTypeSchema,
    entity_id: uuid,
});
/** List response for GET /cases */
export const AdminCaseListResponseSchema = z.object({
    cases: z.array(AdminCaseSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
});
/** Attached entity row in case detail. */
export const AdminCaseEntitySchema = z.object({
    id: uuid,
    case_id: uuid,
    entity_type: CaseEntityTypeSchema,
    entity_id: uuid,
    created_at: z.string().optional(),
});
/** Roles allowed to read/write cases. */
export const CASES_ROLES = ['support', 'moderator', 'admin', 'super_admin'];

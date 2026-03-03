import { z } from 'zod';

const uuidNullable = z.string().uuid().nullable();

/** Known admin audit actions. API may send other strings; this enum is for validation of canonical actions. */
export const AuditActionEnum = z.enum([
  'admin.team.invite',
  'admin.team.remove_member',
  'admin.finance.withdrawal_approve',
  'admin.finance.withdrawal_reject',
  'admin.finance.wallet_freeze',
  'admin.finance.wallet_unfreeze',
  'admin.tasks.force_cancel',
  'admin.disputes.resolve',
  'admin.case.create',
  'admin.case.attach_entity',
  'user_ban',
  'user_unban',
  'user_suspend',
  'admin.report.triage',
  'admin.report.dismiss',
  'admin.report.escalate',
  'admin.report.resolve',
  'admin.chat.access',
  'admin.chat.redact',
  'admin.chat.delete_attachment',
  'admin.case.assign',
  'admin.case.status_update',
  'admin.case.note_add',
  'admin.users.force_logout',
  'admin.finance.tx_view_sensitive_meta',
  'admin.approval.request',
  'admin.approval.approve',
  'admin.approval.reject',
  'admin.finance.wallet_adjust',
  'admin.users.investigation_view',
  'admin.export.evidence_pack',
  'admin.pii.reveal',
]);
export type AuditAction = z.infer<typeof AuditActionEnum>;

/** Canonical audit_logs row shape (actor_user_id, action, related_entity_type, related_entity_id, meta). */
export const AuditLogRowSchema = z.object({
  actor_user_id: uuidNullable,
  action: z.string(),
  related_entity_type: z.string().nullable(),
  related_entity_id: uuidNullable,
  journal_entry_id: uuidNullable.optional(),
  meta: z.record(z.unknown()).default({}),
});
export type AuditLogRow = z.infer<typeof AuditLogRowSchema>;

/** Minimal ack shape returned after a mutation (e.g. { id }, { requestId }). */
export const MutationAckSchema = z.object({
  id: z.string().uuid().optional(),
  requestId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
});
export type MutationAck = z.infer<typeof MutationAckSchema>;

/** Actor profile subset for task activity display. */
export const TaskActivityActorSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string(),
  avatar_url: z.string().nullable().optional(),
});

/** Single task activity item as returned by GET /tasks/:id/activity (audit_logs + joined actor). */
export const TaskActivityItemSchema = z.object({
  id: z.string().uuid(),
  actor_user_id: uuidNullable,
  actor: TaskActivityActorSchema.optional(),
  action: z.string(),
  related_entity_type: z.string().nullable(),
  related_entity_id: uuidNullable,
  created_at: z.string(),
  meta: z.record(z.unknown()).nullable().optional(),
});
export type TaskActivityItem = z.infer<typeof TaskActivityItemSchema>;

/** Response shape of GET /tasks/:id/activity */
export const TaskActivityResponseSchema = z.array(TaskActivityItemSchema);
export type TaskActivityResponse = z.infer<typeof TaskActivityResponseSchema>;

// ─── PAGE 12: Audit list/export (audit_logs table shape) ─────────────────────

/** Single audit_logs row as returned by GET /finance/audit (list). */
export const AuditLogListEntrySchema = z.object({
  id: z.string().uuid(),
  created_at: z.string(),
  actor_user_id: uuidNullable,
  action: z.string(),
  related_entity_type: z.string().nullable(),
  related_entity_id: uuidNullable,
  journal_entry_id: uuidNullable.optional(),
  meta: z.record(z.unknown()).nullable().optional(),
});
export type AuditLogListEntry = z.infer<typeof AuditLogListEntrySchema>;

/** Query params for GET /finance/audit (paginated list). */
export const AuditLogListFiltersSchema = z.object({
  action: z.string().optional(),
  actor_user_id: z.string().uuid().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  limit: z.number().int().min(1).max(200).optional(),
  cursor_created_at: z.string().optional(),
  cursor_id: z.string().uuid().optional(),
});
export type AuditLogListFilters = z.infer<typeof AuditLogListFiltersSchema>;

/** Query params for GET /finance/audit/export (same as list; limit max 10000). */
export const AuditExportQuerySchema = z.object({
  action: z.string().optional(),
  actor_user_id: z.string().uuid().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  limit: z.number().int().min(1).max(10000).optional(),
});
export type AuditExportQuery = z.infer<typeof AuditExportQuerySchema>;

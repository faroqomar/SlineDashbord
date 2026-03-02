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
  'user_ban',
  'user_unban',
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

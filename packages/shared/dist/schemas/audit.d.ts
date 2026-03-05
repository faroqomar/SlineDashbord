import { z } from 'zod';
/** Known admin audit actions. API may send other strings; this enum is for validation of canonical actions. */
export declare const AuditActionEnum: z.ZodEnum<["admin.team.invite", "admin.team.remove_member", "admin.finance.withdrawal_approve", "admin.finance.withdrawal_reject", "admin.finance.wallet_freeze", "admin.finance.wallet_unfreeze", "admin.tasks.force_cancel", "admin.disputes.resolve", "admin.case.create", "admin.case.attach_entity", "user_ban", "user_unban", "user_suspend", "admin.report.triage", "admin.report.dismiss", "admin.report.escalate", "admin.report.resolve", "admin.chat.access", "admin.chat.redact", "admin.chat.delete_attachment", "admin.case.assign", "admin.case.status_update", "admin.case.note_add", "admin.users.force_logout", "admin.finance.tx_view_sensitive_meta", "admin.approval.request", "admin.approval.approve", "admin.approval.reject", "admin.finance.wallet_adjust", "admin.users.investigation_view", "admin.export.evidence_pack", "admin.pii.reveal"]>;
export type AuditAction = z.infer<typeof AuditActionEnum>;
/** Canonical audit_logs row shape (actor_user_id, action, related_entity_type, related_entity_id, meta). */
export declare const AuditLogRowSchema: z.ZodObject<{
    actor_user_id: z.ZodNullable<z.ZodString>;
    action: z.ZodString;
    related_entity_type: z.ZodNullable<z.ZodString>;
    related_entity_id: z.ZodNullable<z.ZodString>;
    journal_entry_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    meta: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    actor_user_id: string | null;
    action: string;
    related_entity_type: string | null;
    related_entity_id: string | null;
    meta: Record<string, unknown>;
    journal_entry_id?: string | null | undefined;
}, {
    actor_user_id: string | null;
    action: string;
    related_entity_type: string | null;
    related_entity_id: string | null;
    journal_entry_id?: string | null | undefined;
    meta?: Record<string, unknown> | undefined;
}>;
export type AuditLogRow = z.infer<typeof AuditLogRowSchema>;
/** Minimal ack shape returned after a mutation (e.g. { id }, { requestId }). */
export declare const MutationAckSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    requestId: z.ZodOptional<z.ZodString>;
    userId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id?: string | undefined;
    requestId?: string | undefined;
    userId?: string | undefined;
}, {
    id?: string | undefined;
    requestId?: string | undefined;
    userId?: string | undefined;
}>;
export type MutationAck = z.infer<typeof MutationAckSchema>;
/** Actor profile subset for task activity display. */
export declare const TaskActivityActorSchema: z.ZodObject<{
    id: z.ZodString;
    full_name: z.ZodString;
    avatar_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    full_name: string;
    avatar_url?: string | null | undefined;
}, {
    id: string;
    full_name: string;
    avatar_url?: string | null | undefined;
}>;
/** Single task activity item as returned by GET /tasks/:id/activity (audit_logs + joined actor). */
export declare const TaskActivityItemSchema: z.ZodObject<{
    id: z.ZodString;
    actor_user_id: z.ZodNullable<z.ZodString>;
    actor: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        full_name: z.ZodString;
        avatar_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        full_name: string;
        avatar_url?: string | null | undefined;
    }, {
        id: string;
        full_name: string;
        avatar_url?: string | null | undefined;
    }>>;
    action: z.ZodString;
    related_entity_type: z.ZodNullable<z.ZodString>;
    related_entity_id: z.ZodNullable<z.ZodString>;
    created_at: z.ZodString;
    meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    actor_user_id: string | null;
    action: string;
    related_entity_type: string | null;
    related_entity_id: string | null;
    meta?: Record<string, unknown> | null | undefined;
    actor?: {
        id: string;
        full_name: string;
        avatar_url?: string | null | undefined;
    } | undefined;
}, {
    id: string;
    created_at: string;
    actor_user_id: string | null;
    action: string;
    related_entity_type: string | null;
    related_entity_id: string | null;
    meta?: Record<string, unknown> | null | undefined;
    actor?: {
        id: string;
        full_name: string;
        avatar_url?: string | null | undefined;
    } | undefined;
}>;
export type TaskActivityItem = z.infer<typeof TaskActivityItemSchema>;
/** Response shape of GET /tasks/:id/activity */
export declare const TaskActivityResponseSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    actor_user_id: z.ZodNullable<z.ZodString>;
    actor: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        full_name: z.ZodString;
        avatar_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        full_name: string;
        avatar_url?: string | null | undefined;
    }, {
        id: string;
        full_name: string;
        avatar_url?: string | null | undefined;
    }>>;
    action: z.ZodString;
    related_entity_type: z.ZodNullable<z.ZodString>;
    related_entity_id: z.ZodNullable<z.ZodString>;
    created_at: z.ZodString;
    meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    actor_user_id: string | null;
    action: string;
    related_entity_type: string | null;
    related_entity_id: string | null;
    meta?: Record<string, unknown> | null | undefined;
    actor?: {
        id: string;
        full_name: string;
        avatar_url?: string | null | undefined;
    } | undefined;
}, {
    id: string;
    created_at: string;
    actor_user_id: string | null;
    action: string;
    related_entity_type: string | null;
    related_entity_id: string | null;
    meta?: Record<string, unknown> | null | undefined;
    actor?: {
        id: string;
        full_name: string;
        avatar_url?: string | null | undefined;
    } | undefined;
}>, "many">;
export type TaskActivityResponse = z.infer<typeof TaskActivityResponseSchema>;
/** Single audit_logs row as returned by GET /finance/audit (list). */
export declare const AuditLogListEntrySchema: z.ZodObject<{
    id: z.ZodString;
    created_at: z.ZodString;
    actor_user_id: z.ZodNullable<z.ZodString>;
    action: z.ZodString;
    related_entity_type: z.ZodNullable<z.ZodString>;
    related_entity_id: z.ZodNullable<z.ZodString>;
    journal_entry_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    actor_user_id: string | null;
    action: string;
    related_entity_type: string | null;
    related_entity_id: string | null;
    journal_entry_id?: string | null | undefined;
    meta?: Record<string, unknown> | null | undefined;
}, {
    id: string;
    created_at: string;
    actor_user_id: string | null;
    action: string;
    related_entity_type: string | null;
    related_entity_id: string | null;
    journal_entry_id?: string | null | undefined;
    meta?: Record<string, unknown> | null | undefined;
}>;
export type AuditLogListEntry = z.infer<typeof AuditLogListEntrySchema>;
/** Query params for GET /finance/audit (paginated list). */
export declare const AuditLogListFiltersSchema: z.ZodObject<{
    action: z.ZodOptional<z.ZodString>;
    actor_user_id: z.ZodOptional<z.ZodString>;
    start_date: z.ZodOptional<z.ZodString>;
    end_date: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodNumber>;
    cursor_created_at: z.ZodOptional<z.ZodString>;
    cursor_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit?: number | undefined;
    actor_user_id?: string | undefined;
    action?: string | undefined;
    start_date?: string | undefined;
    end_date?: string | undefined;
    cursor_created_at?: string | undefined;
    cursor_id?: string | undefined;
}, {
    limit?: number | undefined;
    actor_user_id?: string | undefined;
    action?: string | undefined;
    start_date?: string | undefined;
    end_date?: string | undefined;
    cursor_created_at?: string | undefined;
    cursor_id?: string | undefined;
}>;
export type AuditLogListFilters = z.infer<typeof AuditLogListFiltersSchema>;
/** Query params for GET /finance/audit/export (same as list; limit max 10000). */
export declare const AuditExportQuerySchema: z.ZodObject<{
    action: z.ZodOptional<z.ZodString>;
    actor_user_id: z.ZodOptional<z.ZodString>;
    start_date: z.ZodOptional<z.ZodString>;
    end_date: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit?: number | undefined;
    actor_user_id?: string | undefined;
    action?: string | undefined;
    start_date?: string | undefined;
    end_date?: string | undefined;
}, {
    limit?: number | undefined;
    actor_user_id?: string | undefined;
    action?: string | undefined;
    start_date?: string | undefined;
    end_date?: string | undefined;
}>;
export type AuditExportQuery = z.infer<typeof AuditExportQuerySchema>;

import { z } from 'zod';
/** Entity type that can be reported (task, user, chat). */
export declare const ReportEntityTypeEnum: z.ZodEnum<["task", "user", "chat"]>;
export type ReportEntityType = z.infer<typeof ReportEntityTypeEnum>;
/** Report queue status. */
export declare const ReportStatusEnum: z.ZodEnum<["open", "triaged", "closed"]>;
export type ReportStatus = z.infer<typeof ReportStatusEnum>;
/** Triage action taken by admin (dismiss, warn_user, escalate, close). */
export declare const TriageActionEnum: z.ZodEnum<["dismiss", "warn_user", "escalate", "close"]>;
export type TriageAction = z.infer<typeof TriageActionEnum>;
/** Single report row (DB shape). */
export declare const ReportRowSchema: z.ZodObject<{
    id: z.ZodString;
    reporter_user_id: z.ZodString;
    entity_type: z.ZodEnum<["task", "user", "chat"]>;
    entity_id: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["open", "triaged", "closed"]>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
    meta: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, "strip", z.ZodTypeAny, {
    status: "open" | "triaged" | "closed";
    id: string;
    created_at: string;
    updated_at: string;
    entity_type: "task" | "user" | "chat";
    entity_id: string;
    meta: Record<string, unknown>;
    reporter_user_id: string;
    reason?: string | undefined;
    category?: string | undefined;
}, {
    status: "open" | "triaged" | "closed";
    id: string;
    created_at: string;
    updated_at: string;
    entity_type: "task" | "user" | "chat";
    entity_id: string;
    reporter_user_id: string;
    reason?: string | undefined;
    meta?: Record<string, unknown> | undefined;
    category?: string | undefined;
}>;
export type ReportRow = z.infer<typeof ReportRowSchema>;
/** Single report action (admin triage/close) row. */
export declare const ReportActionRowSchema: z.ZodObject<{
    id: z.ZodString;
    report_id: z.ZodString;
    admin_user_id: z.ZodString;
    action: z.ZodString;
    reason: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    created_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    action: string;
    report_id: string;
    admin_user_id: string;
    reason?: string | null | undefined;
}, {
    id: string;
    created_at: string;
    action: string;
    report_id: string;
    admin_user_id: string;
    reason?: string | null | undefined;
}>;
export type ReportActionRow = z.infer<typeof ReportActionRowSchema>;
/** List item for GET /reports response. */
export declare const ReportListItemSchema: z.ZodObject<{
    id: z.ZodString;
    reporter_user_id: z.ZodString;
    entity_type: z.ZodEnum<["task", "user", "chat"]>;
    entity_id: z.ZodString;
    reason: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    category: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodEnum<["open", "triaged", "closed"]>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "open" | "triaged" | "closed";
    id: string;
    created_at: string;
    updated_at: string;
    entity_type: "task" | "user" | "chat";
    entity_id: string;
    reporter_user_id: string;
    reason?: string | null | undefined;
    category?: string | null | undefined;
}, {
    status: "open" | "triaged" | "closed";
    id: string;
    created_at: string;
    updated_at: string;
    entity_type: "task" | "user" | "chat";
    entity_id: string;
    reporter_user_id: string;
    reason?: string | null | undefined;
    category?: string | null | undefined;
}>;
export type ReportListItem = z.infer<typeof ReportListItemSchema>;
/** Detail for GET /reports/:reportId (report + actions). */
export declare const ReportDetailSchema: z.ZodObject<{
    id: z.ZodString;
    reporter_user_id: z.ZodString;
    entity_type: z.ZodEnum<["task", "user", "chat"]>;
    entity_id: z.ZodString;
    reason: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    category: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodEnum<["open", "triaged", "closed"]>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
    meta: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    actions: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        report_id: z.ZodString;
        admin_user_id: z.ZodString;
        action: z.ZodString;
        reason: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        created_at: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        created_at: string;
        action: string;
        report_id: string;
        admin_user_id: string;
        reason?: string | null | undefined;
    }, {
        id: string;
        created_at: string;
        action: string;
        report_id: string;
        admin_user_id: string;
        reason?: string | null | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    status: "open" | "triaged" | "closed";
    id: string;
    created_at: string;
    updated_at: string;
    entity_type: "task" | "user" | "chat";
    entity_id: string;
    reporter_user_id: string;
    actions: {
        id: string;
        created_at: string;
        action: string;
        report_id: string;
        admin_user_id: string;
        reason?: string | null | undefined;
    }[];
    reason?: string | null | undefined;
    meta?: Record<string, unknown> | null | undefined;
    category?: string | null | undefined;
}, {
    status: "open" | "triaged" | "closed";
    id: string;
    created_at: string;
    updated_at: string;
    entity_type: "task" | "user" | "chat";
    entity_id: string;
    reporter_user_id: string;
    reason?: string | null | undefined;
    meta?: Record<string, unknown> | null | undefined;
    category?: string | null | undefined;
    actions?: {
        id: string;
        created_at: string;
        action: string;
        report_id: string;
        admin_user_id: string;
        reason?: string | null | undefined;
    }[] | undefined;
}>;
export type ReportDetail = z.infer<typeof ReportDetailSchema>;
/** Query params for GET /reports list. */
export declare const ListReportsQuerySchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["open", "triaged", "closed"]>>;
    entity_type: z.ZodOptional<z.ZodEnum<["task", "user", "chat"]>>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    status?: "open" | "triaged" | "closed" | undefined;
    entity_type?: "task" | "user" | "chat" | undefined;
}, {
    page?: number | undefined;
    status?: "open" | "triaged" | "closed" | undefined;
    entity_type?: "task" | "user" | "chat" | undefined;
    limit?: number | undefined;
}>;
export type ListReportsQuery = z.infer<typeof ListReportsQuerySchema>;
/** Body for POST /reports/:reportId/triage */
export declare const TriageReportInputSchema: z.ZodObject<{
    action: z.ZodEnum<["dismiss", "warn_user", "escalate", "close"]>;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    reason: string;
    action: "dismiss" | "warn_user" | "escalate" | "close";
}, {
    reason: string;
    action: "dismiss" | "warn_user" | "escalate" | "close";
}>;
export type TriageReportInput = z.infer<typeof TriageReportInputSchema>;
/** Body for POST /reports/:reportId/close */
export declare const CloseReportInputSchema: z.ZodObject<{
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    reason: string;
}, {
    reason: string;
}>;
export type CloseReportInput = z.infer<typeof CloseReportInputSchema>;
/** Roles allowed to read reports (list/detail). */
export declare const REPORTS_READ_ROLES: string[];
/** Roles allowed to triage/close reports. */
export declare const REPORTS_WRITE_ROLES: string[];

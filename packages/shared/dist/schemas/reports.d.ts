import { z } from 'zod';
/** Entity type that can be reported. */
export declare const ReportEntityTypeEnum: z.ZodEnum<["task", "user", "chat", "booking"]>;
export type ReportEntityType = z.infer<typeof ReportEntityTypeEnum>;
/** Report queue status. */
export declare const ReportStatusEnum: z.ZodEnum<["open", "triaged", "escalated", "closed"]>;
export type ReportStatus = z.infer<typeof ReportStatusEnum>;
/** Report severity used for queue prioritization. */
export declare const ReportSeverityEnum: z.ZodEnum<["low", "medium", "high", "critical"]>;
export type ReportSeverity = z.infer<typeof ReportSeverityEnum>;
/** Final resolution once report closes or is escalated. */
export declare const ReportResolutionEnum: z.ZodEnum<["dismissed", "resolved", "case_opened", "case_attached"]>;
export type ReportResolution = z.infer<typeof ReportResolutionEnum>;
/**
 * Backward-compatible triage action enum.
 * Keep legacy actions while introducing close_resolved semantics.
 */
export declare const TriageActionEnum: z.ZodEnum<["dismiss", "warn_user", "escalate", "close", "close_resolved"]>;
export type TriageAction = z.infer<typeof TriageActionEnum>;
/** Explicit moderation actions used by dedicated endpoints. */
export declare const ReportDecisionActionEnum: z.ZodEnum<["dismiss", "escalate", "close_resolved"]>;
export type ReportDecisionAction = z.infer<typeof ReportDecisionActionEnum>;
/** Lightweight reporter summary for list/detail contexts. */
export declare const ReportReporterSummarySchema: z.ZodObject<{
    user_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    full_name: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    username: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    avatar_url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    trust_level: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    valid_reports_count: z.ZodOptional<z.ZodNumber>;
    total_reports_count: z.ZodOptional<z.ZodNumber>;
    relationship_to_entity: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    full_name?: string | null | undefined;
    avatar_url?: string | null | undefined;
    user_id?: string | null | undefined;
    username?: string | null | undefined;
    trust_level?: string | null | undefined;
    valid_reports_count?: number | undefined;
    total_reports_count?: number | undefined;
    relationship_to_entity?: string | null | undefined;
}, {
    full_name?: string | null | undefined;
    avatar_url?: string | null | undefined;
    user_id?: string | null | undefined;
    username?: string | null | undefined;
    trust_level?: string | null | undefined;
    valid_reports_count?: number | undefined;
    total_reports_count?: number | undefined;
    relationship_to_entity?: string | null | undefined;
}>;
export type ReportReporterSummary = z.infer<typeof ReportReporterSummarySchema>;
/** Lightweight entity summary for decision-ready report views. */
export declare const ReportEntitySummarySchema: z.ZodObject<{
    entity_type: z.ZodEnum<["task", "user", "chat", "booking"]>;
    title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    subtitle: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    avatar_url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    participants: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    link_hint: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    meta: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, "strip", z.ZodTypeAny, {
    entity_type: "task" | "booking" | "user" | "chat";
    meta: Record<string, unknown>;
    status?: string | null | undefined;
    avatar_url?: string | null | undefined;
    title?: string | null | undefined;
    subtitle?: string | null | undefined;
    participants?: string[] | undefined;
    link_hint?: string | null | undefined;
}, {
    entity_type: "task" | "booking" | "user" | "chat";
    status?: string | null | undefined;
    avatar_url?: string | null | undefined;
    title?: string | null | undefined;
    meta?: Record<string, unknown> | undefined;
    subtitle?: string | null | undefined;
    participants?: string[] | undefined;
    link_hint?: string | null | undefined;
}>;
export type ReportEntitySummary = z.infer<typeof ReportEntitySummarySchema>;
/** Timeline entry for report lifecycle/history view. */
export declare const ReportTimelineItemSchema: z.ZodObject<{
    id: z.ZodString;
    event: z.ZodString;
    actor_user_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    actor_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    reason: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    created_at: z.ZodString;
    meta: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    meta: Record<string, unknown>;
    event: string;
    reason?: string | null | undefined;
    actor_user_id?: string | null | undefined;
    actor_name?: string | null | undefined;
}, {
    id: string;
    created_at: string;
    event: string;
    reason?: string | null | undefined;
    meta?: Record<string, unknown> | undefined;
    actor_user_id?: string | null | undefined;
    actor_name?: string | null | undefined;
}>;
export type ReportTimelineItem = z.infer<typeof ReportTimelineItemSchema>;
/** Single report row (DB shape). */
export declare const ReportRowSchema: z.ZodObject<{
    id: z.ZodString;
    reporter_user_id: z.ZodNullable<z.ZodString>;
    entity_type: z.ZodEnum<["task", "user", "chat", "booking"]>;
    entity_id: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["open", "triaged", "escalated", "closed"]>;
    severity: z.ZodNullable<z.ZodOptional<z.ZodEnum<["low", "medium", "high", "critical"]>>>;
    resolution: z.ZodNullable<z.ZodOptional<z.ZodEnum<["dismissed", "resolved", "case_opened", "case_attached"]>>>;
    case_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    assigned_admin_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    sla_due_at: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
    meta: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, "strip", z.ZodTypeAny, {
    status: "open" | "closed" | "triaged" | "escalated";
    id: string;
    created_at: string;
    updated_at: string;
    entity_type: "task" | "booking" | "user" | "chat";
    entity_id: string;
    meta: Record<string, unknown>;
    reporter_user_id: string | null;
    reason?: string | undefined;
    case_id?: string | null | undefined;
    category?: string | undefined;
    severity?: "low" | "high" | "critical" | "medium" | null | undefined;
    resolution?: "resolved" | "dismissed" | "case_opened" | "case_attached" | null | undefined;
    assigned_admin_id?: string | null | undefined;
    sla_due_at?: string | null | undefined;
}, {
    status: "open" | "closed" | "triaged" | "escalated";
    id: string;
    created_at: string;
    updated_at: string;
    entity_type: "task" | "booking" | "user" | "chat";
    entity_id: string;
    reporter_user_id: string | null;
    reason?: string | undefined;
    case_id?: string | null | undefined;
    category?: string | undefined;
    severity?: "low" | "high" | "critical" | "medium" | null | undefined;
    resolution?: "resolved" | "dismissed" | "case_opened" | "case_attached" | null | undefined;
    meta?: Record<string, unknown> | undefined;
    assigned_admin_id?: string | null | undefined;
    sla_due_at?: string | null | undefined;
}>;
export type ReportRow = z.infer<typeof ReportRowSchema>;
/** Single report action (admin triage/close) row. */
export declare const ReportActionRowSchema: z.ZodObject<{
    id: z.ZodString;
    report_id: z.ZodString;
    admin_user_id: z.ZodString;
    action: z.ZodString;
    reason: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    case_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    resolution: z.ZodNullable<z.ZodOptional<z.ZodEnum<["dismissed", "resolved", "case_opened", "case_attached"]>>>;
    status_after: z.ZodOptional<z.ZodEnum<["open", "triaged", "escalated", "closed"]>>;
    created_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    action: string;
    report_id: string;
    admin_user_id: string;
    reason?: string | null | undefined;
    case_id?: string | null | undefined;
    resolution?: "resolved" | "dismissed" | "case_opened" | "case_attached" | null | undefined;
    status_after?: "open" | "closed" | "triaged" | "escalated" | undefined;
}, {
    id: string;
    created_at: string;
    action: string;
    report_id: string;
    admin_user_id: string;
    reason?: string | null | undefined;
    case_id?: string | null | undefined;
    resolution?: "resolved" | "dismissed" | "case_opened" | "case_attached" | null | undefined;
    status_after?: "open" | "closed" | "triaged" | "escalated" | undefined;
}>;
export type ReportActionRow = z.infer<typeof ReportActionRowSchema>;
/** List item for GET /reports response. */
export declare const ReportListItemSchema: z.ZodObject<{
    id: z.ZodString;
    reporter_user_id: z.ZodNullable<z.ZodString>;
    entity_type: z.ZodEnum<["task", "user", "chat", "booking"]>;
    entity_id: z.ZodString;
    reason: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    category: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodEnum<["open", "triaged", "escalated", "closed"]>;
    severity: z.ZodNullable<z.ZodOptional<z.ZodEnum<["low", "medium", "high", "critical"]>>>;
    resolution: z.ZodNullable<z.ZodOptional<z.ZodEnum<["dismissed", "resolved", "case_opened", "case_attached"]>>>;
    case_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    assigned_admin_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    sla_due_at: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    reporter: z.ZodOptional<z.ZodObject<{
        user_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        full_name: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        username: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        avatar_url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        trust_level: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        valid_reports_count: z.ZodOptional<z.ZodNumber>;
        total_reports_count: z.ZodOptional<z.ZodNumber>;
        relationship_to_entity: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        full_name?: string | null | undefined;
        avatar_url?: string | null | undefined;
        user_id?: string | null | undefined;
        username?: string | null | undefined;
        trust_level?: string | null | undefined;
        valid_reports_count?: number | undefined;
        total_reports_count?: number | undefined;
        relationship_to_entity?: string | null | undefined;
    }, {
        full_name?: string | null | undefined;
        avatar_url?: string | null | undefined;
        user_id?: string | null | undefined;
        username?: string | null | undefined;
        trust_level?: string | null | undefined;
        valid_reports_count?: number | undefined;
        total_reports_count?: number | undefined;
        relationship_to_entity?: string | null | undefined;
    }>>;
    entity: z.ZodOptional<z.ZodObject<{
        entity_type: z.ZodEnum<["task", "user", "chat", "booking"]>;
        title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        subtitle: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        status: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        avatar_url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        participants: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        link_hint: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        meta: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, "strip", z.ZodTypeAny, {
        entity_type: "task" | "booking" | "user" | "chat";
        meta: Record<string, unknown>;
        status?: string | null | undefined;
        avatar_url?: string | null | undefined;
        title?: string | null | undefined;
        subtitle?: string | null | undefined;
        participants?: string[] | undefined;
        link_hint?: string | null | undefined;
    }, {
        entity_type: "task" | "booking" | "user" | "chat";
        status?: string | null | undefined;
        avatar_url?: string | null | undefined;
        title?: string | null | undefined;
        meta?: Record<string, unknown> | undefined;
        subtitle?: string | null | undefined;
        participants?: string[] | undefined;
        link_hint?: string | null | undefined;
    }>>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "open" | "closed" | "triaged" | "escalated";
    id: string;
    created_at: string;
    updated_at: string;
    entity_type: "task" | "booking" | "user" | "chat";
    entity_id: string;
    reporter_user_id: string | null;
    reason?: string | null | undefined;
    case_id?: string | null | undefined;
    category?: string | null | undefined;
    severity?: "low" | "high" | "critical" | "medium" | null | undefined;
    resolution?: "resolved" | "dismissed" | "case_opened" | "case_attached" | null | undefined;
    assigned_admin_id?: string | null | undefined;
    sla_due_at?: string | null | undefined;
    reporter?: {
        full_name?: string | null | undefined;
        avatar_url?: string | null | undefined;
        user_id?: string | null | undefined;
        username?: string | null | undefined;
        trust_level?: string | null | undefined;
        valid_reports_count?: number | undefined;
        total_reports_count?: number | undefined;
        relationship_to_entity?: string | null | undefined;
    } | undefined;
    entity?: {
        entity_type: "task" | "booking" | "user" | "chat";
        meta: Record<string, unknown>;
        status?: string | null | undefined;
        avatar_url?: string | null | undefined;
        title?: string | null | undefined;
        subtitle?: string | null | undefined;
        participants?: string[] | undefined;
        link_hint?: string | null | undefined;
    } | undefined;
}, {
    status: "open" | "closed" | "triaged" | "escalated";
    id: string;
    created_at: string;
    updated_at: string;
    entity_type: "task" | "booking" | "user" | "chat";
    entity_id: string;
    reporter_user_id: string | null;
    reason?: string | null | undefined;
    case_id?: string | null | undefined;
    category?: string | null | undefined;
    severity?: "low" | "high" | "critical" | "medium" | null | undefined;
    resolution?: "resolved" | "dismissed" | "case_opened" | "case_attached" | null | undefined;
    assigned_admin_id?: string | null | undefined;
    sla_due_at?: string | null | undefined;
    reporter?: {
        full_name?: string | null | undefined;
        avatar_url?: string | null | undefined;
        user_id?: string | null | undefined;
        username?: string | null | undefined;
        trust_level?: string | null | undefined;
        valid_reports_count?: number | undefined;
        total_reports_count?: number | undefined;
        relationship_to_entity?: string | null | undefined;
    } | undefined;
    entity?: {
        entity_type: "task" | "booking" | "user" | "chat";
        status?: string | null | undefined;
        avatar_url?: string | null | undefined;
        title?: string | null | undefined;
        meta?: Record<string, unknown> | undefined;
        subtitle?: string | null | undefined;
        participants?: string[] | undefined;
        link_hint?: string | null | undefined;
    } | undefined;
}>;
export type ReportListItem = z.infer<typeof ReportListItemSchema>;
/** Detail for GET /reports/:reportId (report + actions). */
export declare const ReportDetailSchema: z.ZodObject<{
    id: z.ZodString;
    reporter_user_id: z.ZodNullable<z.ZodString>;
    entity_type: z.ZodEnum<["task", "user", "chat", "booking"]>;
    entity_id: z.ZodString;
    reason: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    category: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    status: z.ZodEnum<["open", "triaged", "escalated", "closed"]>;
    severity: z.ZodNullable<z.ZodOptional<z.ZodEnum<["low", "medium", "high", "critical"]>>>;
    resolution: z.ZodNullable<z.ZodOptional<z.ZodEnum<["dismissed", "resolved", "case_opened", "case_attached"]>>>;
    case_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    assigned_admin_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    sla_due_at: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    reporter: z.ZodOptional<z.ZodObject<{
        user_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        full_name: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        username: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        avatar_url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        trust_level: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        valid_reports_count: z.ZodOptional<z.ZodNumber>;
        total_reports_count: z.ZodOptional<z.ZodNumber>;
        relationship_to_entity: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        full_name?: string | null | undefined;
        avatar_url?: string | null | undefined;
        user_id?: string | null | undefined;
        username?: string | null | undefined;
        trust_level?: string | null | undefined;
        valid_reports_count?: number | undefined;
        total_reports_count?: number | undefined;
        relationship_to_entity?: string | null | undefined;
    }, {
        full_name?: string | null | undefined;
        avatar_url?: string | null | undefined;
        user_id?: string | null | undefined;
        username?: string | null | undefined;
        trust_level?: string | null | undefined;
        valid_reports_count?: number | undefined;
        total_reports_count?: number | undefined;
        relationship_to_entity?: string | null | undefined;
    }>>;
    entity: z.ZodOptional<z.ZodObject<{
        entity_type: z.ZodEnum<["task", "user", "chat", "booking"]>;
        title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        subtitle: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        status: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        avatar_url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        participants: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        link_hint: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        meta: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, "strip", z.ZodTypeAny, {
        entity_type: "task" | "booking" | "user" | "chat";
        meta: Record<string, unknown>;
        status?: string | null | undefined;
        avatar_url?: string | null | undefined;
        title?: string | null | undefined;
        subtitle?: string | null | undefined;
        participants?: string[] | undefined;
        link_hint?: string | null | undefined;
    }, {
        entity_type: "task" | "booking" | "user" | "chat";
        status?: string | null | undefined;
        avatar_url?: string | null | undefined;
        title?: string | null | undefined;
        meta?: Record<string, unknown> | undefined;
        subtitle?: string | null | undefined;
        participants?: string[] | undefined;
        link_hint?: string | null | undefined;
    }>>;
    evidence: z.ZodDefault<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>, "many">>;
    timeline: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        event: z.ZodString;
        actor_user_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        actor_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        reason: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        created_at: z.ZodString;
        meta: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        created_at: string;
        meta: Record<string, unknown>;
        event: string;
        reason?: string | null | undefined;
        actor_user_id?: string | null | undefined;
        actor_name?: string | null | undefined;
    }, {
        id: string;
        created_at: string;
        event: string;
        reason?: string | null | undefined;
        meta?: Record<string, unknown> | undefined;
        actor_user_id?: string | null | undefined;
        actor_name?: string | null | undefined;
    }>, "many">>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
    meta: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    actions: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        report_id: z.ZodString;
        admin_user_id: z.ZodString;
        action: z.ZodString;
        reason: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        case_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        resolution: z.ZodNullable<z.ZodOptional<z.ZodEnum<["dismissed", "resolved", "case_opened", "case_attached"]>>>;
        status_after: z.ZodOptional<z.ZodEnum<["open", "triaged", "escalated", "closed"]>>;
        created_at: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        created_at: string;
        action: string;
        report_id: string;
        admin_user_id: string;
        reason?: string | null | undefined;
        case_id?: string | null | undefined;
        resolution?: "resolved" | "dismissed" | "case_opened" | "case_attached" | null | undefined;
        status_after?: "open" | "closed" | "triaged" | "escalated" | undefined;
    }, {
        id: string;
        created_at: string;
        action: string;
        report_id: string;
        admin_user_id: string;
        reason?: string | null | undefined;
        case_id?: string | null | undefined;
        resolution?: "resolved" | "dismissed" | "case_opened" | "case_attached" | null | undefined;
        status_after?: "open" | "closed" | "triaged" | "escalated" | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    status: "open" | "closed" | "triaged" | "escalated";
    id: string;
    created_at: string;
    updated_at: string;
    entity_type: "task" | "booking" | "user" | "chat";
    entity_id: string;
    evidence: Record<string, unknown>[];
    reporter_user_id: string | null;
    timeline: {
        id: string;
        created_at: string;
        meta: Record<string, unknown>;
        event: string;
        reason?: string | null | undefined;
        actor_user_id?: string | null | undefined;
        actor_name?: string | null | undefined;
    }[];
    actions: {
        id: string;
        created_at: string;
        action: string;
        report_id: string;
        admin_user_id: string;
        reason?: string | null | undefined;
        case_id?: string | null | undefined;
        resolution?: "resolved" | "dismissed" | "case_opened" | "case_attached" | null | undefined;
        status_after?: "open" | "closed" | "triaged" | "escalated" | undefined;
    }[];
    reason?: string | null | undefined;
    case_id?: string | null | undefined;
    category?: string | null | undefined;
    severity?: "low" | "high" | "critical" | "medium" | null | undefined;
    resolution?: "resolved" | "dismissed" | "case_opened" | "case_attached" | null | undefined;
    meta?: Record<string, unknown> | null | undefined;
    assigned_admin_id?: string | null | undefined;
    sla_due_at?: string | null | undefined;
    reporter?: {
        full_name?: string | null | undefined;
        avatar_url?: string | null | undefined;
        user_id?: string | null | undefined;
        username?: string | null | undefined;
        trust_level?: string | null | undefined;
        valid_reports_count?: number | undefined;
        total_reports_count?: number | undefined;
        relationship_to_entity?: string | null | undefined;
    } | undefined;
    entity?: {
        entity_type: "task" | "booking" | "user" | "chat";
        meta: Record<string, unknown>;
        status?: string | null | undefined;
        avatar_url?: string | null | undefined;
        title?: string | null | undefined;
        subtitle?: string | null | undefined;
        participants?: string[] | undefined;
        link_hint?: string | null | undefined;
    } | undefined;
}, {
    status: "open" | "closed" | "triaged" | "escalated";
    id: string;
    created_at: string;
    updated_at: string;
    entity_type: "task" | "booking" | "user" | "chat";
    entity_id: string;
    reporter_user_id: string | null;
    reason?: string | null | undefined;
    case_id?: string | null | undefined;
    category?: string | null | undefined;
    severity?: "low" | "high" | "critical" | "medium" | null | undefined;
    resolution?: "resolved" | "dismissed" | "case_opened" | "case_attached" | null | undefined;
    evidence?: Record<string, unknown>[] | undefined;
    meta?: Record<string, unknown> | null | undefined;
    assigned_admin_id?: string | null | undefined;
    sla_due_at?: string | null | undefined;
    reporter?: {
        full_name?: string | null | undefined;
        avatar_url?: string | null | undefined;
        user_id?: string | null | undefined;
        username?: string | null | undefined;
        trust_level?: string | null | undefined;
        valid_reports_count?: number | undefined;
        total_reports_count?: number | undefined;
        relationship_to_entity?: string | null | undefined;
    } | undefined;
    entity?: {
        entity_type: "task" | "booking" | "user" | "chat";
        status?: string | null | undefined;
        avatar_url?: string | null | undefined;
        title?: string | null | undefined;
        meta?: Record<string, unknown> | undefined;
        subtitle?: string | null | undefined;
        participants?: string[] | undefined;
        link_hint?: string | null | undefined;
    } | undefined;
    timeline?: {
        id: string;
        created_at: string;
        event: string;
        reason?: string | null | undefined;
        meta?: Record<string, unknown> | undefined;
        actor_user_id?: string | null | undefined;
        actor_name?: string | null | undefined;
    }[] | undefined;
    actions?: {
        id: string;
        created_at: string;
        action: string;
        report_id: string;
        admin_user_id: string;
        reason?: string | null | undefined;
        case_id?: string | null | undefined;
        resolution?: "resolved" | "dismissed" | "case_opened" | "case_attached" | null | undefined;
        status_after?: "open" | "closed" | "triaged" | "escalated" | undefined;
    }[] | undefined;
}>;
export type ReportDetail = z.infer<typeof ReportDetailSchema>;
/** Query params for GET /reports list. */
export declare const ListReportsQuerySchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["open", "triaged", "escalated", "closed"]>>;
    entity_type: z.ZodOptional<z.ZodEnum<["task", "user", "chat", "booking"]>>;
    severity: z.ZodOptional<z.ZodEnum<["low", "medium", "high", "critical"]>>;
    assigned_admin_id: z.ZodOptional<z.ZodString>;
    assigned_to_me: z.ZodOptional<z.ZodBoolean>;
    q: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    status?: "open" | "closed" | "triaged" | "escalated" | undefined;
    entity_type?: "task" | "booking" | "user" | "chat" | undefined;
    severity?: "low" | "high" | "critical" | "medium" | undefined;
    q?: string | undefined;
    assigned_admin_id?: string | undefined;
    assigned_to_me?: boolean | undefined;
}, {
    page?: number | undefined;
    status?: "open" | "closed" | "triaged" | "escalated" | undefined;
    entity_type?: "task" | "booking" | "user" | "chat" | undefined;
    limit?: number | undefined;
    severity?: "low" | "high" | "critical" | "medium" | undefined;
    q?: string | undefined;
    assigned_admin_id?: string | undefined;
    assigned_to_me?: boolean | undefined;
}>;
export type ListReportsQuery = z.infer<typeof ListReportsQuerySchema>;
/** Body for POST /reports/:reportId/triage */
export declare const TriageReportInputSchema: z.ZodObject<{
    action: z.ZodEnum<["dismiss", "warn_user", "escalate", "close", "close_resolved"]>;
    reason: z.ZodString;
    case_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    reason: string;
    action: "dismiss" | "warn_user" | "escalate" | "close" | "close_resolved";
    case_id?: string | undefined;
}, {
    reason: string;
    action: "dismiss" | "warn_user" | "escalate" | "close" | "close_resolved";
    case_id?: string | undefined;
}>;
export type TriageReportInput = z.infer<typeof TriageReportInputSchema>;
/** Body for POST /reports/:reportId/close */
export declare const CloseReportInputSchema: z.ZodObject<{
    reason: z.ZodString;
    resolution: z.ZodDefault<z.ZodEnum<["resolved", "dismissed"]>>;
}, "strip", z.ZodTypeAny, {
    reason: string;
    resolution: "resolved" | "dismissed";
}, {
    reason: string;
    resolution?: "resolved" | "dismissed" | undefined;
}>;
export type CloseReportInput = z.infer<typeof CloseReportInputSchema>;
/** Body for POST /reports/:reportId/dismiss */
export declare const DismissReportInputSchema: z.ZodObject<{
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    reason: string;
}, {
    reason: string;
}>;
export type DismissReportInput = z.infer<typeof DismissReportInputSchema>;
/** Body for POST /reports/:reportId/escalate */
export declare const EscalateReportInputSchema: z.ZodObject<{
    reason: z.ZodString;
    case_id: z.ZodOptional<z.ZodString>;
    priority: z.ZodOptional<z.ZodEnum<["low", "medium", "high", "urgent"]>>;
    assignee_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    reason: string;
    case_id?: string | undefined;
    priority?: "low" | "high" | "urgent" | "medium" | undefined;
    assignee_id?: string | undefined;
}, {
    reason: string;
    case_id?: string | undefined;
    priority?: "low" | "high" | "urgent" | "medium" | undefined;
    assignee_id?: string | undefined;
}>;
export type EscalateReportInput = z.infer<typeof EscalateReportInputSchema>;
/** Body for POST /reports */
export declare const CreateReportInputSchema: z.ZodObject<{
    entity_type: z.ZodEnum<["task", "user", "chat", "booking"]>;
    entity_id: z.ZodString;
    reason: z.ZodString;
    category: z.ZodOptional<z.ZodString>;
    severity: z.ZodOptional<z.ZodEnum<["low", "medium", "high", "critical"]>>;
    reporter_user_id: z.ZodOptional<z.ZodString>;
    meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    reason: string;
    entity_type: "task" | "booking" | "user" | "chat";
    entity_id: string;
    category?: string | undefined;
    severity?: "low" | "high" | "critical" | "medium" | undefined;
    meta?: Record<string, unknown> | undefined;
    reporter_user_id?: string | undefined;
}, {
    reason: string;
    entity_type: "task" | "booking" | "user" | "chat";
    entity_id: string;
    category?: string | undefined;
    severity?: "low" | "high" | "critical" | "medium" | undefined;
    meta?: Record<string, unknown> | undefined;
    reporter_user_id?: string | undefined;
}>;
export type CreateReportInput = z.infer<typeof CreateReportInputSchema>;
/** Generic ack payload for report mutations. */
export declare const ReportMutationAckSchema: z.ZodObject<{
    id: z.ZodString;
    status: z.ZodOptional<z.ZodEnum<["open", "triaged", "escalated", "closed"]>>;
    resolution: z.ZodNullable<z.ZodOptional<z.ZodEnum<["dismissed", "resolved", "case_opened", "case_attached"]>>>;
    case_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    status?: "open" | "closed" | "triaged" | "escalated" | undefined;
    case_id?: string | undefined;
    resolution?: "resolved" | "dismissed" | "case_opened" | "case_attached" | null | undefined;
}, {
    id: string;
    status?: "open" | "closed" | "triaged" | "escalated" | undefined;
    case_id?: string | undefined;
    resolution?: "resolved" | "dismissed" | "case_opened" | "case_attached" | null | undefined;
}>;
export type ReportMutationAck = z.infer<typeof ReportMutationAckSchema>;
/** Response for POST /reports create flow. */
export declare const CreateReportResponseSchema: z.ZodObject<{
    id: z.ZodString;
    status: z.ZodEnum<["open", "triaged", "escalated", "closed"]>;
    resolution: z.ZodNullable<z.ZodOptional<z.ZodEnum<["dismissed", "resolved", "case_opened", "case_attached"]>>>;
}, "strip", z.ZodTypeAny, {
    status: "open" | "closed" | "triaged" | "escalated";
    id: string;
    resolution?: "resolved" | "dismissed" | "case_opened" | "case_attached" | null | undefined;
}, {
    status: "open" | "closed" | "triaged" | "escalated";
    id: string;
    resolution?: "resolved" | "dismissed" | "case_opened" | "case_attached" | null | undefined;
}>;
export type CreateReportResponse = z.infer<typeof CreateReportResponseSchema>;
export declare const ReportsTrendPointSchema: z.ZodObject<{
    date: z.ZodString;
    incoming: z.ZodNumber;
    resolved: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    date: string;
    resolved: number;
    incoming: number;
}, {
    date: string;
    resolved: number;
    incoming: number;
}>;
export type ReportsTrendPoint = z.infer<typeof ReportsTrendPointSchema>;
export declare const ReportsTrendResponseSchema: z.ZodObject<{
    window: z.ZodLiteral<"7d">;
    timezone: z.ZodLiteral<"UTC">;
    points: z.ZodArray<z.ZodObject<{
        date: z.ZodString;
        incoming: z.ZodNumber;
        resolved: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        date: string;
        resolved: number;
        incoming: number;
    }, {
        date: string;
        resolved: number;
        incoming: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    window: "7d";
    timezone: "UTC";
    points: {
        date: string;
        resolved: number;
        incoming: number;
    }[];
}, {
    window: "7d";
    timezone: "UTC";
    points: {
        date: string;
        resolved: number;
        incoming: number;
    }[];
}>;
export type ReportsTrendResponse = z.infer<typeof ReportsTrendResponseSchema>;
export declare const ReportsKpiKeyEnum: z.ZodEnum<["total", "open", "escalated", "closed"]>;
export type ReportsKpiKey = z.infer<typeof ReportsKpiKeyEnum>;
export declare const ReportsKpiCardAnalyticsSchema: z.ZodObject<{
    key: z.ZodEnum<["total", "open", "escalated", "closed"]>;
    count: z.ZodNumber;
    delta_absolute: z.ZodNumber;
    delta_percent: z.ZodNullable<z.ZodNumber>;
    trend: z.ZodArray<z.ZodNumber, "many">;
}, "strip", z.ZodTypeAny, {
    key: "open" | "closed" | "total" | "escalated";
    count: number;
    delta_absolute: number;
    delta_percent: number | null;
    trend: number[];
}, {
    key: "open" | "closed" | "total" | "escalated";
    count: number;
    delta_absolute: number;
    delta_percent: number | null;
    trend: number[];
}>;
export type ReportsKpiCardAnalytics = z.infer<typeof ReportsKpiCardAnalyticsSchema>;
export declare const ReportsKpisResponseSchema: z.ZodObject<{
    window: z.ZodLiteral<"7d">;
    comparison_window: z.ZodLiteral<"previous_7d">;
    cards: z.ZodArray<z.ZodObject<{
        key: z.ZodEnum<["total", "open", "escalated", "closed"]>;
        count: z.ZodNumber;
        delta_absolute: z.ZodNumber;
        delta_percent: z.ZodNullable<z.ZodNumber>;
        trend: z.ZodArray<z.ZodNumber, "many">;
    }, "strip", z.ZodTypeAny, {
        key: "open" | "closed" | "total" | "escalated";
        count: number;
        delta_absolute: number;
        delta_percent: number | null;
        trend: number[];
    }, {
        key: "open" | "closed" | "total" | "escalated";
        count: number;
        delta_absolute: number;
        delta_percent: number | null;
        trend: number[];
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    window: "7d";
    comparison_window: "previous_7d";
    cards: {
        key: "open" | "closed" | "total" | "escalated";
        count: number;
        delta_absolute: number;
        delta_percent: number | null;
        trend: number[];
    }[];
}, {
    window: "7d";
    comparison_window: "previous_7d";
    cards: {
        key: "open" | "closed" | "total" | "escalated";
        count: number;
        delta_absolute: number;
        delta_percent: number | null;
        trend: number[];
    }[];
}>;
export type ReportsKpisResponse = z.infer<typeof ReportsKpisResponseSchema>;
export declare const ListReportsResponseSchema: z.ZodObject<{
    reports: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        reporter_user_id: z.ZodNullable<z.ZodString>;
        entity_type: z.ZodEnum<["task", "user", "chat", "booking"]>;
        entity_id: z.ZodString;
        reason: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        category: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        status: z.ZodEnum<["open", "triaged", "escalated", "closed"]>;
        severity: z.ZodNullable<z.ZodOptional<z.ZodEnum<["low", "medium", "high", "critical"]>>>;
        resolution: z.ZodNullable<z.ZodOptional<z.ZodEnum<["dismissed", "resolved", "case_opened", "case_attached"]>>>;
        case_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        assigned_admin_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        sla_due_at: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        reporter: z.ZodOptional<z.ZodObject<{
            user_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            full_name: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            username: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            avatar_url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            trust_level: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            valid_reports_count: z.ZodOptional<z.ZodNumber>;
            total_reports_count: z.ZodOptional<z.ZodNumber>;
            relationship_to_entity: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            full_name?: string | null | undefined;
            avatar_url?: string | null | undefined;
            user_id?: string | null | undefined;
            username?: string | null | undefined;
            trust_level?: string | null | undefined;
            valid_reports_count?: number | undefined;
            total_reports_count?: number | undefined;
            relationship_to_entity?: string | null | undefined;
        }, {
            full_name?: string | null | undefined;
            avatar_url?: string | null | undefined;
            user_id?: string | null | undefined;
            username?: string | null | undefined;
            trust_level?: string | null | undefined;
            valid_reports_count?: number | undefined;
            total_reports_count?: number | undefined;
            relationship_to_entity?: string | null | undefined;
        }>>;
        entity: z.ZodOptional<z.ZodObject<{
            entity_type: z.ZodEnum<["task", "user", "chat", "booking"]>;
            title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            subtitle: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            status: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            avatar_url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            participants: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            link_hint: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            meta: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        }, "strip", z.ZodTypeAny, {
            entity_type: "task" | "booking" | "user" | "chat";
            meta: Record<string, unknown>;
            status?: string | null | undefined;
            avatar_url?: string | null | undefined;
            title?: string | null | undefined;
            subtitle?: string | null | undefined;
            participants?: string[] | undefined;
            link_hint?: string | null | undefined;
        }, {
            entity_type: "task" | "booking" | "user" | "chat";
            status?: string | null | undefined;
            avatar_url?: string | null | undefined;
            title?: string | null | undefined;
            meta?: Record<string, unknown> | undefined;
            subtitle?: string | null | undefined;
            participants?: string[] | undefined;
            link_hint?: string | null | undefined;
        }>>;
        created_at: z.ZodString;
        updated_at: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        status: "open" | "closed" | "triaged" | "escalated";
        id: string;
        created_at: string;
        updated_at: string;
        entity_type: "task" | "booking" | "user" | "chat";
        entity_id: string;
        reporter_user_id: string | null;
        reason?: string | null | undefined;
        case_id?: string | null | undefined;
        category?: string | null | undefined;
        severity?: "low" | "high" | "critical" | "medium" | null | undefined;
        resolution?: "resolved" | "dismissed" | "case_opened" | "case_attached" | null | undefined;
        assigned_admin_id?: string | null | undefined;
        sla_due_at?: string | null | undefined;
        reporter?: {
            full_name?: string | null | undefined;
            avatar_url?: string | null | undefined;
            user_id?: string | null | undefined;
            username?: string | null | undefined;
            trust_level?: string | null | undefined;
            valid_reports_count?: number | undefined;
            total_reports_count?: number | undefined;
            relationship_to_entity?: string | null | undefined;
        } | undefined;
        entity?: {
            entity_type: "task" | "booking" | "user" | "chat";
            meta: Record<string, unknown>;
            status?: string | null | undefined;
            avatar_url?: string | null | undefined;
            title?: string | null | undefined;
            subtitle?: string | null | undefined;
            participants?: string[] | undefined;
            link_hint?: string | null | undefined;
        } | undefined;
    }, {
        status: "open" | "closed" | "triaged" | "escalated";
        id: string;
        created_at: string;
        updated_at: string;
        entity_type: "task" | "booking" | "user" | "chat";
        entity_id: string;
        reporter_user_id: string | null;
        reason?: string | null | undefined;
        case_id?: string | null | undefined;
        category?: string | null | undefined;
        severity?: "low" | "high" | "critical" | "medium" | null | undefined;
        resolution?: "resolved" | "dismissed" | "case_opened" | "case_attached" | null | undefined;
        assigned_admin_id?: string | null | undefined;
        sla_due_at?: string | null | undefined;
        reporter?: {
            full_name?: string | null | undefined;
            avatar_url?: string | null | undefined;
            user_id?: string | null | undefined;
            username?: string | null | undefined;
            trust_level?: string | null | undefined;
            valid_reports_count?: number | undefined;
            total_reports_count?: number | undefined;
            relationship_to_entity?: string | null | undefined;
        } | undefined;
        entity?: {
            entity_type: "task" | "booking" | "user" | "chat";
            status?: string | null | undefined;
            avatar_url?: string | null | undefined;
            title?: string | null | undefined;
            meta?: Record<string, unknown> | undefined;
            subtitle?: string | null | undefined;
            participants?: string[] | undefined;
            link_hint?: string | null | undefined;
        } | undefined;
    }>, "many">;
    total: z.ZodNumber;
    page: z.ZodNumber;
    limit: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    total: number;
    reports: {
        status: "open" | "closed" | "triaged" | "escalated";
        id: string;
        created_at: string;
        updated_at: string;
        entity_type: "task" | "booking" | "user" | "chat";
        entity_id: string;
        reporter_user_id: string | null;
        reason?: string | null | undefined;
        case_id?: string | null | undefined;
        category?: string | null | undefined;
        severity?: "low" | "high" | "critical" | "medium" | null | undefined;
        resolution?: "resolved" | "dismissed" | "case_opened" | "case_attached" | null | undefined;
        assigned_admin_id?: string | null | undefined;
        sla_due_at?: string | null | undefined;
        reporter?: {
            full_name?: string | null | undefined;
            avatar_url?: string | null | undefined;
            user_id?: string | null | undefined;
            username?: string | null | undefined;
            trust_level?: string | null | undefined;
            valid_reports_count?: number | undefined;
            total_reports_count?: number | undefined;
            relationship_to_entity?: string | null | undefined;
        } | undefined;
        entity?: {
            entity_type: "task" | "booking" | "user" | "chat";
            meta: Record<string, unknown>;
            status?: string | null | undefined;
            avatar_url?: string | null | undefined;
            title?: string | null | undefined;
            subtitle?: string | null | undefined;
            participants?: string[] | undefined;
            link_hint?: string | null | undefined;
        } | undefined;
    }[];
}, {
    page: number;
    limit: number;
    total: number;
    reports: {
        status: "open" | "closed" | "triaged" | "escalated";
        id: string;
        created_at: string;
        updated_at: string;
        entity_type: "task" | "booking" | "user" | "chat";
        entity_id: string;
        reporter_user_id: string | null;
        reason?: string | null | undefined;
        case_id?: string | null | undefined;
        category?: string | null | undefined;
        severity?: "low" | "high" | "critical" | "medium" | null | undefined;
        resolution?: "resolved" | "dismissed" | "case_opened" | "case_attached" | null | undefined;
        assigned_admin_id?: string | null | undefined;
        sla_due_at?: string | null | undefined;
        reporter?: {
            full_name?: string | null | undefined;
            avatar_url?: string | null | undefined;
            user_id?: string | null | undefined;
            username?: string | null | undefined;
            trust_level?: string | null | undefined;
            valid_reports_count?: number | undefined;
            total_reports_count?: number | undefined;
            relationship_to_entity?: string | null | undefined;
        } | undefined;
        entity?: {
            entity_type: "task" | "booking" | "user" | "chat";
            status?: string | null | undefined;
            avatar_url?: string | null | undefined;
            title?: string | null | undefined;
            meta?: Record<string, unknown> | undefined;
            subtitle?: string | null | undefined;
            participants?: string[] | undefined;
            link_hint?: string | null | undefined;
        } | undefined;
    }[];
}>;
export type ListReportsResponse = z.infer<typeof ListReportsResponseSchema>;
/** Roles allowed to read reports (list/detail). */
export declare const REPORTS_READ_ROLES: string[];
/** Roles allowed to triage/close reports. */
export declare const REPORTS_WRITE_ROLES: string[];

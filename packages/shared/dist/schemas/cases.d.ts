import { z } from 'zod';
/** Case id for case-gated operations (e.g. chat access). */
export declare const CaseIdSchema: z.ZodString;
export type CaseId = z.infer<typeof CaseIdSchema>;
/** Entity types that can be attached to a case. */
export declare const CaseEntityTypeSchema: z.ZodEnum<["task", "user", "conversation", "booking", "dispute", "report"]>;
export type CaseEntityType = z.infer<typeof CaseEntityTypeSchema>;
/** Case workflow statuses. */
export declare const CaseStatusEnum: z.ZodEnum<["open", "in_progress", "pending", "closed"]>;
export type CaseStatus = z.infer<typeof CaseStatusEnum>;
/** Case priority levels. */
export declare const CasePriorityEnum: z.ZodEnum<["low", "medium", "high", "urgent"]>;
export type CasePriority = z.infer<typeof CasePriorityEnum>;
/** Minimal case reference for API responses. */
export declare const AdminCaseRefSchema: z.ZodObject<{
    id: z.ZodString;
    subject: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    status: z.ZodOptional<z.ZodUnion<[z.ZodEnum<["open", "in_progress", "pending", "closed"]>, z.ZodString]>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    status?: string | undefined;
    subject?: string | null | undefined;
}, {
    id: string;
    status?: string | undefined;
    subject?: string | null | undefined;
}>;
export type AdminCaseRef = z.infer<typeof AdminCaseRefSchema>;
/** Case as returned by API (PAGE 08). */
export declare const AdminCaseSchema: z.ZodObject<{
    id: z.ZodString;
    subject: z.ZodString;
    source: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodUnion<[z.ZodEnum<["open", "in_progress", "pending", "closed"]>, z.ZodString]>>;
    priority: z.ZodOptional<z.ZodUnion<[z.ZodEnum<["low", "medium", "high", "urgent"]>, z.ZodString]>>;
    case_code: z.ZodOptional<z.ZodString>;
    links_count: z.ZodOptional<z.ZodNumber>;
    created_at: z.ZodString;
    updated_at: z.ZodOptional<z.ZodString>;
    assignee_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    assignee_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    severity: z.ZodNullable<z.ZodOptional<z.ZodEnum<["low", "medium", "high", "critical"]>>>;
    sla_due_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    id: string;
    subject: string;
    created_at: string;
    status?: string | undefined;
    priority?: string | undefined;
    source?: string | undefined;
    assignee_id?: string | null | undefined;
    case_code?: string | undefined;
    links_count?: number | undefined;
    updated_at?: string | undefined;
    assignee_name?: string | null | undefined;
    severity?: "low" | "medium" | "high" | "critical" | null | undefined;
    sla_due_at?: string | null | undefined;
    tags?: string[] | undefined;
}, {
    id: string;
    subject: string;
    created_at: string;
    status?: string | undefined;
    priority?: string | undefined;
    source?: string | undefined;
    assignee_id?: string | null | undefined;
    case_code?: string | undefined;
    links_count?: number | undefined;
    updated_at?: string | undefined;
    assignee_name?: string | null | undefined;
    severity?: "low" | "medium" | "high" | "critical" | null | undefined;
    sla_due_at?: string | null | undefined;
    tags?: string[] | undefined;
}>;
export type AdminCase = z.infer<typeof AdminCaseSchema>;
/** Create case input (PAGE 08). */
export declare const AdminCaseCreateInputSchema: z.ZodObject<{
    subject: z.ZodString;
    priority: z.ZodDefault<z.ZodEnum<["low", "medium", "high", "urgent"]>>;
    source: z.ZodDefault<z.ZodString>;
    assignee_id: z.ZodOptional<z.ZodString>;
    idempotency_key: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    priority: "low" | "medium" | "high" | "urgent";
    source: string;
    subject: string;
    assignee_id?: string | undefined;
    idempotency_key?: string | undefined;
}, {
    subject: string;
    priority?: "low" | "medium" | "high" | "urgent" | undefined;
    source?: string | undefined;
    assignee_id?: string | undefined;
    idempotency_key?: string | undefined;
}>;
export type AdminCaseCreateInput = z.infer<typeof AdminCaseCreateInputSchema>;
/** Attach entity to case input. */
export declare const AdminCaseAttachEntityInputSchema: z.ZodObject<{
    entity_type: z.ZodEnum<["task", "user", "conversation", "booking", "dispute", "report"]>;
    entity_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    entity_type: "task" | "user" | "conversation" | "booking" | "dispute" | "report";
    entity_id: string;
}, {
    entity_type: "task" | "user" | "conversation" | "booking" | "dispute" | "report";
    entity_id: string;
}>;
export type AdminCaseAttachEntityInput = z.infer<typeof AdminCaseAttachEntityInputSchema>;
/** Safe query contract for server-side list filtering/sorting. */
export declare const AdminCasesListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    q: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<["all", "open", "in_progress", "escalated", "closed"]>>;
    priority: z.ZodDefault<z.ZodEnum<["all", "low", "medium", "high", "critical"]>>;
    source: z.ZodDefault<z.ZodString>;
    sort: z.ZodDefault<z.ZodEnum<["created_desc", "created_asc"]>>;
}, "strip", z.ZodTypeAny, {
    sort: "created_desc" | "created_asc";
    status: "open" | "in_progress" | "closed" | "all" | "escalated";
    page: number;
    limit: number;
    priority: "all" | "low" | "medium" | "high" | "critical";
    source: string;
    q?: string | undefined;
}, {
    sort?: "created_desc" | "created_asc" | undefined;
    status?: "open" | "in_progress" | "closed" | "all" | "escalated" | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    q?: string | undefined;
    priority?: "all" | "low" | "medium" | "high" | "critical" | undefined;
    source?: string | undefined;
}>;
export type AdminCasesListQuery = z.infer<typeof AdminCasesListQuerySchema>;
/** List response for GET /cases */
export declare const AdminCaseListResponseSchema: z.ZodObject<{
    cases: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        subject: z.ZodString;
        source: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodUnion<[z.ZodEnum<["open", "in_progress", "pending", "closed"]>, z.ZodString]>>;
        priority: z.ZodOptional<z.ZodUnion<[z.ZodEnum<["low", "medium", "high", "urgent"]>, z.ZodString]>>;
        case_code: z.ZodOptional<z.ZodString>;
        links_count: z.ZodOptional<z.ZodNumber>;
        created_at: z.ZodString;
        updated_at: z.ZodOptional<z.ZodString>;
        assignee_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        assignee_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        severity: z.ZodNullable<z.ZodOptional<z.ZodEnum<["low", "medium", "high", "critical"]>>>;
        sla_due_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        subject: string;
        created_at: string;
        status?: string | undefined;
        priority?: string | undefined;
        source?: string | undefined;
        assignee_id?: string | null | undefined;
        case_code?: string | undefined;
        links_count?: number | undefined;
        updated_at?: string | undefined;
        assignee_name?: string | null | undefined;
        severity?: "low" | "medium" | "high" | "critical" | null | undefined;
        sla_due_at?: string | null | undefined;
        tags?: string[] | undefined;
    }, {
        id: string;
        subject: string;
        created_at: string;
        status?: string | undefined;
        priority?: string | undefined;
        source?: string | undefined;
        assignee_id?: string | null | undefined;
        case_code?: string | undefined;
        links_count?: number | undefined;
        updated_at?: string | undefined;
        assignee_name?: string | null | undefined;
        severity?: "low" | "medium" | "high" | "critical" | null | undefined;
        sla_due_at?: string | null | undefined;
        tags?: string[] | undefined;
    }>, "many">;
    total: z.ZodNumber;
    page: z.ZodNumber;
    limit: z.ZodNumber;
    totalPages: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    total: number;
    page: number;
    limit: number;
    cases: {
        id: string;
        subject: string;
        created_at: string;
        status?: string | undefined;
        priority?: string | undefined;
        source?: string | undefined;
        assignee_id?: string | null | undefined;
        case_code?: string | undefined;
        links_count?: number | undefined;
        updated_at?: string | undefined;
        assignee_name?: string | null | undefined;
        severity?: "low" | "medium" | "high" | "critical" | null | undefined;
        sla_due_at?: string | null | undefined;
        tags?: string[] | undefined;
    }[];
    totalPages?: number | undefined;
}, {
    total: number;
    page: number;
    limit: number;
    cases: {
        id: string;
        subject: string;
        created_at: string;
        status?: string | undefined;
        priority?: string | undefined;
        source?: string | undefined;
        assignee_id?: string | null | undefined;
        case_code?: string | undefined;
        links_count?: number | undefined;
        updated_at?: string | undefined;
        assignee_name?: string | null | undefined;
        severity?: "low" | "medium" | "high" | "critical" | null | undefined;
        sla_due_at?: string | null | undefined;
        tags?: string[] | undefined;
    }[];
    totalPages?: number | undefined;
}>;
export type AdminCaseListResponse = z.infer<typeof AdminCaseListResponseSchema>;
/** Query string for hero analytics chart. */
export declare const AdminCasesAnalyticsQuerySchema: z.ZodObject<{
    window: z.ZodDefault<z.ZodEnum<["7d"]>>;
}, "strip", z.ZodTypeAny, {
    window: "7d";
}, {
    window?: "7d" | undefined;
}>;
export type AdminCasesAnalyticsQuery = z.infer<typeof AdminCasesAnalyticsQuerySchema>;
/** Single analytics point for a day bucket. */
export declare const AdminCasesAnalyticsPointSchema: z.ZodObject<{
    bucket_start: z.ZodString;
    value: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    value: number;
    bucket_start: string;
}, {
    value: number;
    bucket_start: string;
}>;
export type AdminCasesAnalyticsPoint = z.infer<typeof AdminCasesAnalyticsPointSchema>;
/** KPI ids rendered on the cases page cards. */
export declare const AdminCasesKpiIdSchema: z.ZodEnum<["total", "open", "in_progress", "escalated"]>;
export type AdminCasesKpiId = z.infer<typeof AdminCasesKpiIdSchema>;
/** KPI trend directions for visual indicators. */
export declare const AdminCasesKpiTrendSchema: z.ZodEnum<["up", "down", "neutral"]>;
export type AdminCasesKpiTrend = z.infer<typeof AdminCasesKpiTrendSchema>;
/** Live KPI trend payload used by Cases KPI cards. */
export declare const AdminCasesKpiItemSchema: z.ZodObject<{
    id: z.ZodEnum<["total", "open", "in_progress", "escalated"]>;
    value: z.ZodNumber;
    delta: z.ZodString;
    trend: z.ZodEnum<["up", "down", "neutral"]>;
    sparkline: z.ZodArray<z.ZodNumber, "many">;
}, "strip", z.ZodTypeAny, {
    value: number;
    id: "open" | "in_progress" | "total" | "escalated";
    delta: string;
    trend: "up" | "down" | "neutral";
    sparkline: number[];
}, {
    value: number;
    id: "open" | "in_progress" | "total" | "escalated";
    delta: string;
    trend: "up" | "down" | "neutral";
    sparkline: number[];
}>;
export type AdminCasesKpiItem = z.infer<typeof AdminCasesKpiItemSchema>;
/** Hero chart payload for opened vs closed cases. */
export declare const AdminCasesHeroSeriesSchema: z.ZodObject<{
    window: z.ZodLiteral<"7d">;
    opened: z.ZodArray<z.ZodObject<{
        bucket_start: z.ZodString;
        value: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        value: number;
        bucket_start: string;
    }, {
        value: number;
        bucket_start: string;
    }>, "many">;
    closed: z.ZodArray<z.ZodObject<{
        bucket_start: z.ZodString;
        value: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        value: number;
        bucket_start: string;
    }, {
        value: number;
        bucket_start: string;
    }>, "many">;
    kpis: z.ZodArray<z.ZodObject<{
        id: z.ZodEnum<["total", "open", "in_progress", "escalated"]>;
        value: z.ZodNumber;
        delta: z.ZodString;
        trend: z.ZodEnum<["up", "down", "neutral"]>;
        sparkline: z.ZodArray<z.ZodNumber, "many">;
    }, "strip", z.ZodTypeAny, {
        value: number;
        id: "open" | "in_progress" | "total" | "escalated";
        delta: string;
        trend: "up" | "down" | "neutral";
        sparkline: number[];
    }, {
        value: number;
        id: "open" | "in_progress" | "total" | "escalated";
        delta: string;
        trend: "up" | "down" | "neutral";
        sparkline: number[];
    }>, "many">;
    is_stale: z.ZodOptional<z.ZodBoolean>;
    generated_at: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    closed: {
        value: number;
        bucket_start: string;
    }[];
    window: "7d";
    opened: {
        value: number;
        bucket_start: string;
    }[];
    kpis: {
        value: number;
        id: "open" | "in_progress" | "total" | "escalated";
        delta: string;
        trend: "up" | "down" | "neutral";
        sparkline: number[];
    }[];
    is_stale?: boolean | undefined;
    generated_at?: string | undefined;
}, {
    closed: {
        value: number;
        bucket_start: string;
    }[];
    window: "7d";
    opened: {
        value: number;
        bucket_start: string;
    }[];
    kpis: {
        value: number;
        id: "open" | "in_progress" | "total" | "escalated";
        delta: string;
        trend: "up" | "down" | "neutral";
        sparkline: number[];
    }[];
    is_stale?: boolean | undefined;
    generated_at?: string | undefined;
}>;
export type AdminCasesHeroSeries = z.infer<typeof AdminCasesHeroSeriesSchema>;
/** Attached entity row in case detail. */
export declare const AdminCaseEntitySchema: z.ZodObject<{
    id: z.ZodString;
    case_id: z.ZodString;
    entity_type: z.ZodEnum<["task", "user", "conversation", "booking", "dispute", "report"]>;
    entity_id: z.ZodString;
    label: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    meta: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    created_at: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    entity_type: "task" | "user" | "conversation" | "booking" | "dispute" | "report";
    entity_id: string;
    case_id: string;
    meta: Record<string, unknown>;
    created_at?: string | undefined;
    label?: string | null | undefined;
}, {
    id: string;
    entity_type: "task" | "user" | "conversation" | "booking" | "dispute" | "report";
    entity_id: string;
    case_id: string;
    created_at?: string | undefined;
    label?: string | null | undefined;
    meta?: Record<string, unknown> | undefined;
}>;
export type AdminCaseEntity = z.infer<typeof AdminCaseEntitySchema>;
/** Case note visibility. */
export declare const CaseNoteVisibilityEnum: z.ZodEnum<["internal", "system"]>;
export type CaseNoteVisibility = z.infer<typeof CaseNoteVisibilityEnum>;
/** Case note item. */
export declare const AdminCaseNoteSchema: z.ZodObject<{
    id: z.ZodString;
    case_id: z.ZodString;
    admin_user_id: z.ZodString;
    note: z.ZodString;
    visibility: z.ZodDefault<z.ZodEnum<["internal", "system"]>>;
    created_at: z.ZodString;
    updated_at: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    note: string;
    visibility: "internal" | "system";
    case_id: string;
    admin_user_id: string;
    updated_at?: string | undefined;
}, {
    id: string;
    created_at: string;
    note: string;
    case_id: string;
    admin_user_id: string;
    updated_at?: string | undefined;
    visibility?: "internal" | "system" | undefined;
}>;
export type AdminCaseNote = z.infer<typeof AdminCaseNoteSchema>;
/** Evidence linked to a case (reports, chats, bookings, etc.). */
export declare const AdminCaseEvidenceSchema: z.ZodObject<{
    id: z.ZodString;
    case_id: z.ZodString;
    evidence_type: z.ZodString;
    entity_type: z.ZodString;
    entity_id: z.ZodString;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    created_at: z.ZodOptional<z.ZodString>;
    meta: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    entity_type: string;
    entity_id: string;
    case_id: string;
    meta: Record<string, unknown>;
    evidence_type: string;
    created_at?: string | undefined;
    title?: string | null | undefined;
}, {
    id: string;
    entity_type: string;
    entity_id: string;
    case_id: string;
    evidence_type: string;
    created_at?: string | undefined;
    meta?: Record<string, unknown> | undefined;
    title?: string | null | undefined;
}>;
export type AdminCaseEvidence = z.infer<typeof AdminCaseEvidenceSchema>;
/** Timeline event emitted while case lifecycle changes. */
export declare const AdminCaseTimelineItemSchema: z.ZodObject<{
    id: z.ZodString;
    case_id: z.ZodString;
    event: z.ZodString;
    actor_user_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    reason: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    created_at: z.ZodString;
    meta: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    created_at: string;
    case_id: string;
    meta: Record<string, unknown>;
    event: string;
    reason?: string | null | undefined;
    actor_user_id?: string | null | undefined;
}, {
    id: string;
    created_at: string;
    case_id: string;
    event: string;
    reason?: string | null | undefined;
    meta?: Record<string, unknown> | undefined;
    actor_user_id?: string | null | undefined;
}>;
export type AdminCaseTimelineItem = z.infer<typeof AdminCaseTimelineItemSchema>;
/** Case detail (case + entities + workspace details). */
export declare const AdminCaseDetailSchema: z.ZodObject<{
    id: z.ZodString;
    subject: z.ZodString;
    source: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodUnion<[z.ZodEnum<["open", "in_progress", "pending", "closed"]>, z.ZodString]>>;
    priority: z.ZodOptional<z.ZodUnion<[z.ZodEnum<["low", "medium", "high", "urgent"]>, z.ZodString]>>;
    case_code: z.ZodOptional<z.ZodString>;
    links_count: z.ZodOptional<z.ZodNumber>;
    created_at: z.ZodString;
    updated_at: z.ZodOptional<z.ZodString>;
    assignee_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    assignee_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    severity: z.ZodNullable<z.ZodOptional<z.ZodEnum<["low", "medium", "high", "critical"]>>>;
    sla_due_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
} & {
    entities: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        case_id: z.ZodString;
        entity_type: z.ZodEnum<["task", "user", "conversation", "booking", "dispute", "report"]>;
        entity_id: z.ZodString;
        label: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        meta: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        created_at: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        entity_type: "task" | "user" | "conversation" | "booking" | "dispute" | "report";
        entity_id: string;
        case_id: string;
        meta: Record<string, unknown>;
        created_at?: string | undefined;
        label?: string | null | undefined;
    }, {
        id: string;
        entity_type: "task" | "user" | "conversation" | "booking" | "dispute" | "report";
        entity_id: string;
        case_id: string;
        created_at?: string | undefined;
        label?: string | null | undefined;
        meta?: Record<string, unknown> | undefined;
    }>, "many">>;
    evidence: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        case_id: z.ZodString;
        evidence_type: z.ZodString;
        entity_type: z.ZodString;
        entity_id: z.ZodString;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        created_at: z.ZodOptional<z.ZodString>;
        meta: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        entity_type: string;
        entity_id: string;
        case_id: string;
        meta: Record<string, unknown>;
        evidence_type: string;
        created_at?: string | undefined;
        title?: string | null | undefined;
    }, {
        id: string;
        entity_type: string;
        entity_id: string;
        case_id: string;
        evidence_type: string;
        created_at?: string | undefined;
        meta?: Record<string, unknown> | undefined;
        title?: string | null | undefined;
    }>, "many">>;
    notes: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        case_id: z.ZodString;
        admin_user_id: z.ZodString;
        note: z.ZodString;
        visibility: z.ZodDefault<z.ZodEnum<["internal", "system"]>>;
        created_at: z.ZodString;
        updated_at: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        created_at: string;
        note: string;
        visibility: "internal" | "system";
        case_id: string;
        admin_user_id: string;
        updated_at?: string | undefined;
    }, {
        id: string;
        created_at: string;
        note: string;
        case_id: string;
        admin_user_id: string;
        updated_at?: string | undefined;
        visibility?: "internal" | "system" | undefined;
    }>, "many">>;
    timeline: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        case_id: z.ZodString;
        event: z.ZodString;
        actor_user_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        reason: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        created_at: z.ZodString;
        meta: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        created_at: string;
        case_id: string;
        meta: Record<string, unknown>;
        event: string;
        reason?: string | null | undefined;
        actor_user_id?: string | null | undefined;
    }, {
        id: string;
        created_at: string;
        case_id: string;
        event: string;
        reason?: string | null | undefined;
        meta?: Record<string, unknown> | undefined;
        actor_user_id?: string | null | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    id: string;
    subject: string;
    created_at: string;
    entities: {
        id: string;
        entity_type: "task" | "user" | "conversation" | "booking" | "dispute" | "report";
        entity_id: string;
        case_id: string;
        meta: Record<string, unknown>;
        created_at?: string | undefined;
        label?: string | null | undefined;
    }[];
    evidence: {
        id: string;
        entity_type: string;
        entity_id: string;
        case_id: string;
        meta: Record<string, unknown>;
        evidence_type: string;
        created_at?: string | undefined;
        title?: string | null | undefined;
    }[];
    notes: {
        id: string;
        created_at: string;
        note: string;
        visibility: "internal" | "system";
        case_id: string;
        admin_user_id: string;
        updated_at?: string | undefined;
    }[];
    timeline: {
        id: string;
        created_at: string;
        case_id: string;
        meta: Record<string, unknown>;
        event: string;
        reason?: string | null | undefined;
        actor_user_id?: string | null | undefined;
    }[];
    status?: string | undefined;
    priority?: string | undefined;
    source?: string | undefined;
    assignee_id?: string | null | undefined;
    case_code?: string | undefined;
    links_count?: number | undefined;
    updated_at?: string | undefined;
    assignee_name?: string | null | undefined;
    severity?: "low" | "medium" | "high" | "critical" | null | undefined;
    sla_due_at?: string | null | undefined;
    tags?: string[] | undefined;
}, {
    id: string;
    subject: string;
    created_at: string;
    status?: string | undefined;
    priority?: string | undefined;
    source?: string | undefined;
    assignee_id?: string | null | undefined;
    case_code?: string | undefined;
    links_count?: number | undefined;
    updated_at?: string | undefined;
    assignee_name?: string | null | undefined;
    severity?: "low" | "medium" | "high" | "critical" | null | undefined;
    sla_due_at?: string | null | undefined;
    tags?: string[] | undefined;
    entities?: {
        id: string;
        entity_type: "task" | "user" | "conversation" | "booking" | "dispute" | "report";
        entity_id: string;
        case_id: string;
        created_at?: string | undefined;
        label?: string | null | undefined;
        meta?: Record<string, unknown> | undefined;
    }[] | undefined;
    evidence?: {
        id: string;
        entity_type: string;
        entity_id: string;
        case_id: string;
        evidence_type: string;
        created_at?: string | undefined;
        meta?: Record<string, unknown> | undefined;
        title?: string | null | undefined;
    }[] | undefined;
    notes?: {
        id: string;
        created_at: string;
        note: string;
        case_id: string;
        admin_user_id: string;
        updated_at?: string | undefined;
        visibility?: "internal" | "system" | undefined;
    }[] | undefined;
    timeline?: {
        id: string;
        created_at: string;
        case_id: string;
        event: string;
        reason?: string | null | undefined;
        meta?: Record<string, unknown> | undefined;
        actor_user_id?: string | null | undefined;
    }[] | undefined;
}>;
export type AdminCaseDetail = z.infer<typeof AdminCaseDetailSchema>;
/** Assign case input. */
export declare const AdminCaseAssignInputSchema: z.ZodObject<{
    assignee_id: z.ZodNullable<z.ZodString>;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    assignee_id: string | null;
    reason: string;
}, {
    assignee_id: string | null;
    reason: string;
}>;
export type AdminCaseAssignInput = z.infer<typeof AdminCaseAssignInputSchema>;
/** Status transition input. */
export declare const AdminCaseStatusInputSchema: z.ZodObject<{
    status: z.ZodEnum<["open", "in_progress", "pending", "closed"]>;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "open" | "in_progress" | "pending" | "closed";
    reason: string;
}, {
    status: "open" | "in_progress" | "pending" | "closed";
    reason: string;
}>;
export type AdminCaseStatusInput = z.infer<typeof AdminCaseStatusInputSchema>;
/** Add note input. */
export declare const AdminCaseNoteInputSchema: z.ZodObject<{
    note: z.ZodString;
    visibility: z.ZodDefault<z.ZodEnum<["internal", "system"]>>;
}, "strip", z.ZodTypeAny, {
    note: string;
    visibility: "internal" | "system";
}, {
    note: string;
    visibility?: "internal" | "system" | undefined;
}>;
export type AdminCaseNoteInput = z.infer<typeof AdminCaseNoteInputSchema>;
/** Roles allowed to read/write cases. */
export declare const CASES_ROLES: string[];
export declare const CASES_WRITE_ROLES: string[];
export declare const CASES_DESTRUCTIVE_ROLES: string[];

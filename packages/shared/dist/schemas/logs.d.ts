import { z } from 'zod';
export type LogDTO = {
    id: string;
    event_type: string;
    entity_type: string;
    entity_id: string;
    metadata: any;
    created_at: string;
    actor: {
        id: string;
        full_name: string;
        email: string;
        avatar_url: string;
    } | undefined;
};
export declare const GetSystemLogsSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    actionFilter: z.ZodDefault<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    query: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    page: number;
    query: string;
    limit: number;
    actionFilter: string;
}, {
    page?: number | undefined;
    query?: string | undefined;
    limit?: number | undefined;
    actionFilter?: string | undefined;
}>;
export declare const GetLogsByTargetSchema: z.ZodObject<{
    targetId: z.ZodString;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    targetId: string;
}, {
    targetId: string;
    limit?: number | undefined;
}>;
export declare const LogLevelEnum: z.ZodEnum<["critical", "error", "warning", "info", "debug"]>;
export type LogLevel = z.infer<typeof LogLevelEnum>;
export declare const LogSortEnum: z.ZodEnum<["newest", "oldest"]>;
export type LogSort = z.infer<typeof LogSortEnum>;
export declare const LogListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    q: z.ZodOptional<z.ZodString>;
    action: z.ZodOptional<z.ZodString>;
    actorUserId: z.ZodOptional<z.ZodString>;
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
    level: z.ZodDefault<z.ZodUnion<[z.ZodLiteral<"all">, z.ZodEnum<["critical", "error", "warning", "info", "debug"]>]>>;
    source: z.ZodOptional<z.ZodString>;
    sort: z.ZodDefault<z.ZodEnum<["newest", "oldest"]>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    sort: "newest" | "oldest";
    limit: number;
    level: "all" | "info" | "warning" | "error" | "critical" | "debug";
    q?: string | undefined;
    action?: string | undefined;
    actorUserId?: string | undefined;
    from?: string | undefined;
    to?: string | undefined;
    source?: string | undefined;
}, {
    page?: number | undefined;
    sort?: "newest" | "oldest" | undefined;
    limit?: number | undefined;
    q?: string | undefined;
    action?: string | undefined;
    actorUserId?: string | undefined;
    from?: string | undefined;
    to?: string | undefined;
    level?: "all" | "info" | "warning" | "error" | "critical" | "debug" | undefined;
    source?: string | undefined;
}>;
export type LogListQuery = z.infer<typeof LogListQuerySchema>;
export declare const LogExportQuerySchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodNumber>;
    q: z.ZodOptional<z.ZodString>;
    action: z.ZodOptional<z.ZodString>;
    actorUserId: z.ZodOptional<z.ZodString>;
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
    level: z.ZodDefault<z.ZodUnion<[z.ZodLiteral<"all">, z.ZodEnum<["critical", "error", "warning", "info", "debug"]>]>>;
    source: z.ZodOptional<z.ZodString>;
    sort: z.ZodDefault<z.ZodEnum<["newest", "oldest"]>>;
}, "strip", z.ZodTypeAny, {
    sort: "newest" | "oldest";
    limit: number;
    level: "all" | "info" | "warning" | "error" | "critical" | "debug";
    q?: string | undefined;
    action?: string | undefined;
    actorUserId?: string | undefined;
    from?: string | undefined;
    to?: string | undefined;
    source?: string | undefined;
}, {
    sort?: "newest" | "oldest" | undefined;
    limit?: number | undefined;
    q?: string | undefined;
    action?: string | undefined;
    actorUserId?: string | undefined;
    from?: string | undefined;
    to?: string | undefined;
    level?: "all" | "info" | "warning" | "error" | "critical" | "debug" | undefined;
    source?: string | undefined;
}>;
export type LogExportQuery = z.infer<typeof LogExportQuerySchema>;
export declare const LogListItemSchema: z.ZodObject<{
    id: z.ZodString;
    action: z.ZodString;
    actorUserId: z.ZodNullable<z.ZodString>;
    actorName: z.ZodNullable<z.ZodString>;
    entityType: z.ZodNullable<z.ZodString>;
    entityId: z.ZodNullable<z.ZodString>;
    level: z.ZodEnum<["critical", "error", "warning", "info", "debug"]>;
    source: z.ZodString;
    message: z.ZodString;
    eventCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    requestId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    href: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    createdAt: z.ZodString;
    meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    message: string;
    id: string;
    entityType: string | null;
    entityId: string | null;
    action: string;
    actorUserId: string | null;
    level: "info" | "warning" | "error" | "critical" | "debug";
    source: string;
    actorName: string | null;
    createdAt: string;
    requestId?: string | null | undefined;
    eventCode?: string | null | undefined;
    href?: string | null | undefined;
    meta?: Record<string, unknown> | undefined;
}, {
    message: string;
    id: string;
    entityType: string | null;
    entityId: string | null;
    action: string;
    actorUserId: string | null;
    level: "info" | "warning" | "error" | "critical" | "debug";
    source: string;
    actorName: string | null;
    createdAt: string;
    requestId?: string | null | undefined;
    eventCode?: string | null | undefined;
    href?: string | null | undefined;
    meta?: Record<string, unknown> | undefined;
}>;
export type LogListItem = z.infer<typeof LogListItemSchema>;
export declare const LogSummarySchema: z.ZodObject<{
    total: z.ZodNumber;
    critical: z.ZodNumber;
    error: z.ZodNumber;
    warning: z.ZodNumber;
    info: z.ZodNumber;
    debug: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    info: number;
    warning: number;
    error: number;
    critical: number;
    debug: number;
    total: number;
}, {
    info: number;
    warning: number;
    error: number;
    critical: number;
    debug: number;
    total: number;
}>;
export type LogSummary = z.infer<typeof LogSummarySchema>;
export declare const LogHourlyBucketSchema: z.ZodObject<{
    label: z.ZodString;
    critical: z.ZodNumber;
    error: z.ZodNumber;
    warning: z.ZodNumber;
    info: z.ZodNumber;
    debug: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    info: number;
    warning: number;
    error: number;
    critical: number;
    debug: number;
    label: string;
}, {
    info: number;
    warning: number;
    error: number;
    critical: number;
    debug: number;
    label: string;
}>;
export type LogHourlyBucket = z.infer<typeof LogHourlyBucketSchema>;
export declare const LogListResponseSchema: z.ZodObject<{
    logs: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        action: z.ZodString;
        actorUserId: z.ZodNullable<z.ZodString>;
        actorName: z.ZodNullable<z.ZodString>;
        entityType: z.ZodNullable<z.ZodString>;
        entityId: z.ZodNullable<z.ZodString>;
        level: z.ZodEnum<["critical", "error", "warning", "info", "debug"]>;
        source: z.ZodString;
        message: z.ZodString;
        eventCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        requestId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        href: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        createdAt: z.ZodString;
        meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        message: string;
        id: string;
        entityType: string | null;
        entityId: string | null;
        action: string;
        actorUserId: string | null;
        level: "info" | "warning" | "error" | "critical" | "debug";
        source: string;
        actorName: string | null;
        createdAt: string;
        requestId?: string | null | undefined;
        eventCode?: string | null | undefined;
        href?: string | null | undefined;
        meta?: Record<string, unknown> | undefined;
    }, {
        message: string;
        id: string;
        entityType: string | null;
        entityId: string | null;
        action: string;
        actorUserId: string | null;
        level: "info" | "warning" | "error" | "critical" | "debug";
        source: string;
        actorName: string | null;
        createdAt: string;
        requestId?: string | null | undefined;
        eventCode?: string | null | undefined;
        href?: string | null | undefined;
        meta?: Record<string, unknown> | undefined;
    }>, "many">;
    count: z.ZodNumber;
    totalPages: z.ZodNumber;
    page: z.ZodNumber;
    sourceOptions: z.ZodArray<z.ZodString, "many">;
    summary: z.ZodObject<{
        total: z.ZodNumber;
        critical: z.ZodNumber;
        error: z.ZodNumber;
        warning: z.ZodNumber;
        info: z.ZodNumber;
        debug: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        info: number;
        warning: number;
        error: number;
        critical: number;
        debug: number;
        total: number;
    }, {
        info: number;
        warning: number;
        error: number;
        critical: number;
        debug: number;
        total: number;
    }>;
    hourlyBuckets: z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        critical: z.ZodNumber;
        error: z.ZodNumber;
        warning: z.ZodNumber;
        info: z.ZodNumber;
        debug: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        info: number;
        warning: number;
        error: number;
        critical: number;
        debug: number;
        label: string;
    }, {
        info: number;
        warning: number;
        error: number;
        critical: number;
        debug: number;
        label: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    page: number;
    totalPages: number;
    summary: {
        info: number;
        warning: number;
        error: number;
        critical: number;
        debug: number;
        total: number;
    };
    logs: {
        message: string;
        id: string;
        entityType: string | null;
        entityId: string | null;
        action: string;
        actorUserId: string | null;
        level: "info" | "warning" | "error" | "critical" | "debug";
        source: string;
        actorName: string | null;
        createdAt: string;
        requestId?: string | null | undefined;
        eventCode?: string | null | undefined;
        href?: string | null | undefined;
        meta?: Record<string, unknown> | undefined;
    }[];
    count: number;
    sourceOptions: string[];
    hourlyBuckets: {
        info: number;
        warning: number;
        error: number;
        critical: number;
        debug: number;
        label: string;
    }[];
}, {
    page: number;
    totalPages: number;
    summary: {
        info: number;
        warning: number;
        error: number;
        critical: number;
        debug: number;
        total: number;
    };
    logs: {
        message: string;
        id: string;
        entityType: string | null;
        entityId: string | null;
        action: string;
        actorUserId: string | null;
        level: "info" | "warning" | "error" | "critical" | "debug";
        source: string;
        actorName: string | null;
        createdAt: string;
        requestId?: string | null | undefined;
        eventCode?: string | null | undefined;
        href?: string | null | undefined;
        meta?: Record<string, unknown> | undefined;
    }[];
    count: number;
    sourceOptions: string[];
    hourlyBuckets: {
        info: number;
        warning: number;
        error: number;
        critical: number;
        debug: number;
        label: string;
    }[];
}>;
export type LogListResponse = z.infer<typeof LogListResponseSchema>;
export declare const LOGS_READ_ROLES: readonly ["support", "moderator", "admin", "super_admin"];

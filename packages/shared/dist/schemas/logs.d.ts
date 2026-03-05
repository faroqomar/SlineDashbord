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
    limit: number;
    page: number;
    actionFilter: string;
    query: string;
}, {
    limit?: number | undefined;
    page?: number | undefined;
    actionFilter?: string | undefined;
    query?: string | undefined;
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
export declare const LogEntryStatusEnum: z.ZodEnum<["success", "warning", "error", "info"]>;
export type LogEntryStatus = z.infer<typeof LogEntryStatusEnum>;
export declare const LogListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    action: z.ZodOptional<z.ZodString>;
    actorUserId: z.ZodOptional<z.ZodString>;
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    to?: string | undefined;
    action?: string | undefined;
    actorUserId?: string | undefined;
    from?: string | undefined;
}, {
    to?: string | undefined;
    limit?: number | undefined;
    action?: string | undefined;
    page?: number | undefined;
    actorUserId?: string | undefined;
    from?: string | undefined;
}>;
export type LogListQuery = z.infer<typeof LogListQuerySchema>;
export declare const LogListItemSchema: z.ZodObject<{
    id: z.ZodString;
    action: z.ZodString;
    actorUserId: z.ZodNullable<z.ZodString>;
    actorName: z.ZodNullable<z.ZodString>;
    entityType: z.ZodNullable<z.ZodString>;
    entityId: z.ZodNullable<z.ZodString>;
    status: z.ZodEnum<["success", "warning", "error", "info"]>;
    createdAt: z.ZodString;
    meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    status: "success" | "error" | "warning" | "info";
    id: string;
    action: string;
    entityType: string | null;
    entityId: string | null;
    actorUserId: string | null;
    actorName: string | null;
    createdAt: string;
    meta?: Record<string, unknown> | undefined;
}, {
    status: "success" | "error" | "warning" | "info";
    id: string;
    action: string;
    entityType: string | null;
    entityId: string | null;
    actorUserId: string | null;
    actorName: string | null;
    createdAt: string;
    meta?: Record<string, unknown> | undefined;
}>;
export type LogListItem = z.infer<typeof LogListItemSchema>;
export declare const LogListResponseSchema: z.ZodObject<{
    logs: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        action: z.ZodString;
        actorUserId: z.ZodNullable<z.ZodString>;
        actorName: z.ZodNullable<z.ZodString>;
        entityType: z.ZodNullable<z.ZodString>;
        entityId: z.ZodNullable<z.ZodString>;
        status: z.ZodEnum<["success", "warning", "error", "info"]>;
        createdAt: z.ZodString;
        meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        status: "success" | "error" | "warning" | "info";
        id: string;
        action: string;
        entityType: string | null;
        entityId: string | null;
        actorUserId: string | null;
        actorName: string | null;
        createdAt: string;
        meta?: Record<string, unknown> | undefined;
    }, {
        status: "success" | "error" | "warning" | "info";
        id: string;
        action: string;
        entityType: string | null;
        entityId: string | null;
        actorUserId: string | null;
        actorName: string | null;
        createdAt: string;
        meta?: Record<string, unknown> | undefined;
    }>, "many">;
    count: z.ZodNumber;
    totalPages: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    count: number;
    totalPages: number;
    logs: {
        status: "success" | "error" | "warning" | "info";
        id: string;
        action: string;
        entityType: string | null;
        entityId: string | null;
        actorUserId: string | null;
        actorName: string | null;
        createdAt: string;
        meta?: Record<string, unknown> | undefined;
    }[];
}, {
    count: number;
    totalPages: number;
    logs: {
        status: "success" | "error" | "warning" | "info";
        id: string;
        action: string;
        entityType: string | null;
        entityId: string | null;
        actorUserId: string | null;
        actorName: string | null;
        createdAt: string;
        meta?: Record<string, unknown> | undefined;
    }[];
}>;
export type LogListResponse = z.infer<typeof LogListResponseSchema>;
export declare const LOGS_READ_ROLES: readonly ["support", "moderator", "admin", "super_admin"];

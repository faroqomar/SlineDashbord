import { z } from 'zod';
export const GetSystemLogsSchema = z.object({
    page: z.number().int().positive().default(1),
    actionFilter: z.string().default('all'),
    limit: z.number().int().positive().max(100).default(20),
    query: z.string().default(''),
});
export const GetLogsByTargetSchema = z.object({
    targetId: z.string().uuid("Invalid Target ID"),
    limit: z.number().int().positive().max(100).default(20),
});
export const LogLevelEnum = z.enum(['critical', 'error', 'warning', 'info', 'debug']);
export const LogSortEnum = z.enum(['newest', 'oldest']);
export const LogListQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    q: z.string().trim().min(1).optional(),
    action: z.string().trim().min(1).optional(),
    actorUserId: z.string().uuid().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    level: z.union([z.literal('all'), LogLevelEnum]).default('all'),
    source: z.string().trim().min(1).optional(),
    sort: LogSortEnum.default('newest'),
});
export const LogExportQuerySchema = z.object({
    limit: z.coerce.number().int().positive().max(10000).default(10000),
    q: z.string().trim().min(1).optional(),
    action: z.string().trim().min(1).optional(),
    actorUserId: z.string().uuid().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    level: z.union([z.literal('all'), LogLevelEnum]).default('all'),
    source: z.string().trim().min(1).optional(),
    sort: LogSortEnum.default('newest'),
});
export const LogListItemSchema = z.object({
    id: z.string().uuid(),
    action: z.string(),
    actorUserId: z.string().uuid().nullable(),
    actorName: z.string().nullable(),
    entityType: z.string().nullable(),
    entityId: z.string().nullable(),
    level: LogLevelEnum,
    source: z.string(),
    message: z.string(),
    eventCode: z.string().nullable().optional(),
    requestId: z.string().nullable().optional(),
    href: z.string().nullable().optional(),
    createdAt: z.string(),
    meta: z.record(z.unknown()).optional(),
});
export const LogSummarySchema = z.object({
    total: z.number().int().nonnegative(),
    critical: z.number().int().nonnegative(),
    error: z.number().int().nonnegative(),
    warning: z.number().int().nonnegative(),
    info: z.number().int().nonnegative(),
    debug: z.number().int().nonnegative(),
});
export const LogHourlyBucketSchema = z.object({
    label: z.string(),
    critical: z.number().int().nonnegative(),
    error: z.number().int().nonnegative(),
    warning: z.number().int().nonnegative(),
    info: z.number().int().nonnegative(),
    debug: z.number().int().nonnegative(),
});
export const LogListResponseSchema = z.object({
    logs: z.array(LogListItemSchema),
    count: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    sourceOptions: z.array(z.string()),
    summary: LogSummarySchema,
    hourlyBuckets: z.array(LogHourlyBucketSchema),
});
export const LOGS_READ_ROLES = ['support', 'moderator', 'admin', 'super_admin'];

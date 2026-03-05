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
export const LogEntryStatusEnum = z.enum(['success', 'warning', 'error', 'info']);
export const LogListQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    action: z.string().trim().min(1).optional(),
    actorUserId: z.string().uuid().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
});
export const LogListItemSchema = z.object({
    id: z.string().uuid(),
    action: z.string(),
    actorUserId: z.string().uuid().nullable(),
    actorName: z.string().nullable(),
    entityType: z.string().nullable(),
    entityId: z.string().nullable(),
    status: LogEntryStatusEnum,
    createdAt: z.string(),
    meta: z.record(z.unknown()).optional(),
});
export const LogListResponseSchema = z.object({
    logs: z.array(LogListItemSchema),
    count: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
});
export const LOGS_READ_ROLES = ['support', 'moderator', 'admin', 'super_admin'];

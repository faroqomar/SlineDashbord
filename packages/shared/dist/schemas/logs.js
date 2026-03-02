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
export const LOGS_READ_ROLES = ['admin', 'super_admin'];

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
export type LogLevel = z.infer<typeof LogLevelEnum>;

export const LogSortEnum = z.enum(['newest', 'oldest']);
export type LogSort = z.infer<typeof LogSortEnum>;

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
export type LogListQuery = z.infer<typeof LogListQuerySchema>;

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
export type LogExportQuery = z.infer<typeof LogExportQuerySchema>;

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
export type LogListItem = z.infer<typeof LogListItemSchema>;

export const LogSummarySchema = z.object({
  total: z.number().int().nonnegative(),
  critical: z.number().int().nonnegative(),
  error: z.number().int().nonnegative(),
  warning: z.number().int().nonnegative(),
  info: z.number().int().nonnegative(),
  debug: z.number().int().nonnegative(),
});
export type LogSummary = z.infer<typeof LogSummarySchema>;

export const LogHourlyBucketSchema = z.object({
  label: z.string(),
  critical: z.number().int().nonnegative(),
  error: z.number().int().nonnegative(),
  warning: z.number().int().nonnegative(),
  info: z.number().int().nonnegative(),
  debug: z.number().int().nonnegative(),
});
export type LogHourlyBucket = z.infer<typeof LogHourlyBucketSchema>;

export const LogListResponseSchema = z.object({
  logs: z.array(LogListItemSchema),
  count: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  sourceOptions: z.array(z.string()),
  summary: LogSummarySchema,
  hourlyBuckets: z.array(LogHourlyBucketSchema),
});
export type LogListResponse = z.infer<typeof LogListResponseSchema>;

export const LOGS_READ_ROLES = ['support', 'moderator', 'admin', 'super_admin'] as const;

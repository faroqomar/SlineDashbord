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

export const LogEntryStatusEnum = z.enum(['success', 'warning', 'error', 'info']);
export type LogEntryStatus = z.infer<typeof LogEntryStatusEnum>;

export const LogListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  action: z.string().trim().min(1).optional(),
  actorUserId: z.string().uuid().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});
export type LogListQuery = z.infer<typeof LogListQuerySchema>;

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
export type LogListItem = z.infer<typeof LogListItemSchema>;

export const LogListResponseSchema = z.object({
  logs: z.array(LogListItemSchema),
  count: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});
export type LogListResponse = z.infer<typeof LogListResponseSchema>;

export const LOGS_READ_ROLES = ['support', 'moderator', 'admin', 'super_admin'] as const;

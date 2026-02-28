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

export const LOGS_READ_ROLES = ['admin', 'super_admin'];

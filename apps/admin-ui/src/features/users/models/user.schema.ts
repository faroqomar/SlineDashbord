import { z } from 'zod';

export const GetUsersSchema = z.object({
  page: z.number().int().positive().default(1),
  query: z.string().default(''),
  role: z.string().default('all'),
  statusTab: z.enum(['all', 'active', 'inactive']).default('all'),
});

export const GetUserDetailsSchema = z.object({
  id: z.string().uuid("Invalid User ID"),
});

export const SuspendUserSchema = z.object({
  id: z.string().uuid("Invalid User ID"),
  reason: z.string().min(5, "Reason must be at least 5 characters").max(500, "Reason is too long"),
  duration: z.enum(['24h', '30d', 'permanent']).default('24h'),
});

export const BanUserSchema = z.object({
  userId: z.string().uuid("Invalid User ID"),
  reason: z.string().min(5, "Reason must be at least 5 characters").max(500, "Reason is too long"),
});

export const UnbanUserSchema = z.object({
  userId: z.string().uuid("Invalid User ID"),
});

export const VerifyUserSchema = z.object({
  userId: z.string().uuid("Invalid User ID"),
});

// Role Access Control Definitions
export const USERS_READ_ROLES = ['support', 'moderator', 'admin', 'super_admin'];
export const USERS_WRITE_ROLES = ['admin', 'super_admin'];

import { z } from 'zod';

export type AdminUserDTO = {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  role: string;
  status: string;
  last_active_at: string;
  created_at: string;
};

export const InviteMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(['support', 'moderator', 'admin', 'super_admin']),
  fullName: z.string().min(2, "Name too short").max(100),
});

export const UpdateRoleSchema = z.object({
  userId: z.string().uuid("Invalid User ID"),
  newRole: z.enum(['support', 'moderator', 'admin', 'super_admin']),
});

export const RemoveMemberSchema = z.object({
  userId: z.string().uuid("Invalid User ID"),
});

export const TEAM_READ_ROLES = ['admin', 'super_admin'];
export const TEAM_WRITE_ROLES = ['super_admin'];

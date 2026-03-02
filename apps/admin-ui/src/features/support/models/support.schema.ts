import { z } from 'zod';

export const SupportTicketSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  subject: z.string(),
  category: z.string().optional(),
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']),
  priority: z.enum(['low', 'normal', 'high', 'urgent']),
  created_at: z.string(),
  updated_at: z.string(),
  user: z.object({
    id: z.string(),
    full_name: z.string(),
    email: z.string(),
    avatar_url: z.string().nullable()
  }).optional(),
  assignee: z.object({
    id: z.string(),
    full_name: z.string(),
    avatar_url: z.string().nullable()
  }).optional(),
  last_message: z.string().optional(),
});

export type SupportTicketDTO = z.infer<typeof SupportTicketSchema>;

export const GetTicketsSchema = z.object({
  page: z.number().int().positive().default(1),
  status: z.string().default('all'),
  limit: z.number().int().positive().max(100).default(10),
});

export const UpdateTicketStatusSchema = z.object({
  id: z.string().uuid("Invalid Ticket ID"),
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']),
});

export const SUPPORT_READ_ROLES = ['support', 'moderator', 'admin', 'super_admin'];
export const SUPPORT_WRITE_ROLES = ['support', 'moderator', 'admin', 'super_admin'];

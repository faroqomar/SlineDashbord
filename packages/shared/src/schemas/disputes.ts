import { z } from 'zod';

export type DisputeDTO = {
  id: string;
  task_id: string;
  reporter_id: string;
  reported_id: string;
  reason: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'escalated';
  resolution?: string;
  created_at: string;
  updated_at: string;
  reporter: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
  reported: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
  task: {
    title: string;
    budget: number;
    status: string;
  };
};

export const GetDisputesSchema = z.object({
  page: z.number().int().positive().default(1),
  status: z.string().default('all'),
  limit: z.number().int().positive().max(100).default(10),
});

export const UpdateDisputeStatusSchema = z.object({
  id: z.string().uuid("Invalid Dispute ID"),
  status: z.enum(['open', 'in_progress', 'resolved', 'escalated']),
  resolution: z.string().optional(),
  decision: z.enum(['refund_client', 'release_freelancer']).optional(),
});

export const CreateDisputeInputSchema = z.object({
  task_id: z.string().uuid('Invalid task ID'),
  complainant_id: z.string().uuid('Invalid complainant ID'),
  defendant_id: z.string().uuid('Invalid defendant ID'),
  reason: z.string().trim().min(5, 'Reason must be at least 5 characters').max(500, 'Reason must be at most 500 characters'),
}).refine((data) => data.complainant_id !== data.defendant_id, {
  message: 'Complainant and defendant must be different users',
  path: ['defendant_id'],
});
export type CreateDisputeInput = z.infer<typeof CreateDisputeInputSchema>;

export const CreateDisputeAckSchema = z.object({
  id: z.string().uuid(),
});
export type CreateDisputeAck = z.infer<typeof CreateDisputeAckSchema>;

export const DISPUTES_READ_ROLES = ['support', 'moderator', 'admin', 'super_admin'];
export const DISPUTES_WRITE_ROLES = ['moderator', 'admin', 'super_admin'];

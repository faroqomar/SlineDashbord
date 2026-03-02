import { z } from 'zod';

export interface DisputeDTO {
  id: string;
  task_id: string;
  task_title: string;
  complainant: {
    id: string;
    full_name: string;
    avatar_url: string;
    email: string;
    role: string;
  };
  defendant: {
     id: string;
    full_name: string;
    avatar_url: string;
    email: string;
    role: string;
  };
  reason: string;
  status: 'open' | 'in_progress' | 'resolved' | 'escalated';
  amount: number;
  created_at: string;
  resolution?: string;
  resolved_at?: string;
  task?: {
    id: string;
    title: string;
    description: string;
    budget: number;
    status: string;
  };
  messages?: any[];
  evidence?: any[];
}

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

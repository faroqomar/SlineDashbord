import { z } from 'zod';
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
export const DISPUTES_READ_ROLES = ['support', 'moderator', 'admin', 'super_admin'];
export const DISPUTES_WRITE_ROLES = ['moderator', 'admin', 'super_admin'];

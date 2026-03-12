import { z } from 'zod';
// --- Canonical dispute status (SQL-enforced FSM: open → active | canceled; active → resolved) ---
export const DisputeStatusEnum = z.enum(['open', 'active', 'resolved', 'canceled']);
// --- List / queue ---
export const GetDisputesSchema = z.object({
    page: z.number().int().positive().default(1),
    status: z.enum(['all', 'open', 'active', 'resolved', 'canceled']).default('all'),
    limit: z.number().int().positive().max(100).default(10),
});
export const DisputeQueueRowSchema = z.object({
    id: z.string().uuid(),
    task_id: z.string().uuid(),
    status: DisputeStatusEnum,
    reason: z.string(),
    created_at: z.string(),
    updated_at: z.string().optional(),
    resolved_at: z.string().optional().nullable(),
    complainant: z.object({
        id: z.string().uuid(),
        full_name: z.string(),
        avatar_url: z.string().optional().nullable(),
    }).optional(),
    defendant: z.object({
        id: z.string().uuid(),
        full_name: z.string(),
        avatar_url: z.string().optional().nullable(),
    }).optional(),
    task: z.object({
        id: z.string().uuid(),
        title: z.string(),
        budget: z.number().optional(),
        budget_cents: z.number().optional(),
    }).optional(),
    amount: z.number().optional(),
    comments_count: z.number().optional(),
    category: z.string().optional(),
    severity: z.enum(['low', 'med', 'high', 'crit']).optional(),
});
export const DisputeTabCountsSchema = z.object({
    all: z.number().int().min(0),
    open: z.number().int().min(0),
    active: z.number().int().min(0),
    resolved: z.number().int().min(0),
    canceled: z.number().int().min(0),
});
export const DisputeListResponseSchema = z.object({
    disputes: z.array(DisputeQueueRowSchema),
    totalDisputes: z.number().int().min(0),
    totalPages: z.number().int().min(0),
    tabCounts: DisputeTabCountsSchema.optional(),
});
// --- Detail: entity context, messages/evidence, booking candidates, action availability ---
export const BookingCandidateSchema = z.object({
    booking_id: z.string().uuid(),
    status: z.string(),
    client_id: z.string().uuid().optional(),
    provider_id: z.string().uuid().optional(),
    amount_cents: z.number().optional(),
});
export const DisputeActionAvailabilitySchema = z.object({
    can_accept: z.boolean(),
    can_cancel: z.boolean(),
    can_resolve: z.boolean(),
    requires_booking_id: z.boolean().optional(),
});
export const DisputeDetailSchema = z.object({
    id: z.string().uuid(),
    task_id: z.string().uuid().nullable(),
    direct_offer_id: z.string().uuid().nullable().optional(),
    status: DisputeStatusEnum,
    reason: z.string(),
    resolution: z.string().optional().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
    resolved_at: z.string().optional().nullable(),
    complainant: z.object({
        id: z.string().uuid(),
        full_name: z.string(),
        email: z.string().optional(),
        avatar_url: z.string().optional().nullable(),
    }).optional(),
    defendant: z.object({
        id: z.string().uuid(),
        full_name: z.string(),
        email: z.string().optional(),
        avatar_url: z.string().optional().nullable(),
    }).optional(),
    task: z.object({
        id: z.string().uuid(),
        title: z.string(),
        description: z.string().optional(),
        budget: z.number().optional(),
        budget_cents: z.number().optional(),
        status: z.string(),
        deadline: z.string().optional(),
    }).optional().nullable(),
    amount: z.number().optional(),
    messages: z.array(z.object({
        id: z.string(),
        content: z.string(),
        created_at: z.string(),
        is_admin: z.boolean().optional(),
        sender: z.object({ full_name: z.string() }).optional(),
    })).optional(),
    evidence: z.array(z.object({
        id: z.string(),
        file_url: z.string(),
        file_type: z.string().optional(),
        description: z.string().optional(),
        created_at: z.string(),
        uploader: z.object({ full_name: z.string() }).optional(),
    })).optional(),
    booking_candidates: z.array(BookingCandidateSchema).optional(),
    action_availability: DisputeActionAvailabilitySchema.optional(),
});
// --- Admin actions (reason required for cancel/resolve) ---
export const AdminAcceptDisputeInputSchema = z.object({
    dispute_id: z.string().uuid('Invalid Dispute ID'),
});
export const AdminCancelDisputeInputSchema = z.object({
    dispute_id: z.string().uuid('Invalid Dispute ID'),
    reason: z.string().trim().min(1, 'Reason is required for cancel'),
});
export const ResolveOutcomeEnum = z.enum(['refund_client', 'release_freelancer', 'no_financial']);
export const AdminResolveDisputeInputSchema = z.object({
    dispute_id: z.string().uuid('Invalid Dispute ID'),
    reason: z.string().trim().min(1, 'Reason is required for resolve'),
    outcome: ResolveOutcomeEnum.optional(),
    booking_id: z.string().uuid().optional(),
});
// --- Legacy / existing (keep for backward compatibility during migration) ---
export const UpdateDisputeStatusSchema = z.object({
    id: z.string().uuid("Invalid Dispute ID"),
    status: DisputeStatusEnum,
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
export const CreateDisputeAckSchema = z.object({
    id: z.string().uuid(),
});
export const DISPUTES_READ_ROLES = ['support', 'moderator', 'admin', 'super_admin'];
export const DISPUTES_WRITE_ROLES = ['moderator', 'admin', 'super_admin'];

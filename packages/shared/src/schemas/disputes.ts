import { z } from 'zod';

// --- Canonical dispute status (SQL-enforced FSM: open → active | canceled; active → resolved) ---
export const DisputeStatusEnum = z.enum(['open', 'active', 'resolved', 'canceled']);
export type DisputeStatus = z.infer<typeof DisputeStatusEnum>;

export type DisputeDTO = {
  id: string;
  task_id: string;
  reporter_id: string;
  reported_id: string;
  reason: string;
  description: string;
  status: DisputeStatus;
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

// --- List / queue ---
export const GetDisputesSchema = z.object({
  page: z.number().int().positive().default(1),
  status: z.enum(['all', 'open', 'active', 'resolved', 'canceled']).default('all'),
  limit: z.number().int().positive().max(100).default(10),
});
export type GetDisputesInput = z.infer<typeof GetDisputesSchema>;

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
export type DisputeQueueRow = z.infer<typeof DisputeQueueRowSchema>;

export const DisputeTabCountsSchema = z.object({
  all: z.number().int().min(0),
  open: z.number().int().min(0),
  active: z.number().int().min(0),
  resolved: z.number().int().min(0),
  canceled: z.number().int().min(0),
});
export type DisputeTabCounts = z.infer<typeof DisputeTabCountsSchema>;

export const DisputeListResponseSchema = z.object({
  disputes: z.array(DisputeQueueRowSchema),
  totalDisputes: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  tabCounts: DisputeTabCountsSchema.optional(),
});
export type DisputeListResponse = z.infer<typeof DisputeListResponseSchema>;

// --- Detail: entity context, messages/evidence, booking candidates, action availability ---
export const BookingCandidateSchema = z.object({
  booking_id: z.string().uuid(),
  status: z.string(),
  client_id: z.string().uuid().optional(),
  provider_id: z.string().uuid().optional(),
  amount_cents: z.number().optional(),
});
export type BookingCandidate = z.infer<typeof BookingCandidateSchema>;

export const SettlementTargetTypeEnum = z.enum(['booking', 'task_request', 'direct_offer']);
export type SettlementTargetType = z.infer<typeof SettlementTargetTypeEnum>;

export const SettlementCandidateSchema = z.object({
  target_type: SettlementTargetTypeEnum,
  target_id: z.string().uuid(),
  status: z.string(),
  payment_status: z.string().optional(),
  client_id: z.string().uuid().nullable().optional(),
  provider_id: z.string().uuid().nullable().optional(),
  amount_cents: z.number().optional(),
  fee_rate_bps: z.number().int().min(0).optional(),
});
export type SettlementCandidate = z.infer<typeof SettlementCandidateSchema>;

export const DisputeActionAvailabilitySchema = z.object({
  can_accept: z.boolean(),
  can_cancel: z.boolean(),
  can_resolve: z.boolean(),
  requires_booking_id: z.boolean().optional(),
  requires_settlement_target: z.boolean().optional(),
  supports_split_resolution: z.boolean().optional(),
});
export type DisputeActionAvailability = z.infer<typeof DisputeActionAvailabilitySchema>;

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
  settlement_candidates: z.array(SettlementCandidateSchema).optional(),
  action_availability: DisputeActionAvailabilitySchema.optional(),
});
export type DisputeDetail = z.infer<typeof DisputeDetailSchema>;

// --- Admin actions (reason required for cancel/resolve) ---
export const AdminAcceptDisputeInputSchema = z.object({
  dispute_id: z.string().uuid('Invalid Dispute ID'),
});
export type AdminAcceptDisputeInput = z.infer<typeof AdminAcceptDisputeInputSchema>;

export const AdminCancelDisputeInputSchema = z.object({
  dispute_id: z.string().uuid('Invalid Dispute ID'),
  reason: z.string().trim().min(1, 'Reason is required for cancel'),
});
export type AdminCancelDisputeInput = z.infer<typeof AdminCancelDisputeInputSchema>;

export const ResolveOutcomeEnum = z.enum(['refund_client', 'release_freelancer', 'split_settlement']);
export type ResolveOutcome = z.infer<typeof ResolveOutcomeEnum>;

export const AdminResolveDisputeInputSchema = z.object({
  dispute_id: z.string().uuid('Invalid Dispute ID'),
  reason: z.string().trim().min(1, 'Reason is required for resolve'),
  outcome: ResolveOutcomeEnum,
  booking_id: z.string().uuid().optional(),
  task_request_id: z.string().uuid().optional(),
  client_refund_amount: z.number().int().min(0).optional(),
  freelancer_payout_amount: z.number().int().min(0).optional(),
}).superRefine((data, ctx) => {
  if (data.booking_id && data.task_request_id) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Only one settlement target can be provided',
      path: ['booking_id'],
    });
  }
  if (data.outcome === 'split_settlement') {
    if (data.client_refund_amount == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'client_refund_amount is required for split settlement',
        path: ['client_refund_amount'],
      });
    }
    if (data.freelancer_payout_amount == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'freelancer_payout_amount is required for split settlement',
        path: ['freelancer_payout_amount'],
      });
    }
    if (
      data.client_refund_amount != null &&
      data.freelancer_payout_amount != null &&
      data.client_refund_amount <= 0 &&
      data.freelancer_payout_amount <= 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one split amount must be greater than zero',
        path: ['client_refund_amount'],
      });
    }
  } else if (data.client_refund_amount != null || data.freelancer_payout_amount != null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Split amounts are only allowed for split_settlement',
      path: ['outcome'],
    });
  }
});
export type AdminResolveDisputeInput = z.infer<typeof AdminResolveDisputeInputSchema>;

export const AdminResolveDisputeResultSchema = z.object({
  dispute_id: z.string().uuid(),
  status: DisputeStatusEnum,
  outcome: ResolveOutcomeEnum,
  entity_type: z.enum(['booking', 'task_request', 'direct_offer']),
  entity_id: z.string().uuid(),
  booking_id: z.string().uuid().nullable().optional(),
  task_request_id: z.string().uuid().nullable().optional(),
  direct_offer_id: z.string().uuid().nullable().optional(),
  journal_entry_ids: z.array(z.string().uuid()).min(1),
  fee_amount: z.number().int().min(0),
  client_refund_amount: z.number().int().min(0),
  freelancer_payout_amount: z.number().int().min(0),
  client_wallet_destination: z.literal('available_balance'),
  freelancer_wallet_destination: z.literal('available_balance'),
  idempotent: z.boolean().optional(),
});
export type AdminResolveDisputeResult = z.infer<typeof AdminResolveDisputeResultSchema>;

// --- Legacy / existing (keep for backward compatibility during migration) ---
export const UpdateDisputeStatusSchema = z.object({
  id: z.string().uuid("Invalid Dispute ID"),
  status: DisputeStatusEnum,
  resolution: z.string().optional(),
  decision: z.enum(['refund_client', 'release_freelancer', 'split_settlement']).optional(),
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

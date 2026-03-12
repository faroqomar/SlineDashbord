import { z } from 'zod';

const uuidField = z.string().uuid('Invalid UUID format');
const reasonField = z.string().min(1, 'Reason is required').max(500, 'Reason too long');

export const ApproveWithdrawalSchema = z.object({
  requestId: uuidField,
  reason: z.string().max(500).default('Approved by admin'),
});
export type ApproveWithdrawalInput = z.infer<typeof ApproveWithdrawalSchema>;

export const RejectWithdrawalSchema = z.object({
  requestId: uuidField,
  reason: reasonField,
});
export type RejectWithdrawalInput = z.infer<typeof RejectWithdrawalSchema>;

export const FreezeWalletSchema = z.object({
  targetUserId: uuidField,
  reason: reasonField,
});
export type FreezeWalletInput = z.infer<typeof FreezeWalletSchema>;

export const UnfreezeWalletSchema = z.object({
  targetUserId: uuidField,
  reason: reasonField,
});
export type UnfreezeWalletInput = z.infer<typeof UnfreezeWalletSchema>;

/** Wallet adjust (credit/debit). Positive amount_cents = credit, negative = debit. approval_id required when |amount_cents| >= WALLET_ADJUST_DANGEROUS_MIN. */
export const AdjustWalletInputSchema = z.object({
  target_user_id: uuidField,
  amount_cents: z.number().int(),
  reason: reasonField,
  approval_id: uuidField.optional(),
});
export type AdjustWalletInput = z.infer<typeof AdjustWalletInputSchema>;

export const SoftDeleteUserSchema = z.object({
  targetUserId: uuidField,
  reason: reasonField,
});
export type SoftDeleteUserInput = z.infer<typeof SoftDeleteUserSchema>;

export const ExportCSVSchema = z.object({
  event_type: z.string().optional(),
  status: z.string().optional(),
  payer_user_id: z.string().uuid().optional(),
  payee_user_id: z.string().uuid().optional(),
  entity_type: z.string().optional(),
  entity_id: z.string().optional(),
  limit: z.number().int().min(1).max(1000).optional(),
});
export type ExportCSVInput = z.infer<typeof ExportCSVSchema>;

// Query Schemas
export const TransactionDetailsSchema = z.object({
  journalId: uuidField,
});
export type TransactionDetailsInput = z.infer<typeof TransactionDetailsSchema>;

export const UserLookupSchema = z.object({
  userId: uuidField,
});
export type UserLookupInput = z.infer<typeof UserLookupSchema>;

export const EntityTraceSchema = z.object({
  entityType: z.string().min(1),
  entityId: z.string().min(1),
});
export type EntityTraceInput = z.infer<typeof EntityTraceSchema>;

export const TransactionFiltersSchema = z.object({
  event_type: z.string().optional(),
  status: z.string().optional(),
  payer_user_id: z.string().uuid().optional(),
  payee_user_id: z.string().uuid().optional(),
  entity_type: z.string().optional(),
  entity_id: z.string().optional(),
  limit: z.number().int().min(1).max(200).optional(),
});

/** Query params for GET /finance/transactions (list). Validates limit + cursor + filters. */
export const TransactionListQuerySchema = z.object({
  event_type: z.string().optional(),
  status: z.string().optional(),
  payer_user_id: z.string().uuid().optional(),
  payee_user_id: z.string().uuid().optional(),
  entity_type: z.string().optional(),
  entity_id: z.string().uuid().optional(),
  limit: z.number().int().min(1).max(200).optional(),
  cursor_created_at: z.string().optional(),
  cursor_id: z.string().uuid().optional(),
});
export type TransactionListQuery = z.infer<typeof TransactionListQuerySchema>;

// Roles
export type FinanceRole = 'support' | 'moderator' | 'admin' | 'super_admin';
export const FINANCE_READ_ROLES: FinanceRole[] = ['support', 'moderator', 'admin', 'super_admin'];
export const FINANCE_WRITE_ROLES: FinanceRole[] = ['admin', 'super_admin'];
export const FINANCE_SUPERADMIN_ROLES: FinanceRole[] = ['super_admin'];

// DTOs
export const JournalLedgerEntrySchema = z.object({
  journal_id: z.string().uuid(),
  created_at: z.string(),
  event_type: z.string(),
  status: z.string(),
  entity_type: z.string().nullable().optional(),
  entity_id: z.string().uuid().nullable().optional(),
  payer_user_id: z.string().uuid().nullable().optional(),
  payee_user_id: z.string().uuid().nullable().optional(),
  gross_amount: z.number(),
  fee_amount: z.number(),
  net_amount: z.number(),
  initiator_user_id: z.string().uuid().nullable().optional(),
  meta_masked: z.any().optional(),
  meta_full: z.any().optional(),
});
export type JournalLedgerEntry = z.infer<typeof JournalLedgerEntrySchema>;

export const WithdrawalRequestSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  status: z.enum(['requested', 'processing', 'completed', 'failed']),
  amount: z.number(),
  currency: z.string(),
  created_at: z.string(),
});
export type WithdrawalRequest = z.infer<typeof WithdrawalRequestSchema>;

/** Wallet summary from vw_wallet_balances_user (PAGE 12 user lookup). */
export const WalletSummarySchema = z.object({
  available_balance: z.number(),
  held_balance: z.number(),
  pending_withdrawal_balance: z.number(),
  currency: z.string(),
  is_wallet_frozen: z.boolean().optional(),
});
export type WalletSummary = z.infer<typeof WalletSummarySchema>;

export const UserHeldFundsSummarySchema = z.object({
  held_in_escrow: z.number(),
  total_wallet_balances: z.number(),
  total_owed_to_users: z.number(),
});
export type UserHeldFundsSummary = z.infer<typeof UserHeldFundsSummarySchema>;

export const CompanyFundsSummarySchema = z.object({
  total_fee_revenue: z.number(),
  net_platform_earnings: z.number(),
  actual_company_owned_balance: z.number(),
});
export type CompanyFundsSummary = z.infer<typeof CompanyFundsSummarySchema>;

export const FinanceMetricsSummarySchema = z.object({
  platform_cash_position: z.number(),
  userFunds: UserHeldFundsSummarySchema,
  companyFunds: CompanyFundsSummarySchema,
});
export type FinanceMetricsSummary = z.infer<typeof FinanceMetricsSummarySchema>;

/** Wallet activity row from vw_wallet_activity_user. Use this (not JournalLedgerEntry) for wallet activity; preserves spent semantics e.g. gateway_escrow. */
export const WalletActivityEntrySchema = z.object({
  journal_entry_id: z.string().uuid(),
  created_at: z.string(),
  event_type: z.string(),
  amount_gross: z.number(),
  amount_net: z.number(),
  fee_amount: z.number(),
  currency: z.string(),
  related_entity_type: z.string().nullable().optional(),
  related_entity_id: z.string().uuid().nullable().optional(),
  counterparty_user_id: z.string().uuid().nullable().optional(),
  status: z.string(),
  user_id: z.string().uuid().optional(),
});
export type WalletActivityEntry = z.infer<typeof WalletActivityEntrySchema>;

// --- Finance workflow (read-only) ---
export const WORKFLOW_BUCKETS = ['delivered_awaiting_client', 'disputed_money', 'stuck_direct_offer', 'held_funds', 'withdrawals_pending'] as const;
export type WorkflowBucket = (typeof WORKFLOW_BUCKETS)[number];

export const FinanceWorkflowOverviewSchema = z.object({
  platform_cash: z.number(),
  escrow_held: z.number(),
  delivered_awaiting_count: z.number().optional(),
  disputed_count: z.number().optional(),
  stuck_direct_offer_count: z.number().optional(),
  pending_withdrawals_count: z.number().optional(),
  /** True when counts are stub (not yet from real queries). */
  stub: z.boolean().optional(),
});
export type FinanceWorkflowOverview = z.infer<typeof FinanceWorkflowOverviewSchema>;

export const FinanceWorkflowCaseSchema = z.object({
  entityType: z.string(),
  entityId: z.string().uuid(),
  bucket: z.enum(WORKFLOW_BUCKETS),
  summary: z.string().optional(),
  amount_cents: z.number().optional(),
  created_at: z.string().optional(),
});
export type FinanceWorkflowCase = z.infer<typeof FinanceWorkflowCaseSchema>;

export const FinanceWorkflowCaseDetailSchema = z.object({
  entityType: z.string(),
  entityId: z.string().uuid(),
  bucket: z.enum(WORKFLOW_BUCKETS),
  state: z.record(z.unknown()).optional(),
  journal_links: z.array(z.object({ journal_id: z.string().uuid(), event_type: z.string() })).optional(),
  payer_user_id: z.string().uuid().nullable().optional(),
  payee_user_id: z.string().uuid().nullable().optional(),
  available_actions: z.array(z.string()).optional(),
});
export type FinanceWorkflowCaseDetail = z.infer<typeof FinanceWorkflowCaseDetailSchema>;

// --- Platform fee settings (admin-controlled; single source: platform_settings) ---

/** GET /api/v1/finance/fee-settings response. */
export const PlatformFeeSettingsSchema = z.object({
  fee_rate_default_bps: z.number().int().min(0).max(10000),
  max_fee_rate_bps: z.number().int().min(0).max(10000),
  updated_at: z.string(),
  updated_by: z.string().uuid().nullable().optional(),
});
export type PlatformFeeSettings = z.infer<typeof PlatformFeeSettingsSchema>;

/** PATCH /api/v1/finance/fee-settings body; reason required. */
export const UpdatePlatformFeeSettingsBodySchema = z.object({
  fee_rate_default_bps: z.number().int().min(0).max(10000),
  reason: z.string().min(1, 'Reason is required').max(500, 'Reason too long'),
});
export type UpdatePlatformFeeSettingsBody = z.infer<typeof UpdatePlatformFeeSettingsBodySchema>;

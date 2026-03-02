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

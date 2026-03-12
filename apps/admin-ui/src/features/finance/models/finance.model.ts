import { z } from 'zod';
import type { WalletActivityEntry } from '@sline/shared';

// ─── Local types (API/ledger contract; no Supabase DB types in SPA) ─────
export type JournalEntry = {
  id: string;
  created_at: string;
  event_type: string;
  status: string;
  entity_type?: string | null;
  entity_id?: string | null;
  meta?: Record<string, unknown> | null;
  [key: string]: unknown;
};
export type LedgerLine = {
  id: string;
  journal_id: string;
  ledger_account: string;
  amount: number;
  [key: string]: unknown;
};
export type VwAdminJournalLedger = {
  journal_id: string;
  created_at: string;
  event_type: string;
  status: string;
  entity_type?: string | null;
  entity_id?: string | null;
  payer_user_id?: string | null;
  payee_user_id?: string | null;
  gross_amount: number;
  fee_amount: number;
  net_amount: number;
  [key: string]: unknown;
};

// ─── Roles ────────────────────────────────────────────────
export type FinanceRole = 'support' | 'moderator' | 'admin' | 'super_admin';

// ─── Pagination & Filters ─────────────────────────────────
export interface TransactionCursor {
  created_at: string;
  journal_id: string;
}

export interface TransactionFilters {
  event_type?: string;
  status?: string;
  payer_user_id?: string;
  payee_user_id?: string;
  entity_type?: string;
  entity_id?: string;
  limit?: number;
}

export interface TransactionActorSummary {
  id: string;
  full_name: string;
  avatar_url?: string | null;
}

export interface TransactionEntityContext {
  kind: string;
  id: string;
  title: string;
  subtitle?: string | null;
  status?: string | null;
  payment_status?: string | null;
  price?: number | null;
  created_at?: string | null;
  note?: string | null;
  description?: string | null;
  requirements?: Record<string, unknown> | null;
  client?: TransactionActorSummary | null;
  provider?: TransactionActorSummary | null;
  task?: Record<string, unknown> | null;
  timeline?: Record<string, unknown> | null;
}

// ─── Journal Ledger Entry (Zod + TS) ──────────────────────
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
  payer: z
    .object({
      id: z.string().uuid(),
      full_name: z.string(),
      avatar_url: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  payee: z
    .object({
      id: z.string().uuid(),
      full_name: z.string(),
      avatar_url: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  initiator: z
    .object({
      id: z.string().uuid(),
      full_name: z.string(),
      avatar_url: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  entity_context: z
    .object({
      kind: z.string(),
      id: z.string().uuid(),
      title: z.string(),
      subtitle: z.string().nullable().optional(),
      status: z.string().nullable().optional(),
      payment_status: z.string().nullable().optional(),
      price: z.number().nullable().optional(),
      created_at: z.string().nullable().optional(),
      note: z.string().nullable().optional(),
      description: z.string().nullable().optional(),
      requirements: z.record(z.unknown()).nullable().optional(),
      client: z
        .object({
          id: z.string().uuid(),
          full_name: z.string(),
          avatar_url: z.string().nullable().optional(),
        })
        .nullable()
        .optional(),
      provider: z
        .object({
          id: z.string().uuid(),
          full_name: z.string(),
          avatar_url: z.string().nullable().optional(),
        })
        .nullable()
        .optional(),
      task: z.record(z.unknown()).nullable().optional(),
      timeline: z.record(z.unknown()).nullable().optional(),
    })
    .nullable()
    .optional(),
});
export type JournalLedgerEntry = z.infer<typeof JournalLedgerEntrySchema>;

/** Re-export for wallet activity timeline (GET /finance/users/:userId). Use this, not JournalLedgerEntry, for wallet activity. */
export type { WalletActivityEntry };

// ─── Platform Metrics ─────────────────────────────────────
export const PlatformMetricsSchema = z.object({
  platform_cash_position: z.number(),
  userFunds: z.object({
    held_in_escrow: z.number(),
    total_wallet_balances: z.number(),
    total_owed_to_users: z.number(),
  }),
  companyFunds: z.object({
    total_fee_revenue: z.number(),
    net_platform_earnings: z.number(),
    actual_company_owned_balance: z.number(),
  }),
});
export type PlatformMetrics = z.infer<typeof PlatformMetricsSchema>;

// ─── Withdrawal Request ───────────────────────────────────
export const WithdrawalRequestSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  status: z.enum(['requested', 'processing', 'completed', 'failed']),
  amount: z.number(),
  currency: z.string(),
  created_at: z.string(),
});
export type WithdrawalRequest = z.infer<typeof WithdrawalRequestSchema>;

// ─── Wallet Summary ───────────────────────────────────────
export interface WalletSummary {
  available_balance: number;
  held_balance: number;
  pending_withdrawal_balance: number;
  currency: string;
  is_wallet_frozen?: boolean;
}

// ─── Audit Log Entry ──────────────────────────────────────
export interface AuditLogEntry {
  id: string;
  created_at: string;
  action: string;
  actor_user_id: string | null;
  event_type: string | null;
  journal_entry_id: string | null;
  related_entity_type: string | null;
  related_entity_id: string | null;
  meta: Record<string, unknown> | null;
}

// ─── Role Constants ───────────────────────────────────────
export const FINANCE_READ_ROLES: FinanceRole[] = ['support', 'moderator', 'admin', 'super_admin'];
export const FINANCE_WRITE_ROLES: FinanceRole[] = ['admin', 'super_admin'];
export const FINANCE_SUPERADMIN_ROLES: FinanceRole[] = ['super_admin'];

/** Display amount for wallet activity (spent-aware: use amount_net). */
export function getWalletActivityAmount(entry: WalletActivityEntry): number {
  const value = Number(entry.amount_net ?? entry.amount_gross ?? 0);
  return Number.isFinite(value) ? value : 0;
}

// ─── UI Utilities ─────────────────────────────────────────
export function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'posted':
    case 'completed':
      return 'bg-green-500/10 text-green-500';
    case 'failed':
      return 'bg-red-500/10 text-red-500';
    default:
      return 'bg-orange-500/10 text-orange-500';
  }
}

'use server';

import { createClient as supabaseServer } from '@/lib/supabase/server';
import { requireAdminRole, maskMetaForRole, logAuditEvent } from '../services/security_guards';
import { ok, fail, ServiceResult } from '../models/result';
import {
  JournalLedgerEntry,
  PlatformMetrics,
  TransactionCursor,
  TransactionFilters,
  WalletSummary,
  WithdrawalRequest,
  AuditLogEntry,
  FINANCE_READ_ROLES,
  FINANCE_WRITE_ROLES,
} from '../models/finance.model';
import {
  TransactionDetailsSchema,
  UserLookupSchema,
  EntityTraceSchema,
  TransactionFiltersSchema,
  CursorSchema,
} from '../models/finance.schema';

// Re-export model types so pages importing from this file continue to work
export type { TransactionCursor, TransactionFilters } from '../models/finance.model';

// ─── Error Helper ─────────────────────────────────────────
function toErrorMessage(e: unknown): string {
  return e instanceof Error ? e.message : 'Unknown error';
}

// ─── Platform Metrics ─────────────────────────────────────

export async function getPlatformMetrics(): Promise<ServiceResult<PlatformMetrics>> {
  try {
    await requireAdminRole(FINANCE_READ_ROLES);
    const supabase = await supabaseServer();

    const { data, error } = await supabase
      .from('vw_financial_metrics_realtime')
      .select('*')
      .single();

    if (error) {
      console.error('getPlatformMetrics error:', error);
      return fail('Failed to fetch platform metrics');
    }

    return ok({
      platform_cash: data.platform_cash_iqd || 0,
      escrow_held: data.escrow_held_iqd || 0,
      lifetime_revenue: data.revenue_iqd || 0,
      pending_withdrawals: 0,
    });
  } catch (e: unknown) {
    return fail(toErrorMessage(e));
  }
}

// ─── Paginated Transactions ───────────────────────────────

export async function getTransactionsPaginated(
  filters: TransactionFilters = {},
  cursor?: TransactionCursor
): Promise<ServiceResult<{ data: JournalLedgerEntry[]; nextCursor?: TransactionCursor }>> {
  try {
    const parsedFilters = TransactionFiltersSchema.safeParse(filters);
    if (!parsedFilters.success) return fail(parsedFilters.error.issues[0].message);

    const parsedCursor = CursorSchema.safeParse(cursor);
    if (!parsedCursor.success) return fail(parsedCursor.error.issues[0].message);

    const { role } = await requireAdminRole(FINANCE_READ_ROLES);
    const supabase = await supabaseServer();

    let query = supabase
      .from('vw_admin_journal_ledger')
      .select('*')
      .order('created_at', { ascending: false })
      .order('journal_id', { ascending: false });

    if (parsedFilters.data.event_type) query = query.eq('event_type', parsedFilters.data.event_type);
    if (parsedFilters.data.status) query = query.eq('status', parsedFilters.data.status);
    if (parsedFilters.data.payer_user_id) query = query.eq('payer_user_id', parsedFilters.data.payer_user_id);
    if (parsedFilters.data.payee_user_id) query = query.eq('payee_user_id', parsedFilters.data.payee_user_id);
    if (parsedFilters.data.entity_type) query = query.eq('entity_type', parsedFilters.data.entity_type);
    if (parsedFilters.data.entity_id) query = query.eq('entity_id', parsedFilters.data.entity_id);

    if (parsedCursor.data) {
      query = query.or(
        `created_at.lt.${parsedCursor.data.created_at},and(created_at.eq.${parsedCursor.data.created_at},journal_id.lt.${parsedCursor.data.journal_id})`
      );
    }

    const limit = parsedFilters.data.limit || 50;
    query = query.limit(limit);

    const { data, error } = await query;
    if (error) return fail(`Query failed: ${error.message}`);

    const maskedData = (data as JournalLedgerEntry[]).map((row) => ({
      ...row,
      meta_full: maskMetaForRole(role, row.meta_full),
    }));

    const nextCursor =
      data.length === limit
        ? { created_at: data[data.length - 1].created_at, journal_id: data[data.length - 1].journal_id }
        : undefined;

    return ok({ data: maskedData, nextCursor });
  } catch (e: unknown) {
    return fail(toErrorMessage(e));
  }
}

// ─── Transaction Details ──────────────────────────────────

export async function getTransactionDetails(
  journalId: string
): Promise<ServiceResult<JournalLedgerEntry>> {
  try {
    const parsed = TransactionDetailsSchema.safeParse({ journalId });
    if (!parsed.success) return fail(parsed.error.issues[0].message);

    const { userId, role } = await requireAdminRole(FINANCE_READ_ROLES);
    const supabase = await supabaseServer();

    const { data, error } = await supabase
      .from('vw_admin_journal_ledger')
      .select('*')
      .eq('journal_id', parsed.data.journalId)
      .single();

    if (error || !data) return fail('Transaction not found');

    if ((role === 'admin' || role === 'super_admin') && data.meta_full) {
      await logAuditEvent({
        action: 'admin.finance.tx_view_sensitive_meta',
        actor_user_id: userId,
        event_type: data.event_type,
        journal_entry_id: parsed.data.journalId,
        meta: { viewed_at: new Date().toISOString() },
      });
    }

    return ok({ ...data, meta_full: maskMetaForRole(role, data.meta_full) } as JournalLedgerEntry);
  } catch (e: unknown) {
    return fail(toErrorMessage(e));
  }
}

// ─── User Wallet Summary ─────────────────────────────────

export async function getUserWalletSummary(
  targetUserId: string
): Promise<ServiceResult<WalletSummary>> {
  try {
    const parsed = UserLookupSchema.safeParse({ userId: targetUserId });
    if (!parsed.success) return fail(parsed.error.issues[0].message);

    await requireAdminRole(FINANCE_READ_ROLES);
    const supabase = await supabaseServer();

    const { data, error } = await supabase
      .from('vw_wallet_balances_user')
      .select('*')
      .eq('user_id', parsed.data.userId)
      .single();

    if (error) {
      return ok({ available_balance: 0, held_balance: 0, pending_withdrawal_balance: 0, currency: 'IQD' });
    }
    return ok(data as WalletSummary);
  } catch (e: unknown) {
    return fail(toErrorMessage(e));
  }
}

// ─── User Finance Timeline ────────────────────────────────

export async function getUserFinanceTimeline(
  targetUserId: string,
  filters: Pick<TransactionFilters, 'event_type' | 'status' | 'limit'> = {},
  cursor?: TransactionCursor
): Promise<ServiceResult<{ data: JournalLedgerEntry[]; nextCursor?: TransactionCursor }>> {
  try {
    const parsed = UserLookupSchema.safeParse({ userId: targetUserId });
    if (!parsed.success) return fail(parsed.error.issues[0].message);

    await requireAdminRole(FINANCE_READ_ROLES);
    const supabase = await supabaseServer();

    const { data, error } = await supabase
      .from('vw_wallet_activity_user')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(filters.limit || 50);

    if (error) return fail('Query failed');
    return ok({ data: data as JournalLedgerEntry[], nextCursor: undefined });
  } catch (e: unknown) {
    return fail(toErrorMessage(e));
  }
}

// ─── Entity Trace ─────────────────────────────────────────

export async function getEntityTrace(
  entityType: string,
  entityId: string
): Promise<ServiceResult<{ data: JournalLedgerEntry[]; nextCursor?: TransactionCursor }>> {
  try {
    const parsed = EntityTraceSchema.safeParse({ entityType, entityId });
    if (!parsed.success) return fail(parsed.error.issues[0].message);
    return getTransactionsPaginated({ entity_type: parsed.data.entityType, entity_id: parsed.data.entityId });
  } catch (e: unknown) {
    return fail(toErrorMessage(e));
  }
}

// ─── Withdrawals ──────────────────────────────────────────

export async function getWithdrawals(
  filters: { status?: string; limit?: number } = {},
  cursor?: { created_at: string; id: string }
): Promise<ServiceResult<{ data: WithdrawalRequest[]; nextCursor?: { created_at: string; id: string } }>> {
  try {
    await requireAdminRole(FINANCE_READ_ROLES);
    const supabase = await supabaseServer();

    let query = supabase
      .from('withdrawal_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .order('id', { ascending: false });

    if (filters.status) query = query.eq('status', filters.status);
    if (cursor) {
      query = query.or(`created_at.lt.${cursor.created_at},and(created_at.eq.${cursor.created_at},id.lt.${cursor.id})`);
    }

    const limit = filters.limit || 50;
    const { data, error } = await query.limit(limit);
    if (error) return fail('Query failed');

    const nextCursor = data.length === limit
      ? { created_at: data[data.length - 1].created_at, id: data[data.length - 1].id }
      : undefined;

    return ok({ data: data as WithdrawalRequest[], nextCursor });
  } catch (e: unknown) {
    return fail(toErrorMessage(e));
  }
}

// ─── Audit Logs ───────────────────────────────────────────

export async function getAuditLogs(
  filters: { limit?: number } = {},
  cursor?: { created_at: string; id: string }
): Promise<ServiceResult<{ data: AuditLogEntry[]; nextCursor?: { created_at: string; id: string } }>> {
  try {
    await requireAdminRole(FINANCE_WRITE_ROLES);
    const supabase = await supabaseServer();

    let query = supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .order('id', { ascending: false });

    if (cursor) {
      query = query.or(`created_at.lt.${cursor.created_at},and(created_at.eq.${cursor.created_at},id.lt.${cursor.id})`);
    }

    const limit = filters.limit || 50;
    const { data, error } = await query.limit(limit);
    if (error) return fail(`Query failed: ${error.message}`);

    const nextCursor = data.length === limit
      ? { created_at: data[data.length - 1].created_at, id: data[data.length - 1].id }
      : undefined;

    return ok({ data, nextCursor });
  } catch (e: unknown) {
    return fail(toErrorMessage(e));
  }
}

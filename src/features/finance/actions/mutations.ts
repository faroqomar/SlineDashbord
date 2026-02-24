'use server';

import { createAdminClient as supabaseAdmin } from '@/lib/supabase/admin';
import { enforceRateLimit, requireAdminRole, logAuditEvent } from '../services/security_guards';
import { ok, fail, ServiceResult } from '../models/result';
import {
  ApproveWithdrawalSchema,
  RejectWithdrawalSchema,
  FreezeWalletSchema,
  UnfreezeWalletSchema,
  SoftDeleteUserSchema,
  ExportCSVSchema,
} from '../models/finance.schema';
import {
  JournalLedgerEntry,
  TransactionFilters,
  FINANCE_WRITE_ROLES,
  FINANCE_SUPERADMIN_ROLES,
} from '../models/finance.model';

// ─── Error Helper ─────────────────────────────────────────
function toErrorMessage(e: unknown): string {
  return e instanceof Error ? e.message : 'Unknown error';
}

// ─── 1. Withdrawal Approvals ──────────────────────────────

export async function approveWithdrawal(
  requestId: string,
  reason: string = 'Approved by admin'
): Promise<ServiceResult<{ requestId: string }>> {
  try {
    const parsed = ApproveWithdrawalSchema.safeParse({ requestId, reason });
    if (!parsed.success) return fail(parsed.error.issues[0].message);

    const { userId } = await requireAdminRole(FINANCE_SUPERADMIN_ROLES);
    enforceRateLimit('approve_withdrawal', userId, 5, 60000);

    const adminClient = supabaseAdmin();
    const { error } = await adminClient.rpc('admin_process_withdrawal', {
      p_request_id: parsed.data.requestId,
      p_decision: 'approve',
      p_reason: parsed.data.reason,
      p_admin_id: userId,
    });

    if (error) return fail(`Failed to approve withdrawal: ${error.message}`);

    await logAuditEvent({
      action: 'admin.finance.withdrawal_approve',
      actor_user_id: userId,
      related_entity_type: 'withdrawal_request',
      related_entity_id: parsed.data.requestId,
      meta: { reason: parsed.data.reason },
    });

    return ok({ requestId: parsed.data.requestId });
  } catch (e: unknown) {
    return fail(toErrorMessage(e));
  }
}

export async function rejectWithdrawal(
  requestId: string,
  reason: string
): Promise<ServiceResult<{ requestId: string }>> {
  try {
    const parsed = RejectWithdrawalSchema.safeParse({ requestId, reason });
    if (!parsed.success) return fail(parsed.error.issues[0].message);

    const { userId } = await requireAdminRole(FINANCE_SUPERADMIN_ROLES);
    enforceRateLimit('reject_withdrawal', userId, 5, 60000);

    const adminClient = supabaseAdmin();
    const { error } = await adminClient.rpc('admin_process_withdrawal', {
      p_request_id: parsed.data.requestId,
      p_decision: 'reject',
      p_reason: parsed.data.reason,
      p_admin_id: userId,
    });

    if (error) return fail(`Failed to reject withdrawal: ${error.message}`);

    await logAuditEvent({
      action: 'admin.finance.withdrawal_reject',
      actor_user_id: userId,
      related_entity_type: 'withdrawal_request',
      related_entity_id: parsed.data.requestId,
      meta: { reason: parsed.data.reason },
    });

    return ok({ requestId: parsed.data.requestId });
  } catch (e: unknown) {
    return fail(toErrorMessage(e));
  }
}

// ─── 2. Wallet Freeze ─────────────────────────────────────

export async function freezeWallet(
  targetUserId: string,
  reason: string
): Promise<ServiceResult<{ targetUserId: string }>> {
  try {
    const parsed = FreezeWalletSchema.safeParse({ targetUserId, reason });
    if (!parsed.success) return fail(parsed.error.issues[0].message);

    const { userId } = await requireAdminRole(FINANCE_WRITE_ROLES);
    const adminClient = supabaseAdmin();

    const { error } = await adminClient.rpc('admin_process_wallet_freeze', {
      p_user_id: parsed.data.targetUserId,
      p_freeze: true,
      p_reason: parsed.data.reason,
      p_admin_id: userId,
    });

    if (error) return fail(`Failed to freeze wallet: ${error.message}`);

    await logAuditEvent({
      action: 'admin.finance.wallet_freeze',
      actor_user_id: userId,
      related_entity_type: 'profile',
      related_entity_id: parsed.data.targetUserId,
      meta: { reason: parsed.data.reason },
    });

    return ok({ targetUserId: parsed.data.targetUserId });
  } catch (e: unknown) {
    return fail(toErrorMessage(e));
  }
}

export async function unfreezeWallet(
  targetUserId: string,
  reason: string
): Promise<ServiceResult<{ targetUserId: string }>> {
  try {
    const parsed = UnfreezeWalletSchema.safeParse({ targetUserId, reason });
    if (!parsed.success) return fail(parsed.error.issues[0].message);

    const { userId } = await requireAdminRole(FINANCE_WRITE_ROLES);
    const adminClient = supabaseAdmin();

    const { error } = await adminClient.rpc('admin_process_wallet_freeze', {
      p_user_id: parsed.data.targetUserId,
      p_freeze: false,
      p_reason: parsed.data.reason,
      p_admin_id: userId,
    });

    if (error) return fail(`Failed to unfreeze wallet: ${error.message}`);

    await logAuditEvent({
      action: 'admin.finance.wallet_unfreeze',
      actor_user_id: userId,
      related_entity_type: 'profile',
      related_entity_id: parsed.data.targetUserId,
      meta: { reason: parsed.data.reason },
    });

    return ok({ targetUserId: parsed.data.targetUserId });
  } catch (e: unknown) {
    return fail(toErrorMessage(e));
  }
}

// ─── 3. Soft Delete User ──────────────────────────────────

export async function softDeleteUser(
  targetUserId: string,
  reason: string
): Promise<ServiceResult<{ targetUserId: string }>> {
  try {
    const parsed = SoftDeleteUserSchema.safeParse({ targetUserId, reason });
    if (!parsed.success) return fail(parsed.error.issues[0].message);

    const { userId } = await requireAdminRole(FINANCE_WRITE_ROLES);
    const adminClient = supabaseAdmin();

    const { error: profileError } = await adminClient
      .from('profiles')
      .update({ status: 'deleted', is_wallet_frozen: true })
      .eq('id', parsed.data.targetUserId);

    if (profileError) return fail(`Soft delete failed: ${profileError.message}`);

    await logAuditEvent({
      action: 'admin.users.soft_delete',
      actor_user_id: userId,
      related_entity_id: parsed.data.targetUserId,
      related_entity_type: 'profile',
      meta: { reason: parsed.data.reason },
    });

    return ok({ targetUserId: parsed.data.targetUserId });
  } catch (e: unknown) {
    return fail(toErrorMessage(e));
  }
}

// ─── 4. Export CSV ────────────────────────────────────────

export async function exportTransactionsCSV(
  filters: TransactionFilters
): Promise<ServiceResult<JournalLedgerEntry[]>> {
  try {
    const parsed = ExportCSVSchema.safeParse(filters);
    if (!parsed.success) return fail(parsed.error.issues[0].message);

    const { userId } = await requireAdminRole(FINANCE_WRITE_ROLES);
    enforceRateLimit('export_csv', userId, 2, 60000);

    const adminClient = supabaseAdmin();

    let query = adminClient
      .from('vw_admin_journal_ledger')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000);

    if (parsed.data.event_type) query = query.eq('event_type', parsed.data.event_type);
    if (parsed.data.status) query = query.eq('status', parsed.data.status);

    const { data, error } = await query;
    if (error) return fail('Export query failed');

    await logAuditEvent({
      action: 'admin.finance.tx_export_csv',
      actor_user_id: userId,
      meta: { filters: JSON.parse(JSON.stringify(parsed.data)), row_count: data?.length || 0 },
    });

    return ok((data || []) as JournalLedgerEntry[]);
  } catch (e: unknown) {
    return fail(toErrorMessage(e));
  }
}

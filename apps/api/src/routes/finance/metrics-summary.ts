import type { SupabaseClient } from '@supabase/supabase-js';
import type { FinanceMetricsSummary } from '@sline/shared';

type MetricsRow = Record<string, unknown> | null;

export interface FinanceMetricsSnapshot extends FinanceMetricsSummary {
  raw: {
    escrowHeld: number;
    platformCash: number;
    feeRevenue: number;
    revenueAccountBalance: number;
    totalUserWalletLiabilities: number;
    pendingPayouts: number;
    freelancerPayablesAvailable: number;
    totalPlatformObligations: number;
    actualCompanyOwnedCash: number;
    reconciliationGap: number;
    sourceView: 'vw_treasury_pool_balances_realtime' | 'vw_financial_metrics_realtime';
  };
}

function toNumber(value: unknown): number {
  const numeric = typeof value === 'number' ? value : Number(value ?? 0);
  return Number.isFinite(numeric) ? numeric : 0;
}

function normalizeCurrency(value: number): number {
  return Math.abs(value) < 0.005 ? 0 : Math.round(value * 100) / 100;
}

function pickNumber(metrics: MetricsRow, keys: string[], fallback = 0): number {
  for (const key of keys) {
    if (metrics != null && key in metrics) {
      return toNumber(metrics[key]);
    }
  }
  return fallback;
}

function resolveEscrowHeld(
  metrics: MetricsRow,
  sourceView: 'vw_treasury_pool_balances_realtime' | 'vw_financial_metrics_realtime',
): number {
  const escrowHeld = pickNumber(metrics, ['escrow_held_iqd'], 0);
  const escrowAccountBalance = pickNumber(metrics, ['escrow_account_balance_iqd'], escrowHeld);

  // Older fallback views have been observed returning `escrow_held_iqd = 0`
  // while the actual escrow account balance remains populated.
  if (
    sourceView === 'vw_financial_metrics_realtime'
    && escrowHeld === 0
    && escrowAccountBalance !== 0
  ) {
    return escrowAccountBalance;
  }

  return pickNumber(metrics, ['escrow_held_iqd', 'escrow_account_balance_iqd']);
}

export function buildFinanceMetricsSnapshot(
  metrics: MetricsRow,
  sourceView: 'vw_treasury_pool_balances_realtime' | 'vw_financial_metrics_realtime' = 'vw_financial_metrics_realtime',
): FinanceMetricsSnapshot {
  const escrowHeld = normalizeCurrency(resolveEscrowHeld(metrics, sourceView));
  const platformCash = pickNumber(metrics, ['platform_cash_iqd']);
  const feeRevenue = pickNumber(metrics, ['total_fee_revenue_iqd', 'revenue_iqd', 'platform_revenue_iqd']);
  const revenueAccountBalance = pickNumber(
    metrics,
    ['platform_revenue_iqd', 'revenue_account_balance_iqd', 'revenue_iqd'],
    feeRevenue,
  );

  const inferredTotalOwedToUsers = Math.max(platformCash - revenueAccountBalance, escrowHeld);
  const totalOwedToUsers = normalizeCurrency(inferredTotalOwedToUsers);
  const totalWalletBalances = normalizeCurrency(Math.max(totalOwedToUsers - escrowHeld, 0));
  const pendingPayouts = normalizeCurrency(
    pickNumber(metrics, ['pending_payouts_iqd'], 0),
  );
  const totalUserWalletLiabilities = normalizeCurrency(
    pickNumber(metrics, ['total_user_wallet_liabilities_iqd'], totalWalletBalances),
  );
  const freelancerPayablesAvailable = normalizeCurrency(
    pickNumber(
      metrics,
      ['freelancer_payables_available_iqd'],
      Math.max(totalUserWalletLiabilities - pendingPayouts, 0),
    ),
  );
  const freelancerPayablesTotal = normalizeCurrency(
    pickNumber(
      metrics,
      ['freelancer_payables_total_iqd'],
      freelancerPayablesAvailable + pendingPayouts,
    ),
  );
  const otherUserWalletLiabilities = normalizeCurrency(
    pickNumber(
      metrics,
      ['other_user_wallet_liabilities_iqd'],
      Math.max(totalUserWalletLiabilities - freelancerPayablesAvailable, 0),
    ),
  );
  const totalPlatformObligations = normalizeCurrency(
    pickNumber(metrics, ['total_platform_obligations_iqd'], totalOwedToUsers),
  );
  const actualCompanyOwnedCash = normalizeCurrency(
    pickNumber(metrics, ['actual_company_owned_cash_iqd'], platformCash - totalPlatformObligations),
  );
  const actualCompanyOwnedBalance = normalizeCurrency(revenueAccountBalance);
  const reconciliationGap = normalizeCurrency(
    pickNumber(metrics, ['reconciliation_gap_iqd'], actualCompanyOwnedCash - revenueAccountBalance),
  );

  return {
    platform_cash_position: platformCash,
    userFunds: {
      held_in_escrow: escrowHeld,
      total_wallet_balances: totalUserWalletLiabilities,
      total_owed_to_users: totalPlatformObligations,
      freelancer_payables_available: freelancerPayablesAvailable,
      pending_payouts: pendingPayouts,
      freelancer_payables_total: freelancerPayablesTotal,
      total_user_wallet_liabilities: totalUserWalletLiabilities,
      other_user_wallet_liabilities: otherUserWalletLiabilities,
      total_platform_obligations: totalPlatformObligations,
    },
    companyFunds: {
      total_fee_revenue: feeRevenue,
      net_platform_earnings: revenueAccountBalance,
      actual_company_owned_balance: actualCompanyOwnedBalance,
      platform_revenue: revenueAccountBalance,
      actual_company_owned_cash: actualCompanyOwnedCash,
    },
    reconciliation: {
      gap_to_platform_revenue: reconciliationGap,
    },
    raw: {
      escrowHeld,
      platformCash,
      feeRevenue,
      revenueAccountBalance,
      totalUserWalletLiabilities,
      pendingPayouts,
      freelancerPayablesAvailable,
      totalPlatformObligations,
      actualCompanyOwnedCash,
      reconciliationGap,
      sourceView,
    },
  };
}

export async function getFinanceMetricsSnapshot(
  supabase: SupabaseClient,
): Promise<{ data: FinanceMetricsSnapshot | null; error: string | null }> {
  const treasuryRes = await supabase
    .from('vw_treasury_pool_balances_realtime')
    .select('*')
    .single();

  if (!treasuryRes.error && treasuryRes.data) {
    return {
      data: buildFinanceMetricsSnapshot(
        (treasuryRes.data as MetricsRow) ?? null,
        'vw_treasury_pool_balances_realtime',
      ),
      error: null,
    };
  }

  const fallbackRes = await supabase
    .from('vw_financial_metrics_realtime')
    .select('*')
    .single();

  if (fallbackRes.error) {
    return {
      data: null,
      error: treasuryRes.error?.message ?? fallbackRes.error.message,
    };
  }

  return {
    data: buildFinanceMetricsSnapshot(
      (fallbackRes.data as MetricsRow) ?? null,
      'vw_financial_metrics_realtime',
    ),
    error: null,
  };
}

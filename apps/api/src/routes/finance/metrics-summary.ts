import type { SupabaseClient } from '@supabase/supabase-js';
import type { FinanceMetricsSummary } from '@sline/shared';

type MetricsRow = Record<string, unknown> | null;

export interface FinanceMetricsSnapshot extends FinanceMetricsSummary {
  raw: {
    escrowHeld: number;
    platformCash: number;
    feeRevenue: number;
    revenueAccountBalance: number;
  };
}

function toNumber(value: unknown): number {
  const numeric = typeof value === 'number' ? value : Number(value ?? 0);
  return Number.isFinite(numeric) ? numeric : 0;
}

function normalizeCurrency(value: number): number {
  return Math.abs(value) < 0.005 ? 0 : Math.round(value * 100) / 100;
}

export function buildFinanceMetricsSnapshot(metrics: MetricsRow): FinanceMetricsSnapshot {
  const escrowHeld = toNumber(metrics?.escrow_held_iqd);
  const platformCash = toNumber(metrics?.platform_cash_iqd);
  const feeRevenue = toNumber(metrics?.revenue_iqd);
  const revenueAccountBalance = toNumber(metrics?.revenue_account_balance_iqd) || feeRevenue;

  const totalOwedToUsers = normalizeCurrency(platformCash - revenueAccountBalance);
  const totalWalletBalances = normalizeCurrency(totalOwedToUsers - escrowHeld);
  const actualCompanyOwnedBalance = normalizeCurrency(platformCash - totalOwedToUsers);

  return {
    platform_cash_position: platformCash,
    userFunds: {
      held_in_escrow: escrowHeld,
      total_wallet_balances: totalWalletBalances,
      total_owed_to_users: totalOwedToUsers,
    },
    companyFunds: {
      total_fee_revenue: feeRevenue,
      net_platform_earnings: revenueAccountBalance,
      actual_company_owned_balance: actualCompanyOwnedBalance,
    },
    raw: {
      escrowHeld,
      platformCash,
      feeRevenue,
      revenueAccountBalance,
    },
  };
}

export async function getFinanceMetricsSnapshot(
  supabase: SupabaseClient,
): Promise<{ data: FinanceMetricsSnapshot | null; error: string | null }> {
  const { data, error } = await supabase.from('vw_financial_metrics_realtime').select('*').single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: buildFinanceMetricsSnapshot((data as MetricsRow) ?? null), error: null };
}

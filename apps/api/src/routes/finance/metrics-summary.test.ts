import { describe, expect, it } from 'vitest';
import { buildFinanceMetricsSnapshot } from './metrics-summary.js';

describe('buildFinanceMetricsSnapshot', () => {
  it('keeps user-held funds separate from company-owned funds', () => {
    const snapshot = buildFinanceMetricsSnapshot({
      escrow_held_iqd: 45000,
      platform_cash_iqd: 120000,
      platform_revenue_iqd: 10000,
      total_fee_revenue_iqd: 10000,
      freelancer_payables_available_iqd: 50000,
      pending_payouts_iqd: 15000,
      freelancer_payables_total_iqd: 65000,
      total_user_wallet_liabilities_iqd: 65000,
      other_user_wallet_liabilities_iqd: 5000,
      total_platform_obligations_iqd: 110000,
      actual_company_owned_cash_iqd: 10000,
      reconciliation_gap_iqd: 0,
    });

    expect(snapshot.userFunds.held_in_escrow).toBe(45000);
    expect(snapshot.userFunds.total_wallet_balances).toBe(65000);
    expect(snapshot.userFunds.total_owed_to_users).toBe(110000);
    expect(snapshot.userFunds.freelancer_payables_available).toBe(50000);
    expect(snapshot.userFunds.pending_payouts).toBe(15000);
    expect(snapshot.userFunds.freelancer_payables_total).toBe(65000);
    expect(snapshot.userFunds.total_platform_obligations).toBe(110000);
    expect(snapshot.companyFunds.total_fee_revenue).toBe(10000);
    expect(snapshot.companyFunds.net_platform_earnings).toBe(10000);
    expect(snapshot.companyFunds.actual_company_owned_balance).toBe(10000);
    expect(snapshot.companyFunds.platform_revenue).toBe(10000);
    expect(snapshot.companyFunds.actual_company_owned_cash).toBe(10000);
    expect(snapshot.reconciliation.gap_to_platform_revenue).toBe(0);
  });

  it('falls back to the escrow account balance when the legacy view zeroes escrow_held_iqd', () => {
    const snapshot = buildFinanceMetricsSnapshot(
      {
        escrow_held_iqd: 0,
        escrow_account_balance_iqd: 710000,
        platform_cash_iqd: 0,
        revenue_account_balance_iqd: 56500,
        total_fee_revenue_iqd: 56500,
      },
      'vw_financial_metrics_realtime',
    );

    expect(snapshot.userFunds.held_in_escrow).toBe(710000);
    expect(snapshot.userFunds.total_wallet_balances).toBe(0);
    expect(snapshot.userFunds.total_platform_obligations).toBe(710000);
  });

  it('keeps cash-basis position diagnostic while preserving revenue-backed company funds', () => {
    const snapshot = buildFinanceMetricsSnapshot({
      escrow_held_iqd: 710000,
      platform_cash_iqd: 0,
      platform_revenue_iqd: 56500,
      total_fee_revenue_iqd: 56500,
      freelancer_payables_available_iqd: 1429500,
      pending_payouts_iqd: 100000,
      freelancer_payables_total_iqd: 1529500,
      total_user_wallet_liabilities_iqd: 1429500,
      other_user_wallet_liabilities_iqd: 0,
      total_platform_obligations_iqd: 2239500,
      actual_company_owned_cash_iqd: -2239500,
      reconciliation_gap_iqd: -2296000,
    });

    expect(snapshot.companyFunds.actual_company_owned_balance).toBe(56500);
    expect(snapshot.companyFunds.actual_company_owned_cash).toBe(-2239500);
    expect(snapshot.reconciliation.gap_to_platform_revenue).toBe(-2296000);
  });
});

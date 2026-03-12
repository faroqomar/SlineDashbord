import { describe, expect, it } from 'vitest';
import { buildFinanceMetricsSnapshot } from './metrics-summary.js';

describe('buildFinanceMetricsSnapshot', () => {
  it('keeps user-held funds separate from company-owned funds', () => {
    const snapshot = buildFinanceMetricsSnapshot({
      escrow_held_iqd: 45000,
      platform_cash_iqd: 120000,
      revenue_iqd: 10000,
      revenue_account_balance_iqd: 10000,
    });

    expect(snapshot.userFunds.held_in_escrow).toBe(45000);
    expect(snapshot.userFunds.total_wallet_balances).toBe(65000);
    expect(snapshot.userFunds.total_owed_to_users).toBe(110000);
    expect(snapshot.companyFunds.total_fee_revenue).toBe(10000);
    expect(snapshot.companyFunds.net_platform_earnings).toBe(10000);
    expect(snapshot.companyFunds.actual_company_owned_balance).toBe(10000);
  });
});

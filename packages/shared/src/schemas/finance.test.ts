import { describe, it, expect } from 'vitest';
import {
  ApproveWithdrawalSchema,
  FinanceMetricsSummarySchema,
  RejectWithdrawalSchema,
  WalletSummarySchema,
} from './finance.js';

const validUuid = '00000000-0000-0000-0000-000000000001';

describe('finance schemas (PAGE 03 contracts)', () => {
  describe('ApproveWithdrawalSchema', () => {
    it('accepts valid requestId and optional reason', () => {
      const r = ApproveWithdrawalSchema.safeParse({ requestId: validUuid });
      expect(r.success).toBe(true);
      if (r.success) expect(r.data.reason).toBe('Approved by admin');
    });
    it('accepts custom reason', () => {
      const r = ApproveWithdrawalSchema.safeParse({ requestId: validUuid, reason: 'Manual review OK' });
      expect(r.success).toBe(true);
      if (r.success) expect(r.data.reason).toBe('Manual review OK');
    });
    it('rejects invalid requestId', () => {
      expect(ApproveWithdrawalSchema.safeParse({ requestId: 'not-a-uuid' }).success).toBe(false);
      expect(ApproveWithdrawalSchema.safeParse({ requestId: '' }).success).toBe(false);
    });
    it('rejects missing requestId', () => {
      expect(ApproveWithdrawalSchema.safeParse({}).success).toBe(false);
    });
  });

  describe('RejectWithdrawalSchema', () => {
    it('accepts valid requestId and reason', () => {
      const r = RejectWithdrawalSchema.safeParse({ requestId: validUuid, reason: 'Insufficient KYC' });
      expect(r.success).toBe(true);
    });
    it('rejects empty reason', () => {
      expect(RejectWithdrawalSchema.safeParse({ requestId: validUuid, reason: '' }).success).toBe(false);
    });
    it('rejects invalid requestId', () => {
      expect(RejectWithdrawalSchema.safeParse({ requestId: 'x', reason: 'x' }).success).toBe(false);
    });
  });

  describe('WalletSummarySchema (PAGE 12)', () => {
    it('parses wallet summary from vw_wallet_balances_user', () => {
      const w = {
        available_balance: 1000,
        held_balance: 200,
        pending_withdrawal_balance: 0,
        currency: 'IQD',
      };
      expect(WalletSummarySchema.safeParse(w).success).toBe(true);
    });
    it('parses with optional is_wallet_frozen', () => {
      const w = {
        available_balance: 0,
        held_balance: 0,
        pending_withdrawal_balance: 0,
        currency: 'IQD',
        is_wallet_frozen: true,
      };
      expect(WalletSummarySchema.safeParse(w).success).toBe(true);
    });
  });

  describe('FinanceMetricsSummarySchema', () => {
    it('separates user-held funds from company-owned funds', () => {
      const summary = {
        platform_cash_position: 120000,
        userFunds: {
          held_in_escrow: 45000,
          total_wallet_balances: 65000,
          total_owed_to_users: 110000,
        },
        companyFunds: {
          total_fee_revenue: 10000,
          net_platform_earnings: 10000,
          actual_company_owned_balance: 10000,
        },
      };

      expect(FinanceMetricsSummarySchema.safeParse(summary).success).toBe(true);
    });
  });
});

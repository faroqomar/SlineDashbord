import { describe, it, expect } from 'vitest';
import { ApproveWithdrawalSchema, RejectWithdrawalSchema } from './finance.js';

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
});

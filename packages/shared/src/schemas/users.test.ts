import { describe, it, expect } from 'vitest';
import { ForceLogoutInputSchema } from './users.js';

const validUuid = '00000000-0000-0000-0000-000000000001';

describe('users schemas (PAGE 06 force-logout)', () => {
  describe('ForceLogoutInputSchema', () => {
    it('accepts valid userId only', () => {
      const r = ForceLogoutInputSchema.safeParse({ userId: validUuid });
      expect(r.success).toBe(true);
      if (r.success) {
        expect(r.data.userId).toBe(validUuid);
        expect(r.data.reason).toBeUndefined();
        expect(r.data.idempotency_key).toBeUndefined();
      }
    });
    it('accepts userId with optional reason and idempotency_key', () => {
      const r = ForceLogoutInputSchema.safeParse({
        userId: validUuid,
        reason: 'Security incident',
        idempotency_key: 'key-123',
      });
      expect(r.success).toBe(true);
      if (r.success) {
        expect(r.data.reason).toBe('Security incident');
        expect(r.data.idempotency_key).toBe('key-123');
      }
    });
    it('rejects invalid userId', () => {
      expect(ForceLogoutInputSchema.safeParse({ userId: 'not-a-uuid' }).success).toBe(false);
      expect(ForceLogoutInputSchema.safeParse({ userId: '' }).success).toBe(false);
    });
    it('rejects missing userId', () => {
      expect(ForceLogoutInputSchema.safeParse({}).success).toBe(false);
    });
  });
});

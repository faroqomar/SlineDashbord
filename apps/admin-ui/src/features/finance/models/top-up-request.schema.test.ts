import { describe, expect, it } from 'vitest';
import {
  TopUpApprovalFormSchema,
  buildTopUpApprovalRequest,
  generateTopUpIdempotencyKey,
} from './top-up-request.schema';

describe('top-up-request.schema', () => {
  it('builds a wallet_adjust approval request payload', () => {
    const parsed = TopUpApprovalFormSchema.parse({
      targetUserId: '00000000-0000-0000-0000-000000000123',
      amountCents: 150000,
      reason: 'Manual balance correction',
    });

    const requestBody = buildTopUpApprovalRequest(parsed);
    expect(requestBody).toEqual({
      operation_type: 'wallet_adjust',
      target_entity_type: 'profile',
      target_entity_id: '00000000-0000-0000-0000-000000000123',
      payload: { amount_cents: 150000 },
      reason: 'Manual balance correction',
    });
  });

  it('rejects invalid form payload', () => {
    const parsed = TopUpApprovalFormSchema.safeParse({
      targetUserId: 'not-a-uuid',
      amountCents: 0,
      reason: 'x',
    });

    expect(parsed.success).toBe(false);
  });

  it('generates deterministic idempotency key when inputs are provided', () => {
    const key = generateTopUpIdempotencyKey(1700000000000, 'abc123');
    expect(key).toBe('finance-topup-1700000000000-abc123');
  });
});

import { z } from 'zod';
import type { ApprovalRequest } from '@sline/shared';

const TOP_UP_MAX_REASON_LENGTH = 500;

export const TopUpApprovalFormSchema = z.object({
  targetUserId: z.string().uuid('Target user must be a valid UUID'),
  amountCents: z.coerce
    .number()
    .int('Amount must be an integer')
    .positive('Amount must be greater than 0')
    .max(1_000_000_000, 'Amount is too large'),
  reason: z
    .string()
    .trim()
    .min(3, 'Reason must be at least 3 characters')
    .max(TOP_UP_MAX_REASON_LENGTH, 'Reason is too long'),
});

export type TopUpApprovalFormValues = z.infer<typeof TopUpApprovalFormSchema>;

export function buildTopUpApprovalRequest(values: TopUpApprovalFormValues): ApprovalRequest {
  return {
    operation_type: 'wallet_adjust',
    target_entity_type: 'profile',
    target_entity_id: values.targetUserId,
    payload: {
      amount_cents: values.amountCents,
    },
    reason: values.reason,
  };
}

export function generateTopUpIdempotencyKey(now = Date.now(), random?: string): string {
  const randomValue =
    random ??
    (typeof globalThis.crypto?.randomUUID === 'function'
      ? globalThis.crypto.randomUUID()
      : Math.random().toString(36).slice(2, 12));

  return `finance-topup-${now}-${randomValue}`;
}

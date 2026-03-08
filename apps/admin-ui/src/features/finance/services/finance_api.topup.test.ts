import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ApprovalRequest } from '@sline/shared';
import api from '@/lib/api';
import { financeApi } from './finance_api';

vi.mock('@/lib/api', () => ({
  request: vi.fn(),
  default: {
    post: vi.fn(),
  },
}));

describe('finance_api.createApproval', () => {
  const postMock = vi.mocked(api.post);

  const approvalRequest: ApprovalRequest = {
    operation_type: 'wallet_adjust',
    target_entity_type: 'profile',
    target_entity_id: '00000000-0000-0000-0000-000000000123',
    payload: { amount_cents: 150000 },
    reason: 'Top-up approval',
  };

  beforeEach(() => {
    postMock.mockReset();
  });

  it('sends idempotency key header with create approval request', async () => {
    postMock.mockResolvedValue({
      data: {
        ok: true,
        data: {
          id: '00000000-0000-0000-0000-000000000999',
          operation_type: 'wallet_adjust',
          target_entity_type: 'profile',
          target_entity_id: approvalRequest.target_entity_id,
          requested_by: '00000000-0000-0000-0000-000000000111',
          approved_by: null,
          status: 'pending',
          idempotency_key: 'idem-key',
          payload: { amount_cents: 150000 },
          reason: approvalRequest.reason,
          created_at: '2026-03-05T10:00:00.000Z',
          resolved_at: null,
          consumed_at: null,
        },
      },
    } as any);

    const result = await financeApi.createApproval(approvalRequest, 'idem-key');

    expect(postMock).toHaveBeenCalledWith('/finance/approvals', approvalRequest, {
      headers: { 'Idempotency-Key': 'idem-key' },
    });
    expect(result.id).toBe('00000000-0000-0000-0000-000000000999');
    expect(result.status).toBe('pending');
  });

  it('throws API message when approval creation fails', async () => {
    postMock.mockRejectedValue({
      response: {
        data: {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid body',
          },
        },
      },
    });

    await expect(financeApi.createApproval(approvalRequest, 'idem-key-2')).rejects.toThrow('Invalid body');
  });
});

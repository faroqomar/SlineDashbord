import { beforeEach, describe, expect, it, vi } from 'vitest';
import { request } from '@/lib/api';
import { disputesApi } from './disputes_api';

vi.mock('@/lib/api', () => ({
  request: vi.fn(),
}));

describe('disputes_api.createDispute', () => {
  const requestMock = vi.mocked(request);

  beforeEach(() => {
    requestMock.mockReset();
  });

  it('posts create payload to /disputes', async () => {
    requestMock.mockResolvedValue({
      ok: true,
      data: { id: '00000000-0000-0000-0000-000000000777' },
    } as any);

    const result = await disputesApi.createDispute({
      task_id: '00000000-0000-0000-0000-000000000010',
      complainant_id: '00000000-0000-0000-0000-000000000011',
      defendant_id: '00000000-0000-0000-0000-000000000012',
      reason: 'Provider failed to deliver the expected task',
    });

    expect(requestMock).toHaveBeenCalledWith('POST', '/disputes', {
      task_id: '00000000-0000-0000-0000-000000000010',
      complainant_id: '00000000-0000-0000-0000-000000000011',
      defendant_id: '00000000-0000-0000-0000-000000000012',
      reason: 'Provider failed to deliver the expected task',
    });
    expect(result.id).toBe('00000000-0000-0000-0000-000000000777');
  });

  it('throws API error when create fails', async () => {
    requestMock.mockResolvedValue({
      ok: false,
      error: { message: 'Invalid input' },
    } as any);

    await expect(
      disputesApi.createDispute({
        task_id: '00000000-0000-0000-0000-000000000010',
        complainant_id: '00000000-0000-0000-0000-000000000011',
        defendant_id: '00000000-0000-0000-0000-000000000012',
        reason: 'Provider failed to deliver the expected task',
      }),
    ).rejects.toThrow('Invalid input');
  });
});

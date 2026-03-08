import { beforeEach, describe, expect, it, vi } from 'vitest';
import { request } from '@/lib/api';
import { reportsApi } from './reports_api';

vi.mock('@/lib/api', () => ({
  request: vi.fn(),
}));

describe('reports_api.create', () => {
  const requestMock = vi.mocked(request);

  beforeEach(() => {
    requestMock.mockReset();
  });

  it('posts create payload to /reports', async () => {
    requestMock.mockResolvedValue({
      ok: true,
      data: {
        id: '00000000-0000-0000-0000-000000000777',
        status: 'open',
        resolution: null,
      },
    } as any);

    const result = await reportsApi.create({
      entity_type: 'task',
      entity_id: '00000000-0000-0000-0000-000000000010',
      reason: 'Manual report from dashboard',
      category: 'abuse',
      severity: 'high',
    });

    expect(requestMock).toHaveBeenCalledWith('POST', '/reports', {
      entity_type: 'task',
      entity_id: '00000000-0000-0000-0000-000000000010',
      reason: 'Manual report from dashboard',
      category: 'abuse',
      severity: 'high',
    });
    expect(result.id).toBe('00000000-0000-0000-0000-000000000777');
    expect(result.status).toBe('open');
  });

  it('throws API error when create fails', async () => {
    requestMock.mockResolvedValue({
      ok: false,
      error: { message: 'Invalid body' },
    } as any);

    await expect(
      reportsApi.create({
        entity_type: 'task',
        entity_id: '00000000-0000-0000-0000-000000000010',
        reason: 'Manual report from dashboard',
      }),
    ).rejects.toThrow('Invalid body');
  });
});

describe('reports_api.list search query', () => {
  const requestMock = vi.mocked(request);

  beforeEach(() => {
    requestMock.mockReset();
  });

  it('sends q in query params', async () => {
    requestMock.mockResolvedValue({
      ok: true,
      data: { reports: [], total: 0, page: 1, limit: 20 },
    } as any);

    await reportsApi.list({ q: 'abuse report', page: 1, limit: 20 });

    expect(requestMock).toHaveBeenCalledWith('GET', '/reports?q=abuse+report&page=1&limit=20');
  });
});

describe('reports_api.analytics', () => {
  const requestMock = vi.mocked(request);

  beforeEach(() => {
    requestMock.mockReset();
  });

  it('fetches trends payload', async () => {
    requestMock.mockResolvedValue({
      ok: true,
      data: {
        window: '7d',
        timezone: 'UTC',
        points: Array.from({ length: 7 }).map((_, idx) => ({
          date: `2026-03-0${idx + 1}`,
          incoming: idx + 1,
          resolved: idx,
        })),
      },
    } as any);

    const result = await reportsApi.getTrends('7d');

    expect(requestMock).toHaveBeenCalledWith('GET', '/reports/trends?window=7d');
    expect(result.points).toHaveLength(7);
  });

  it('fetches kpis payload', async () => {
    requestMock.mockResolvedValue({
      ok: true,
      data: {
        window: '7d',
        comparison_window: 'previous_7d',
        cards: [
          { key: 'total', count: 1, delta_absolute: 1, delta_percent: 100, trend: [1, 1, 1, 1, 1, 1, 1] },
          { key: 'open', count: 1, delta_absolute: 0, delta_percent: 0, trend: [1, 0, 0, 0, 0, 0, 0] },
          { key: 'escalated', count: 0, delta_absolute: 0, delta_percent: null, trend: [0, 0, 0, 0, 0, 0, 0] },
          { key: 'closed', count: 0, delta_absolute: 0, delta_percent: null, trend: [0, 0, 0, 0, 0, 0, 0] },
        ],
      },
    } as any);

    const result = await reportsApi.getKpis('7d');

    expect(requestMock).toHaveBeenCalledWith('GET', '/reports/kpis?window=7d');
    expect(result.cards).toHaveLength(4);
  });
});

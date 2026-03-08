import { describe, expect, it } from 'vitest';
import type { AdminCasesHeroSeries } from '@sline/shared';
import { loadCasesHeroSeries } from './use_cases_viewmodel';

function makeSeriesPayload(values: { opened: number[]; closed: number[]; is_stale?: boolean }): AdminCasesHeroSeries {
  return {
    window: '7d',
    opened: values.opened.map((value, index) => ({
      bucket_start: `2026-03-0${index + 1}T00:00:00Z`,
      value,
    })),
    closed: values.closed.map((value, index) => ({
      bucket_start: `2026-03-0${index + 1}T00:00:00Z`,
      value,
    })),
    kpis: [
      { id: 'total', value: 10, delta: '+2', trend: 'up', sparkline: [1, 2, 3, 4, 5, 6, 7] },
      { id: 'open', value: 4, delta: '-1', trend: 'down', sparkline: [7, 6, 5, 4, 3, 2, 1] },
      { id: 'in_progress', value: 3, delta: '0', trend: 'neutral', sparkline: [3, 3, 3, 3, 3, 3, 3] },
      { id: 'escalated', value: 1, delta: '+1', trend: 'up', sparkline: [0, 0, 0, 1, 1, 1, 1] },
    ],
    is_stale: values.is_stale,
    generated_at: '2026-03-07T12:00:00Z',
  };
}

describe('useCasesViewModel hero analytics loader', () => {
  it('returns real hero analytics payload when API succeeds', async () => {
    const payload = makeSeriesPayload({
      opened: [1, 2, 3, 4, 5, 6, 7],
      closed: [7, 6, 5, 4, 3, 2, 1],
    });
    const apiClient = {
      getCasesAnalytics: async () => payload,
    };

    const result = await loadCasesHeroSeries(apiClient);

    expect(result).not.toBeNull();
    expect(result?.opened.map((point) => point.value)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(result?.closed.map((point) => point.value)).toEqual([7, 6, 5, 4, 3, 2, 1]);
    expect(result?.kpis).toHaveLength(4);
  });

  it('returns null when analytics request fails', async () => {
    const apiClient = {
      getCasesAnalytics: async () => {
        throw new Error('network');
      },
    };

    const result = await loadCasesHeroSeries(apiClient);
    expect(result).toBeNull();
  });

  it('returns null when backend marks analytics payload as stale', async () => {
    const payload = makeSeriesPayload({
      opened: [1, 2, 3, 4, 5, 6, 7],
      closed: [7, 6, 5, 4, 3, 2, 1],
      is_stale: true,
    });
    const apiClient = {
      getCasesAnalytics: async () => payload,
    };

    const result = await loadCasesHeroSeries(apiClient);
    expect(result).toBeNull();
  });
});

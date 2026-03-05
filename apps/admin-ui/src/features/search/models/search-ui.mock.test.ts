import { describe, expect, it } from 'vitest';
import type { AdminSearchInsightsResult } from '@sline/shared';
import { buildSearchKpiCardsFromInsights } from './search-ui.mock';

function makeInsights(overrides?: Partial<AdminSearchInsightsResult>): AdminSearchInsightsResult {
  return {
    windowHours: 24,
    generatedAt: '2026-03-05T00:00:00.000Z',
    stale: false,
    metrics: {
      searchesToday: { value: 284, deltaPercent: 18, sparkline: [24, 32, 28, 40, 37, 44], stale: false },
      avgResultsPerQuery: { value: 8.3, deltaPercent: 5, sparkline: [18, 26, 22, 36, 30, 41], stale: false },
      instantMatchRate: { value: 95, deltaPercent: 2, sparkline: [40, 42, 39, 43, 41, 45], stale: false },
      zeroResultQueries: { value: 4, deltaPercent: -3, sparkline: [44, 26, 48, 20, 36, 18], stale: false },
    },
    ...overrides,
  };
}

describe('buildSearchKpiCardsFromInsights', () => {
  it('maps insights metrics to non-mock KPI cards', () => {
    const cards = buildSearchKpiCardsFromInsights(makeInsights());

    expect(cards).toHaveLength(4);
    expect(cards[0]).toMatchObject({
      id: 'searches_today',
      value: '284',
      delta: '+18%',
      isMock: false,
      isStale: false,
    });
    expect(cards[1]).toMatchObject({
      id: 'avg_results',
      value: '8.3',
      delta: '+5%',
      isMock: false,
      isStale: false,
    });
    expect(cards[2]).toMatchObject({
      id: 'instant_matches',
      value: '95%',
      delta: '+2%',
      isMock: false,
      isStale: false,
    });
    expect(cards[3]).toMatchObject({
      id: 'zero_results',
      value: '4',
      delta: '-3%',
      tone: 'success',
      isMock: false,
      isStale: false,
    });
  });

  it('marks cards stale when endpoint is stale and uses warning tone for rising zero results', () => {
    const cards = buildSearchKpiCardsFromInsights(
      makeInsights({
        stale: true,
        metrics: {
          ...makeInsights().metrics,
          zeroResultQueries: {
            ...makeInsights().metrics.zeroResultQueries,
            deltaPercent: 12,
          },
        },
      })
    );

    expect(cards.every((card) => card.isStale)).toBe(true);
    expect(cards.find((card) => card.id === 'zero_results')?.tone).toBe('warning');
  });
});

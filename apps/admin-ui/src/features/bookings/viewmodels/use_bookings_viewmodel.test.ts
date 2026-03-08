import { describe, expect, it } from 'vitest';
import type { BookingAnalyticsKpis, BookingAnalyticsSeries } from '@sline/shared';
import { BOOKING_KPI_MOCK_CARDS, HERO_BOOKED_SERIES_MOCK, HERO_COMPLETED_SERIES_MOCK } from '../models/bookings-ui.mock';
import { loadBookingHeroSeries, loadBookingKpiCards } from './use_bookings_viewmodel';

function makeSeriesPayload(values: { booked: number[]; completed: number[]; is_stale?: boolean }): BookingAnalyticsSeries {
  return {
    window: '7d',
    timezone: 'UTC',
    points: values.booked.map((bookedValue, index) => ({
      bucket_start: `2026-03-0${index + 1}T00:00:00Z`,
      booked: bookedValue,
      completed: values.completed[index] ?? 0,
    })),
    updated_at: '2026-03-07T12:00:00Z',
    is_stale: values.is_stale,
  };
}

function makeKpiPayload(values?: { is_stale?: boolean }): BookingAnalyticsKpis {
  return {
    window: '7d',
    currency: 'IQD',
    cards: [
      { id: 'total_bookings', value: 12, delta: 22, sparkline: [1, 2, 3, 4, 5, 6, 7], tone: 'violet' },
      { id: 'completed', value: 5, delta: 4, sparkline: [0, 1, 1, 1, 2, 2, 3], tone: 'green' },
      { id: 'revenue', value: 230000, delta: 31, sparkline: [20, 24, 27, 32, 28, 34, 33], tone: 'amber' },
      { id: 'canceled', value: 2, delta: -2, sparkline: [1, 0, 1, 0, 0, 1, 0], tone: 'red' },
    ],
    updated_at: '2026-03-07T12:00:00Z',
    is_stale: values?.is_stale,
  };
}

describe('useBookingsViewModel hero analytics loader', () => {
  it('returns real hero series when analytics request succeeds', async () => {
    const payload = makeSeriesPayload({
      booked: [2, 3, 4, 5, 6, 7, 8],
      completed: [1, 2, 3, 4, 5, 6, 7],
    });
    const apiClient = {
      getAnalyticsSeries: async () => payload,
    };

    const result = await loadBookingHeroSeries(apiClient);

    expect(result.booked).toEqual([2, 3, 4, 5, 6, 7, 8]);
    expect(result.completed).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(result.isMock).toBe(false);
  });

  it('falls back to mock hero series when analytics request fails', async () => {
    const apiClient = {
      getAnalyticsSeries: async () => {
        throw new Error('network');
      },
    };

    const result = await loadBookingHeroSeries(apiClient);

    expect(result.booked).toEqual(HERO_BOOKED_SERIES_MOCK);
    expect(result.completed).toEqual(HERO_COMPLETED_SERIES_MOCK);
    expect(result.isMock).toBe(true);
  });
});

describe('useBookingsViewModel KPI loader', () => {
  it('maps live KPI payload into UI cards', async () => {
    const apiClient = {
      getAnalyticsKpis: async () => makeKpiPayload(),
    };

    const result = await loadBookingKpiCards(apiClient);

    expect(result).toHaveLength(4);
    expect(result[0]).toMatchObject({
      id: 'total_bookings',
      label: 'Total Bookings',
      value: '12',
      delta: '+22%',
      isMock: false,
    });
    expect(result[2]).toMatchObject({
      id: 'revenue',
      label: 'Revenue',
      value: '230K',
      delta: '+31%',
      isMock: false,
    });
  });

  it('keeps API values but marks cards as fallback when backend marks response stale', async () => {
    const apiClient = {
      getAnalyticsKpis: async () => makeKpiPayload({ is_stale: true }),
    };

    const result = await loadBookingKpiCards(apiClient);

    expect(result.every((card) => card.isMock)).toBe(true);
    expect(result[0]?.value).toBe('12');
  });

  it('falls back to mock KPI cards when analytics request fails', async () => {
    const apiClient = {
      getAnalyticsKpis: async () => {
        throw new Error('network');
      },
    };

    const result = await loadBookingKpiCards(apiClient);

    expect(result).toHaveLength(4);
    expect(result.map((card) => card.id)).toEqual(BOOKING_KPI_MOCK_CARDS.map((card) => card.id));
    expect(result.every((card) => card.isMock)).toBe(true);
  });
});

import { useState, useCallback, useEffect } from 'react';
import type { BookingAnalyticsKpis, BookingDetail, BookingListSort, BookingRow } from '@sline/shared';
import { bookingsApi } from '../services/bookings_api';
import {
  BOOKING_KPI_MOCK_CARDS,
  HERO_BOOKED_SERIES_MOCK,
  HERO_COMPLETED_SERIES_MOCK,
} from '../models/bookings-ui.mock';

export interface BookingFilters {
  page?: number;
  pageSize?: number;
  status?: string;
  q?: string;
  sort?: BookingListSort;
}

export interface BookingHeroSeriesState {
  booked: number[];
  completed: number[];
  isMock: boolean;
}

export interface BookingKpiCardVm {
  id: 'total_bookings' | 'completed' | 'revenue' | 'canceled';
  label: string;
  value: string;
  delta: string;
  sparkline: number[];
  tone: 'violet' | 'green' | 'amber' | 'red';
  isMock: boolean;
}

const KPI_LABEL_BY_ID: Record<BookingKpiCardVm['id'], string> = {
  total_bookings: 'Total Bookings',
  completed: 'Completed',
  revenue: 'Revenue',
  canceled: 'Canceled',
};

const KPI_CARD_ORDER: BookingKpiCardVm['id'][] = ['total_bookings', 'completed', 'revenue', 'canceled'];

function createMockHeroSeries(): BookingHeroSeriesState {
  return {
    booked: [...HERO_BOOKED_SERIES_MOCK],
    completed: [...HERO_COMPLETED_SERIES_MOCK],
    isMock: true,
  };
}

function createMockKpiCards(): BookingKpiCardVm[] {
  return BOOKING_KPI_MOCK_CARDS.map((card) => ({
    ...card,
    isMock: true,
  }));
}

function formatKpiValue(id: BookingKpiCardVm['id'], raw: number): string {
  if (id === 'revenue') {
    if (raw >= 1000) {
      const compact = raw >= 10000 ? Math.round(raw / 1000).toString() : (raw / 1000).toFixed(1).replace(/\.0$/, '');
      return `${compact}K`;
    }
    return Math.round(raw).toString();
  }
  return Math.round(raw).toString();
}

function formatKpiDelta(raw: number): string {
  const normalized = Number.isInteger(raw) ? raw : Number(raw.toFixed(1));
  const sign = normalized > 0 ? '+' : '';
  return `${sign}${normalized}%`;
}

function mapKpiCard(
  card: BookingAnalyticsKpis['cards'][number],
  isStale: boolean
): BookingKpiCardVm {
  return {
    id: card.id,
    label: KPI_LABEL_BY_ID[card.id],
    value: formatKpiValue(card.id, card.value),
    delta: formatKpiDelta(card.delta),
    sparkline: card.sparkline,
    tone: card.tone,
    isMock: isStale,
  };
}

export async function loadBookingHeroSeries(
  apiClient: Pick<typeof bookingsApi, 'getAnalyticsSeries'>
): Promise<BookingHeroSeriesState> {
  try {
    const data = await apiClient.getAnalyticsSeries({ window: '7d' });
    const booked = data.points.map((point) => point.booked);
    const completed = data.points.map((point) => point.completed);

    if (booked.length !== 7 || completed.length !== 7) return createMockHeroSeries();

    return {
      booked,
      completed,
      isMock: data.is_stale === true,
    };
  } catch {
    return createMockHeroSeries();
  }
}

export async function loadBookingKpiCards(
  apiClient: Pick<typeof bookingsApi, 'getAnalyticsKpis'>
): Promise<BookingKpiCardVm[]> {
  try {
    const data = await apiClient.getAnalyticsKpis();
    const cardsById = new Map(data.cards.map((card) => [card.id, card] as const));

    for (const id of KPI_CARD_ORDER) {
      if (!cardsById.has(id)) return createMockKpiCards();
    }

    const isStale = data.is_stale === true;
    return KPI_CARD_ORDER.map((id) => mapKpiCard(cardsById.get(id)!, isStale));
  } catch {
    return createMockKpiCards();
  }
}

export function useBookingsViewModel(initialFilters: BookingFilters = { page: 1, pageSize: 10, sort: 'created_desc' }) {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [count, setCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isHeroLoading, setIsHeroLoading] = useState(true);
  const [isKpisLoading, setIsKpisLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BookingFilters>({
    page: initialFilters.page ?? 1,
    pageSize: initialFilters.pageSize ?? 10,
    status: initialFilters.status,
    q: initialFilters.q,
    sort: initialFilters.sort ?? 'created_desc',
  });
  const [heroSeries, setHeroSeries] = useState<BookingHeroSeriesState>(() => createMockHeroSeries());
  const [kpiCards, setKpiCards] = useState<BookingKpiCardVm[]>(() => createMockKpiCards());

  const [selectedBooking, setSelectedBooking] = useState<BookingDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const fetchList = useCallback(async (currentFilters: BookingFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await bookingsApi.getList({
        page: currentFilters.page ?? 1,
        pageSize: currentFilters.pageSize ?? 10,
        status: currentFilters.status,
        q: currentFilters.q,
        sort: currentFilters.sort,
      });
      setBookings(data.bookings);
      setCount(data.count);
      setTotalPages(data.totalPages);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const changeFilters = useCallback((newFilters: Partial<BookingFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page ?? prev.page ?? 1,
      sort: newFilters.sort ?? prev.sort ?? 'created_desc',
    }));
  }, []);

  const loadDetail = useCallback(async (bookingId: string) => {
    setIsLoadingDetail(true);
    setError(null);
    try {
      const detail = await bookingsApi.getById(bookingId);
      setSelectedBooking(detail);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load booking');
      setSelectedBooking(null);
    } finally {
      setIsLoadingDetail(false);
    }
  }, []);

  const cancel = async (bookingId: string, reason: string) => {
    setIsMutating(true);
    setError(null);
    try {
      await bookingsApi.cancel(bookingId, { reason });
      await loadDetail(bookingId);
      return true;
    } catch (e: any) {
      setError(e.message ?? 'Failed to cancel');
      return false;
    } finally {
      setIsMutating(false);
    }
  };

  const refund = async (bookingId: string, reason: string, idempotencyKey?: string) => {
    setIsMutating(true);
    setError(null);
    try {
      await bookingsApi.refund(bookingId, { reason, idempotency_key: idempotencyKey });
      await loadDetail(bookingId);
      return true;
    } catch (e: any) {
      setError(e.message ?? 'Failed to refund');
      return false;
    } finally {
      setIsMutating(false);
    }
  };

  const fetchHeroSeries = useCallback(async () => {
    setIsHeroLoading(true);
    try {
      const nextHeroSeries = await loadBookingHeroSeries(bookingsApi);
      setHeroSeries(nextHeroSeries);
    } finally {
      setIsHeroLoading(false);
    }
  }, []);

  const fetchKpiCards = useCallback(async () => {
    setIsKpisLoading(true);
    try {
      const nextKpis = await loadBookingKpiCards(bookingsApi);
      setKpiCards(nextKpis);
    } finally {
      setIsKpisLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchList(filters);
  }, [filters, fetchList]);

  useEffect(() => {
    void fetchHeroSeries();
  }, [fetchHeroSeries]);

  useEffect(() => {
    void fetchKpiCards();
  }, [fetchKpiCards]);

  const refreshBookings = useCallback(async () => {
    await Promise.all([fetchList(filters), fetchHeroSeries(), fetchKpiCards()]);
  }, [fetchHeroSeries, fetchKpiCards, fetchList, filters]);

  return {
    bookings,
    count,
    totalPages,
    isLoading,
    isHeroLoading,
    isKpisLoading,
    error,
    filters,
    changeFilters,
    fetchList,
    refreshBookings,
    heroBookedSeries: heroSeries.booked,
    heroCompletedSeries: heroSeries.completed,
    isHeroSeriesMock: heroSeries.isMock,
    kpiCards,
    selectedBooking,
    isLoadingDetail,
    loadDetail,
    setSelectedBooking,
    cancel,
    refund,
    isMutating,
  };
}

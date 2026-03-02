import { useState, useCallback, useEffect } from 'react';
import type { BookingRow, BookingDetail } from '@sline/shared';
import { bookingsApi } from '../services/bookings_api';

export interface BookingFilters {
  page?: number;
  pageSize?: number;
  status?: string;
}

export function useBookingsViewModel(initialFilters: BookingFilters = { page: 1, pageSize: 10 }) {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [count, setCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BookingFilters>(initialFilters);

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

  const changeFilters = (newFilters: Partial<BookingFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: newFilters.page ?? prev.page ?? 1 }));
  };

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

  useEffect(() => {
    fetchList(filters);
  }, [filters, fetchList]);

  return {
    bookings,
    count,
    totalPages,
    isLoading,
    error,
    filters,
    changeFilters,
    fetchList,
    selectedBooking,
    isLoadingDetail,
    loadDetail,
    setSelectedBooking,
    cancel,
    refund,
    isMutating,
  };
}

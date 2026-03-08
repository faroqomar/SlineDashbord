import { request } from '../../../lib/api';
import type {
  BookingAnalyticsSeries,
  BookingAnalyticsKpis,
  BookingRow,
  BookingDetail,
  BookingListResponse,
  BookingListSort,
  AdminBookingCancelInput,
  AdminBookingRefundInput,
} from '@sline/shared';

export const bookingsApi = {
  getList: async (params: { page?: number; pageSize?: number; status?: string; q?: string; sort?: BookingListSort }) => {
    const search = new URLSearchParams();
    if (params.page != null) search.append('page', String(params.page));
    if (params.pageSize != null) search.append('pageSize', String(params.pageSize));
    if (params.status) search.append('status', params.status);
    if (params.q) search.append('q', params.q);
    if (params.sort) search.append('sort', params.sort);
    const res = await request<BookingListResponse>('GET', `/bookings?${search.toString()}`);
    if (!res.ok) throw new Error(res.error?.message ?? 'Failed to fetch bookings');
    return res.data;
  },

  getById: async (bookingId: string) => {
    const res = await request<BookingDetail>('GET', `/bookings/${bookingId}`);
    if (!res.ok) throw new Error(res.error?.message ?? 'Failed to fetch booking');
    return res.data;
  },

  getAnalyticsSeries: async (params: { window?: '7d'; tz?: 'UTC' } = {}) => {
    const search = new URLSearchParams();
    if (params.window) search.append('window', params.window);
    if (params.tz) search.append('tz', params.tz);
    const qs = search.toString();
    const res = await request<BookingAnalyticsSeries>('GET', `/bookings/analytics/series${qs ? `?${qs}` : ''}`);
    if (!res.ok) throw new Error(res.error?.message ?? 'Failed to fetch booking analytics');
    return res.data;
  },

  getAnalyticsKpis: async () => {
    const res = await request<BookingAnalyticsKpis>('GET', '/bookings/analytics/kpis');
    if (!res.ok) throw new Error(res.error?.message ?? 'Failed to fetch booking KPIs');
    return res.data;
  },

  cancel: async (bookingId: string, input: AdminBookingCancelInput) => {
    const res = await request<{ id: string }>('POST', `/bookings/${bookingId}/cancel`, input);
    if (!res.ok) throw new Error(res.error?.message ?? 'Failed to cancel booking');
    return res.data;
  },

  refund: async (bookingId: string, input: AdminBookingRefundInput) => {
    const res = await request<{ id: string }>('POST', `/bookings/${bookingId}/refund`, input);
    if (!res.ok) throw new Error(res.error?.message ?? 'Failed to refund booking');
    return res.data;
  },
};

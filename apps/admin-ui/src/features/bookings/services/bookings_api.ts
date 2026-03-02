import { request } from '../../../lib/api';
import type {
  BookingRow,
  BookingDetail,
  BookingListResponse,
  AdminBookingCancelInput,
  AdminBookingRefundInput,
} from '@sline/shared';

export const bookingsApi = {
  getList: async (params: { page?: number; pageSize?: number; status?: string }) => {
    const search = new URLSearchParams();
    if (params.page != null) search.append('page', String(params.page));
    if (params.pageSize != null) search.append('pageSize', String(params.pageSize));
    if (params.status) search.append('status', params.status);
    const res = await request<BookingListResponse>('GET', `/bookings?${search.toString()}`);
    if (!res.ok) throw new Error(res.error?.message ?? 'Failed to fetch bookings');
    return res.data;
  },

  getById: async (bookingId: string) => {
    const res = await request<BookingDetail>('GET', `/bookings/${bookingId}`);
    if (!res.ok) throw new Error(res.error?.message ?? 'Failed to fetch booking');
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

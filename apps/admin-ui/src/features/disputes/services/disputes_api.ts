import { request } from "@/lib/api";
import type { DisputeDTO } from "../models/dispute.schema";
import type { AdminResolveDisputeInput, AdminResolveDisputeResult, CreateDisputeInput } from "@sline/shared";
import api from '@/lib/api';

export type DisputeListResponse = {
  disputes: DisputeDTO[];
  totalDisputes: number;
  totalPages: number;
  tabCounts?: { all: number; open: number; active: number; resolved: number; canceled: number };
};

export const disputesApi = {
  getDisputes: async (params: { page?: number; limit?: number; status?: string; query?: string }): Promise<DisputeListResponse> => {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') search.append(k, String(v));
    });
    const res = await request<DisputeListResponse>('GET', `/disputes?${search.toString()}`);
    if (!res.ok) throw new Error(res.error?.message || 'Failed to fetch disputes');
    return res.data;
  },

  getDisputeDetails: async (id: string) => {
    const res = await request<any>('GET', `/disputes/${id}`);
    if (!res.ok) throw new Error(res.error?.message || 'Failed to fetch dispute details');
    return res.data;
  },

  createDispute: async (data: CreateDisputeInput) => {
    const res = await request<{ id: string }>('POST', '/disputes', data);
    if (!res.ok) throw new Error(res.error?.message || 'Failed to create dispute');
    return res.data;
  },

  acceptDispute: async (id: string) => {
    const res = await request<{ id: string }>('POST', `/disputes/${id}/accept`, {});
    if (!res.ok) throw new Error(res.error?.message || 'Failed to accept dispute');
    return res.data;
  },

  cancelDispute: async (id: string, reason: string) => {
    const res = await request<{ id: string }>('POST', `/disputes/${id}/cancel`, { reason });
    if (!res.ok) throw new Error(res.error?.message || 'Failed to cancel dispute');
    return res.data;
  },

  resolveDispute: async (id: string, data: Omit<AdminResolveDisputeInput, 'dispute_id'>, idempotencyKey: string) => {
    const res = await api.post<{ ok: true; data: AdminResolveDisputeResult }>(`/disputes/${id}/resolve`, data, {
      headers: { 'Idempotency-Key': idempotencyKey },
    }).then((r) => r.data).catch((err: any) => ({
      ok: false as const,
      error: { code: err.response?.data?.error?.code || 'FETCH_ERROR', message: err.response?.data?.error?.message || err.message },
    }));
    if (!res.ok) throw new Error(res.error?.message || 'Failed to resolve dispute');
    return res.data;
  },
};

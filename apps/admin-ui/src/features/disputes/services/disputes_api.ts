import { request } from "@/lib/api";
import type { DisputeDTO } from "../models/dispute.schema";

export const disputesApi = {
  getDisputes: async (params: { page?: number, limit?: number, status?: string, query?: string }) => {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') search.append(k, String(v));
    });
    
    const res = await request<{ disputes: any[], totalDisputes: number, totalPages: number }>('GET', `/disputes?${search.toString()}`);
    if (!res.ok) throw new Error(res.error?.message || 'Failed to fetch disputes');
    return res.data;
  },
  
  getDisputeDetails: async (id: string) => {
    const res = await request<any>('GET', `/disputes/${id}`);
    if (!res.ok) throw new Error(res.error?.message || 'Failed to fetch dispute details');
    return res.data;
  },
  
  resolveDispute: async (id: string, data: { status: string, resolution: string, decision?: string }) => {
    const res = await request<{ id: string }>('POST', `/disputes/${id}/resolve`, data);
    if (!res.ok) throw new Error(res.error?.message || 'Failed to resolve dispute');
    return res.data;
  }
};

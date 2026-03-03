import { request } from '../../../lib/api';
import type { ObservabilityResponse } from '@sline/shared';

export type ObservabilityData = ObservabilityResponse['data'];

export const observabilityApi = {
  getObservability: async (): Promise<ObservabilityData> => {
    const res = await request<ObservabilityData>('GET', '/observability');
    if (!res.ok) throw new Error(res.error?.message || 'Failed to fetch system health');
    return res.data;
  },
};

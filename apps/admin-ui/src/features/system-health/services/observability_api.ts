import { createScopedLogger } from '../../../lib/appLogger';
import { request } from '../../../lib/api';
import type { ObservabilityResponse } from '@sline/shared';

const log = createScopedLogger('SystemHealth:API');

export type ObservabilityData = ObservabilityResponse['data'];

export const observabilityApi = {
  getObservability: async (): Promise<ObservabilityData> => {
    log.debug('GET /observability request');
    const res = await request<ObservabilityData>('GET', '/observability');
    if (!res.ok) {
      log.error('GET /observability failed', { message: res.error?.message });
      throw new Error(res.error?.message || 'Failed to fetch system health');
    }
    log.debug('GET /observability success', { servicesCount: res.data?.services?.length });
    return res.data;
  },
};

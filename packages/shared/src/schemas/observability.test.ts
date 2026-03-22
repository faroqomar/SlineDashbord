import { describe, it, expect } from 'vitest';
import {
  ServiceStatusSchema,
  ObservabilityResponseSchema,
  ServiceStatusEnum,
  SystemHealthKpisSchema,
  Uptime90DaySchema,
  UptimeDaySchema,
  SummarySchema,
} from './observability.js';

describe('observability schemas', () => {
  describe('ServiceStatusSchema', () => {
    it('parses valid service status', () => {
      const valid = {
        name: 'Database (Postgres)',
        status: 'operational',
        latencyMs: 12,
        lastChecked: new Date().toISOString(),
      };
      expect(ServiceStatusSchema.safeParse(valid).success).toBe(true);
    });
    it('parses service status with maintenance and optional fields', () => {
      const withOptional = {
        name: 'Admin Panel',
        status: 'maintenance',
        latencyMs: 0,
        lastChecked: new Date().toISOString(),
        description: 'Dashboard API & internal tooling',
        uptimePct: 99.88,
        sparkline: [98, 99, 99, 100, 99, 100],
      };
      expect(ServiceStatusSchema.safeParse(withOptional).success).toBe(true);
    });
    it('rejects invalid status', () => {
      expect(
        ServiceStatusSchema.safeParse({
          name: 'DB',
          status: 'unknown',
          latencyMs: 0,
          lastChecked: new Date().toISOString(),
        }).success
      ).toBe(false);
    });
  });

  describe('SystemHealthKpisSchema', () => {
    it('parses minimal valid KPIs', () => {
      const minimal = {
        uptime30d: 99.93,
        avgLatencyMs: 83,
        errorRatePct: 0.62,
        requestsPerMin: 9100,
      };
      expect(SystemHealthKpisSchema.safeParse(minimal).success).toBe(true);
    });
    it('parses full KPIs with deltas and sparklines', () => {
      const full = {
        uptime30d: 99.93,
        uptime30dDelta: 0.02,
        avgLatencyMs: 83,
        avgLatencyDeltaMs: 3,
        errorRatePct: 0.62,
        errorRateDeltaPct: 0.17,
        requestsPerMin: 9100,
        requestsPerMinDelta: 14,
        sparklineUptime: [99.9, 99.91, 99.92, 99.93],
      };
      expect(SystemHealthKpisSchema.safeParse(full).success).toBe(true);
    });
  });

  describe('UptimeDaySchema / Uptime90DaySchema', () => {
    it('parses single day', () => {
      expect(UptimeDaySchema.safeParse({ date: '2025-03-01', status: 'operational' }).success).toBe(true);
      expect(UptimeDaySchema.safeParse({ date: '2025-03-02', status: 'degraded' }).success).toBe(true);
      expect(UptimeDaySchema.safeParse({ date: '2025-03-03', status: 'outage' }).success).toBe(true);
    });
    it('parses 90-day array', () => {
      const days = Array.from({ length: 90 }, (_, i) => ({
        date: new Date(Date.now() - (89 - i) * 86400000).toISOString().slice(0, 10),
        status: i % 10 === 0 ? 'degraded' : 'operational',
      }));
      expect(Uptime90DaySchema.safeParse(days).success).toBe(true);
    });
  });

  describe('SummarySchema', () => {
    it('parses valid summary', () => {
      const s = { overallUptimePct: 99.93, operationalCount: 8, degradedCount: 2, maintenanceCount: 1 };
      expect(SummarySchema.safeParse(s).success).toBe(true);
    });
  });

  describe('ObservabilityResponseSchema', () => {
    it('parses full response with all optional fields', () => {
      const full = {
        ok: true as const,
        data: {
          services: [
            {
              name: 'Database',
              status: 'operational',
              latencyMs: 5,
              lastChecked: new Date().toISOString(),
            },
          ],
          rpcStatus: { status: 'operational', latencyMs: 10 },
          queueStatus: { status: 'not_implemented' as const },
          errorRates: { last1h: 0, last24h: 2 },
        },
      };
      expect(ObservabilityResponseSchema.safeParse(full).success).toBe(true);
    });
    it('parses response with queueStatus not_implemented and errorRates omitted (N/A)', () => {
      const minimal = {
        ok: true as const,
        data: {
          services: [
            {
              name: 'Database',
              status: 'operational',
              latencyMs: 1,
              lastChecked: new Date().toISOString(),
            },
          ],
          rpcStatus: undefined,
          queueStatus: { status: 'not_implemented' as const },
          errorRates: undefined,
        },
      };
      expect(ObservabilityResponseSchema.safeParse(minimal).success).toBe(true);
    });
    it('rejects missing services', () => {
      expect(
        ObservabilityResponseSchema.safeParse({
          ok: true,
          data: { services: [] },
        }).success
      ).toBe(true); // empty array is valid
      expect(
        ObservabilityResponseSchema.safeParse({
          ok: true,
          data: {},
        }).success
      ).toBe(false);
    });
    it('parses response with only data.services (backward compat)', () => {
      const minimal = {
        ok: true as const,
        data: {
          services: [
            {
              name: 'Database',
              status: 'operational' as const,
              latencyMs: 5,
              lastChecked: new Date().toISOString(),
            },
          ],
        },
      };
      expect(ObservabilityResponseSchema.safeParse(minimal).success).toBe(true);
    });
    it('parses full response with summary, kpis, uptime90Day', () => {
      const full = {
        ok: true as const,
        data: {
          services: [
            {
              name: 'Database (Postgres)',
              status: 'operational' as const,
              latencyMs: 18,
              lastChecked: new Date().toISOString(),
              description: 'Primary data store',
              uptimePct: 99.99,
              sparkline: [99, 100, 99, 100, 100],
            },
          ],
          rpcStatus: undefined,
          queueStatus: { status: 'not_implemented' as const },
          errorRates: { last1h: 0, last24h: 2 },
          summary: { overallUptimePct: 99.93, operationalCount: 8, degradedCount: 2, maintenanceCount: 1 },
          kpis: {
            uptime30d: 99.93,
            uptime30dDelta: 0.02,
            avgLatencyMs: 83,
            avgLatencyDeltaMs: 3,
            errorRatePct: 0.62,
            errorRateDeltaPct: 0.17,
            requestsPerMin: 9100,
            requestsPerMinDelta: 14,
          },
          uptime90Day: Array.from({ length: 90 }, (_, i) => ({
            date: new Date(Date.now() - (89 - i) * 86400000).toISOString().slice(0, 10),
            status: i % 10 === 0 ? ('degraded' as const) : ('operational' as const),
          })),
        },
      };
      expect(ObservabilityResponseSchema.safeParse(full).success).toBe(true);
    });
  });
});

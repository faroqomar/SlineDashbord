import { z } from 'zod';
/** Status of a single service or component. */
export const ServiceStatusEnum = z.enum(['operational', 'degraded', 'down', 'maintenance']);
/** Single service health check result. */
export const ServiceStatusSchema = z.object({
    name: z.string(),
    status: ServiceStatusEnum,
    latencyMs: z.number().int().min(0),
    lastChecked: z.string(), // ISO date string
    description: z.string().optional(),
    uptimePct: z.number().min(0).max(100).optional(),
    sparkline: z.array(z.number()).optional(),
});
/** One day in 90-day uptime history. */
export const UptimeDayStatusEnum = z.enum(['operational', 'degraded', 'outage']);
export const UptimeDaySchema = z.object({
    date: z.string(),
    status: UptimeDayStatusEnum,
});
export const Uptime90DaySchema = z.array(UptimeDaySchema);
/** Summary counts and overall uptime for hero card. */
export const SummarySchema = z.object({
    overallUptimePct: z.number().min(0).max(100),
    operationalCount: z.number().int().min(0),
    degradedCount: z.number().int().min(0),
    maintenanceCount: z.number().int().min(0),
});
/** Aggregate KPIs for dashboard (mock or real). */
export const SystemHealthKpisSchema = z.object({
    uptime30d: z.number(),
    uptime30dDelta: z.number().optional(),
    avgLatencyMs: z.number(),
    avgLatencyDeltaMs: z.number().optional(),
    errorRatePct: z.number(),
    errorRateDeltaPct: z.number().optional(),
    requestsPerMin: z.number(),
    requestsPerMinDelta: z.number().optional(),
    sparklineUptime: z.array(z.number()).optional(),
    sparklineLatency: z.array(z.number()).optional(),
    sparklineError: z.array(z.number()).optional(),
    sparklineReqMin: z.array(z.number()).optional(),
});
/** RPC availability: optional; N/A when no read-only RPC is used for health. */
export const RpcStatusSchema = z.object({
    status: ServiceStatusEnum,
    latencyMs: z.number().int().min(0).optional(),
}).optional();
/** Queue status: optional; use 'not_implemented' when no queue in stack. */
export const QueueStatusSchema = z.object({
    status: z.union([ServiceStatusEnum, z.literal('not_implemented')]),
}).optional();
/** Error rate summary (e.g. from audit_logs counts); optional. */
export const ErrorRatesSchema = z.object({
    last1h: z.number().int().min(0).optional(),
    last24h: z.number().int().min(0).optional(),
}).optional();
/** GET /api/v1/observability response. RBAC: support, moderator, admin, super_admin. */
export const ObservabilityResponseSchema = z.object({
    ok: z.literal(true),
    data: z.object({
        services: z.array(ServiceStatusSchema),
        rpcStatus: RpcStatusSchema,
        queueStatus: QueueStatusSchema,
        errorRates: ErrorRatesSchema,
        summary: SummarySchema.optional(),
        kpis: SystemHealthKpisSchema.optional(),
        uptime90Day: Uptime90DaySchema.optional(),
    }),
});

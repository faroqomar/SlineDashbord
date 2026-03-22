import { z } from 'zod';
/** Status of a single service or component. */
export declare const ServiceStatusEnum: z.ZodEnum<["operational", "degraded", "down", "maintenance"]>;
export type ServiceStatus = z.infer<typeof ServiceStatusEnum>;
/** Single service health check result. */
export declare const ServiceStatusSchema: z.ZodObject<{
    name: z.ZodString;
    status: z.ZodEnum<["operational", "degraded", "down", "maintenance"]>;
    latencyMs: z.ZodNumber;
    lastChecked: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    uptimePct: z.ZodOptional<z.ZodNumber>;
    sparkline: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
}, "strip", z.ZodTypeAny, {
    status: "down" | "operational" | "degraded" | "maintenance";
    name: string;
    latencyMs: number;
    lastChecked: string;
    description?: string | undefined;
    sparkline?: number[] | undefined;
    uptimePct?: number | undefined;
}, {
    status: "down" | "operational" | "degraded" | "maintenance";
    name: string;
    latencyMs: number;
    lastChecked: string;
    description?: string | undefined;
    sparkline?: number[] | undefined;
    uptimePct?: number | undefined;
}>;
export type ServiceStatusItem = z.infer<typeof ServiceStatusSchema>;
/** One day in 90-day uptime history. */
export declare const UptimeDayStatusEnum: z.ZodEnum<["operational", "degraded", "outage"]>;
export type UptimeDayStatus = z.infer<typeof UptimeDayStatusEnum>;
export declare const UptimeDaySchema: z.ZodObject<{
    date: z.ZodString;
    status: z.ZodEnum<["operational", "degraded", "outage"]>;
}, "strip", z.ZodTypeAny, {
    status: "operational" | "degraded" | "outage";
    date: string;
}, {
    status: "operational" | "degraded" | "outage";
    date: string;
}>;
export type UptimeDay = z.infer<typeof UptimeDaySchema>;
export declare const Uptime90DaySchema: z.ZodArray<z.ZodObject<{
    date: z.ZodString;
    status: z.ZodEnum<["operational", "degraded", "outage"]>;
}, "strip", z.ZodTypeAny, {
    status: "operational" | "degraded" | "outage";
    date: string;
}, {
    status: "operational" | "degraded" | "outage";
    date: string;
}>, "many">;
export type Uptime90Day = z.infer<typeof Uptime90DaySchema>;
/** Summary counts and overall uptime for hero card. */
export declare const SummarySchema: z.ZodObject<{
    overallUptimePct: z.ZodNumber;
    operationalCount: z.ZodNumber;
    degradedCount: z.ZodNumber;
    maintenanceCount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    overallUptimePct: number;
    operationalCount: number;
    degradedCount: number;
    maintenanceCount: number;
}, {
    overallUptimePct: number;
    operationalCount: number;
    degradedCount: number;
    maintenanceCount: number;
}>;
export type Summary = z.infer<typeof SummarySchema>;
/** Aggregate KPIs for dashboard (mock or real). */
export declare const SystemHealthKpisSchema: z.ZodObject<{
    uptime30d: z.ZodNumber;
    uptime30dDelta: z.ZodOptional<z.ZodNumber>;
    avgLatencyMs: z.ZodNumber;
    avgLatencyDeltaMs: z.ZodOptional<z.ZodNumber>;
    errorRatePct: z.ZodNumber;
    errorRateDeltaPct: z.ZodOptional<z.ZodNumber>;
    requestsPerMin: z.ZodNumber;
    requestsPerMinDelta: z.ZodOptional<z.ZodNumber>;
    sparklineUptime: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
    sparklineLatency: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
    sparklineError: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
    sparklineReqMin: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
}, "strip", z.ZodTypeAny, {
    uptime30d: number;
    avgLatencyMs: number;
    errorRatePct: number;
    requestsPerMin: number;
    uptime30dDelta?: number | undefined;
    avgLatencyDeltaMs?: number | undefined;
    errorRateDeltaPct?: number | undefined;
    requestsPerMinDelta?: number | undefined;
    sparklineUptime?: number[] | undefined;
    sparklineLatency?: number[] | undefined;
    sparklineError?: number[] | undefined;
    sparklineReqMin?: number[] | undefined;
}, {
    uptime30d: number;
    avgLatencyMs: number;
    errorRatePct: number;
    requestsPerMin: number;
    uptime30dDelta?: number | undefined;
    avgLatencyDeltaMs?: number | undefined;
    errorRateDeltaPct?: number | undefined;
    requestsPerMinDelta?: number | undefined;
    sparklineUptime?: number[] | undefined;
    sparklineLatency?: number[] | undefined;
    sparklineError?: number[] | undefined;
    sparklineReqMin?: number[] | undefined;
}>;
export type SystemHealthKpis = z.infer<typeof SystemHealthKpisSchema>;
/** RPC availability: optional; N/A when no read-only RPC is used for health. */
export declare const RpcStatusSchema: z.ZodOptional<z.ZodObject<{
    status: z.ZodEnum<["operational", "degraded", "down", "maintenance"]>;
    latencyMs: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    status: "down" | "operational" | "degraded" | "maintenance";
    latencyMs?: number | undefined;
}, {
    status: "down" | "operational" | "degraded" | "maintenance";
    latencyMs?: number | undefined;
}>>;
export type RpcStatus = z.infer<typeof RpcStatusSchema>;
/** Queue status: optional; use 'not_implemented' when no queue in stack. */
export declare const QueueStatusSchema: z.ZodOptional<z.ZodObject<{
    status: z.ZodUnion<[z.ZodEnum<["operational", "degraded", "down", "maintenance"]>, z.ZodLiteral<"not_implemented">]>;
}, "strip", z.ZodTypeAny, {
    status: "down" | "operational" | "degraded" | "maintenance" | "not_implemented";
}, {
    status: "down" | "operational" | "degraded" | "maintenance" | "not_implemented";
}>>;
export type QueueStatus = z.infer<typeof QueueStatusSchema>;
/** Error rate summary (e.g. from audit_logs counts); optional. */
export declare const ErrorRatesSchema: z.ZodOptional<z.ZodObject<{
    last1h: z.ZodOptional<z.ZodNumber>;
    last24h: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    last1h?: number | undefined;
    last24h?: number | undefined;
}, {
    last1h?: number | undefined;
    last24h?: number | undefined;
}>>;
export type ErrorRates = z.infer<typeof ErrorRatesSchema>;
/** GET /api/v1/observability response. RBAC: support, moderator, admin, super_admin. */
export declare const ObservabilityResponseSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
    data: z.ZodObject<{
        services: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            status: z.ZodEnum<["operational", "degraded", "down", "maintenance"]>;
            latencyMs: z.ZodNumber;
            lastChecked: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            uptimePct: z.ZodOptional<z.ZodNumber>;
            sparkline: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
        }, "strip", z.ZodTypeAny, {
            status: "down" | "operational" | "degraded" | "maintenance";
            name: string;
            latencyMs: number;
            lastChecked: string;
            description?: string | undefined;
            sparkline?: number[] | undefined;
            uptimePct?: number | undefined;
        }, {
            status: "down" | "operational" | "degraded" | "maintenance";
            name: string;
            latencyMs: number;
            lastChecked: string;
            description?: string | undefined;
            sparkline?: number[] | undefined;
            uptimePct?: number | undefined;
        }>, "many">;
        rpcStatus: z.ZodOptional<z.ZodObject<{
            status: z.ZodEnum<["operational", "degraded", "down", "maintenance"]>;
            latencyMs: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            status: "down" | "operational" | "degraded" | "maintenance";
            latencyMs?: number | undefined;
        }, {
            status: "down" | "operational" | "degraded" | "maintenance";
            latencyMs?: number | undefined;
        }>>;
        queueStatus: z.ZodOptional<z.ZodObject<{
            status: z.ZodUnion<[z.ZodEnum<["operational", "degraded", "down", "maintenance"]>, z.ZodLiteral<"not_implemented">]>;
        }, "strip", z.ZodTypeAny, {
            status: "down" | "operational" | "degraded" | "maintenance" | "not_implemented";
        }, {
            status: "down" | "operational" | "degraded" | "maintenance" | "not_implemented";
        }>>;
        errorRates: z.ZodOptional<z.ZodObject<{
            last1h: z.ZodOptional<z.ZodNumber>;
            last24h: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            last1h?: number | undefined;
            last24h?: number | undefined;
        }, {
            last1h?: number | undefined;
            last24h?: number | undefined;
        }>>;
        summary: z.ZodOptional<z.ZodObject<{
            overallUptimePct: z.ZodNumber;
            operationalCount: z.ZodNumber;
            degradedCount: z.ZodNumber;
            maintenanceCount: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            overallUptimePct: number;
            operationalCount: number;
            degradedCount: number;
            maintenanceCount: number;
        }, {
            overallUptimePct: number;
            operationalCount: number;
            degradedCount: number;
            maintenanceCount: number;
        }>>;
        kpis: z.ZodOptional<z.ZodObject<{
            uptime30d: z.ZodNumber;
            uptime30dDelta: z.ZodOptional<z.ZodNumber>;
            avgLatencyMs: z.ZodNumber;
            avgLatencyDeltaMs: z.ZodOptional<z.ZodNumber>;
            errorRatePct: z.ZodNumber;
            errorRateDeltaPct: z.ZodOptional<z.ZodNumber>;
            requestsPerMin: z.ZodNumber;
            requestsPerMinDelta: z.ZodOptional<z.ZodNumber>;
            sparklineUptime: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
            sparklineLatency: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
            sparklineError: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
            sparklineReqMin: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
        }, "strip", z.ZodTypeAny, {
            uptime30d: number;
            avgLatencyMs: number;
            errorRatePct: number;
            requestsPerMin: number;
            uptime30dDelta?: number | undefined;
            avgLatencyDeltaMs?: number | undefined;
            errorRateDeltaPct?: number | undefined;
            requestsPerMinDelta?: number | undefined;
            sparklineUptime?: number[] | undefined;
            sparklineLatency?: number[] | undefined;
            sparklineError?: number[] | undefined;
            sparklineReqMin?: number[] | undefined;
        }, {
            uptime30d: number;
            avgLatencyMs: number;
            errorRatePct: number;
            requestsPerMin: number;
            uptime30dDelta?: number | undefined;
            avgLatencyDeltaMs?: number | undefined;
            errorRateDeltaPct?: number | undefined;
            requestsPerMinDelta?: number | undefined;
            sparklineUptime?: number[] | undefined;
            sparklineLatency?: number[] | undefined;
            sparklineError?: number[] | undefined;
            sparklineReqMin?: number[] | undefined;
        }>>;
        uptime90Day: z.ZodOptional<z.ZodArray<z.ZodObject<{
            date: z.ZodString;
            status: z.ZodEnum<["operational", "degraded", "outage"]>;
        }, "strip", z.ZodTypeAny, {
            status: "operational" | "degraded" | "outage";
            date: string;
        }, {
            status: "operational" | "degraded" | "outage";
            date: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        services: {
            status: "down" | "operational" | "degraded" | "maintenance";
            name: string;
            latencyMs: number;
            lastChecked: string;
            description?: string | undefined;
            sparkline?: number[] | undefined;
            uptimePct?: number | undefined;
        }[];
        summary?: {
            overallUptimePct: number;
            operationalCount: number;
            degradedCount: number;
            maintenanceCount: number;
        } | undefined;
        kpis?: {
            uptime30d: number;
            avgLatencyMs: number;
            errorRatePct: number;
            requestsPerMin: number;
            uptime30dDelta?: number | undefined;
            avgLatencyDeltaMs?: number | undefined;
            errorRateDeltaPct?: number | undefined;
            requestsPerMinDelta?: number | undefined;
            sparklineUptime?: number[] | undefined;
            sparklineLatency?: number[] | undefined;
            sparklineError?: number[] | undefined;
            sparklineReqMin?: number[] | undefined;
        } | undefined;
        rpcStatus?: {
            status: "down" | "operational" | "degraded" | "maintenance";
            latencyMs?: number | undefined;
        } | undefined;
        queueStatus?: {
            status: "down" | "operational" | "degraded" | "maintenance" | "not_implemented";
        } | undefined;
        errorRates?: {
            last1h?: number | undefined;
            last24h?: number | undefined;
        } | undefined;
        uptime90Day?: {
            status: "operational" | "degraded" | "outage";
            date: string;
        }[] | undefined;
    }, {
        services: {
            status: "down" | "operational" | "degraded" | "maintenance";
            name: string;
            latencyMs: number;
            lastChecked: string;
            description?: string | undefined;
            sparkline?: number[] | undefined;
            uptimePct?: number | undefined;
        }[];
        summary?: {
            overallUptimePct: number;
            operationalCount: number;
            degradedCount: number;
            maintenanceCount: number;
        } | undefined;
        kpis?: {
            uptime30d: number;
            avgLatencyMs: number;
            errorRatePct: number;
            requestsPerMin: number;
            uptime30dDelta?: number | undefined;
            avgLatencyDeltaMs?: number | undefined;
            errorRateDeltaPct?: number | undefined;
            requestsPerMinDelta?: number | undefined;
            sparklineUptime?: number[] | undefined;
            sparklineLatency?: number[] | undefined;
            sparklineError?: number[] | undefined;
            sparklineReqMin?: number[] | undefined;
        } | undefined;
        rpcStatus?: {
            status: "down" | "operational" | "degraded" | "maintenance";
            latencyMs?: number | undefined;
        } | undefined;
        queueStatus?: {
            status: "down" | "operational" | "degraded" | "maintenance" | "not_implemented";
        } | undefined;
        errorRates?: {
            last1h?: number | undefined;
            last24h?: number | undefined;
        } | undefined;
        uptime90Day?: {
            status: "operational" | "degraded" | "outage";
            date: string;
        }[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    ok: true;
    data: {
        services: {
            status: "down" | "operational" | "degraded" | "maintenance";
            name: string;
            latencyMs: number;
            lastChecked: string;
            description?: string | undefined;
            sparkline?: number[] | undefined;
            uptimePct?: number | undefined;
        }[];
        summary?: {
            overallUptimePct: number;
            operationalCount: number;
            degradedCount: number;
            maintenanceCount: number;
        } | undefined;
        kpis?: {
            uptime30d: number;
            avgLatencyMs: number;
            errorRatePct: number;
            requestsPerMin: number;
            uptime30dDelta?: number | undefined;
            avgLatencyDeltaMs?: number | undefined;
            errorRateDeltaPct?: number | undefined;
            requestsPerMinDelta?: number | undefined;
            sparklineUptime?: number[] | undefined;
            sparklineLatency?: number[] | undefined;
            sparklineError?: number[] | undefined;
            sparklineReqMin?: number[] | undefined;
        } | undefined;
        rpcStatus?: {
            status: "down" | "operational" | "degraded" | "maintenance";
            latencyMs?: number | undefined;
        } | undefined;
        queueStatus?: {
            status: "down" | "operational" | "degraded" | "maintenance" | "not_implemented";
        } | undefined;
        errorRates?: {
            last1h?: number | undefined;
            last24h?: number | undefined;
        } | undefined;
        uptime90Day?: {
            status: "operational" | "degraded" | "outage";
            date: string;
        }[] | undefined;
    };
}, {
    ok: true;
    data: {
        services: {
            status: "down" | "operational" | "degraded" | "maintenance";
            name: string;
            latencyMs: number;
            lastChecked: string;
            description?: string | undefined;
            sparkline?: number[] | undefined;
            uptimePct?: number | undefined;
        }[];
        summary?: {
            overallUptimePct: number;
            operationalCount: number;
            degradedCount: number;
            maintenanceCount: number;
        } | undefined;
        kpis?: {
            uptime30d: number;
            avgLatencyMs: number;
            errorRatePct: number;
            requestsPerMin: number;
            uptime30dDelta?: number | undefined;
            avgLatencyDeltaMs?: number | undefined;
            errorRateDeltaPct?: number | undefined;
            requestsPerMinDelta?: number | undefined;
            sparklineUptime?: number[] | undefined;
            sparklineLatency?: number[] | undefined;
            sparklineError?: number[] | undefined;
            sparklineReqMin?: number[] | undefined;
        } | undefined;
        rpcStatus?: {
            status: "down" | "operational" | "degraded" | "maintenance";
            latencyMs?: number | undefined;
        } | undefined;
        queueStatus?: {
            status: "down" | "operational" | "degraded" | "maintenance" | "not_implemented";
        } | undefined;
        errorRates?: {
            last1h?: number | undefined;
            last24h?: number | undefined;
        } | undefined;
        uptime90Day?: {
            status: "operational" | "degraded" | "outage";
            date: string;
        }[] | undefined;
    };
}>;
export type ObservabilityResponse = z.infer<typeof ObservabilityResponseSchema>;

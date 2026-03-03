import { z } from 'zod';
/** Status of a single service or component. */
export declare const ServiceStatusEnum: z.ZodEnum<["operational", "degraded", "down"]>;
export type ServiceStatus = z.infer<typeof ServiceStatusEnum>;
/** Single service health check result. */
export declare const ServiceStatusSchema: z.ZodObject<{
    name: z.ZodString;
    status: z.ZodEnum<["operational", "degraded", "down"]>;
    latencyMs: z.ZodNumber;
    lastChecked: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "operational" | "degraded" | "down";
    name: string;
    latencyMs: number;
    lastChecked: string;
}, {
    status: "operational" | "degraded" | "down";
    name: string;
    latencyMs: number;
    lastChecked: string;
}>;
export type ServiceStatusItem = z.infer<typeof ServiceStatusSchema>;
/** RPC availability: optional; N/A when no read-only RPC is used for health. */
export declare const RpcStatusSchema: z.ZodOptional<z.ZodObject<{
    status: z.ZodEnum<["operational", "degraded", "down"]>;
    latencyMs: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    status: "operational" | "degraded" | "down";
    latencyMs?: number | undefined;
}, {
    status: "operational" | "degraded" | "down";
    latencyMs?: number | undefined;
}>>;
export type RpcStatus = z.infer<typeof RpcStatusSchema>;
/** Queue status: optional; use 'not_implemented' when no queue in stack. */
export declare const QueueStatusSchema: z.ZodOptional<z.ZodObject<{
    status: z.ZodUnion<[z.ZodEnum<["operational", "degraded", "down"]>, z.ZodLiteral<"not_implemented">]>;
}, "strip", z.ZodTypeAny, {
    status: "operational" | "degraded" | "down" | "not_implemented";
}, {
    status: "operational" | "degraded" | "down" | "not_implemented";
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
            status: z.ZodEnum<["operational", "degraded", "down"]>;
            latencyMs: z.ZodNumber;
            lastChecked: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            status: "operational" | "degraded" | "down";
            name: string;
            latencyMs: number;
            lastChecked: string;
        }, {
            status: "operational" | "degraded" | "down";
            name: string;
            latencyMs: number;
            lastChecked: string;
        }>, "many">;
        rpcStatus: z.ZodOptional<z.ZodObject<{
            status: z.ZodEnum<["operational", "degraded", "down"]>;
            latencyMs: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            status: "operational" | "degraded" | "down";
            latencyMs?: number | undefined;
        }, {
            status: "operational" | "degraded" | "down";
            latencyMs?: number | undefined;
        }>>;
        queueStatus: z.ZodOptional<z.ZodObject<{
            status: z.ZodUnion<[z.ZodEnum<["operational", "degraded", "down"]>, z.ZodLiteral<"not_implemented">]>;
        }, "strip", z.ZodTypeAny, {
            status: "operational" | "degraded" | "down" | "not_implemented";
        }, {
            status: "operational" | "degraded" | "down" | "not_implemented";
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
    }, "strip", z.ZodTypeAny, {
        services: {
            status: "operational" | "degraded" | "down";
            name: string;
            latencyMs: number;
            lastChecked: string;
        }[];
        rpcStatus?: {
            status: "operational" | "degraded" | "down";
            latencyMs?: number | undefined;
        } | undefined;
        queueStatus?: {
            status: "operational" | "degraded" | "down" | "not_implemented";
        } | undefined;
        errorRates?: {
            last1h?: number | undefined;
            last24h?: number | undefined;
        } | undefined;
    }, {
        services: {
            status: "operational" | "degraded" | "down";
            name: string;
            latencyMs: number;
            lastChecked: string;
        }[];
        rpcStatus?: {
            status: "operational" | "degraded" | "down";
            latencyMs?: number | undefined;
        } | undefined;
        queueStatus?: {
            status: "operational" | "degraded" | "down" | "not_implemented";
        } | undefined;
        errorRates?: {
            last1h?: number | undefined;
            last24h?: number | undefined;
        } | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    ok: true;
    data: {
        services: {
            status: "operational" | "degraded" | "down";
            name: string;
            latencyMs: number;
            lastChecked: string;
        }[];
        rpcStatus?: {
            status: "operational" | "degraded" | "down";
            latencyMs?: number | undefined;
        } | undefined;
        queueStatus?: {
            status: "operational" | "degraded" | "down" | "not_implemented";
        } | undefined;
        errorRates?: {
            last1h?: number | undefined;
            last24h?: number | undefined;
        } | undefined;
    };
}, {
    ok: true;
    data: {
        services: {
            status: "operational" | "degraded" | "down";
            name: string;
            latencyMs: number;
            lastChecked: string;
        }[];
        rpcStatus?: {
            status: "operational" | "degraded" | "down";
            latencyMs?: number | undefined;
        } | undefined;
        queueStatus?: {
            status: "operational" | "degraded" | "down" | "not_implemented";
        } | undefined;
        errorRates?: {
            last1h?: number | undefined;
            last24h?: number | undefined;
        } | undefined;
    };
}>;
export type ObservabilityResponse = z.infer<typeof ObservabilityResponseSchema>;

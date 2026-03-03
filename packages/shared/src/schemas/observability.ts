import { z } from 'zod';

/** Status of a single service or component. */
export const ServiceStatusEnum = z.enum(['operational', 'degraded', 'down']);
export type ServiceStatus = z.infer<typeof ServiceStatusEnum>;

/** Single service health check result. */
export const ServiceStatusSchema = z.object({
  name: z.string(),
  status: ServiceStatusEnum,
  latencyMs: z.number().int().min(0),
  lastChecked: z.string(), // ISO date string
});
export type ServiceStatusItem = z.infer<typeof ServiceStatusSchema>;

/** RPC availability: optional; N/A when no read-only RPC is used for health. */
export const RpcStatusSchema = z.object({
  status: ServiceStatusEnum,
  latencyMs: z.number().int().min(0).optional(),
}).optional();
export type RpcStatus = z.infer<typeof RpcStatusSchema>;

/** Queue status: optional; use 'not_implemented' when no queue in stack. */
export const QueueStatusSchema = z.object({
  status: z.union([ServiceStatusEnum, z.literal('not_implemented')]),
}).optional();
export type QueueStatus = z.infer<typeof QueueStatusSchema>;

/** Error rate summary (e.g. from audit_logs counts); optional. */
export const ErrorRatesSchema = z.object({
  last1h: z.number().int().min(0).optional(),
  last24h: z.number().int().min(0).optional(),
}).optional();
export type ErrorRates = z.infer<typeof ErrorRatesSchema>;

/** GET /api/v1/observability response. RBAC: support, moderator, admin, super_admin. */
export const ObservabilityResponseSchema = z.object({
  ok: z.literal(true),
  data: z.object({
    services: z.array(ServiceStatusSchema),
    rpcStatus: RpcStatusSchema,
    queueStatus: QueueStatusSchema,
    errorRates: ErrorRatesSchema,
  }),
});
export type ObservabilityResponse = z.infer<typeof ObservabilityResponseSchema>;

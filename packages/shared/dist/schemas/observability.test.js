import { describe, it, expect } from 'vitest';
import { ServiceStatusSchema, ObservabilityResponseSchema, } from './observability.js';
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
        it('rejects invalid status', () => {
            expect(ServiceStatusSchema.safeParse({
                name: 'DB',
                status: 'unknown',
                latencyMs: 0,
                lastChecked: new Date().toISOString(),
            }).success).toBe(false);
        });
    });
    describe('ObservabilityResponseSchema', () => {
        it('parses full response with all optional fields', () => {
            const full = {
                ok: true,
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
                    queueStatus: { status: 'not_implemented' },
                    errorRates: { last1h: 0, last24h: 2 },
                },
            };
            expect(ObservabilityResponseSchema.safeParse(full).success).toBe(true);
        });
        it('parses response with queueStatus not_implemented and errorRates omitted (N/A)', () => {
            const minimal = {
                ok: true,
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
                    queueStatus: { status: 'not_implemented' },
                    errorRates: undefined,
                },
            };
            expect(ObservabilityResponseSchema.safeParse(minimal).success).toBe(true);
        });
        it('rejects missing services', () => {
            expect(ObservabilityResponseSchema.safeParse({
                ok: true,
                data: { services: [] },
            }).success).toBe(true); // empty array is valid
            expect(ObservabilityResponseSchema.safeParse({
                ok: true,
                data: {},
            }).success).toBe(false);
        });
    });
});

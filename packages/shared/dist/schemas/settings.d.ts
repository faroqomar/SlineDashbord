import { z } from "zod";
export declare const SystemConfigSchema: z.ZodObject<{
    key: z.ZodString;
    value: z.ZodRecord<z.ZodString, z.ZodAny>;
    description: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodString;
    updated_by: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    key: string;
    value: Record<string, any>;
    updated_at: string;
    description?: string | undefined;
    updated_by?: string | undefined;
}, {
    key: string;
    value: Record<string, any>;
    updated_at: string;
    description?: string | undefined;
    updated_by?: string | undefined;
}>;
export type SystemConfig = z.infer<typeof SystemConfigSchema>;
export declare const MaintenanceModeSchema: z.ZodObject<{
    enabled: z.ZodBoolean;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
    enabled: boolean;
}, {
    message: string;
    enabled: boolean;
}>;
export type MaintenanceMode = z.infer<typeof MaintenanceModeSchema>;
export declare const AppBannerSchema: z.ZodObject<{
    enabled: z.ZodBoolean;
    text: z.ZodString;
    type: z.ZodEnum<["info", "warning", "error", "success"]>;
}, "strip", z.ZodTypeAny, {
    type: "success" | "error" | "warning" | "info";
    enabled: boolean;
    text: string;
}, {
    type: "success" | "error" | "warning" | "info";
    enabled: boolean;
    text: string;
}>;
export type AppBanner = z.infer<typeof AppBannerSchema>;
/** API response: list of system config rows (GET /api/v1/settings/config). */
export declare const GetSystemConfigResponseSchema: z.ZodArray<z.ZodObject<{
    key: z.ZodString;
    value: z.ZodRecord<z.ZodString, z.ZodAny>;
    description: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodString;
    updated_by: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    key: string;
    value: Record<string, any>;
    updated_at: string;
    description?: string | undefined;
    updated_by?: string | undefined;
}, {
    key: string;
    value: Record<string, any>;
    updated_at: string;
    description?: string | undefined;
    updated_by?: string | undefined;
}>, "many">;
export type GetSystemConfigResponse = z.infer<typeof GetSystemConfigResponseSchema>;
/** API request body: update one config key (PATCH /api/v1/settings/config). */
export declare const UpdateSystemConfigBodySchema: z.ZodObject<{
    key: z.ZodString;
    value: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
    key: string;
    value: Record<string, unknown>;
}, {
    key: string;
    value: Record<string, unknown>;
}>;
export type UpdateSystemConfigBody = z.infer<typeof UpdateSystemConfigBodySchema>;

import { z } from "zod";
export declare const SystemConfigSchema: z.ZodObject<{
    key: z.ZodString;
    value: z.ZodRecord<z.ZodString, z.ZodAny>;
    description: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodString;
    updated_by: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    value: Record<string, any>;
    key: string;
    updated_at: string;
    description?: string | undefined;
    updated_by?: string | undefined;
}, {
    value: Record<string, any>;
    key: string;
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
    type: "info" | "warning" | "error" | "success";
    enabled: boolean;
    text: string;
}, {
    type: "info" | "warning" | "error" | "success";
    enabled: boolean;
    text: string;
}>;
export type AppBanner = z.infer<typeof AppBannerSchema>;

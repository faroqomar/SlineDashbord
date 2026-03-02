import { z } from "zod";

export const SystemConfigSchema = z.object({
  key: z.string(),
  value: z.record(z.string(), z.any()),
  description: z.string().optional(),
  updated_at: z.string(),
  updated_by: z.string().optional(),
});

export type SystemConfig = z.infer<typeof SystemConfigSchema>;

export const MaintenanceModeSchema = z.object({
  enabled: z.boolean(),
  message: z.string(),
});

export type MaintenanceMode = z.infer<typeof MaintenanceModeSchema>;

export const AppBannerSchema = z.object({
  enabled: z.boolean(),
  text: z.string(),
  type: z.enum(['info', 'warning', 'error', 'success']),
});

export type AppBanner = z.infer<typeof AppBannerSchema>;

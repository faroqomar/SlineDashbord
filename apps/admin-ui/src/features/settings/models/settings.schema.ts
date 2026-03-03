/**
 * Single source of truth: re-export from @sline/shared to avoid contract drift.
 * Use these types and schemas in the settings feature (view, viewmodel, api client).
 */
export type { SystemConfig, MaintenanceMode, AppBanner } from '@sline/shared';
export {
  SystemConfigSchema,
  MaintenanceModeSchema,
  AppBannerSchema,
} from '@sline/shared';

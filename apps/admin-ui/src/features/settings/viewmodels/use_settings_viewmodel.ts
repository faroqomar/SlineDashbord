import { useState, useTransition } from "react";
import { SystemConfig, MaintenanceMode, AppBanner } from "../models/settings.schema";
import { updateSystemConfig } from "../services/settings_api";
import { toast } from "sonner";

export function useSettingsViewModel(initialConfigs: SystemConfig[]) {
  const [configs, setConfigs] = useState<SystemConfig[]>(initialConfigs);
  const [isUpdating, startTransition] = useTransition();

  const getEnumValue = <T>(key: string, defaultValue: T): T => {
    const config = configs.find(c => c.key === key);
    if (!config) return defaultValue;
    return config.value as T;
  };

  const maintenance = getEnumValue<MaintenanceMode>('maintenance_mode', { enabled: false, message: '' });
  const banner = getEnumValue<AppBanner>('app_banner', { enabled: false, text: '', type: 'info' });
  const disableSignups = getEnumValue<{enabled: boolean}>('disable_signups', { enabled: false });
  const appVersion = getEnumValue<{ios: string, android: string}>('min_app_version', { ios: '1.0.0', android: '1.0.0' });

  const updateConfig = async (key: string, newValue: Record<string, unknown>) => {
    startTransition(() => {
      void (async () => {
      const res = await updateSystemConfig(key, newValue);
      if (res.success) {
        setConfigs(prev => prev.map(c => c.key === key ? { ...c, value: newValue } : c));
        toast.success(`${key.replace('_', ' ')} updated`);
      } else {
        toast.error(res.error || "Update failed");
      }
      })();
    });
  };

  const toggleMaintenance = (enabled: boolean) => {
    updateConfig('maintenance_mode', { ...maintenance, enabled });
  };

  const updateMaintenanceMessage = (message: string) => {
    updateConfig('maintenance_mode', { ...maintenance, message });
  };

  const toggleBanner = (enabled: boolean) => {
    updateConfig('app_banner', { ...banner, enabled });
  };

  const updateBannerText = (text: string) => {
    updateConfig('app_banner', { ...banner, text });
  };

  const updateBannerType = (type: AppBanner['type']) => {
    updateConfig('app_banner', { ...banner, type });
  };

  const toggleSignups = (enabled: boolean) => {
    updateConfig('disable_signups', { enabled });
  };

  const updateAppVersion = (platform: 'ios' | 'android', version: string) => {
    updateConfig('min_app_version', { ...appVersion, [platform]: version });
  };

  return {
    maintenance,
    banner,
    disableSignups,
    appVersion,
    isUpdating,
    toggleMaintenance,
    updateMaintenanceMessage,
    toggleBanner,
    updateBannerText,
    updateBannerType,
    toggleSignups,
    updateAppVersion
  };
}

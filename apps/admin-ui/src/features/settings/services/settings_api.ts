import { request } from '@/lib/api';
import type { SystemConfig } from '../models/settings.schema';

const CONFIG_URL = '/settings/config';

export async function getSystemConfigs(): Promise<
  { success: true; data: SystemConfig[] } | { success: false; error: string }
> {
  const result = await request<SystemConfig[]>('GET', CONFIG_URL);
  if (result.ok) {
    return { success: true, data: result.data ?? [] };
  }
  return {
    success: false,
    error: result.error?.message ?? 'Failed to load settings',
  };
}

export async function updateSystemConfig(
  key: string,
  value: unknown
): Promise<
  { success: true; data: { key: string } } | { success: false; error: string }
> {
  const result = await request<{ key: string }>('PATCH', CONFIG_URL, {
    key,
    value: value as Record<string, unknown>,
  });
  if (result.ok) {
    return { success: true, data: result.data ?? { key } };
  }
  return {
    success: false,
    error: result.error?.message ?? 'Failed to update settings',
  };
}

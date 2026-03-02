import type { SystemConfig } from '../models/settings.schema';

/** No settings API in scope; stub returns empty list. */
export async function getSystemConfigs(): Promise<{ success: true; data: SystemConfig[] } | { success: false; error: string }> {
  return { success: true, data: [] };
}

/** No settings API in scope; stub returns failure. */
export async function updateSystemConfig(_key: string, _value: unknown): Promise<{ success: true; data: { key: string } } | { success: false; error: string }> {
  return { success: false, error: 'Settings API not implemented yet' };
}

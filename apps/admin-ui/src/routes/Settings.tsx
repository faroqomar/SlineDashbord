import { useLoaderData } from '@tanstack/react-router';
import { SettingsScreen } from '@/features/settings/view/SettingsScreen';

export function SettingsPage() {
  const { configs, canManage } = useLoaderData({ strict: false }) as { configs: Array<{ key: string; value: Record<string, unknown>; updated_at: string }>; canManage: boolean };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <SettingsScreen initialConfigs={configs ?? []} canManage={canManage ?? false} />
    </div>
  );
}

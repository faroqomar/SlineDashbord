import { Suspense } from "react";
import { SettingsScreen } from "@/features/settings/view/SettingsScreen";
import { getSystemConfigs } from "@/features/settings/services/settings_actions";
import { requireAdminRole } from "@/features/core/security/security_guards";
import { Skeleton } from "@/components/ui/skeleton";

export default async function SettingsPage() {
  // Check role - only super_admin for full management, but others might read?
  // implementation_plan says Step 1 SysOp role validation.
  const { role } = await requireAdminRole(['super_admin', 'support', 'moderator']);
  const canManage = role === 'super_admin';

  const res = await getSystemConfigs();
  const configs = res.success ? res.data : [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Suspense fallback={<SettingsSkeleton />}>
        <SettingsScreen initialConfigs={configs} canManage={canManage} />
      </Suspense>
    </div>
  );
}

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

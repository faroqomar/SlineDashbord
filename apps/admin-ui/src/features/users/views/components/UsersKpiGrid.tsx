import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { CalendarDays, UserCheck, UserX, Users } from 'lucide-react';

const KPI_ACCENT: Record<'blue' | 'green' | 'amber' | 'violet', string> = {
  blue: 'from-[#003f91]/20 to-[#003f91]/0 text-[#4ca2ff] border-[#0054c2]/35',
  green: 'from-[#00a650]/20 to-[#00a650]/0 text-[#42e38f] border-[#00a650]/35',
  amber: 'from-[#a06a00]/20 to-[#a06a00]/0 text-[#f4be5c] border-[#a06a00]/35',
  violet: 'from-[#4f2bd4]/20 to-[#4f2bd4]/0 text-[#a58bff] border-[#4f2bd4]/35',
};

interface KpiCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  tone: keyof typeof KPI_ACCENT;
}

interface UsersKpiGridProps {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  joinedThisMonth: number;
}

function KpiCard({ label, value, icon: Icon, tone }: KpiCardProps) {
  return (
    <div className="rounded-[14px] border border-[#7f7668] bg-[#0a0d12] p-5">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex size-10 items-center justify-center rounded-[12px] border bg-gradient-to-br',
            KPI_ACCENT[tone],
          )}
        >
          <Icon className="size-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-[0.12em] text-[#9d9588]">{label}</span>
          <span className="text-4xl font-bold leading-none text-[#e8e6e3]">{value}</span>
        </div>
      </div>
    </div>
  );
}

export function UsersKpiGrid({
  totalUsers,
  activeUsers,
  inactiveUsers,
  joinedThisMonth,
}: UsersKpiGridProps) {
  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
      <KpiCard label="Total Users" value={totalUsers} icon={Users} tone="blue" />
      <KpiCard label="Active" value={activeUsers} icon={UserCheck} tone="green" />
      <KpiCard label="Inactive" value={inactiveUsers} icon={UserX} tone="amber" />
      <KpiCard
        label="Joined This Month"
        value={joinedThisMonth}
        icon={CalendarDays}
        tone="violet"
      />
    </section>
  );
}

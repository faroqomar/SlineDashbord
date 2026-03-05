'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { UserActionsMenu } from '@/components/users/UserActionsMenu';
import { toast } from 'sonner';
import type { LucideIcon } from 'lucide-react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Search,
  UserCheck,
  UserPlus,
  UserX,
  Users,
} from 'lucide-react';
import { USERS_INVITE_ACTION_MOCK, USERS_KPI_MOCK } from '../models/users-ui.mock';
import { useUsersViewModel, type UsersTabKey } from '../viewmodels/useUsersViewModel';

const KPI_ACCENT: Record<'blue' | 'green' | 'amber' | 'violet', string> = {
  blue: 'from-[#003f91]/20 to-[#003f91]/0 text-[#4ca2ff] border-[#0054c2]/35',
  green: 'from-[#00a650]/20 to-[#00a650]/0 text-[#42e38f] border-[#00a650]/35',
  amber: 'from-[#a06a00]/20 to-[#a06a00]/0 text-[#f4be5c] border-[#a06a00]/35',
  violet: 'from-[#4f2bd4]/20 to-[#4f2bd4]/0 text-[#a58bff] border-[#4f2bd4]/35',
};

const STATUS_CLASSES: Record<'active' | 'suspended' | 'banned', string> = {
  active: 'border-[#2cb562] bg-[#08190e] text-[#4ae081] shadow-[0px_0px_5px_0px_rgba(27,158,75,0.6)]',
  suspended: 'border-[#c7952d] bg-[#22190a] text-[#f4be5c]',
  banned: 'border-[#c63b3b] bg-[#2a0f12] text-[#f38b8b]',
};

interface KpiCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  tone: keyof typeof KPI_ACCENT;
}

function formatJoinedDate(value: string): string {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return date.toLocaleDateString();
}

function formatLastActive(value: string): string {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';

  const diffMs = Date.now() - date.getTime();
  if (diffMs < 60 * 60 * 1000) {
    const minutes = Math.max(1, Math.floor(diffMs / (60 * 1000)));
    return `${minutes}m ago`;
  }
  if (diffMs < 24 * 60 * 60 * 1000) {
    const hours = Math.max(1, Math.floor(diffMs / (60 * 60 * 1000)));
    return `${hours}h ago`;
  }
  const days = Math.max(1, Math.floor(diffMs / (24 * 60 * 60 * 1000)));
  return `${days}d ago`;
}

function getInitials(value: string): string {
  const segments = value.trim().split(/\s+/).filter(Boolean);
  if (segments.length === 0) return 'U';
  if (segments.length === 1) return segments[0].slice(0, 2).toUpperCase();
  return `${segments[0][0] ?? ''}${segments[1][0] ?? ''}`.toUpperCase();
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

function UsersTableSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <TableRow key={`users-skeleton-${index}`}>
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="size-9 rounded-[14px] bg-[#1e232d]" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[120px] bg-[#1e232d]" />
                <Skeleton className="h-3 w-[170px] bg-[#1e232d]" />
              </div>
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-14 rounded-full bg-[#1e232d]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-16 rounded-full bg-[#1e232d]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20 bg-[#1e232d]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-14 bg-[#1e232d]" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="ml-auto size-6 rounded-md bg-[#1e232d]" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export function UsersScreen() {
  const vm = useUsersViewModel();

  const tabs: Array<{ key: UsersTabKey; label: string; count: number }> = [
    { key: 'all', label: 'All', count: vm.totalUsers },
    { key: 'active', label: 'Active', count: vm.activeUsersOnPage },
    { key: 'inactive', label: 'Inactive', count: vm.inactiveUsersOnPage },
  ];

  const inviteUser = () => {
    toast.info(USERS_INVITE_ACTION_MOCK.message);
  };

  return (
    <div className="space-y-4 text-[#e8e6e3]">
      <section className="relative overflow-hidden rounded-[14px] border border-[#7f7668] bg-[linear-gradient(172deg,#0e0f13_0%,#151226_60%,#0e0f13_100%)] p-6">
        <div className="absolute -right-12 -top-20 size-[220px] rounded-full bg-[radial-gradient(circle,rgba(13,15,140,0.18)_0%,rgba(13,15,140,0)_70%)]" />
        <div className="relative flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm text-[#afa89d]">Platform</p>
            <h1 className="text-[38px] font-bold leading-[1.05] text-[#c7f8e5]">Users</h1>
            <p className="text-sm text-[#9d9588]">Manage and monitor platform participants.</p>
          </div>
          <Button
            type="button"
            onClick={inviteUser}
            className="h-10 rounded-[10px] border border-[#242989] bg-[linear-gradient(163deg,#0d0f8c_0%,#1d169c_100%)] px-4 text-sm font-medium text-[#e8e6e3] shadow-[0px_0px_20px_0px_rgba(13,15,140,0.2)] hover:opacity-95"
          >
            <UserPlus className="mr-2 size-4" />
            Invite User
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Users" value={vm.totalUsers} icon={Users} tone="blue" />
        <KpiCard label="Active" value={USERS_KPI_MOCK.activeUsers.value} icon={UserCheck} tone="green" />
        <KpiCard label="Inactive" value={USERS_KPI_MOCK.inactiveUsers.value} icon={UserX} tone="amber" />
        <KpiCard
          label="Joined This Month"
          value={USERS_KPI_MOCK.joinedThisMonth.value}
          icon={CalendarDays}
          tone="violet"
        />
      </section>

      <section className="overflow-hidden rounded-[14px] border border-[#7f7668] bg-[#0a0d12]">
        <div className="flex flex-col gap-3 border-b border-[#7f7668] px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab.key}
                type="button"
                variant="ghost"
                className={cn(
                  'h-8 rounded-[8px] px-3 text-xs text-[#9d9588] hover:bg-[#161a25] hover:text-[#e8e6e3]',
                  vm.tab === tab.key && 'bg-[#1a1d2d] text-[#e8e6e3]',
                )}
                onClick={() => vm.setTab(tab.key)}
              >
                {tab.label}
                <span className="ml-2 rounded-full bg-[#222636] px-1.5 py-0.5 text-[10px] leading-none text-[#b0a99f]">
                  {tab.count}
                </span>
              </Button>
            ))}
          </div>

          <div className="relative w-full lg:w-[420px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9d9588]" />
            <Input
              value={vm.query}
              onChange={(event) => vm.setQuery(event.target.value)}
              placeholder="Search by name, email, ID..."
              className="h-9 border-[#7f7668] bg-[#070b12] pl-9 text-sm text-[#e8e6e3] placeholder:text-[#8d8579] focus-visible:ring-[#2a2f44]"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#7f7668]">
              <TableHead className="h-9 pl-5 text-xs font-normal uppercase tracking-[0.08em] text-[#9d9588]">User</TableHead>
              <TableHead className="h-9 text-xs font-normal uppercase tracking-[0.08em] text-[#9d9588]">Role</TableHead>
              <TableHead className="h-9 text-xs font-normal uppercase tracking-[0.08em] text-[#9d9588]">Status</TableHead>
              <TableHead className="h-9 text-xs font-normal uppercase tracking-[0.08em] text-[#9d9588]">Joined</TableHead>
              <TableHead className="h-9 text-xs font-normal uppercase tracking-[0.08em] text-[#9d9588]">Last Active</TableHead>
              <TableHead className="h-9 pr-5 text-right text-xs font-normal uppercase tracking-[0.08em] text-[#9d9588]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vm.isLoading ? (
              <UsersTableSkeleton />
            ) : vm.users.length > 0 ? (
              vm.users.map((user) => {
                const displayName = user.full_name || 'Unknown User';
                const role = user.active_role || user.roles[0] || user.role || 'user';
                const statusClass = STATUS_CLASSES[user.status];

                return (
                  <TableRow key={user.id} className="border-b border-[#141820] hover:bg-[#121722]">
                    <TableCell className="pl-5">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9 rounded-[14px]">
                          <AvatarImage src={user.avatar_url} alt={displayName} />
                          <AvatarFallback className="rounded-[14px] bg-[#173ead] text-xs font-bold text-[#e8e6e3]">
                            {getInitials(displayName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-[#e8e6e3]">{displayName}</span>
                          <span className="text-xs text-[#9d9588]">{user.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="rounded-full border-[#7b7265] bg-[#151725] text-xs text-[#b0a99f]">
                        {role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-[#1b9e4b]" />
                        <Badge
                          variant="outline"
                          className={cn('rounded-full border px-2 py-0 text-xs font-medium capitalize', statusClass)}
                        >
                          {user.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-[#afa89d]">{formatJoinedDate(user.created_at)}</TableCell>
                    <TableCell className="text-xs text-[#9d9588]">{formatLastActive(user.last_sign_in_at)}</TableCell>
                    <TableCell className="pr-5 text-right">
                      <UserActionsMenu userId={user.id} />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-28 text-center text-sm text-[#9d9588]">
                  No users found for this filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {vm.error && (
          <div className="border-t border-[#7f7668] px-4 py-2 text-xs text-[#f38b8b]">
            Error loading users: {vm.error}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-[#7f7668] px-4 py-2 text-xs text-[#b1aaa0]">
          <span>
            {vm.users.length} of {vm.totalUsers} users
          </span>
          <div className="flex items-center gap-1">
            {vm.totalPages > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-6 rounded-[4px] text-[#b1aaa0] hover:bg-[#181a26] hover:text-[#e8e6e3]"
                disabled={vm.page <= 1}
                onClick={() => vm.setPage(vm.page - 1)}
              >
                <ChevronLeft className="size-3.5" />
              </Button>
            )}
            <span className="flex size-6 items-center justify-center rounded-[4px] bg-[#181a26] font-semibold text-[#e8e6e3]">
              {vm.page}
            </span>
            {vm.totalPages > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-6 rounded-[4px] text-[#b1aaa0] hover:bg-[#181a26] hover:text-[#e8e6e3]"
                disabled={vm.page >= vm.totalPages}
                onClick={() => vm.setPage(vm.page + 1)}
              >
                <ChevronRight className="size-3.5" />
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

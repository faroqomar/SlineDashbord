import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { UserDTO } from '../../services/users_api';

const STATUS_CLASSES: Record<'active' | 'suspended' | 'banned', string> = {
  active: 'border-[#2cb562] bg-[#08190e] text-[#4ae081] shadow-[0px_0px_5px_0px_rgba(27,158,75,0.6)]',
  suspended: 'border-[#c7952d] bg-[#22190a] text-[#f4be5c]',
  banned: 'border-[#c63b3b] bg-[#2a0f12] text-[#f38b8b]',
};

interface UsersTableProps {
  users: UserDTO[];
  isLoading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  totalUsers: number;
  onPageChange: (nextPage: number) => void;
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

function UsersTableSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <TableRow key={`users-skeleton-${index}`} data-testid="users-table-skeleton-row">
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

export function UsersTable({
  users,
  isLoading,
  error,
  page,
  totalPages,
  totalUsers,
  onPageChange,
}: UsersTableProps) {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-[#7f7668]">
            <TableHead className="h-9 pl-5 text-xs font-normal uppercase tracking-[0.08em] text-[#9d9588]">
              User
            </TableHead>
            <TableHead className="h-9 text-xs font-normal uppercase tracking-[0.08em] text-[#9d9588]">
              Role
            </TableHead>
            <TableHead className="h-9 text-xs font-normal uppercase tracking-[0.08em] text-[#9d9588]">
              Status
            </TableHead>
            <TableHead className="h-9 text-xs font-normal uppercase tracking-[0.08em] text-[#9d9588]">
              Joined
            </TableHead>
            <TableHead className="h-9 text-xs font-normal uppercase tracking-[0.08em] text-[#9d9588]">
              Last Active
            </TableHead>
            <TableHead className="h-9 pr-5 text-right text-xs font-normal uppercase tracking-[0.08em] text-[#9d9588]">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <UsersTableSkeleton />
          ) : users.length > 0 ? (
            users.map((user) => {
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
                    <Badge
                      variant="outline"
                      className="rounded-full border-[#7b7265] bg-[#151725] text-xs text-[#b0a99f]"
                    >
                      {role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-[#1b9e4b]" />
                      <Badge
                        variant="outline"
                        className={cn(
                          'rounded-full border px-2 py-0 text-xs font-medium capitalize',
                          statusClass,
                        )}
                      >
                        {user.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-[#afa89d]">
                    {formatJoinedDate(user.created_at)}
                  </TableCell>
                  <TableCell className="text-xs text-[#9d9588]">
                    {formatLastActive(user.last_sign_in_at)}
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <UserActionsMenu userId={user.id} userStatus={user.status} />
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

      {error ? (
        <div className="border-t border-[#7f7668] px-4 py-2 text-xs text-[#f38b8b]">
          Error loading users: {error}
        </div>
      ) : null}

      <div className="flex items-center justify-between border-t border-[#7f7668] px-4 py-2 text-xs text-[#b1aaa0]">
        <span>
          {users.length} of {totalUsers} users
        </span>
        <div className="flex items-center gap-1">
          {totalPages > 1 ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Previous page"
              className="size-6 rounded-[4px] text-[#b1aaa0] hover:bg-[#181a26] hover:text-[#e8e6e3]"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft className="size-3.5" />
            </Button>
          ) : null}
          <span
            className="flex size-6 items-center justify-center rounded-[4px] bg-[#181a26] font-semibold text-[#e8e6e3]"
            data-testid="users-current-page"
          >
            {page}
          </span>
          {totalPages > 1 ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Next page"
              className="size-6 rounded-[4px] text-[#b1aaa0] hover:bg-[#181a26] hover:text-[#e8e6e3]"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              <ChevronRight className="size-3.5" />
            </Button>
          ) : null}
        </div>
      </div>
    </>
  );
}

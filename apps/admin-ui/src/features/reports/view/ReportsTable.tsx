import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Filter, Search } from 'lucide-react';
import { statusBadge, severityBadge } from './ReportBadges';
import type { ReportListItem } from '@sline/shared';

const STATUS_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'Triaged', value: 'triaged' },
  { label: 'Escalated', value: 'escalated' },
  { label: 'Closed', value: 'closed' },
];

const TYPE_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'User', value: 'user' },
  { label: 'Chat', value: 'chat' },
  { label: 'Task', value: 'task' },
  { label: 'Booking', value: 'booking' },
];

const SEVERITY_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical' },
];

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={`h-[26px] rounded-[10px] border px-3 text-xs ${
        active
          ? 'border-[rgba(73,79,82,0.35)] bg-[rgba(63,76,95,0.09)] text-[#b0a99f]'
          : 'border-transparent text-[#9e9589] hover:border-[#3e4957] hover:bg-[#151a24] hover:text-[#cecac4]'
      }`}
    >
      {label}
    </Button>
  );
}

function ReportsSkeletonTable() {
  return (
    <div className="space-y-2 py-2">
      <Skeleton className="h-10 w-full rounded-[10px] bg-[#151a24]" />
      <Skeleton className="h-[58px] w-full rounded-[10px] bg-[#11151e]" />
      <Skeleton className="h-[58px] w-full rounded-[10px] bg-[#11151e]" />
      <Skeleton className="h-[58px] w-full rounded-[10px] bg-[#11151e]" />
      <Skeleton className="h-[58px] w-full rounded-[10px] bg-[#11151e]" />
    </div>
  );
}

export interface ReportsTableProps {
  filters: {
    status: string;
    entity_type: string;
    severity: string;
    assigned_to_me: boolean;
    page: number;
    limit: number;
  };
  reports: ReportListItem[];
  total: number;
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  changeFilters: (u: Partial<ReportsTableProps['filters']>) => void;
  openDetail: (reportId: string) => void;
}

export function ReportsTable({
  filters,
  reports,
  total,
  loading,
  searchQuery,
  setSearchQuery,
  changeFilters,
  openDetail,
}: ReportsTableProps) {
  return (
    <Card className="rounded-[14px] border-[#7f7668] bg-[#0e0f13]">
      <CardHeader className="space-y-3 border-b border-[#7f7668]/60 pb-4">
        <CardTitle className="text-sm font-semibold uppercase tracking-[0.6px] text-[#cecac4]">Reports</CardTitle>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9d9588]" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by ID, reason, reporter, or entity..."
                className="h-[42px] rounded-[14px] border-[#7f7668] bg-[#0e0f13] pl-10 text-[#cecac4] placeholder:text-[#b2aba1] focus-visible:ring-0"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-[26px] items-center rounded-[14px] border border-[#7f7668] bg-[#0e0f13] px-3 text-xs text-[#9d9588]">
                <Filter className="mr-2 h-3 w-3" />
                {total} results
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex flex-wrap items-center gap-1">
              <span className="mr-1 text-xs text-[#b1aaa0]">Status</span>
              {STATUS_OPTIONS.map((option) => (
                <FilterChip
                  key={option.value}
                  active={filters.status === option.value}
                  label={option.label}
                  onClick={() => changeFilters({ status: option.value })}
                />
              ))}
            </div>
            <div className="h-5 w-px bg-[#181a26]" />
            <div className="flex flex-wrap items-center gap-1">
              <span className="mr-1 text-xs text-[#b1aaa0]">Type</span>
              {TYPE_OPTIONS.map((option) => (
                <FilterChip
                  key={option.value}
                  active={filters.entity_type === option.value}
                  label={option.label}
                  onClick={() => changeFilters({ entity_type: option.value })}
                />
              ))}
            </div>
            <div className="h-5 w-px bg-[#181a26]" />
            <div className="flex flex-wrap items-center gap-1">
              <span className="mr-1 text-xs text-[#b1aaa0]">Severity</span>
              {SEVERITY_OPTIONS.map((option) => (
                <FilterChip
                  key={option.value}
                  active={filters.severity === option.value}
                  label={option.label}
                  onClick={() => changeFilters({ severity: option.value })}
                />
              ))}
            </div>
            <div className="h-5 w-px bg-[#181a26]" />
            <div className="flex flex-wrap items-center gap-1">
              <span className="mr-1 text-xs text-[#b1aaa0]">Ownership</span>
              <FilterChip
                active={filters.assigned_to_me}
                label="Assigned to me"
                onClick={() => changeFilters({ assigned_to_me: !filters.assigned_to_me })}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <ReportsSkeletonTable />
        ) : reports.length === 0 ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-[14px] border border-dashed border-[#7f7668] bg-[#0a0c11] p-6 text-center">
            <Search className="h-6 w-6 text-[#5eb1fa]" />
            <p className="text-base font-semibold text-[#e8e6e3]">No reports found</p>
            <p className="max-w-lg text-sm text-[#afa89d]">
              {searchQuery.trim()
                ? 'No reports match this search query.'
                : 'No reports found for the current filters.'}
            </p>
          </div>
        ) : (
          <Table className="overflow-hidden rounded-[14px] border border-[#7f7668]">
            <TableHeader>
              <TableRow className="border-[#7f7668] bg-[#0a0c11]">
                <TableHead className="text-[12px] uppercase tracking-[0.6px] text-[#9d9588]">Report</TableHead>
                <TableHead className="text-[12px] uppercase tracking-[0.6px] text-[#9d9588]">Type</TableHead>
                <TableHead className="text-[12px] uppercase tracking-[0.6px] text-[#9d9588]">Reporter</TableHead>
                <TableHead className="text-[12px] uppercase tracking-[0.6px] text-[#9d9588]">Severity</TableHead>
                <TableHead className="text-[12px] uppercase tracking-[0.6px] text-[#9d9588]">Reason</TableHead>
                <TableHead className="text-[12px] uppercase tracking-[0.6px] text-[#9d9588]">Status</TableHead>
                <TableHead className="text-[12px] uppercase tracking-[0.6px] text-[#9d9588]">Created</TableHead>
                <TableHead className="text-[12px] uppercase tracking-[0.6px] text-[#9d9588]">SLA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((r) => (
                <TableRow
                  key={r.id}
                  className="cursor-pointer border-[#7f7668] hover:bg-[rgba(24,26,27,0.2)]"
                  onClick={() => openDetail(r.id)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-[8px] border border-[rgba(169,72,4,0.2)] bg-[rgba(190,81,5,0.08)] text-xs text-[#fa7f2a]">
                        •
                      </div>
                      <div className="space-y-1">
                        <span className="font-mono text-xs text-[#cecac4]">{r.id.slice(0, 8)}...</span>
                        <div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 px-2 text-[10px] text-[#9d9588] hover:bg-[#181a26] hover:text-[#cecac4]"
                            onClick={(event) => {
                              event.stopPropagation();
                              openDetail(r.id);
                            }}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="capitalize text-[#cecac4]">{r.entity_type}</p>
                      <p className="text-xs text-[#b1aaa0]">{r.entity?.title ?? r.entity_id.slice(0, 8)}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="text-[#cecac4]">{r.reporter?.full_name ?? r.reporter?.username ?? 'Unknown'}</p>
                      <p className="text-xs uppercase text-[#b1aaa0]">{r.reporter?.username ?? 'User'}</p>
                    </div>
                  </TableCell>
                  <TableCell>{severityBadge(r.severity)}</TableCell>
                  <TableCell className="max-w-[260px]">
                    <p className="truncate text-sm text-[#afa89d]">{r.reason ?? 'No reason provided'}</p>
                  </TableCell>
                  <TableCell>{statusBadge(r.status)}</TableCell>
                  <TableCell className="text-sm text-[#9d9588]">
                    {new Date(r.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs text-[#bdb7ae]">
                    {r.sla_due_at ? new Date(r.sla_due_at).toLocaleString() : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {total > filters.limit && (
          <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
            <span>Page {filters.page} of {Math.ceil(total / filters.limit)}</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page <= 1}
                onClick={() => changeFilters({ page: filters.page - 1 })}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page >= Math.ceil(total / filters.limit)}
                onClick={() => changeFilters({ page: filters.page + 1 })}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

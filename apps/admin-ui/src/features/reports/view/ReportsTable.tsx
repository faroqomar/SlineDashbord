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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Copy } from 'lucide-react';
import { statusBadge, severityBadge } from './ReportBadges';
import type { ReportListItem } from '@sline/shared';

async function copyId(id: string) {
  try {
    await navigator.clipboard.writeText(id);
  } catch {
    // no-op
  }
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
  changeFilters: (u: Partial<ReportsTableProps['filters']>) => void;
  openDetail: (reportId: string) => void;
  refreshList: () => void;
}

export function ReportsTable({
  filters,
  reports,
  total,
  loading,
  changeFilters,
  openDetail,
  refreshList,
}: ReportsTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Reports</CardTitle>
        <div className="flex flex-wrap gap-2 items-center">
          <Select value={filters.status} onValueChange={(v) => changeFilters({ status: v })}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="triaged">Triaged</SelectItem>
              <SelectItem value="escalated">Escalated</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.entity_type} onValueChange={(v) => changeFilters({ entity_type: v })}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="task">Task</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="chat">Chat</SelectItem>
              <SelectItem value="booking">Booking</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.severity} onValueChange={(v) => changeFilters({ severity: v })}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All severity</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 border border-border rounded-md px-3 py-2">
            <Switch
              id="assigned-to-me"
              checked={filters.assigned_to_me}
              onCheckedChange={(checked) => changeFilters({ assigned_to_me: checked })}
            />
            <Label htmlFor="assigned-to-me" className="text-xs">Assigned to me</Label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground py-8 text-center">Loading reports…</p>
        ) : reports.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">No reports found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Reporter</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>SLA</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">{r.id.slice(0, 8)}…</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyId(r.id)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="capitalize">{r.entity_type}</p>
                      <p className="text-muted-foreground text-xs">{r.entity?.title ?? r.entity_id.slice(0, 8)}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p>{r.reporter?.full_name ?? r.reporter?.username ?? 'Unknown'}</p>
                      <p className="text-muted-foreground text-xs font-mono">
                        {r.reporter_user_id ? `${r.reporter_user_id.slice(0, 8)}…` : '—'}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{severityBadge(r.severity)}</TableCell>
                  <TableCell className="max-w-[260px]">
                    <p className="truncate text-sm">{r.reason ?? 'No reason provided'}</p>
                  </TableCell>
                  <TableCell>{statusBadge(r.status)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(r.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {r.sla_due_at ? new Date(r.sla_due_at).toLocaleString() : '—'}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => openDetail(r.id)}>
                      View
                    </Button>
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

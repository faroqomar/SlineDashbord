import React from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useLogsViewModel } from '@/features/logs/viewmodels/use_logs_viewmodel';

export function LogsPage() {
  const vm = useLogsViewModel();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">System Logs</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Audit and operational events with server-side pagination.
        </p>
      </div>

      <div className="rounded-xl border bg-card">
        <div className="grid gap-4 border-b p-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="grid gap-2">
            <Label htmlFor="log-action">Action</Label>
            <Input
              id="log-action"
              placeholder="admin.case.create"
              value={vm.draftFilters.action}
              onChange={(event) =>
                vm.setDraftFilters({ ...vm.draftFilters, action: event.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="log-actor">Actor User ID</Label>
            <Input
              id="log-actor"
              placeholder="UUID"
              value={vm.draftFilters.actorUserId}
              onChange={(event) =>
                vm.setDraftFilters({ ...vm.draftFilters, actorUserId: event.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="log-from">From</Label>
            <Input
              id="log-from"
              type="date"
              value={vm.draftFilters.from}
              onChange={(event) =>
                vm.setDraftFilters({ ...vm.draftFilters, from: event.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="log-to">To</Label>
            <Input
              id="log-to"
              type="date"
              value={vm.draftFilters.to}
              onChange={(event) =>
                vm.setDraftFilters({ ...vm.draftFilters, to: event.target.value })
              }
            />
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={vm.applyFilters} className="w-full">Apply</Button>
            <Button variant="outline" onClick={vm.resetFilters} className="w-full">
              Reset
            </Button>
          </div>
        </div>

        {vm.error && (
          <div className="border-b px-4 py-3 text-sm font-medium text-destructive">
            {vm.error.message}
          </div>
        )}

        {vm.isLoading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading logs…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Entity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vm.logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No logs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  vm.logs.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(item.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm font-medium">{item.action}</TableCell>
                      <TableCell className={`text-xs font-semibold uppercase ${vm.statusTone[item.status]}`}>
                        {item.status}
                      </TableCell>
                      <TableCell className="text-xs">
                        {item.actorName || item.actorUserId || 'System'}
                      </TableCell>
                      <TableCell className="text-xs">
                        {item.entityType && item.entityId ? `${item.entityType}:${item.entityId}` : '—'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex items-center justify-between border-t px-4 py-3">
          <p className="text-xs text-muted-foreground">
            {vm.count.toLocaleString()} total · page {vm.page}
            {vm.totalPages ? ` of ${vm.totalPages}` : ''}
          </p>
          <div className="flex items-center gap-2">
            {vm.isFetching && !vm.isLoading && (
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
            )}
            <Button variant="outline" size="sm" disabled={!vm.canPrev || vm.isFetching} onClick={vm.goPrev}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={!vm.canNext || vm.isFetching} onClick={vm.goNext}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

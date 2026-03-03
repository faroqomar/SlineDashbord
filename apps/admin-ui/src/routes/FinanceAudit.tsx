'use client';

import { useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuditLogsVM } from '@/features/finance/viewmodels/useAuditLogs.vm';
import { Loader2, Download, ChevronRight } from 'lucide-react';

export function FinanceAuditPage() {
  const vm = useAuditLogsVM();

  useEffect(() => {
    vm.load(false);
  }, []);

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="rounded-md border bg-card">
        <div className="flex flex-col p-4 border-b gap-4">
          <h3 className="text-lg font-semibold">Security Audit Trail</h3>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="grid gap-2">
              <Label htmlFor="action">Action</Label>
              <Input
                id="action"
                placeholder="e.g. admin.finance.withdrawal_approve"
                value={vm.filters.action ?? ''}
                onChange={(e) => vm.setFilters({ ...vm.filters, action: e.target.value || undefined })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="actor">Actor User ID</Label>
              <Input
                id="actor"
                placeholder="UUID"
                value={vm.filters.actor_user_id ?? ''}
                onChange={(e) => vm.setFilters({ ...vm.filters, actor_user_id: e.target.value || undefined })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={vm.filters.start_date ?? ''}
                onChange={(e) => vm.setFilters({ ...vm.filters, start_date: e.target.value || undefined })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={vm.filters.end_date ?? ''}
                onChange={(e) => vm.setFilters({ ...vm.filters, end_date: e.target.value || undefined })}
              />
            </div>
            <Button onClick={() => vm.load()}>Apply</Button>
            <Button
              variant="outline"
              onClick={vm.exportCsv}
              disabled={vm.exportLoading}
            >
              {vm.exportLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
              Export CSV
            </Button>
          </div>
        </div>

        {vm.error && (
          <div className="p-4 text-destructive text-sm font-medium">{vm.error}</div>
        )}

        {vm.loading && vm.data.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            Loading audit logs…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity Type</TableHead>
                  <TableHead>Entity ID</TableHead>
                  <TableHead>Journal ID</TableHead>
                  <TableHead>Metadata</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vm.data.length > 0 ? (
                  vm.data.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(log.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{log.actor_user_id ?? '—'}</TableCell>
                      <TableCell className="font-medium">{log.action}</TableCell>
                      <TableCell>{log.related_entity_type ?? '—'}</TableCell>
                      <TableCell className="font-mono text-xs">{log.related_entity_id ?? '—'}</TableCell>
                      <TableCell className="font-mono text-xs">{log.journal_entry_id ?? '—'}</TableCell>
                      <TableCell className="text-xs max-w-[200px] truncate">
                        {log.meta ? JSON.stringify(log.meta) : '—'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No audit logs found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex items-center justify-end space-x-2 py-4 px-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => vm.load(false)}
            disabled={vm.loading}
          >
            First page
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => vm.load(true)}
            disabled={!vm.nextCursor || vm.loading}
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

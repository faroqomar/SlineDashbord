import * as React from 'react';
import { useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { useApprovalsVM } from '../features/finance/viewmodels/useApprovals.vm';
import { Button } from '../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export function FinanceApprovalsPage() {
  const vm = useApprovalsVM();

  useEffect(() => {
    vm.loadApprovals();
    // Intentionally run once on mount; vm is stable per mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (vm.loading && vm.items.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse">
        Loading approval queue…
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <Card>
        <CardHeader>
          <CardTitle>Approval queue</CardTitle>
          <CardDescription>
            Dangerous ops (wallet adjust, reversal, large refund) require a second approver. Approve or reject as a different admin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {vm.error && (
            <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-destructive flex items-center justify-between">
              <span>{vm.error}</span>
              <Button variant="outline" size="sm" onClick={vm.clearError}>Dismiss</Button>
            </div>
          )}

          {vm.items.length === 0 && !vm.loading && (
            <p className="text-muted-foreground py-8 text-center">No pending approvals.</p>
          )}

          {vm.items.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Requested by</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vm.items.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.operation_type}</TableCell>
                    <TableCell>{row.target_entity_type} / {row.target_entity_id?.slice(0, 8)}…</TableCell>
                    <TableCell>{row.requested_by?.slice(0, 8)}…</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.created_at ? new Date(row.created_at).toLocaleString() : '—'}</TableCell>
                    <TableCell className="text-right">
                      {row.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="default"
                            className="mr-2"
                            disabled={vm.loadingActionId !== null}
                            onClick={() => vm.approve(row.id)}
                          >
                            {vm.loadingActionId === row.id ? '…' : 'Approve'}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={vm.loadingActionId !== null}
                            onClick={() => vm.reject(row.id, 'Rejected by admin')}
                          >
                            {vm.loadingActionId === row.id ? '…' : 'Reject'}
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {vm.nextCursor && (
            <div className="mt-4">
              <Button variant="outline" onClick={() => vm.loadApprovals(vm.nextCursor ?? undefined)}>
                Load more
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        <Link to="/finance" className="underline">Back to Finance</Link> · Request an approval from wallet adjust or refund flows when the amount is above the dangerous threshold.
      </p>
    </div>
  );
}

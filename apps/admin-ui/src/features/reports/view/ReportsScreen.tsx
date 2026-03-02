import React from 'react';
import { useReportsViewModel } from '../viewmodels/use_reports_viewmodel';
import type { TriageAction } from '@sline/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, RefreshCw, Flag } from 'lucide-react';

const TRIAGE_ACTIONS: TriageAction[] = ['dismiss', 'warn_user', 'escalate', 'close'];

export function ReportsScreen() {
  const vm = useReportsViewModel();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Flag className="h-8 w-8 text-primary" />
            Reports Queue
          </h2>
          <p className="text-muted-foreground">
            Triage and close user reports for tasks, users, and chats.
          </p>
        </div>
        <Button variant="outline" onClick={vm.refreshList} disabled={vm.loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${vm.loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {vm.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{vm.error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Reports</CardTitle>
          <div className="flex gap-2">
            <Select
              value={vm.filters.status}
              onValueChange={(v) => vm.changeFilters({ status: v })}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="triaged">Triaged</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={vm.filters.entity_type}
              onValueChange={(v) => vm.changeFilters({ entity_type: v })}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="task">Task</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="chat">Chat</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {vm.loading ? (
            <p className="text-muted-foreground py-8 text-center">Loading reports…</p>
          ) : vm.reports.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">No reports found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vm.reports.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">{r.id.slice(0, 8)}…</TableCell>
                    <TableCell>
                      <span className="capitalize">{r.entity_type}</span>
                      <span className="text-muted-foreground ml-1 font-mono text-xs">{r.entity_id.slice(0, 8)}…</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={r.status === 'closed' ? 'secondary' : r.status === 'open' ? 'destructive' : 'default'}>
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(r.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => vm.openDetail(r.id)}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {vm.total > vm.filters.limit && (
            <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
              <span>Page {vm.filters.page} of {Math.ceil(vm.total / vm.filters.limit)}</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={vm.filters.page <= 1}
                  onClick={() => vm.changeFilters({ page: vm.filters.page - 1 })}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={vm.filters.page >= Math.ceil(vm.total / vm.filters.limit)}
                  onClick={() => vm.changeFilters({ page: vm.filters.page + 1 })}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!vm.selectedReport || vm.detailLoading} onOpenChange={(open) => !open && vm.closeDialog()}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report detail</DialogTitle>
            <DialogDescription>Triage or close this report.</DialogDescription>
          </DialogHeader>
          {vm.detailLoading && <p className="py-4 text-muted-foreground">Loading…</p>}
          {vm.selectedReport && !vm.detailLoading && (
            <>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">ID:</span> <span className="font-mono">{vm.selectedReport.id}</span></p>
                <p><span className="font-medium">Entity:</span> {vm.selectedReport.entity_type} / <span className="font-mono">{vm.selectedReport.entity_id}</span></p>
                <p><span className="font-medium">Status:</span> <Badge>{vm.selectedReport.status}</Badge></p>
                {vm.selectedReport.reason && <p><span className="font-medium">Reason:</span> {vm.selectedReport.reason}</p>}
                <p><span className="font-medium">Reporter:</span> <span className="font-mono">{vm.selectedReport.reporter_user_id}</span></p>
                {vm.selectedReport.actions.length > 0 && (
                  <div>
                    <span className="font-medium">Actions:</span>
                    <ul className="list-disc pl-4 mt-1">
                      {vm.selectedReport.actions.map((a) => (
                        <li key={a.id}>{a.action} – {a.reason ?? '—'} ({new Date(a.created_at).toLocaleString()})</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {vm.submitError && (
                <Alert variant="destructive">
                  <AlertDescription>{vm.submitError}</AlertDescription>
                </Alert>
              )}
              {vm.selectedReport.status !== 'closed' && (
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Triage</label>
                    <div className="flex gap-2 flex-wrap">
                      <Select value={vm.triageAction} onValueChange={(v: TriageAction) => vm.setTriageAction(v)}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TRIAGE_ACTIONS.map((a) => (
                            <SelectItem key={a} value={a}>{a}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Textarea
                        placeholder="Reason (required)"
                        value={vm.triageReason}
                        onChange={(e) => vm.setTriageReason(e.target.value)}
                        className="min-h-[60px]"
                      />
                      <Button onClick={vm.handleTriage} disabled={vm.submitting || !vm.triageReason.trim()}>
                        {vm.submitting ? 'Sending…' : 'Triage'}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Close report</label>
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Reason to close (required)"
                        value={vm.closeReason}
                        onChange={(e) => vm.setCloseReason(e.target.value)}
                        className="min-h-[60px] flex-1"
                      />
                      <Button variant="secondary" onClick={vm.handleClose} disabled={vm.submitting || !vm.closeReason.trim()}>
                        {vm.submitting ? 'Sending…' : 'Close'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              {vm.selectedReport.status === 'closed' && (
                <p className="text-muted-foreground text-sm pt-4">This report is closed.</p>
              )}
            </>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={vm.closeDialog}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

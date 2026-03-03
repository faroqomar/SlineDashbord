import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { statusBadge, severityBadge } from './ReportBadges';
import type { ReportDetail } from '@sline/shared';

export interface ReportDetailModalProps {
  open: boolean;
  loading: boolean;
  report: ReportDetail | null;
  actionReason: string;
  setActionReason: (v: string) => void;
  onDismiss: () => void;
  onEscalate: () => Promise<string | null>;
  onCloseResolved: () => void;
  submitting: boolean;
  submitError: string | null;
  onClose: () => void;
}

export function ReportDetailModal({
  open,
  loading,
  report,
  actionReason,
  setActionReason,
  onDismiss,
  onEscalate,
  onCloseResolved,
  submitting,
  submitError,
  onClose,
}: ReportDetailModalProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto overflow-x-hidden border border-border shadow-2xl [background-color:hsl(var(--background))]">
        <div className="min-h-full [background-color:hsl(var(--background))]">
          <DialogHeader>
            <DialogTitle>Report detail</DialogTitle>
            <DialogDescription>Review evidence and decide: dismiss, close resolved, or escalate to case.</DialogDescription>
          </DialogHeader>
          {loading && <p className="py-4 text-muted-foreground">Loading…</p>}
          {report && !loading && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <Card className="min-w-0 overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Reporter</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="font-medium truncate" title={report.reporter?.full_name ?? report.reporter?.username ?? 'Unknown reporter'}>
                      {report.reporter?.full_name ?? report.reporter?.username ?? 'Unknown reporter'}
                    </p>
                    <p className="text-muted-foreground font-mono text-xs break-all" title={report.reporter_user_id ?? undefined}>
                      {report.reporter_user_id ?? '—'}
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-muted-foreground text-xs">
                      <span>Trust: {report.reporter?.trust_level ?? '—'}</span>
                      <span>Total reports: {report.reporter?.total_reports_count ?? 0}</span>
                      <span>Relation: {report.reporter?.relationship_to_entity ?? 'n/a'}</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="min-w-0 overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Entity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="capitalize shrink-0">{report.entity_type}</Badge>
                      {report.entity?.status != null && (
                        <span className="text-muted-foreground text-xs">Status: {report.entity.status}</span>
                      )}
                    </div>
                    <p className="font-medium break-words">{report.entity?.title ?? report.entity_id}</p>
                    {report.entity?.subtitle && (
                      <p className="text-muted-foreground text-xs break-words">{report.entity.subtitle}</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Report content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {statusBadge(report.status)}
                    {severityBadge(report.severity)}
                    {report.case_id && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate({ to: '/cases/$caseId', params: { caseId: report.case_id! } })}
                      >
                        <ExternalLink className="mr-2 h-3 w-3" />
                        Open case
                      </Button>
                    )}
                  </div>
                  <dl className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                    <dt className="font-medium text-muted-foreground">Reason</dt>
                    <dd className="break-words">{report.reason ?? 'No reason provided'}</dd>
                    <dt className="font-medium text-muted-foreground">Category</dt>
                    <dd>{report.category ?? '—'}</dd>
                  </dl>
                  {report.evidence.length > 0 && (
                    <div className="pt-2 border-t border-border">
                      <p className="font-medium text-sm mb-2">Evidence</p>
                      <ul className="space-y-1.5 text-sm text-muted-foreground">
                        {report.evidence.map((item, idx) => {
                          const rec = item as Record<string, unknown>;
                          const parts = Object.entries(rec).map(([k, v]) => `${k}: ${typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v)}`);
                          return (
                            <li key={idx} className="break-words">
                              {parts.join(' · ') || '—'}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  {report.timeline.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No timeline entries yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {report.timeline.map((t) => (
                        <li key={t.id} className="text-sm border-l-2 border-border pl-3 py-0.5">
                          <p className="font-medium">{t.event}</p>
                          <p className="text-muted-foreground text-xs">
                            {new Date(t.created_at).toLocaleString()}
                            {t.reason ? ` · ${t.reason}` : ''}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              <div className="space-y-4 border-t border-border pt-4">
                <Label htmlFor="report-action-reason" className="text-sm font-medium">Reason (required for any action)</Label>
                <Textarea
                  id="report-action-reason"
                  placeholder="Enter reason for dismiss, escalate, or close…"
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  className="min-h-[88px] resize-y"
                />
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    onClick={onDismiss}
                    disabled={submitting || !actionReason.trim() || report.status === 'closed'}
                  >
                    {submitting ? 'Submitting…' : 'Dismiss'}
                  </Button>
                  <Button
                    onClick={async () => {
                      const caseId = await onEscalate();
                      if (caseId) navigate({ to: '/cases/$caseId', params: { caseId } });
                    }}
                    disabled={submitting || !actionReason.trim() || report.status === 'closed'}
                  >
                    {submitting ? 'Submitting…' : 'Escalate to case'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={onCloseResolved}
                    disabled={submitting || !actionReason.trim() || report.status === 'closed'}
                  >
                    {submitting ? 'Submitting…' : 'Close as resolved'}
                  </Button>
                </div>
              </div>
              {submitError && (
                <Alert variant="destructive">
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )}
            </>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Done</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

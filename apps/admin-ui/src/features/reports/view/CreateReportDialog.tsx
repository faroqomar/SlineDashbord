import React from 'react';
import type { ReportEntityType, ReportSeverity } from '@sline/shared';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { CreateReportDraft } from '../viewmodels/use_reports_viewmodel';

interface CreateReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: CreateReportDraft;
  updateDraft: (updates: Partial<CreateReportDraft>) => void;
  onSubmit: () => void;
  submitting: boolean;
  error: string | null;
}

const ENTITY_OPTIONS: Array<{ value: ReportEntityType; label: string }> = [
  { value: 'task', label: 'Task' },
  { value: 'user', label: 'User' },
  { value: 'chat', label: 'Chat' },
  { value: 'booking', label: 'Booking' },
];

const SEVERITY_OPTIONS: Array<{ value: ReportSeverity; label: string }> = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

export function CreateReportDialog({
  open,
  onOpenChange,
  draft,
  updateDraft,
  onSubmit,
  submitting,
  error,
}: CreateReportDialogProps) {
  const isSubmitDisabled = submitting || !draft.entity_id.trim() || !draft.reason.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Create Report</DialogTitle>
          <DialogDescription>Create a moderation report manually from the admin dashboard.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Entity Type</Label>
            <Select
              value={draft.entity_type}
              onValueChange={(value: ReportEntityType) => updateDraft({ entity_type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select entity type" />
              </SelectTrigger>
              <SelectContent>
                {ENTITY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="report-entity-id">Entity ID</Label>
            <Input
              id="report-entity-id"
              value={draft.entity_id}
              onChange={(event) => updateDraft({ entity_id: event.target.value })}
              placeholder="UUID of task/user/chat/booking"
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="report-category">Category</Label>
              <Input
                id="report-category"
                value={draft.category}
                onChange={(event) => updateDraft({ category: event.target.value })}
                placeholder="Optional category"
              />
            </div>
            <div className="grid gap-2">
              <Label>Severity</Label>
              <Select
                value={draft.severity || 'none'}
                onValueChange={(value: ReportSeverity | 'none') =>
                  updateDraft({ severity: value === 'none' ? '' : value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Optional severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {SEVERITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="report-reason">Reason</Label>
            <Textarea
              id="report-reason"
              value={draft.reason}
              onChange={(event) => updateDraft({ reason: event.target.value })}
              placeholder="Describe why this report is being created"
              className="min-h-[100px]"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitDisabled}>
            {submitting ? 'Creating…' : 'Create Report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

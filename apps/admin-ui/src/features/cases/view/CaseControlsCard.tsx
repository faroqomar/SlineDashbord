import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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

export interface CaseControlsCardProps {
  assigneeId: string;
  setAssigneeId: (v: string) => void;
  assignReason: string;
  setAssignReason: (v: string) => void;
  onAssign: () => void;
  isAssigning: boolean;
  status: 'open' | 'in_progress' | 'pending' | 'closed';
  setStatus: (v: 'open' | 'in_progress' | 'pending' | 'closed') => void;
  statusReason: string;
  setStatusReason: (v: string) => void;
  onStatusUpdate: () => void;
  isUpdatingStatus: boolean;
}

export function CaseControlsCard({
  assigneeId,
  setAssigneeId,
  assignReason,
  setAssignReason,
  onAssign,
  isAssigning,
  status,
  setStatus,
  statusReason,
  setStatusReason,
  onStatusUpdate,
  isUpdatingStatus,
}: CaseControlsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Case controls</CardTitle>
        <CardDescription>Assignment and status transitions (reason required).</CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Assign case</Label>
          <Input
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            placeholder="Assignee UUID (blank to unassign)"
          />
          <Textarea
            value={assignReason}
            onChange={(e) => setAssignReason(e.target.value)}
            placeholder="Reason for assignment"
            className="min-h-[80px]"
          />
          <Button onClick={onAssign} disabled={isAssigning || !assignReason.trim()}>
            {isAssigning ? 'Saving…' : 'Update assignee'}
          </Button>
        </div>
        <div className="space-y-2">
          <Label>Update status</Label>
          <Select value={status} onValueChange={(v: 'open' | 'in_progress' | 'pending' | 'closed') => setStatus(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In progress</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Textarea
            value={statusReason}
            onChange={(e) => setStatusReason(e.target.value)}
            placeholder="Reason for status update"
            className="min-h-[80px]"
          />
          <Button onClick={onStatusUpdate} disabled={isUpdatingStatus || !statusReason.trim()}>
            {isUpdatingStatus ? 'Saving…' : 'Update status'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

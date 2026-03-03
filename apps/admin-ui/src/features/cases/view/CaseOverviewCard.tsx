import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export interface CaseOverviewCardProps {
  subject: string;
  source: string | null;
  status: string | null;
  priority: string | null;
  assigneeId: string | null;
  assigneeName?: string | null;
  slaDueAt: string | null;
  createdAt: string | null;
}

export function CaseOverviewCard({
  subject,
  source,
  status,
  priority,
  assigneeId,
  assigneeName,
  slaDueAt,
  createdAt,
}: CaseOverviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
        <CardDescription>Created {createdAt ? new Date(createdAt).toLocaleString() : '—'}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p><span className="text-muted-foreground">Subject:</span> {subject}</p>
        <p><span className="text-muted-foreground">Source:</span> {source ?? '—'}</p>
        <p><span className="text-muted-foreground">Status:</span> {status ?? '—'}</p>
        <p><span className="text-muted-foreground">Priority:</span> {priority ?? '—'}</p>
        <p><span className="text-muted-foreground">Assignee:</span> {assigneeName ?? assigneeId ?? 'Unassigned'}</p>
        <p><span className="text-muted-foreground">SLA due:</span> {slaDueAt ? new Date(slaDueAt).toLocaleString() : '—'}</p>
      </CardContent>
    </Card>
  );
}

import React from 'react';
import { Badge } from '@/components/ui/badge';

export function statusBadge(status: string) {
  if (status === 'open') return <Badge className="bg-warning/20 text-warning-foreground border-warning/30">open</Badge>;
  if (status === 'escalated') return <Badge className="bg-violet-500/20 text-violet-200 border-violet-500/40">escalated</Badge>;
  if (status === 'triaged') return <Badge variant="secondary">triaged</Badge>;
  return <Badge className="bg-success/20 text-success-foreground border-success/30">closed</Badge>;
}

export function severityBadge(severity?: string | null) {
  if (!severity) return <span className="text-muted-foreground text-xs">—</span>;
  const classes: Record<string, string> = {
    low: 'bg-info/15 text-info border-info/30',
    medium: 'bg-warning/15 text-warning-foreground border-warning/30',
    high: 'bg-destructive/15 text-destructive-foreground border-destructive/30',
    critical: 'bg-destructive/30 text-destructive-foreground border-destructive/60',
  };
  return <Badge className={classes[severity] ?? 'bg-muted text-muted-foreground'}>{severity}</Badge>;
}

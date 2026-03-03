import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export interface TimelineItem {
  id: string;
  event: string;
  created_at: string;
  reason?: string | null;
}

export interface CaseTimelineCardProps {
  timeline: TimelineItem[];
}

export function CaseTimelineCard({ timeline }: CaseTimelineCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline</CardTitle>
        <CardDescription>Complete investigation/action history for this case.</CardDescription>
      </CardHeader>
      <CardContent>
        {timeline.length === 0 ? (
          <p className="text-muted-foreground py-2">No timeline entries yet.</p>
        ) : (
          <ul className="space-y-2">
            {timeline.map((item) => (
              <li key={item.id} className="border-l border-border pl-3">
                <p className="font-medium">{item.event}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(item.created_at).toLocaleString()}
                  {item.reason ? ` · ${item.reason}` : ''}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

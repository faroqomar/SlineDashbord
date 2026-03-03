import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export interface EvidenceItem {
  id: string;
  entity_type?: string;
  entity_id?: string;
  evidence_type?: string;
  title?: string | null;
  created_at?: string | null;
}

export interface CaseEvidenceCardProps {
  evidence: EvidenceItem[];
}

export function CaseEvidenceCard({ evidence }: CaseEvidenceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evidence</CardTitle>
        <CardDescription>Reports and linked data used in investigation.</CardDescription>
      </CardHeader>
      <CardContent>
        {evidence.length === 0 ? (
          <p className="text-muted-foreground py-2">No evidence records available.</p>
        ) : (
          <ul className="space-y-2">
            {evidence.map((e) => (
              <li key={e.id} className="border border-border rounded-md p-3">
                <p className="font-medium">{e.title ?? `${e.evidence_type ?? 'Evidence'} evidence`}</p>
                <p className="text-xs text-muted-foreground">
                  {e.entity_type ?? '—'} · {e.entity_id ?? '—'} · {e.created_at ? new Date(e.created_at).toLocaleString() : '—'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

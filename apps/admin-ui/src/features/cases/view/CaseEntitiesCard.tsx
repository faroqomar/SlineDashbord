import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@tanstack/react-router';

export interface CaseEntityRow {
  id: string;
  entity_type: string;
  entity_id: string;
  created_at?: string | null | undefined;
}

export interface CaseEntitiesCardProps {
  caseId: string;
  entities: CaseEntityRow[];
}

export function CaseEntitiesCard({ caseId, entities }: CaseEntitiesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attached entities</CardTitle>
        <CardDescription>Entities linked to this case (e.g. for chat access gating).</CardDescription>
      </CardHeader>
      <CardContent>
        {entities.length === 0 ? (
          <p className="text-muted-foreground py-4">No entities attached yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Entity ID</TableHead>
                <TableHead>Attached</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entities.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{e.entity_type}</TableCell>
                  <TableCell className="font-mono text-xs">{e.entity_id}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {e.created_at ? new Date(e.created_at).toLocaleString() : '—'}
                  </TableCell>
                  <TableCell>
                    {e.entity_type === 'conversation' && (
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/chat/threads/$threadId" params={{ threadId: e.entity_id }} search={{ caseId }}>
                          View thread
                        </Link>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

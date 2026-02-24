
export const dynamic = 'force-dynamic';
import { getAuditLogs } from '@/features/finance/actions/queries';
import { AuditLogEntry } from '@/features/finance/models/finance.model';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function FinanceAuditPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const resolvedParams = await searchParams;
  const cursor_created_at = resolvedParams.cursor_created_at;
  const cursor_id = resolvedParams.cursor_id;
  
  const cursor = cursor_created_at && cursor_id ? { created_at: cursor_created_at, id: cursor_id } : undefined;

  const result = await getAuditLogs({ limit: 50 }, cursor);
  if (!result.success) throw new Error(result.error);
  const { data: logs, nextCursor } = result.data;

  // Helper local component for pagination
  const PaginationControls = () => (
    <div className="flex items-center justify-end space-x-2 py-4 px-4 border-t">
      <Button
        variant="outline"
        size="sm"
        asChild
        disabled={!cursor_id}
      >
        <Link href={cursor_id ? '?' : '#'}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
        </Link>
      </Button>
      {nextCursor && (
        <Button
          variant="outline"
          size="sm"
          asChild
        >
          <Link href={`?cursor_created_at=${nextCursor.created_at}&cursor_id=${nextCursor.id}`}>
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-card">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Security Audit Trail</h3>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Metadata</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length > 0 ? (
                logs.map((log: AuditLogEntry) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{log.actor_user_id?.slice(0, 8)}...</TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.action}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      {log.related_entity_type && (
                        <span>{log.related_entity_type}: <span className="font-mono">{log.related_entity_id?.slice(0, 8)}</span></span>
                      )}
                      {log.journal_entry_id && (
                        <span>journal: <span className="font-mono">{log.journal_entry_id?.slice(0, 8)}</span></span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">
                      <pre className="max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap bg-muted p-1 rounded">
                        {JSON.stringify(log.meta)}
                      </pre>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No audit logs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <PaginationControls />
      </div>
    </div>
  );
}

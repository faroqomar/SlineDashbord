'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Link } from '@tanstack/react-router';
import type { WalletActivityEntry } from '@sline/shared';
import { getStatusBadgeClass } from '../models/finance.model';

interface WalletActivityTableProps {
  data: WalletActivityEntry[];
}

export function WalletActivityTable({ data }: WalletActivityTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Journal ID</TableHead>
            <TableHead>Event Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Counterparty</TableHead>
            <TableHead className="text-right">Gross</TableHead>
            <TableHead className="text-right">Net</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((entry) => (
              <TableRow key={entry.journal_entry_id}>
                <TableCell className="font-mono text-xs">
                  <Link
                    to="/finance/transactions/$journalId"
                    params={{ journalId: entry.journal_entry_id }}
                    className="text-primary hover:underline"
                  >
                    {entry.journal_entry_id.slice(0, 8)}...
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{entry.event_type}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStatusBadgeClass(entry.status)}>
                    {entry.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {entry.counterparty_user_id ? `${entry.counterparty_user_id.slice(0, 8)}...` : '—'}
                </TableCell>
                <TableCell className="text-right font-mono">{entry.amount_gross}</TableCell>
                <TableCell className="text-right font-mono font-medium">{entry.amount_net}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(entry.created_at).toLocaleString()}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                No wallet activity.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

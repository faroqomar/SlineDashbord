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
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { JournalLedgerEntry, TransactionCursor, TransactionFilters, getStatusBadgeClass } from '../models/finance.model';
import { TransactionTraceDrawer } from './TransactionTraceDrawer';
import { useTransactionsVM } from '../viewmodels/useTransactions.vm';

interface TransactionsTableProps {
  initialData: JournalLedgerEntry[];
  nextCursor?: TransactionCursor;
  filters: TransactionFilters;
}

export function TransactionsTable({ initialData, nextCursor, filters }: TransactionsTableProps) {
  const vm = useTransactionsVM(nextCursor, filters);

  return (
    <div className="space-y-4">
      {/* Filter Info Bar */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Ledger Transactions</h3>
          {vm.hasActiveFilters && (
            <Badge variant="secondary" className="ml-2">
              <Filter className="h-3 w-3 mr-1" /> Filters Active
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          {vm.hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={vm.clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Journal ID</TableHead>
              <TableHead>Event Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payer / Payee</TableHead>
              <TableHead className="text-right">Gross</TableHead>
              <TableHead className="text-right">Fee</TableHead>
              <TableHead className="text-right">Net</TableHead>
              <TableHead>Date</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.length > 0 ? (
              initialData.map((txn) => (
                <TableRow key={txn.journal_id} className="hover:bg-muted/50 cursor-pointer" onClick={() => vm.selectTransaction(txn.journal_id)}>
                  <TableCell className="font-mono text-xs">{txn.journal_id.slice(0, 8)}...</TableCell>
                  <TableCell>
                    <Badge variant="outline">{txn.event_type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusBadgeClass(txn.status)}>
                      {txn.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div><span className="text-muted-foreground mr-1">Fr:</span> {txn.payer_user_id ? txn.payer_user_id.slice(0, 8) + '...' : 'System'}</div>
                    <div><span className="text-muted-foreground mr-1">To:</span> {txn.payee_user_id ? txn.payee_user_id.slice(0, 8) + '...' : 'System'}</div>
                  </TableCell>
                  <TableCell className="text-right font-mono">{txn.gross_amount}</TableCell>
                  <TableCell className="text-right font-mono text-destructive">{txn.fee_amount > 0 ? `-${txn.fee_amount}` : '0'}</TableCell>
                  <TableCell className="text-right font-mono font-medium">{txn.net_amount}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(txn.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); vm.selectTransaction(txn.journal_id); }}>
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4 px-4 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.history.back()}
          disabled={!vm.canGoBack}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={vm.goNextPage}
          disabled={!nextCursor}
        >
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {vm.selectedTxnId && (
        <TransactionTraceDrawer 
          journalId={vm.selectedTxnId} 
          open={!!vm.selectedTxnId} 
          onOpenChange={(open: boolean) => !open && vm.clearSelection()} 
        />
      )}
    </div>
  );
}

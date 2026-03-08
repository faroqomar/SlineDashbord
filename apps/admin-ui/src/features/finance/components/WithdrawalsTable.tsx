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
import { ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { WithdrawalRequest, getStatusBadgeClass } from '../models/finance.model';
import { useWithdrawalsVM } from '../viewmodels/useWithdrawals.vm';
import { useRouter } from '@/lib/navigation-shim';

interface WithdrawalsTableProps {
  initialData: WithdrawalRequest[];
  nextCursor?: { created_at: string; id: string };
  statusFilter?: string;
}

export function WithdrawalsTable({ initialData, nextCursor, statusFilter }: WithdrawalsTableProps) {
  const vm = useWithdrawalsVM(nextCursor);
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Withdrawal Requests</h3>
          {statusFilter && (
            <Badge variant="secondary" className="ml-2">
              Status: {statusFilter}
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
           <Button variant={statusFilter === 'requested' ? 'default' : 'outline'} size="sm" onClick={() => router.push('?status=requested')}>
            Pending
          </Button>
          <Button variant={!statusFilter ? 'default' : 'outline'} size="sm" onClick={() => router.push('/finance/withdrawals')}>
            All
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request ID</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.length > 0 ? (
              initialData.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-mono text-xs">{req.id.slice(0, 8)}...</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{req.user_id}</TableCell>
                  <TableCell className="font-medium">{req.amount} {req.currency}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(req.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusBadgeClass(req.status)}>
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {req.status === 'requested' || req.status === 'processing' ? (
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                          disabled={vm.processingId === req.id}
                          onClick={() => vm.approveItem(req.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          disabled={vm.processingId === req.id}
                          onClick={() => vm.rejectItem(req.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">No actions</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No withdrawal requests found.
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
    </div>
  );
}

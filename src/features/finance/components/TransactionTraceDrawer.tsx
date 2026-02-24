'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Loader2, Eye, ShieldAlert } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTransactionTraceVM } from '../viewmodels/useTransactionTrace.vm';
import { getStatusBadgeClass } from '../models/finance.model';

interface TransactionTraceDrawerProps {
  journalId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionTraceDrawer({ journalId, open, onOpenChange }: TransactionTraceDrawerProps) {
  const vm = useTransactionTraceVM(journalId, open);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Transaction Trace</SheetTitle>
          <SheetDescription>
            Audit view for journal entry {journalId.split('-')[0]}
          </SheetDescription>
        </SheetHeader>

        {vm.isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : vm.error ? (
          <div className="flex h-40 flex-col items-center justify-center text-destructive">
            <ShieldAlert className="h-8 w-8 mb-2" />
            <p className="text-sm font-medium">{vm.error}</p>
          </div>
        ) : vm.data ? (
          <ScrollArea className="h-[calc(100vh-8rem)] mt-6 pr-4">
            <div className="space-y-6">
              {/* Header Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Event Type</div>
                  <Badge variant="outline" className="font-medium">{vm.data.event_type}</Badge>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Status</div>
                  <Badge variant="secondary" className={getStatusBadgeClass(vm.data.status)}>
                    {vm.data.status}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-muted-foreground mb-1">Date</div>
                  <div className="font-mono text-sm">{new Date(vm.data.created_at).toLocaleString()}</div>
                </div>
              </div>

              {/* Financials */}
              <div className="rounded-md border p-4 space-y-3 bg-secondary/10">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-2">Financials</h4>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Gross Amount</span>
                  <span className="font-mono">{vm.data.gross_amount} IQD</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Fee Amount</span>
                  <span className="font-mono text-destructive">-{vm.data.fee_amount} IQD</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium pt-2 border-t">
                  <span>Net Amount</span>
                  <span className="font-mono">{vm.data.net_amount} IQD</span>
                </div>
              </div>

              {/* Entities */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Related Entities</h4>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex flex-col gap-1 pb-2 border-b border-border/50">
                    <span className="text-muted-foreground text-xs">Payer ID</span>
                    <span className="font-mono text-xs">{vm.data.payer_user_id || 'System (Platform)'}</span>
                  </div>
                  <div className="flex flex-col gap-1 pb-2 border-b border-border/50">
                    <span className="text-muted-foreground text-xs">Payee ID</span>
                    <span className="font-mono text-xs">{vm.data.payee_user_id || 'System (Platform)'}</span>
                  </div>
                  {vm.data.entity_type && (
                    <div className="flex flex-col gap-1 pb-2 border-b border-border/50">
                      <span className="text-muted-foreground text-xs">{vm.data.entity_type} ID</span>
                      <span className="font-mono text-xs">{vm.data.entity_id}</span>
                    </div>
                  )}
                  {vm.data.initiator_user_id && (
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground text-xs">Initiator (Actor)</span>
                      <span className="font-mono text-xs">{vm.data.initiator_user_id}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Metadata</h4>
                  {vm.isUnmasked && (
                    <Badge variant="outline" className="text-xs"><Eye className="h-3 w-3 mr-1"/> Unmasked View</Badge>
                  )}
                </div>
                
                <div className="rounded-md bg-muted p-4">
                  <pre className="text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all">
                    {JSON.stringify(vm.data.meta_full || vm.data.meta_masked || {}, null, 2)}
                  </pre>
                </div>
                {!vm.isUnmasked && (
                  <p className="text-xs text-muted-foreground italic flex items-center gap-1">
                    <ShieldAlert className="h-3 w-3" />
                    Sensitive metadata is masked for your role. Contact a Super Admin for access.
                  </p>
                )}
              </div>
            </div>
          </ScrollArea>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

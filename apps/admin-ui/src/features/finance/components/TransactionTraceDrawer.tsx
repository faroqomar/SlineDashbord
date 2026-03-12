'use client';

import { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Loader2, ShieldAlert } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTransactionTraceVM } from '../viewmodels/useTransactionTrace.vm';
import { TransactionDetailContent } from './TransactionDetailContent';

interface TransactionTraceDrawerProps {
  journalId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionTraceDrawer({ journalId, open, onOpenChange }: TransactionTraceDrawerProps) {
  const [revealRequested, setRevealRequested] = useState(false);
  const vm = useTransactionTraceVM(journalId, open, revealRequested);

  useEffect(() => {
    if (!open) {
      setRevealRequested(false);
    }
  }, [open, journalId]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Transaction Details</SheetTitle>
          <SheetDescription>
            Clear money flow, entity context, and audit metadata for journal entry {journalId.split('-')[0]}
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
            <TransactionDetailContent
              detail={vm.data}
              isUnmasked={vm.isUnmasked}
              onReveal={vm.isUnmasked ? undefined : () => setRevealRequested(true)}
              revealLoading={vm.isLoading && revealRequested}
            />
          </ScrollArea>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

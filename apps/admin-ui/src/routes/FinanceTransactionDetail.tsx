'use client';

import { useEffect, useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useTransactionDetailVM } from '@/features/finance/viewmodels/useTransactionDetail.vm';
import { TransactionDetailContent } from '@/features/finance/components/TransactionDetailContent';

export function FinanceTransactionDetailPage() {
  const params = useParams({ strict: false });
  const journalId = (params as { journalId?: string }).journalId ?? '';
  const vm = useTransactionDetailVM();
  const [revealRequested, setRevealRequested] = useState(false);
  const [revealDialogOpen, setRevealDialogOpen] = useState(false);

  useEffect(() => {
    if (journalId) vm.load(journalId, revealRequested);
  }, [journalId, revealRequested]);

  if (!journalId) {
    return (
      <div className="p-6 text-muted-foreground">
        <Link to="/finance/transactions">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to transactions
          </Button>
        </Link>
        <p className="mt-4">Missing journal ID.</p>
      </div>
    );
  }

  if (vm.loading && !vm.detail) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        Loading transaction…
      </div>
    );
  }

  if (vm.error && !vm.detail) {
    return (
      <div className="space-y-4 p-6">
        <Link to="/finance/transactions">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to transactions
          </Button>
        </Link>
        <div className="rounded-md border bg-card p-6 text-center text-destructive font-medium">
          {vm.error}
        </div>
      </div>
    );
  }

  const d = vm.detail;
  if (!d) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 p-6">
      <div className="flex items-center gap-4">
        <Link to="/finance/transactions">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to transactions
          </Button>
        </Link>
      </div>

      <div className="rounded-md border bg-card p-6">
        <TransactionDetailContent
          detail={d}
          isUnmasked={'meta_full' in d && d.meta_full != null}
          onReveal={() => setRevealDialogOpen(true)}
          revealLoading={revealRequested && vm.loading}
        />
      </div>

      <AlertDialog open={revealDialogOpen} onOpenChange={setRevealDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reveal sensitive metadata?</AlertDialogTitle>
            <AlertDialogDescription>
              This action is logged in the audit trail. Only proceed if you need to inspect the full raw transaction metadata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setRevealRequested(true);
                setRevealDialogOpen(false);
              }}
            >
              Reveal
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Loader2, ArrowLeft, Eye, ShieldAlert } from 'lucide-react';
import { useTransactionDetailVM } from '@/features/finance/viewmodels/useTransactionDetail.vm';
import { getStatusBadgeClass } from '@/features/finance/models/finance.model';

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

  const hasMetaFull = 'meta_full' in d && d.meta_full != null;

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

      <div className="rounded-md border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Transaction detail</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Journal ID</span>
            <p className="font-mono">{d.journal_id}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Event type</span>
            <p><Badge variant="outline">{d.event_type}</Badge></p>
          </div>
          <div>
            <span className="text-muted-foreground">Status</span>
            <p><Badge className={getStatusBadgeClass(d.status)}>{d.status}</Badge></p>
          </div>
          <div>
            <span className="text-muted-foreground">Date</span>
            <p>{new Date(d.created_at).toLocaleString()}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Gross / Fee / Net</span>
            <p className="font-mono">{d.gross_amount} / {d.fee_amount} / {d.net_amount}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Metadata</h4>
          {hasMetaFull ? (
            <pre className="text-xs font-mono bg-muted p-4 rounded overflow-x-auto">
              {JSON.stringify(d.meta_full, null, 2)}
            </pre>
          ) : (
            <>
              <p className="text-xs text-muted-foreground italic flex items-center gap-1 mb-2">
                <ShieldAlert className="h-3 w-3" />
                Sensitive metadata is masked. Reveal requires audit log.
              </p>
              {!revealRequested && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRevealDialogOpen(true)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Reveal sensitive (audit logged)
                  </Button>
                  <AlertDialog open={revealDialogOpen} onOpenChange={setRevealDialogOpen}>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reveal sensitive metadata?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action is logged in the audit trail. Only proceed if you need to view full transaction metadata.
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
                </>
              )}
              {revealRequested && vm.loading && <Loader2 className="h-4 w-4 animate-spin" />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

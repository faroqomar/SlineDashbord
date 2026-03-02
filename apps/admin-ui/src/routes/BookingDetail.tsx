import React, { useEffect, useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { ArrowLeft, CalendarCheck, DollarSign, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
import { useBookingsViewModel } from '../features/bookings/viewmodels/use_bookings_viewmodel';
import { cn } from '@/lib/utils';

export function BookingDetailPage() {
  const { bookingId } = useParams({ from: '/bookings/$bookingId' } as any);
  const vm = useBookingsViewModel();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [refundReason, setRefundReason] = useState('');

  useEffect(() => {
    if (bookingId) vm.loadDetail(bookingId);
  }, [bookingId]);

  const handleCancelConfirm = async () => {
    if (!bookingId || !cancelReason.trim()) return;
    const ok = await vm.cancel(bookingId, cancelReason.trim());
    if (ok) {
      setCancelDialogOpen(false);
      setCancelReason('');
    }
  };

  const handleRefundConfirm = async () => {
    if (!bookingId || !refundReason.trim()) return;
    const ok = await vm.refund(bookingId, refundReason.trim());
    if (ok) {
      setRefundDialogOpen(false);
      setRefundReason('');
    }
  };

  const b = vm.selectedBooking;
  const canCancel = b && !['canceled', 'refunded'].includes(b.status);
  const canRefund = b && !['refunded'].includes(b.status);

  if (vm.isLoadingDetail && !b) {
    return (
      <div className="flex justify-center min-h-[400px] items-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!b) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Booking not found</h2>
        <Link to="/bookings">
          <Button variant="link" className="mt-4">Back to bookings</Button>
        </Link>
      </div>
    );
  }

  const statusColor = (s: string) => {
    if (s === 'canceled' || s === 'refunded') return 'bg-red-500/10 text-red-500 border-red-500/20';
    if (s === 'completed' || s === 'delivered') return 'bg-green-500/10 text-green-500 border-green-500/20';
    if (s === 'active' || s === 'confirmed') return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    return 'bg-secondary text-secondary-foreground';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/bookings">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </Link>
          <div className="h-4 w-[1px] bg-border hidden sm:block" />
          <div>
            <h1 className="text-xl font-bold tracking-tight">Booking</h1>
            <p className="text-xs text-muted-foreground font-mono">{b.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn('capitalize', statusColor(b.status))}>
            {b.status.replace('_', ' ')}
          </Badge>
          {canCancel && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => { setCancelReason(''); setCancelDialogOpen(true); }}
              disabled={vm.isMutating}
            >
              Cancel booking
            </Button>
          )}
          {canRefund && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setRefundReason(''); setRefundDialogOpen(true); }}
              disabled={vm.isMutating}
            >
              Refund
            </Button>
          )}
        </div>
      </div>

      {vm.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{vm.error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-primary" />
              Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className="capitalize">{b.status.replace('_', ' ')}</span>
              <span className="text-muted-foreground">Payment</span>
              <span className="capitalize">{b.payment_status ?? '—'}</span>
              <span className="text-muted-foreground">Price</span>
              <span>{b.price != null ? b.price.toLocaleString() : '—'}</span>
              <span className="text-muted-foreground">Created</span>
              <span>{new Date(b.created_at).toLocaleString()}</span>
              {b.completed_at && (
                <>
                  <span className="text-muted-foreground">Completed</span>
                  <span>{new Date(b.completed_at).toLocaleString()}</span>
                </>
              )}
            </div>
            {b.task_id && (
              <div className="pt-2 border-t">
                <span className="text-muted-foreground text-sm">Task ID</span>
                <p className="font-mono text-xs mt-1">{b.task_id}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Parties
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Client</span>
              <p className="font-mono text-xs truncate">{b.client_id}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Provider</span>
              <p className="font-mono text-xs truncate">{b.provider_id}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cancel confirmation */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Please provide a reason for the cancellation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-2">
            <Label htmlFor="cancel-reason">Reason (required)</Label>
            <Textarea
              id="cancel-reason"
              className="mt-1"
              placeholder="e.g. User request, policy violation"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep booking</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); handleCancelConfirm(); }}
              disabled={!cancelReason.trim() || vm.isMutating}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {vm.isMutating ? 'Canceling…' : 'Cancel booking'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Refund confirmation */}
      <AlertDialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Refund this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the booking as refunded and process the refund. Please provide a reason.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-2">
            <Label htmlFor="refund-reason">Reason (required)</Label>
            <Textarea
              id="refund-reason"
              className="mt-1"
              placeholder="e.g. Service not delivered, dispute resolution"
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); handleRefundConfirm(); }}
              disabled={!refundReason.trim() || vm.isMutating}
            >
              {vm.isMutating ? 'Processing…' : 'Confirm refund'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

import { useBookingsViewModel } from '../features/bookings/viewmodels/use_bookings_viewmodel';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function BookingsPage() {
  const vm = useBookingsViewModel();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bookings</h2>
          <p className="text-muted-foreground mt-1">
            Manage bookings, cancellations, and refunds.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => vm.fetchList(vm.filters)}
          disabled={vm.isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${vm.isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {vm.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{vm.error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <Select
              value={vm.filters.status ?? 'all'}
              onValueChange={(v) => vm.changeFilters({ status: v === 'all' ? undefined : v, page: 1 })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {vm.isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vm.bookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No bookings found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    vm.bookings.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell className="font-mono text-xs">
                          {b.id.slice(0, 8)}…
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">
                            {b.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize text-muted-foreground">
                          {b.payment_status ?? '—'}
                        </TableCell>
                        <TableCell>{b.price != null ? b.price.toLocaleString() : '—'}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(b.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate({ to: `/bookings/${b.id}` as any })}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-muted-foreground">
                  Showing {vm.bookings.length} of {vm.count} bookings
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={vm.filters.page === 1 || vm.isLoading}
                    onClick={() => vm.changeFilters({ page: (vm.filters.page ?? 1) - 1 })}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={(vm.filters.page ?? 1) >= vm.totalPages || vm.isLoading}
                    onClick={() => vm.changeFilters({ page: (vm.filters.page ?? 1) + 1 })}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

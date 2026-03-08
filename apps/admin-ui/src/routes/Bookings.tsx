import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { AlertCircle, CalendarDays, ChevronLeft, ChevronRight, Clock3, CreditCard, Filter, MapPin, MessageSquare, Phone, RefreshCw, Search, Smartphone } from 'lucide-react';
import type { BookingRow } from '@sline/shared';

import { useBookingsViewModel } from '../features/bookings/viewmodels/use_bookings_viewmodel';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import {
  BOOKING_STATUS_CHIPS,
  type BookingStatusChip,
  type BookingDisplayProjection,
  getBookingAppPreviewMock,
} from '../features/bookings/models/bookings-ui.mock';

const STATUS_TAB_TO_API: Record<BookingStatusChip, string | undefined> = {
  all: undefined,
  completed: 'completed',
  in_progress: 'in_progress',
  pending: 'pending',
  canceled: 'canceled',
  refunded: 'refunded',
};

function toStatusChip(status: string | undefined): BookingStatusChip {
  if (!status) return 'all';
  if (status === 'completed') return 'completed';
  if (status === 'in_progress') return 'in_progress';
  if (status === 'pending') return 'pending';
  if (status === 'canceled') return 'canceled';
  if (status === 'refunded') return 'refunded';
  return 'all';
}

function bookingStatusLabel(status: string): string {
  if (status === 'in_progress') return 'In Progress';
  return status.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function bookingStatusTone(status: string): string {
  if (status === 'completed' || status === 'delivered' || status === 'active' || status === 'confirmed') {
    return 'border-[#1b9e4b]/40 bg-[#0f2518] text-[#20d26d]';
  }
  if (status === 'in_progress' || status === 'paid_request_pending') {
    return 'border-[#c37e08]/40 bg-[#271a07] text-[#f5b335]';
  }
  if (status === 'pending') {
    return 'border-[#0f5f8c]/40 bg-[#081f30] text-[#27b0ff]';
  }
  if (status === 'canceled' || status === 'expired_unanswered') {
    return 'border-[#ad2a2a]/40 bg-[#2a0b0d] text-[#ff6565]';
  }
  if (status === 'refunded') {
    return 'border-[#6b44cb]/40 bg-[#22143c] text-[#b591ff]';
  }
  return 'border-[#3f3b36] bg-[#1a1e26] text-[#c8c4bc]';
}

function paymentTone(status: string | null): string {
  if (status === 'released') return 'border-[#1b9e4b]/40 bg-[#0f2518] text-[#20d26d]';
  if (status === 'held') return 'border-[#0f5f8c]/40 bg-[#081f30] text-[#27b0ff]';
  if (status === 'refunded') return 'border-[#6b44cb]/40 bg-[#22143c] text-[#b591ff]';
  return 'border-[#4a4338]/40 bg-[#201910] text-[#c9ac70]';
}

function paymentLabel(status: string | null): string {
  if (!status) return 'Pending';
  return status.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatIqd(value: number | null): string {
  return `IQD${(value ?? 0).toLocaleString()}`;
}

function initialsFromText(value: string): string {
  const parts = value
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return 'NA';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
}

function providerShortName(providerName: string, fallback: string | null | undefined): string {
  const normalizedFallback = (fallback ?? '').trim();
  if (normalizedFallback) return normalizedFallback;
  return providerName.split(/\s+/)[0] ?? providerName;
}

function bookingDisplayFromRow(booking: BookingRow): BookingDisplayProjection {
  const bookingCode = (booking.booking_code ?? '').trim() || `BK-${booking.id.replace(/-/g, '').slice(0, 6).toUpperCase()}`;
  const serviceTitle = (booking.service_title ?? '').trim() || `Service ${booking.task_id?.slice(0, 6) ?? booking.id.slice(0, 6)}`;
  const category = (booking.category_label ?? '').trim() || 'General';
  const clientName = (booking.client_display_name ?? '').trim() || `Client ${booking.client_id.slice(0, 6)}`;
  const providerName = (booking.provider_display_name ?? '').trim() || `Provider ${booking.provider_id.slice(0, 6)}`;
  const providerShort = providerShortName(providerName, booking.provider_short_name);

  return {
    bookingCode,
    serviceTitle,
    category,
    clientName,
    providerName,
    clientInitials: initialsFromText(clientName),
    providerInitials: initialsFromText(providerName),
    providerShort,
  };
}

function MiniSparkline({ points, color }: { points: number[]; color: string }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = Math.max(1, max - min);
  const width = 72;
  const height = 20;
  const path = points
    .map((point, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * width;
      const y = height - ((point - min) / span) * height;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  return (
    <svg aria-hidden className="h-5 w-[72px]" viewBox={`0 0 ${width} ${height}`}>
      <polyline
        fill="none"
        points={path}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function HeroTrend({ booked, completed, isLoading }: { booked: number[]; completed: number[]; isLoading: boolean }) {
  if (isLoading) {
    return <Skeleton className="h-16 w-[220px] bg-[#1b2029]" />;
  }

  if (booked.length !== 7 || completed.length !== 7) {
    return <Skeleton className="h-16 w-[220px] bg-[#1b2029]" />;
  }

  const width = 220;
  const height = 64;
  const topPadding = 10;
  const bottomPadding = 10;
  const max = Math.max(...booked, ...completed, 1);
  const min = Math.min(...booked, ...completed, 0);
  const span = Math.max(1, max - min);
  const chartHeight = height - topPadding - bottomPadding;

  const toPath = (points: number[]) =>
    points
      .map((point, index) => {
        const x = (index / Math.max(points.length - 1, 1)) * width;
        const y = topPadding + chartHeight - ((point - min) / span) * chartHeight;
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(' ');

  const bookedPath = toPath(booked);
  const completedPath = toPath(completed);

  return (
    <svg aria-hidden className="h-16 w-[220px]" viewBox={`0 0 ${width} ${height}`}>
      <polyline
        fill="none"
        points={bookedPath}
        stroke="#2df0b2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <polyline
        fill="none"
        points={completedPath}
        stroke="#9c7df9"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      {booked.map((value, index) => {
        const x = (index / Math.max(booked.length - 1, 1)) * width;
        const y = topPadding + chartHeight - ((value - min) / span) * chartHeight;
        return <circle key={`booked-${index}`} cx={x} cy={y} fill="#2df0b2" r="1.7" />;
      })}
      {completed.map((value, index) => {
        const x = (index / Math.max(completed.length - 1, 1)) * width;
        const y = topPadding + chartHeight - ((value - min) / span) * chartHeight;
        return <circle key={`completed-${index}`} cx={x} cy={y} fill="#9c7df9" r="1.7" />;
      })}
    </svg>
  );
}

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-[14px] border border-[#7f7668] bg-[#0a0d12]">
      <div className="border-b border-[#3f3b36] px-4 py-3">
        <Skeleton className="h-4 w-[320px] bg-[#1b2029]" />
      </div>
      <div className="space-y-3 px-4 py-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={`booking-skeleton-${index}`} className="grid grid-cols-7 gap-3 rounded-xl border border-[#2b2b2f] p-3">
            <Skeleton className="h-9 bg-[#1b2029]" />
            <Skeleton className="h-7 bg-[#1b2029]" />
            <Skeleton className="h-7 bg-[#1b2029]" />
            <Skeleton className="h-7 bg-[#1b2029]" />
            <Skeleton className="h-7 bg-[#1b2029]" />
            <Skeleton className="h-7 bg-[#1b2029]" />
            <Skeleton className="h-7 bg-[#1b2029]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function AppPreviewSkeleton() {
  return (
    <div className="rounded-[14px] border border-[#7f7668] bg-[#0a0d12] p-4">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-5 w-56 bg-[#1b2029]" />
        <Skeleton className="h-5 w-14 bg-[#1b2029]" />
      </div>
      <div className="mx-auto w-[334px] max-w-full rounded-[34px] border border-[#6b6357] bg-[#07090c] p-3">
        <Skeleton className="mx-auto mb-3 h-4 w-20 bg-[#1b2029]" />
        <Skeleton className="mb-3 h-40 w-full rounded-xl bg-[#1b2029]" />
        <Skeleton className="mb-3 h-20 w-full rounded-xl bg-[#1b2029]" />
        <Skeleton className="h-16 w-full rounded-xl bg-[#1b2029]" />
      </div>
    </div>
  );
}

export function BookingsPage() {
  const vm = useBookingsViewModel();
  const navigate = useNavigate();
  const [queryInput, setQueryInput] = useState(vm.filters.q ?? '');
  const [viewMode, setViewMode] = useState<'table' | 'app'>('table');
  const [previewIndex, setPreviewIndex] = useState(0);

  const statusChip = toStatusChip(vm.filters.status);

  const rows = useMemo(() => {
    return vm.bookings.map((booking) => ({
      booking,
      display: bookingDisplayFromRow(booking),
    }));
  }, [vm.bookings]);

  useEffect(() => {
    const normalized = queryInput.trim();
    const current = vm.filters.q ?? '';
    if (normalized === current) return;

    const timeoutId = window.setTimeout(() => {
      vm.changeFilters({ q: normalized || undefined, page: 1 });
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [queryInput, vm.changeFilters, vm.filters.q]);

  useEffect(() => {
    if (previewIndex >= rows.length) {
      setPreviewIndex(0);
    }
  }, [rows.length, previewIndex]);

  useEffect(() => {
    setPreviewIndex(0);
  }, [viewMode, vm.filters.q, vm.filters.status, vm.filters.page]);

  const activePreview = rows[previewIndex] ?? null;
  const previewMock = activePreview
    ? getBookingAppPreviewMock(activePreview.booking, activePreview.display)
    : null;

  const activeFilterCount = Number(Boolean((vm.filters.q ?? '').trim())) + Number(Boolean(vm.filters.status));

  const statusChipsLabel = BOOKING_STATUS_CHIPS;

  return (
    <div className="space-y-4 text-[#e8e6e3]">
      <section
        className="relative overflow-hidden rounded-[16px] border border-[#5837a8] p-5 md:p-6"
        style={{
          background:
            'linear-gradient(169deg, rgb(21, 10, 37) 0%, rgb(12, 18, 34) 40%, rgb(18, 8, 32) 100%)',
        }}
      >
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#4c3a7d] bg-[#1a1330]">
              <CalendarDays className="h-6 w-6 text-[#9c7df9]" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Bookings</h2>
              <p className="mt-1 text-sm text-[#afa89d]">Manage service bookings, payments, cancellations & refunds</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="border-[#3c3753] bg-[#1f1d2d] text-[11px] text-[#afa89d]">
              {vm.isHeroSeriesMock ? 'Hero fallback' : 'Hero live'}
            </Badge>
            <Badge className="border-[#3c3753] bg-[#1f1d2d] text-[11px] text-[#afa89d]">
              {vm.kpiCards.some((card) => card.isMock) ? 'KPI fallback' : 'KPI live'}
            </Badge>
            <Button
              variant="outline"
              onClick={() => {
                void vm.refreshBookings();
              }}
              disabled={vm.isLoading || vm.isHeroLoading || vm.isKpisLoading}
              className="h-10 border-[#43404f] bg-[rgba(24,26,27,0.15)] text-[#cecac4] hover:bg-[#212431]"
            >
              <RefreshCw className={cn('mr-2 h-4 w-4', (vm.isLoading || vm.isHeroLoading || vm.isKpisLoading) && 'animate-spin')} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="relative z-10 mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-5 text-xs text-[#9d9588]">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#220576]" />
              Booked
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#2df0b2]" />
              Completed
            </span>
            <span>Last 7 days</span>
          </div>
          <HeroTrend
            booked={vm.heroBookedSeries}
            completed={vm.heroCompletedSeries}
            isLoading={vm.isHeroLoading}
          />
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {vm.kpiCards.map((card) => {
          const color =
            card.tone === 'green'
              ? '#20d26d'
              : card.tone === 'amber'
              ? '#f5b335'
              : card.tone === 'red'
              ? '#ff5454'
              : '#9c7df9';

          return (
            <Card key={card.id} className="border-[#7f7668] bg-[#0a0d12] text-[#e8e6e3]">
              <CardContent className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg border border-[#34323c] bg-[#141821]" />
                  <MiniSparkline points={card.sparkline} color={color} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[1.6px] text-[#8f877b]">{card.label}</p>
                  <div className="mt-1 flex items-end gap-2">
                    <p className="text-4xl font-semibold leading-none">{card.value}</p>
                    <p className="pb-1 text-sm font-semibold" style={{ color }}>
                      {card.delta}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="space-y-3 rounded-[14px] border border-[#7f7668] bg-[#0a0d12] p-3">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8f877b]" />
            <Input
              value={queryInput}
              onChange={(event) => setQueryInput(event.target.value)}
              placeholder="Search by service, booking #, client, provider, or category..."
              className="h-10 border-[#5a5348] bg-[#080a0f] pl-9 text-[#cecac4] placeholder:text-[#7d766b]"
            />
          </div>

          <Button
            variant="outline"
            className="h-10 border-[#5a5348] bg-[#11141a] px-3 text-[#cecac4] hover:bg-[#181d25]"
            disabled
          >
            <Filter className="mr-1.5 h-4 w-4" />
            {activeFilterCount}
          </Button>

          <div className="inline-flex rounded-xl border border-[#5a5348] bg-[#0f1218] p-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                'h-8 rounded-lg px-4 text-[#999287] hover:bg-[#191d25] hover:text-[#d4d0cb]',
                viewMode === 'table' && 'bg-[#1a2030] text-[#e8e6e3]'
              )}
              onClick={() => setViewMode('table')}
            >
              Table
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                'h-8 rounded-lg px-4 text-[#999287] hover:bg-[#191d25] hover:text-[#d4d0cb]',
                viewMode === 'app' && 'bg-[#1a2030] text-[#e8e6e3]'
              )}
              onClick={() => setViewMode('app')}
            >
              <Smartphone className="mr-1.5 h-4 w-4" />
              App View
            </Button>
          </div>
        </div>

        <p className="px-1 text-[11px] text-[#8f877b]">
          Table labels are live from booking metadata; app preview details are mocked until preview API is available.
        </p>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="shrink-0 pr-1 text-[12px] text-[#9d9588]">Status</span>
          {statusChipsLabel.map((chip) => {
            const selected = chip.value === statusChip;
            return (
              <Button
                key={chip.value}
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => vm.changeFilters({ status: STATUS_TAB_TO_API[chip.value], page: 1 })}
                className={cn(
                  'h-7 rounded-lg border border-transparent px-3 text-[12px] text-[#9f988d] hover:bg-[#171b24] hover:text-[#dfdbd5]',
                  selected && 'border-[#373741] bg-[#171d27] text-[#ece8e2]'
                )}
              >
                {chip.label}
              </Button>
            );
          })}
        </div>
      </section>

      {vm.error && (
        <Alert variant="destructive" className="border-red-900/40 bg-red-950/20 text-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{vm.error}</AlertDescription>
        </Alert>
      )}

      {viewMode === 'table' ? (
        vm.isLoading ? (
          <TableSkeleton />
        ) : rows.length === 0 ? (
          <div className="rounded-[14px] border border-[#7f7668] bg-[#0a0d12] px-6 py-16 text-center">
            <p className="text-lg font-semibold text-[#e8e6e3]">No bookings found</p>
            <p className="mt-2 text-sm text-[#9d9588]">Try clearing search or changing status filter.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[14px] border border-[#7f7668] bg-[#0a0d12]">
            <Table>
              <TableHeader className="bg-[#0e1117]">
                <TableRow className="border-[#3f3b36] hover:bg-transparent">
                  <TableHead className="text-[#8f877b]">Service</TableHead>
                  <TableHead className="text-[#8f877b]">Status</TableHead>
                  <TableHead className="text-[#8f877b]">Payment</TableHead>
                  <TableHead className="text-[#8f877b]">Price</TableHead>
                  <TableHead className="text-[#8f877b]">Client</TableHead>
                  <TableHead className="text-[#8f877b]">Created</TableHead>
                  <TableHead className="text-[#8f877b]">Provider</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(({ booking, display }) => (
                  <TableRow
                    key={booking.id}
                    className="cursor-pointer border-[#3f3b36] hover:bg-[#111620]"
                    onClick={() => navigate({ to: `/bookings/${booking.id}` as never })}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#131722] text-[#9f988d]">
                          <Clock3 className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <p className="font-medium text-[#ece8e2]">{display.serviceTitle}</p>
                          <p className="text-[11px] text-[#8f877b]">
                            {display.bookingCode} 
                            <span className="mx-1.5">•</span>
                            {display.category}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('gap-1 border text-[11px]', bookingStatusTone(booking.status))}>
                        {bookingStatusLabel(booking.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('gap-1 border text-[11px]', paymentTone(booking.payment_status))}>
                        <CreditCard className="h-3 w-3" />
                        {paymentLabel(booking.payment_status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-[#d8d4ce]">{formatIqd(booking.price)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#16283f] text-[9px] font-semibold text-[#69b9ff]">
                          {display.clientInitials}
                        </div>
                        <span className="text-sm text-[#c8c4bc]">{display.clientName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-[#b1aaa0]">
                      {new Date(booking.created_at).toLocaleDateString('en-US')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0f2d25] text-[9px] font-semibold text-[#37e3a8]">
                            {display.providerInitials}
                          </div>
                          <span className="text-sm text-[#c8c4bc]">{display.providerShort}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="xs"
                          className="text-[#9d9588] hover:bg-[#1b202a] hover:text-[#ece8e2]"
                          onClick={(event) => {
                            event.stopPropagation();
                            navigate({ to: `/bookings/${booking.id}` as never });
                          }}
                        >
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )
      ) : vm.isLoading ? (
        <AppPreviewSkeleton />
      ) : !activePreview || !previewMock ? (
        <div className="rounded-[14px] border border-[#7f7668] bg-[#0a0d12] px-6 py-16 text-center">
          <p className="text-lg font-semibold text-[#e8e6e3]">No preview data</p>
          <p className="mt-2 text-sm text-[#9d9588]">Switch to table view or adjust filters to inspect a booking.</p>
        </div>
      ) : (
        <section className="overflow-hidden rounded-[14px] border border-[#7f7668] bg-[#0a0d12] p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#9c7df9]" />
              <p className="text-sm font-medium text-[#d8d4ce]">App Preview</p>
              <span className="text-xs text-[#8f877b]">Browse bookings as users see them</span>
              <Badge className="border-[#3a3449] bg-[#1a1726] text-[10px] text-[#afa89d]">Mock</Badge>
            </div>
            <p className="text-sm text-[#b3ada3]">
              {previewIndex + 1}/{rows.length}
            </p>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8 rounded-full border border-[#2b2e36] bg-[#0e1118] text-[#9d9588] hover:bg-[#181d27]"
              onClick={() => setPreviewIndex((current) => (current === 0 ? rows.length - 1 : current - 1))}
              disabled={rows.length <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8 rounded-full border border-[#2b2e36] bg-[#0e1118] text-[#9d9588] hover:bg-[#181d27]"
              onClick={() => setPreviewIndex((current) => (current + 1) % rows.length)}
              disabled={rows.length <= 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="mx-auto w-[334px] max-w-full rounded-[34px] border border-[#6b6357] bg-[#07090c] p-3">
            <div className="mx-auto mb-2 h-1.5 w-28 rounded-full bg-[#222433]" />
            <div className="mb-3 flex items-center justify-between border-b border-[#34343b] px-2 pb-2">
              <p className="text-sm font-semibold">Booking Details</p>
              <p className="text-[11px] text-[#8f877b]">{activePreview.display.bookingCode}</p>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-[#384457] bg-[#0f1521] p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-lg font-semibold text-[#efebe6]">{previewMock.title}</p>
                  <Badge variant="outline" className={cn('text-[11px]', bookingStatusTone(activePreview.booking.status))}>
                    {bookingStatusLabel(activePreview.booking.status)}
                  </Badge>
                </div>
                <div className="mb-2 flex flex-wrap items-center gap-3 text-xs text-[#b1aaa0]">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {previewMock.location}
                  </span>
                  <span>{activePreview.display.category}</span>
                </div>
                <p className="mb-3 text-xs leading-5 text-[#b1aaa0]">{previewMock.description}</p>
                <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-[#c4beb3]">
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" />
                    {previewMock.dateLabel}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-3 w-3" />
                    {previewMock.timeLabel}
                  </span>
                  <span>{previewMock.durationLabel}</span>
                </div>

                <div className="rounded-xl border border-[#38373d] bg-[#080d15] p-2 text-sm">
                  <div className="mb-1 flex items-center justify-between text-[#afa89d]">
                    <span>Service Price</span>
                    <span>{previewMock.servicePriceLabel}</span>
                  </div>
                  <div className="mb-1 flex items-center justify-between text-[#afa89d]">
                    <span>Platform Fee</span>
                    <span>{previewMock.platformFeeLabel}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between font-semibold text-[#2df0b2]">
                    <span>Total</span>
                    <span>{previewMock.totalLabel}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#38373d] bg-[#0f131c] p-3">
                <p className="mb-2 text-sm font-semibold">Participants</p>
                <div className="space-y-2">
                  {previewMock.participants.map((participant) => (
                    <div key={`${participant.role}-${participant.name}`} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#12324d] text-[10px] font-semibold text-[#69b9ff]">
                          {participant.initials}
                        </div>
                        <div>
                          <p className="text-sm text-[#dedad4]">{participant.name}</p>
                          <p className="text-[11px] text-[#8f877b]">
                            {participant.role} 
                            <span className="mx-1">•</span>
                            {participant.rating.toFixed(1)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button type="button" variant="ghost" size="icon-xs" className="h-7 w-7 rounded-lg border border-[#2e3138] bg-[#131824] text-[#9d9588]">
                          <Phone className="h-3.5 w-3.5" />
                        </Button>
                        <Button type="button" variant="ghost" size="icon-xs" className="h-7 w-7 rounded-lg border border-[#2e3138] bg-[#131824] text-[#9d9588]">
                          <MessageSquare className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#38373d] bg-[#0f131c] p-3">
                <p className="mb-2 text-sm font-semibold">Booking Timeline</p>
                <div className="space-y-2">
                  {previewMock.timeline.map((item) => (
                    <div key={item.label} className="flex items-start gap-2">
                      <span
                        className={cn(
                          'mt-1.5 h-2 w-2 rounded-full',
                          item.tone === 'done' ? 'bg-[#0f5f8c]' : 'bg-[#c37e08]'
                        )}
                      />
                      <div>
                        <p className="text-sm text-[#dedad4]">{item.label}</p>
                        <p className="text-[11px] text-[#8f877b]">{item.dateTime}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#38373d] bg-[#0f131c] p-3">
                <p className="mb-1 text-sm font-semibold">Admin Notes</p>
                <p className="text-xs italic text-[#afa89d]">{previewMock.notes}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-[#8f877b]">
          Showing {rows.length} of {vm.count} bookings
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={(vm.filters.page ?? 1) === 1 || vm.isLoading}
            onClick={() => vm.changeFilters({ page: (vm.filters.page ?? 1) - 1 })}
            className="border-[#5a5348] bg-[#0f1218] text-[#cecac4] hover:bg-[#181d25]"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={(vm.filters.page ?? 1) >= vm.totalPages || vm.isLoading}
            onClick={() => vm.changeFilters({ page: (vm.filters.page ?? 1) + 1 })}
            className="border-[#5a5348] bg-[#0f1218] text-[#cecac4] hover:bg-[#181d25]"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

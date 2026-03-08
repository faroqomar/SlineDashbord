import type { BookingRow } from '@sline/shared';

export type BookingStatusChip = 'all' | 'completed' | 'in_progress' | 'pending' | 'canceled' | 'refunded';

export interface BookingStatusChipOption {
  value: BookingStatusChip;
  label: string;
}

export const BOOKING_STATUS_CHIPS: BookingStatusChipOption[] = [
  { value: 'all', label: 'All' },
  { value: 'completed', label: 'Completed' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'pending', label: 'Pending' },
  { value: 'canceled', label: 'Canceled' },
  { value: 'refunded', label: 'Refunded' },
];

export interface BookingKpiCardMock {
  id: 'total_bookings' | 'completed' | 'revenue' | 'canceled';
  label: string;
  value: string;
  delta: string;
  sparkline: number[];
  tone: 'violet' | 'green' | 'amber' | 'red';
  isMock: true;
}

export const BOOKING_KPI_MOCK_CARDS: BookingKpiCardMock[] = [
  {
    id: 'total_bookings',
    label: 'Total Bookings',
    value: '12',
    delta: '+22%',
    sparkline: [24, 26, 25, 31, 29, 34],
    tone: 'violet',
    isMock: true,
  },
  {
    id: 'completed',
    label: 'Completed',
    value: '5',
    delta: '+4',
    sparkline: [18, 20, 22, 23, 19, 24],
    tone: 'green',
    isMock: true,
  },
  {
    id: 'revenue',
    label: 'Revenue',
    value: '230K',
    delta: '+31%',
    sparkline: [15, 18, 17, 21, 20, 23],
    tone: 'amber',
    isMock: true,
  },
  {
    id: 'canceled',
    label: 'Canceled',
    value: '2',
    delta: '-2',
    sparkline: [22, 19, 17, 21, 16, 14],
    tone: 'red',
    isMock: true,
  },
];

export const HERO_BOOKED_SERIES_MOCK = [13, 16, 12, 20, 11, 15, 14] as const;
export const HERO_COMPLETED_SERIES_MOCK = [10, 14, 18, 9, 14, 12, 13] as const;

const LOCATIONS = [
  'Baghdad, Al-Jadriya',
  'Erbil, Ankawa',
  'Basra, Al-Ashar',
  'Najaf, Al-Hanana',
  'Mosul, Al-Zuhur',
  'Sulaymaniyah, Salim Street',
] as const;

const DURATIONS = ['2 hours', '3 hours', '4 hours', '5 hours', '6 hours'] as const;

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 33 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export interface BookingDisplayProjection {
  bookingCode: string;
  serviceTitle: string;
  category: string;
  clientName: string;
  providerName: string;
  clientInitials: string;
  providerInitials: string;
  providerShort: string;
}

export interface BookingParticipantMock {
  name: string;
  initials: string;
  role: 'client' | 'provider';
  rating: number;
  isMock: true;
}

export interface BookingTimelineMock {
  label: string;
  dateTime: string;
  tone: 'done' | 'pending';
  isMock: true;
}

export interface BookingAppPreviewMock {
  title: string;
  location: string;
  description: string;
  dateLabel: string;
  timeLabel: string;
  durationLabel: string;
  servicePriceLabel: string;
  platformFeeLabel: string;
  totalLabel: string;
  participants: BookingParticipantMock[];
  timeline: BookingTimelineMock[];
  notes: string;
  isMock: true;
}

export function getBookingAppPreviewMock(
  booking: BookingRow,
  display: BookingDisplayProjection,
): BookingAppPreviewMock {
  const createdDate = new Date(booking.created_at);
  const hash = hashString(booking.id);
  const duration = DURATIONS[hash % DURATIONS.length];
  const location = LOCATIONS[hash % LOCATIONS.length];
  const servicePrice = booking.price ?? 0;
  const platformFee = Math.round(servicePrice * 0.1);
  const total = servicePrice + platformFee;

  const dateLabel = Number.isNaN(createdDate.getTime())
    ? 'Mar 6, 2026'
    : createdDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

  const timeLabel = Number.isNaN(createdDate.getTime())
    ? '8:00 AM'
    : createdDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });

  return {
    title: display.serviceTitle,
    location,
    description: `Complete service flow preview for ${display.serviceTitle.toLowerCase()} with quality checks and live updates.`,
    dateLabel,
    timeLabel,
    durationLabel: duration,
    servicePriceLabel: `IQD ${servicePrice.toLocaleString()}`,
    platformFeeLabel: `IQD ${platformFee.toLocaleString()}`,
    totalLabel: `IQD ${total.toLocaleString()}`,
    participants: [
      {
        name: display.clientName,
        initials: display.clientInitials,
        role: 'client',
        rating: 4.6,
        isMock: true,
      },
      {
        name: display.providerName,
        initials: display.providerInitials,
        role: 'provider',
        rating: 4.9,
        isMock: true,
      },
    ],
    timeline: [
      {
        label: 'Booking created',
        dateTime: `${dateLabel} ${timeLabel}`,
        tone: 'done',
        isMock: true,
      },
      {
        label: 'Awaiting provider confirmation',
        dateTime: `${dateLabel} ${timeLabel}`,
        tone: 'pending',
        isMock: true,
      },
    ],
    notes: 'Mock note: Premium package selected. Client prefers a morning slot.',
    isMock: true,
  };
}

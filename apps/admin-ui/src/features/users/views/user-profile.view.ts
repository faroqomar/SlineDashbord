import type { UserDetailsDTO } from '../services/users_api';
import type { UserInvestigationResponse } from '@sline/shared';
import type { JournalLedgerEntry, WalletSummary } from '@/features/finance/models/finance.model';

export type UserProfileStatus = UserDetailsDTO['status'];

export type UserProfileActionKind = 'suspend' | 'ban' | 'unban' | 'forceLogout';

export interface UserProfileActionModel {
  kind: UserProfileActionKind;
  label: string;
  requiresReason: boolean;
  danger: boolean;
  enabledByStatus: UserProfileStatus[];
}

export interface UserProfileActionConfig extends UserProfileActionModel {
  confirmTitle: string;
  confirmDescription: string;
  confirmLabel: string;
  reasonLabel: string;
  reasonPlaceholder: string;
  reasonOptional: boolean;
  buttonClassName: string;
  disabledReason: string;
}

export interface ResolvedUserProfileAction extends UserProfileActionConfig {
  isEnabled: boolean;
}

export interface UserProfileTenderItem {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  kind: 'task' | 'offer';
}

export interface UserProfileBookingItem {
  id: string;
  status: string;
  createdAt: string;
  taskId: string | null;
  relation: 'client' | 'provider' | 'unknown';
}

export interface UserProfileBucket<TItem> {
  key: string;
  label: string;
  items: TItem[];
}

const STATUS_TONE: Record<UserProfileStatus, { badgeClass: string; dotClass: string; label: string }> = {
  active: {
    badgeClass:
      'border-[#2cb562] bg-[#08190e] text-[#4ae081] shadow-[0px_0px_5px_0px_rgba(27,158,75,0.6)]',
    dotClass: 'bg-[#1b9e4b] shadow-[0px_0px_5px_0px_rgba(27,158,75,0.6)]',
    label: 'Active',
  },
  suspended: {
    badgeClass: 'border-[#c7952d] bg-[#22190a] text-[#f4be5c]',
    dotClass: 'bg-[#c7952d]',
    label: 'Suspended',
  },
  banned: {
    badgeClass: 'border-[#c63b3b] bg-[#2a0f12] text-[#f38b8b]',
    dotClass: 'bg-[#c63b3b]',
    label: 'Banned',
  },
};

const ACTION_MODELS: UserProfileActionConfig[] = [
  {
    kind: 'suspend',
    label: 'Suspend 24h',
    requiresReason: true,
    danger: false,
    enabledByStatus: ['active'],
    confirmTitle: 'Suspend this user for 24 hours?',
    confirmDescription:
      'Suspended users cannot access the platform until the suspension expires.',
    confirmLabel: 'Suspend User',
    reasonLabel: 'Suspension reason',
    reasonPlaceholder: 'Provide a reason (minimum 5 characters)',
    reasonOptional: false,
    buttonClassName:
      'border border-[#c7952d] bg-[#22190a] text-[#f4be5c] hover:bg-[#2f230d] disabled:opacity-40',
    disabledReason: 'Only active users can be suspended.',
  },
  {
    kind: 'ban',
    label: 'Ban User',
    requiresReason: true,
    danger: true,
    enabledByStatus: ['active', 'suspended'],
    confirmTitle: 'Permanently ban this user?',
    confirmDescription:
      'Banned users are blocked from signing in until manually unbanned by an admin.',
    confirmLabel: 'Ban User',
    reasonLabel: 'Ban reason',
    reasonPlaceholder: 'Provide a reason (minimum 5 characters)',
    reasonOptional: false,
    buttonClassName:
      'border border-[#c63b3b] bg-[#2a0f12] text-[#f38b8b] hover:bg-[#381419] disabled:opacity-40',
    disabledReason: 'User is already banned.',
  },
  {
    kind: 'unban',
    label: 'Unban User',
    requiresReason: false,
    danger: false,
    enabledByStatus: ['banned'],
    confirmTitle: 'Restore access for this user?',
    confirmDescription: 'This user will be able to sign in again immediately after unban.',
    confirmLabel: 'Unban User',
    reasonLabel: 'Unban note',
    reasonPlaceholder: 'Optional note for audit trail',
    reasonOptional: true,
    buttonClassName:
      'border border-[#2cb562] bg-[#08190e] text-[#4ae081] hover:bg-[#0d2515] disabled:opacity-40',
    disabledReason: 'Only banned users can be unbanned.',
  },
  {
    kind: 'forceLogout',
    label: 'Force Logout',
    requiresReason: false,
    danger: false,
    enabledByStatus: ['active', 'suspended', 'banned'],
    confirmTitle: 'Force logout this user now?',
    confirmDescription:
      'Current sessions will be invalidated and the user will need to authenticate again.',
    confirmLabel: 'Force Logout',
    reasonLabel: 'Logout reason',
    reasonPlaceholder: 'Optional reason for audit trail',
    reasonOptional: true,
    buttonClassName:
      'border border-[#7b7265] bg-[#151725] text-[#e8e6e3] hover:bg-[#1b2030] disabled:opacity-40',
    disabledReason: '',
  },
];

export function formatProfileValue(value: string | null | undefined): string {
  if (!value) return '--';
  const trimmed = value.trim();
  if (!trimmed) return '--';
  return trimmed;
}

export function formatProfileDate(value: string | null | undefined): string {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return date.toLocaleDateString();
}

export function formatProfileDateTime(value: string | null | undefined): string {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return date.toLocaleString();
}

export function formatRoleList(roles: string[]): string {
  if (!roles.length) return '--';
  return roles.join(', ');
}

export function getDisplayName(user: Pick<UserDetailsDTO, 'full_name' | 'email'>): string {
  const name = formatProfileValue(user.full_name);
  if (name !== '--') return name;
  const email = formatProfileValue(user.email);
  if (email !== '--') return email;
  return 'Unknown User';
}

export function getStatusTone(status: UserProfileStatus) {
  return STATUS_TONE[status];
}

export function resolveUserProfileActions(
  status: UserProfileStatus,
): ResolvedUserProfileAction[] {
  return ACTION_MODELS.map((action) => ({
    ...action,
    isEnabled: action.enabledByStatus.includes(status),
  }));
}

function normalizeStatus(value: string | undefined): string {
  return (value ?? '').toLowerCase();
}

function sortByCreatedAtDesc<T extends { createdAt: string }>(items: T[]): T[] {
  return [...items].sort((left, right) => {
    const leftTime = new Date(left.createdAt).getTime();
    const rightTime = new Date(right.createdAt).getTime();
    return (Number.isNaN(rightTime) ? 0 : rightTime) - (Number.isNaN(leftTime) ? 0 : leftTime);
  });
}

const TASK_TAKEN_STATUSES = new Set(['assigned', 'in_progress', 'review', 'completed']);
const TASK_CANCELED_STATUSES = new Set(['canceled']);
const REJECTED_KEYWORDS = ['reject', 'declin', 'expired'];
const BOOKING_CANCELED_STATUSES = new Set(['canceled', 'refunded']);
const BOOKING_REJECTED_STATUSES = new Set(['expired_unanswered']);
const BOOKING_ACTIVE_PROVIDER_STATUSES = new Set([
  'pending',
  'confirmed',
  'in_progress',
  'active',
  'delivered',
  'completed',
  'paid_request_pending',
]);

export function buildTenderBuckets(
  investigation: UserInvestigationResponse | undefined,
  userId: string,
): UserProfileBucket<UserProfileTenderItem>[] {
  if (!investigation) {
    return [
      { key: 'all-tenders', label: 'All Tenders', items: [] },
      { key: 'posted-tenders', label: 'Posted', items: [] },
      { key: 'assigned-tenders', label: 'Assigned', items: [] },
      { key: 'taken-tenders', label: 'Taken', items: [] },
      { key: 'canceled-tenders', label: 'Cancelled', items: [] },
      { key: 'rejected-offers', label: 'Rejected', items: [] },
    ];
  }

  const taskItems = investigation.tasks.map((task) => ({
    id: task.id,
    title: task.title ?? 'Untitled tender',
    status: normalizeStatus(task.status) || 'unknown',
    createdAt: task.created_at ?? '',
    kind: 'task' as const,
    taskType: task.task_type,
    ownerId: task.owner_id ?? '',
    assigneeId: task.assigned_freelancer_id ?? '',
  }));

  const tenders = taskItems.filter((item) => item.taskType === 'tender');
  const base = tenders.length > 0 ? tenders : taskItems;

  const rejectedOffers = investigation.offers
    .filter((offer) => {
      const status = normalizeStatus(offer.status);
      return REJECTED_KEYWORDS.some((keyword) => status.includes(keyword));
    })
    .map((offer) => ({
      id: offer.id,
      title: 'Offer',
      status: normalizeStatus(offer.status) || 'rejected',
      createdAt: offer.created_at ?? '',
      kind: 'offer' as const,
    }));

  return [
    {
      key: 'all-tenders',
      label: 'All Tenders',
      items: sortByCreatedAtDesc(base),
    },
    {
      key: 'posted-tenders',
      label: 'Posted',
      items: sortByCreatedAtDesc(base.filter((item) => item.ownerId === userId)),
    },
    {
      key: 'assigned-tenders',
      label: 'Assigned',
      items: sortByCreatedAtDesc(base.filter((item) => item.assigneeId === userId)),
    },
    {
      key: 'taken-tenders',
      label: 'Taken',
      items: sortByCreatedAtDesc(
        base.filter((item) => item.assigneeId === userId && TASK_TAKEN_STATUSES.has(item.status)),
      ),
    },
    {
      key: 'canceled-tenders',
      label: 'Cancelled',
      items: sortByCreatedAtDesc(base.filter((item) => TASK_CANCELED_STATUSES.has(item.status))),
    },
    {
      key: 'rejected-offers',
      label: 'Rejected',
      items: sortByCreatedAtDesc(rejectedOffers),
    },
  ];
}

export function buildBookingBuckets(
  investigation: UserInvestigationResponse | undefined,
  userId: string,
): UserProfileBucket<UserProfileBookingItem>[] {
  if (!investigation) {
    return [
      { key: 'all-bookings', label: 'All Bookings', items: [] },
      { key: 'posted-bookings', label: 'Posted', items: [] },
      { key: 'booked-bookings', label: 'Booked', items: [] },
      { key: 'taken-bookings', label: 'Taken', items: [] },
      { key: 'canceled-bookings', label: 'Cancelled / Deleted', items: [] },
      { key: 'rejected-bookings', label: 'Rejected', items: [] },
    ];
  }

  const bookings = investigation.bookings.map((booking) => {
    const status = normalizeStatus(booking.status);
    const relation: UserProfileBookingItem['relation'] =
      booking.client_id === userId ? 'client' : booking.provider_id === userId ? 'provider' : 'unknown';

    return {
      id: booking.id,
      status: status || 'unknown',
      createdAt: booking.created_at ?? '',
      taskId: booking.task_id ?? null,
      relation,
    };
  });

  return [
    {
      key: 'all-bookings',
      label: 'All Bookings',
      items: sortByCreatedAtDesc(bookings),
    },
    {
      key: 'posted-bookings',
      label: 'Posted',
      items: sortByCreatedAtDesc(bookings.filter((booking) => booking.relation === 'provider')),
    },
    {
      key: 'booked-bookings',
      label: 'Booked',
      items: sortByCreatedAtDesc(bookings.filter((booking) => booking.relation === 'client')),
    },
    {
      key: 'taken-bookings',
      label: 'Taken',
      items: sortByCreatedAtDesc(
        bookings.filter(
          (booking) =>
            booking.relation === 'provider' && BOOKING_ACTIVE_PROVIDER_STATUSES.has(booking.status),
        ),
      ),
    },
    {
      key: 'canceled-bookings',
      label: 'Cancelled / Deleted',
      items: sortByCreatedAtDesc(
        bookings.filter((booking) => BOOKING_CANCELED_STATUSES.has(booking.status)),
      ),
    },
    {
      key: 'rejected-bookings',
      label: 'Rejected',
      items: sortByCreatedAtDesc(
        bookings.filter((booking) => BOOKING_REJECTED_STATUSES.has(booking.status)),
      ),
    },
  ];
}

export function formatMoney(value: number | undefined, currency: string = 'IQD'): string {
  const amount = Number(value ?? 0);
  if (!Number.isFinite(amount)) return '--';
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'IQD' ? 0 : 2,
  }).format(amount);
}

export interface WalletSummaryCardValue {
  label: string;
  value: string;
}

export function buildWalletSummaryValues(wallet: WalletSummary | null): WalletSummaryCardValue[] {
  const currency = wallet?.currency ?? 'IQD';
  return [
    {
      label: 'Available Balance',
      value: wallet ? formatMoney(wallet.available_balance, currency) : '--',
    },
    {
      label: 'Held Balance',
      value: wallet ? formatMoney(wallet.held_balance, currency) : '--',
    },
    {
      label: 'Pending Withdrawals',
      value: wallet ? formatMoney(wallet.pending_withdrawal_balance, currency) : '--',
    },
    {
      label: 'Wallet Status',
      value: wallet ? (wallet.is_wallet_frozen ? 'Frozen' : 'Active') : '--',
    },
  ];
}

export function getLedgerAmount(entry: JournalLedgerEntry): number {
  const value = Number(entry.net_amount ?? entry.gross_amount ?? 0);
  return Number.isFinite(value) ? value : 0;
}

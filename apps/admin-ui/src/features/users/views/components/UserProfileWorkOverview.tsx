import { Link } from '@tanstack/react-router';
import {
  Briefcase,
  CalendarCheck2,
  Wallet,
  ArrowRightLeft,
  Clock3,
  ShieldAlert,
} from 'lucide-react';
import type { WalletSummary } from '@/features/finance/models/finance.model';
import { getWalletActivityAmount } from '@/features/finance/models/finance.model';
import type { WalletActivityEntry } from '@sline/shared';
import {
  buildBookingBuckets,
  buildTenderBuckets,
  buildWalletSummaryValues,
  formatProfileDate,
  type UserProfileBookingItem,
  type UserProfileBucket,
  type UserProfileTenderItem,
} from '../user-profile.view';
import type { UserInvestigationResponse } from '@sline/shared';

interface UserProfileWorkOverviewProps {
  userId: string;
  investigation: UserInvestigationResponse | undefined;
  isInvestigationLoading: boolean;
  investigationError: string | null;
  wallet: WalletSummary | null;
  walletTimeline: WalletActivityEntry[];
  isWalletLoading: boolean;
  walletError: string | null;
}

function getStatusPillClass(status: string): string {
  const value = status.toLowerCase();
  if (value === 'active' || value === 'in_progress' || value === 'completed' || value === 'delivered') {
    return 'border-[#2cb562] bg-[#08190e] text-[#4ae081]';
  }
  if (value === 'canceled' || value === 'refunded') {
    return 'border-[#c7952d] bg-[#22190a] text-[#f4be5c]';
  }
  if (value.includes('reject') || value.includes('expired') || value === 'banned') {
    return 'border-[#c63b3b] bg-[#2a0f12] text-[#f38b8b]';
  }
  return 'border-[#7b7265] bg-[#151725] text-[#b0a99f]';
}

function ItemCountPill({ value }: { value: number }) {
  return (
    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-[#2a3143] bg-[#151725] px-2 text-xs font-semibold text-[#e8e6e3]">
      {value}
    </span>
  );
}

function TenderBucket({ bucket }: { bucket: UserProfileBucket<UserProfileTenderItem> }) {
  return (
    <article className="rounded-[12px] border border-[#2a3143] bg-[#0d1119] p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs uppercase tracking-[0.08em] text-[#9d9588]">{bucket.label}</p>
        <ItemCountPill value={bucket.items.length} />
      </div>
      {bucket.items.length === 0 ? (
        <p className="text-xs text-[#7f7668]">No records.</p>
      ) : (
        <ul className="space-y-2">
          {bucket.items.slice(0, 6).map((item) => (
            <li key={`${bucket.key}-${item.kind}-${item.id}`} className="rounded-[10px] border border-[#1f2532] bg-[#0b0f17] p-2.5">
              <div className="flex items-center justify-between gap-2">
                {item.kind === 'task' ? (
                  <Link
                    to="/tasks/$taskId"
                    params={{ taskId: item.id }}
                    className="max-w-[200px] truncate text-sm font-medium text-[#d8e9ff] hover:underline"
                  >
                    {item.title}
                  </Link>
                ) : (
                  <span className="max-w-[200px] truncate text-sm font-medium text-[#d8e9ff]">
                    {item.title}
                  </span>
                )}
                <span className={`rounded-full border px-2 py-[1px] text-[11px] capitalize ${getStatusPillClass(item.status)}`}>
                  {item.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-[#9d9588]">{formatProfileDate(item.createdAt)}</p>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function BookingBucket({ bucket }: { bucket: UserProfileBucket<UserProfileBookingItem> }) {
  return (
    <article className="rounded-[12px] border border-[#2a3143] bg-[#0d1119] p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs uppercase tracking-[0.08em] text-[#9d9588]">{bucket.label}</p>
        <ItemCountPill value={bucket.items.length} />
      </div>
      {bucket.items.length === 0 ? (
        <p className="text-xs text-[#7f7668]">No records.</p>
      ) : (
        <ul className="space-y-2">
          {bucket.items.slice(0, 6).map((item) => (
            <li key={`${bucket.key}-${item.id}`} className="rounded-[10px] border border-[#1f2532] bg-[#0b0f17] p-2.5">
              <div className="flex items-center justify-between gap-2">
                <Link
                  to="/bookings/$bookingId"
                  params={{ bookingId: item.id }}
                  className="max-w-[200px] truncate text-sm font-medium text-[#d8e9ff] hover:underline"
                >
                  Booking #{item.id.slice(0, 8)}
                </Link>
                <span className={`rounded-full border px-2 py-[1px] text-[11px] capitalize ${getStatusPillClass(item.status)}`}>
                  {item.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-[#9d9588]">
                {item.relation === 'client' ? 'Booked by user' : item.relation === 'provider' ? 'Taken/posted by user' : 'Relation unknown'} · {formatProfileDate(item.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function WalletSummarySection({
  wallet,
  timeline,
  isLoading,
  error,
}: {
  wallet: WalletSummary | null;
  timeline: WalletActivityEntry[];
  isLoading: boolean;
  error: string | null;
}) {
  const summaryValues = buildWalletSummaryValues(wallet);

  return (
    <section className="rounded-[14px] border border-[#7f7668] bg-[#0a0d12] p-5">
      <div className="mb-4 flex items-center gap-2">
        <Wallet className="size-4 text-[#7ea2ff]" />
        <h3 className="text-base font-semibold text-[#e8e6e3]">Wallet Situation</h3>
      </div>

      {isLoading ? (
        <p className="text-sm text-[#9d9588]">Loading wallet data...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {summaryValues.map((entry) => (
              <article key={entry.label} className="rounded-[12px] border border-[#2a3143] bg-[#0d1119] p-3">
                <p className="text-[11px] uppercase tracking-[0.08em] text-[#9d9588]">{entry.label}</p>
                <p className="mt-1 text-sm font-semibold text-[#e8e6e3]">{entry.value}</p>
              </article>
            ))}
          </div>

          {error ? (
            <p className="mt-3 text-sm text-[#f4be5c]">{error}</p>
          ) : !wallet ? (
            <p className="mt-3 text-sm text-[#9d9588]">No wallet account found for this user yet.</p>
          ) : null}

          <div className="mt-4 rounded-[12px] border border-[#2a3143] bg-[#0d1119] p-3">
            <div className="mb-2 flex items-center gap-2">
              <ArrowRightLeft className="size-4 text-[#7ea2ff]" />
              <p className="text-xs uppercase tracking-[0.08em] text-[#9d9588]">Recent Wallet Activity</p>
            </div>
            {timeline.length === 0 ? (
              <p className="text-xs text-[#7f7668]">No wallet transactions.</p>
            ) : (
              <ul className="space-y-2">
                {timeline.slice(0, 8).map((entry) => (
                  <li key={entry.journal_entry_id} className="rounded-[10px] border border-[#1f2532] bg-[#0b0f17] p-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="max-w-[220px] truncate text-sm font-medium text-[#d8e9ff]">
                        {entry.event_type}
                      </span>
                      <span className={`rounded-full border px-2 py-[1px] text-[11px] capitalize ${getStatusPillClass(entry.status)}`}>
                        {entry.status}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-2 text-xs text-[#9d9588]">
                      <span>{formatProfileDate(entry.created_at)}</span>
                      <span>{getWalletActivityAmount(entry)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </section>
  );
}

export function UserProfileWorkOverview({
  userId,
  investigation,
  isInvestigationLoading,
  investigationError,
  wallet,
  walletTimeline,
  isWalletLoading,
  walletError,
}: UserProfileWorkOverviewProps) {
  const tenderBuckets = buildTenderBuckets(investigation, userId);
  const bookingBuckets = buildBookingBuckets(investigation, userId);

  return (
    <div className="space-y-4">
      <section className="rounded-[14px] border border-[#7f7668] bg-[#0a0d12] p-5">
        <div className="mb-4 flex items-center gap-2">
          <Briefcase className="size-4 text-[#7ea2ff]" />
          <h3 className="text-base font-semibold text-[#e8e6e3]">Tenders & Assignments</h3>
          <Clock3 className="ml-auto size-4 text-[#9d9588]" />
        </div>

        {isInvestigationLoading ? (
          <p className="text-sm text-[#9d9588]">Loading tender and assignment data...</p>
        ) : (
          <>
            {investigationError ? (
              <p className="mb-3 text-sm text-[#f4be5c]">
                {investigationError}. Showing available records only.
              </p>
            ) : null}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {tenderBuckets.map((bucket) => (
                <TenderBucket key={bucket.key} bucket={bucket} />
              ))}
            </div>
          </>
        )}
      </section>

      <section className="rounded-[14px] border border-[#7f7668] bg-[#0a0d12] p-5">
        <div className="mb-4 flex items-center gap-2">
          <CalendarCheck2 className="size-4 text-[#7ea2ff]" />
          <h3 className="text-base font-semibold text-[#e8e6e3]">Bookings Overview</h3>
          <ShieldAlert className="ml-auto size-4 text-[#9d9588]" />
        </div>

        {isInvestigationLoading ? (
          <p className="text-sm text-[#9d9588]">Loading booking data...</p>
        ) : (
          <>
            {investigationError ? (
              <p className="mb-3 text-sm text-[#f4be5c]">
                {investigationError}. Showing available records only.
              </p>
            ) : null}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {bookingBuckets.map((bucket) => (
                <BookingBucket key={bucket.key} bucket={bucket} />
              ))}
            </div>
          </>
        )}
      </section>

      <WalletSummarySection
        wallet={wallet}
        timeline={walletTimeline}
        isLoading={isWalletLoading}
        error={walletError}
      />
    </div>
  );
}

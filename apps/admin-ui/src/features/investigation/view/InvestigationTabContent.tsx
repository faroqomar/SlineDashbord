import React from 'react';
import { Link } from '@tanstack/react-router';
import { Eye } from 'lucide-react';
import type { UserInvestigationResponse, UserDetailRevealed } from '@sline/shared';
import type { UseMutationResult } from '@tanstack/react-query';

export type TabId = 'profile' | 'tasks' | 'offers' | 'bookings' | 'disputes' | 'finance' | 'reports' | 'conversations';

interface InvestigationTabContentProps {
  activeTab: TabId;
  investigation: UserInvestigationResponse;
  userId: string;
  revealedProfile: { email?: string | null; phone?: string | null } | null;
  canRevealPii: boolean;
  revealPiiMutation: UseMutationResult<UserDetailRevealed, Error, string, unknown>;
}

export function InvestigationTabContent({
  activeTab,
  investigation,
  userId,
  revealedProfile,
  canRevealPii,
  revealPiiMutation,
}: InvestigationTabContentProps) {
  const { profile, tasks, offers, bookings, disputes, ledgerActivity, reportsStub, conversationsSummary } =
    investigation;

  const profileRecord = profile as Record<string, unknown> | null;
  const emailDisplay =
    revealedProfile?.email !== undefined
      ? revealedProfile.email ?? '—'
      : profileRecord?.email === '[MASKED]'
        ? '[MASKED]'
        : (profileRecord?.email as string) ?? '[MASKED]';
  const phoneDisplay =
    revealedProfile?.phone !== undefined
      ? revealedProfile.phone ?? '—'
      : profileRecord?.phone === '[MASKED]'
        ? '[MASKED]'
        : (profileRecord?.phone as string) ?? '[MASKED]';

  switch (activeTab) {
    case 'profile':
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-slate-500 text-xs uppercase">Name</span>
              <p className="font-medium">{(profileRecord?.full_name as string) ?? '—'}</p>
            </div>
            <div>
              <span className="text-slate-500 text-xs uppercase">Account status</span>
              <p className="font-medium">{(profileRecord?.account_status as string) ?? '—'}</p>
            </div>
            <div>
              <span className="text-slate-500 text-xs uppercase">Email</span>
              <p className="font-medium">{emailDisplay}</p>
            </div>
            <div>
              <span className="text-slate-500 text-xs uppercase">Phone</span>
              <p className="font-medium">{phoneDisplay}</p>
            </div>
            <div>
              <span className="text-slate-500 text-xs uppercase">Joined</span>
              <p className="font-medium">
                {profileRecord?.created_at
                  ? new Date(profileRecord.created_at as string).toLocaleDateString()
                  : '—'}
              </p>
            </div>
          </div>
          {canRevealPii && (
            <div className="pt-2 border-t border-slate-700/50">
              <button
                onClick={() => {
                  const reason = window.prompt('Reason for revealing PII (required for audit):');
                  if (reason?.trim()) revealPiiMutation.mutate(reason.trim());
                }}
                disabled={revealPiiMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-amber-600/20 text-amber-400 border border-amber-500/30 hover:bg-amber-600/30 disabled:opacity-50"
              >
                <Eye size={16} />
                {revealPiiMutation.isPending ? 'Revealing…' : revealedProfile ? 'PII revealed' : 'Reveal PII'}
              </button>
              {revealPiiMutation.isError && (
                <p className="mt-2 text-sm text-rose-400">{revealPiiMutation.error?.message}</p>
              )}
            </div>
          )}
        </div>
      );
    case 'tasks':
      return tasks.length ? (
        <ul className="space-y-2">
          {tasks.slice(0, 20).map((t) => (
            <li key={t.id} className="flex justify-between py-2 border-b border-slate-700/50">
              <span className="font-mono text-sm">{t.id}</span>
              <span>{t.title ?? '—'}</span>
              <span className="text-slate-400 text-sm">{t.status}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-500 py-8 text-center">No tasks</p>
      );
    case 'offers':
      return offers.length ? (
        <ul className="space-y-2">
          {offers.map((o) => (
            <li key={o.id} className="py-2 border-b border-slate-700/50 font-mono text-sm">
              {o.id}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-500 py-8 text-center">No offers</p>
      );
    case 'bookings':
      return bookings.length ? (
        <ul className="space-y-2">
          {bookings.slice(0, 20).map((b) => (
            <li key={b.id} className="flex justify-between py-2 border-b border-slate-700/50">
              <span className="font-mono text-sm">{b.id}</span>
              <span className="text-slate-400 text-sm">{b.status}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-500 py-8 text-center">No bookings</p>
      );
    case 'disputes':
      return disputes.length ? (
        <ul className="space-y-2">
          {disputes.slice(0, 20).map((d) => (
            <li key={d.id} className="flex justify-between py-2 border-b border-slate-700/50">
              <span className="font-mono text-sm">{d.id}</span>
              <span className="text-slate-400 text-sm">{d.status}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-500 py-8 text-center">No disputes</p>
      );
    case 'finance':
      return ledgerActivity.length ? (
        <ul className="space-y-2">
          {ledgerActivity.slice(0, 20).map((e, i) => (
            <li key={e.id ?? i} className="flex justify-between py-2 border-b border-slate-700/50">
              <span className="font-mono text-sm">{e.id}</span>
              <span>{e.amount_cents != null ? `${e.amount_cents}¢` : '—'}</span>
              <span className="text-slate-400 text-sm">{e.related_entity_type}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-500 py-8 text-center">No ledger activity</p>
      );
    case 'reports':
      return (
        <div className="py-8 text-center">
          <p className="text-slate-500 mb-2">Reports: {reportsStub?.count ?? 0}</p>
          <Link to="/reports" className="text-blue-400 hover:underline">
            Open Reports queue
          </Link>
        </div>
      );
    case 'conversations':
      return conversationsSummary.length ? (
        <ul className="space-y-2">
          {conversationsSummary.slice(0, 20).map((c) => (
            <li key={c.threadId} className="flex justify-between py-2 border-b border-slate-700/50">
              <span className="font-mono text-sm">{c.threadId}</span>
              <span className="text-slate-400 text-sm">View in Chat (case required)</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-500 py-8 text-center">No conversations</p>
      );
    default:
      return null;
  }
}

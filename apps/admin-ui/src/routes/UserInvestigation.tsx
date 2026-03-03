import React, { useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { ArrowLeft, FileDown, User, ListTodo, Calendar, MessageSquare, AlertCircle, CreditCard, FileText } from 'lucide-react';
import { useUserInvestigation } from '../features/investigation/viewmodels/useUserInvestigation';
import { InvestigationTabContent, type TabId } from '../features/investigation/view/InvestigationTabContent';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'profile', label: 'Profile', icon: <User size={16} /> },
  { id: 'tasks', label: 'Tasks', icon: <ListTodo size={16} /> },
  { id: 'offers', label: 'Offers', icon: <FileText size={16} /> },
  { id: 'bookings', label: 'Bookings', icon: <Calendar size={16} /> },
  { id: 'disputes', label: 'Disputes', icon: <AlertCircle size={16} /> },
  { id: 'finance', label: 'Finance', icon: <CreditCard size={16} /> },
  { id: 'reports', label: 'Reports', icon: <FileText size={16} /> },
  { id: 'conversations', label: 'Conversations', icon: <MessageSquare size={16} /> },
];

export function UserInvestigationPage() {
  const { userId } = useParams({ from: '/users/$userId/investigation' as '/users/$userId/investigation' });
  const [activeTab, setActiveTab] = useState<TabId>('profile');

  const {
    investigation,
    isLoading,
    error,
    refetch,
    isSuccess,
    canRevealPii,
    revealedProfile,
    revealPiiMutation,
    evidencePackMutation,
  } = useUserInvestigation(userId);

  if (!userId) {
    return <div className="p-12 text-center text-rose-400">Invalid user.</div>;
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex items-center gap-4">
          <Link to="/users" className="p-2 glass rounded-full text-slate-400 hover:text-white transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div className="h-8 w-48 bg-slate-700/50 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {TABS.map((_, i) => (
            <div key={i} className="h-10 bg-slate-700/50 rounded animate-pulse" />
          ))}
        </div>
        <div className="glass-card min-h-[300px] flex items-center justify-center">
          <div className="text-slate-400">Loading investigation…</div>
        </div>
      </div>
    );
  }

  if (error || !isSuccess) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/users" className="p-2 glass rounded-full text-slate-400 hover:text-white transition-all">
            <ArrowLeft size={20} />
          </Link>
          <span className="text-slate-400">User Investigation</span>
        </div>
        <div className="glass-card p-8 text-center">
          <p className="text-rose-400 mb-4">{error instanceof Error ? error.message : 'Failed to load investigation'}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg text-white font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!investigation) {
    return <div className="p-12 text-center text-slate-400">No investigation data.</div>;
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/users" className="p-2 glass rounded-full text-slate-400 hover:text-white transition-all">
            <ArrowLeft size={20} />
          </Link>
          <Link to="/users/$userId" params={{ userId }} className="text-slate-400 hover:text-white text-sm">
            User detail
          </Link>
          <span className="text-slate-500">|</span>
          <h2 className="text-xl font-bold">Investigation</h2>
          <span className="font-mono text-xs text-slate-500">{userId}</span>
        </div>
        <button
          onClick={() => evidencePackMutation.mutate('json')}
          disabled={evidencePackMutation.isPending}
          className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-slate-200 hover:text-white transition-all disabled:opacity-50"
        >
          <FileDown size={18} />
          {evidencePackMutation.isPending ? 'Exporting…' : 'Evidence pack (JSON)'}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-700/50 pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="glass-card min-h-[280px] p-6">
        <InvestigationTabContent
          activeTab={activeTab}
          investigation={investigation}
          userId={userId}
          revealedProfile={revealedProfile}
          canRevealPii={canRevealPii}
          revealPiiMutation={revealPiiMutation}
        />
      </div>
    </div>
  );
}

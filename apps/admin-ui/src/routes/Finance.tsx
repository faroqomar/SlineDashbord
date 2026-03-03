import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { financeApi } from '../features/finance/services/finance_api';
import { Wallet, ArrowDownCircle, ArrowUpCircle, History, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FinancePage() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['finance', 'metrics'],
    queryFn: financeApi.getMetrics,
  });

  if (isLoading) return <div className="p-8 text-center animate-pulse">Loading financial summary...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold font-inter tracking-tight">Finance Dashboard</h2>
          <p className="text-muted-foreground mt-1">Monitor all platform metrics, transactions, and withdrawals.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/finance/approvals">
              <ListChecks className="mr-2 h-4 w-4" /> Approval queue
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/finance/withdrawals">
              <ListChecks className="mr-2 h-4 w-4" /> Manage Withdrawals
            </Link>
          </Button>
          <Button asChild variant="default">
            <Link to="/finance/transactions">
              <History className="mr-2 h-4 w-4" /> View Ledger
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 glass-card">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <History size={20} className="text-blue-500" />
            Quick Overview
          </h3>
          <div className="grid grid-cols-2 gap-4">
             <div className="p-6 rounded-lg bg-secondary/30 border border-border">
                <p className="text-sm text-muted-foreground font-medium mb-1">Lifetime Revenue</p>
                <p className="text-3xl font-mono font-bold text-primary">IQD {metrics?.lifetime_revenue?.toLocaleString() || '0'}</p>
             </div>
             <div className="p-6 rounded-lg bg-secondary/30 border border-border">
                <p className="text-sm text-muted-foreground font-medium mb-1">Escrow Held</p>
                <p className="text-3xl font-mono font-bold text-amber-500">IQD {metrics?.escrow_held?.toLocaleString() || '0'}</p>
             </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="glass-card bg-gradient-to-br from-blue-600/20 to-emerald-600/20 border-blue-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Wallet size={100} />
            </div>
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Available Platform Cash</h4>
            <p className="text-4xl font-bold font-mono tracking-tighter">IQD {metrics?.platform_cash?.toLocaleString() || '0'}</p>
            <div className="mt-6 flex gap-4">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-background/50 hover:bg-background/80 rounded-lg transition-colors text-sm font-bold border">
                <ArrowUpCircle size={16} /> Top-up
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-background/50 hover:bg-background/80 rounded-lg transition-colors text-sm font-bold border">
                <ArrowDownCircle size={16} /> Payout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { ReactNode } from 'react';
import Link from 'next/link';
import { NavLink } from './nav-link'; // IDE refresh trigger

export default function FinanceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Finance Intelligence</h2>
          <p className="text-muted-foreground">Monitor and manage platform transactions, wallets, and ledger.</p>
        </div>
        
        <nav className="flex items-center gap-4 border-b pb-2">
          <NavLink href="/dashboard/finance/overview">Overview</NavLink>
          <NavLink href="/dashboard/finance/transactions">Transactions</NavLink>
          <NavLink href="/dashboard/finance/withdrawals">Withdrawals</NavLink>
          <NavLink href="/dashboard/finance/users">Users</NavLink>
          <NavLink href="/dashboard/finance/audit">Audit Logs</NavLink>
        </nav>
      </div>
      
      <div>{children}</div>
    </div>
  );
}

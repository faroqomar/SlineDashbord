'use client';

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Loader2 } from 'lucide-react';
import { useFinanceUserLookupVM } from '@/features/finance/viewmodels/useFinanceUserLookup.vm';
import { UserWalletCard } from '@/features/finance/components/UserWalletCard';
import { TransactionsTable } from '@/features/finance/components/TransactionsTable';

export function FinanceUsersPage() {
  const [inputUserId, setInputUserId] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const id = inputUserId.trim();
    if (id) navigate({ to: '/finance/users/$userId', params: { userId: id } });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="rounded-md border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Search Wallet by User ID</h3>
        <form onSubmit={handleSearch} className="flex gap-2 max-w-lg">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="userId">User ID (UUID)</Label>
            <Input
              id="userId"
              placeholder="Enter UUID…"
              value={inputUserId}
              onChange={(e) => setInputUserId(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={!inputUserId.trim()}>
              <Search className="h-4 w-4 mr-2" />
              Lookup
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function FinanceUserLookupPage() {
  const params = useParams({ strict: false });
  const userId = (params as { userId?: string }).userId ?? '';
  const vm = useFinanceUserLookupVM();

  useEffect(() => {
    if (userId) {
      vm.setUserId(userId);
      vm.search();
    }
  }, [userId]);

  if (vm.loading && !vm.wallet && vm.timeline.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        Loading user finance…
      </div>
    );
  }

  if (vm.error && !vm.wallet && vm.timeline.length === 0) {
    return (
      <div className="rounded-md border bg-card p-6 text-center text-destructive font-medium">
        {vm.error}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {vm.wallet ? (
        <UserWalletCard userId={userId || vm.userId} wallet={vm.wallet} />
      ) : (
        <div className="rounded-md border p-6 text-center text-muted-foreground">
          No wallet found for this user.
        </div>
      )}

      {vm.timeline.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <div className="rounded-md border bg-card">
            <TransactionsTable
              initialData={vm.timeline}
              filters={{}}
            />
          </div>
        </div>
      )}
    </div>
  );
}

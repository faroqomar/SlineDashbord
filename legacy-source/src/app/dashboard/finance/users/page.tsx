import { getUserWalletSummary, getUserFinanceTimeline } from '@/features/finance/actions/queries';
import { UserWalletCard } from '@/features/finance/components/UserWalletCard';
import { TransactionsTable } from '@/features/finance/components/TransactionsTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function FinanceUsersPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const resolvedParams = await searchParams;
  const userId = resolvedParams.userId;

  async function searchUser(data: FormData) {
    'use server';
    const id = data.get('userId');
    if (id) {
      redirect(`/dashboard/finance/users?userId=${id}`);
    }
  }

  // If we have a user, fetch their stuff.
  let wallet = null;
  let timeline = null;

  if (userId) {
    try {
      const [walletResult, timelineResult] = await Promise.all([
        getUserWalletSummary(userId),
        getUserFinanceTimeline(userId, { limit: 20 })
      ]);
      wallet = walletResult.success ? walletResult.data : null;
      timeline = timelineResult.success ? timelineResult.data : null;
    } catch (e) {
      // User might not exist or no finance data
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-md border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Search Wallet by User ID</h3>
        <form action={searchUser} className="flex gap-2 max-w-lg">
          <Input 
            name="userId" 
            placeholder="Enter UUID..." 
            defaultValue={userId || ''} 
            required 
          />
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Lookup
          </Button>
        </form>
      </div>

      {userId && (
        <div className="space-y-6">
          {wallet ? (
            <UserWalletCard userId={userId} wallet={wallet} />
          ) : (
            <div className="rounded-md border p-6 text-center text-muted-foreground">
              No wallet found for this user.
            </div>
          )}

          {timeline && timeline.data.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <div className="rounded-md border bg-card">
                <TransactionsTable 
                  initialData={timeline.data} 
                  filters={{}} // Minimal mode, no filters needed for timeline view right now, or we can adapt TransactionsTable
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

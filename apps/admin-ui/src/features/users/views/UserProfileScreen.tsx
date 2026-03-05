import { useMemo, useState } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserProfileViewModel } from '../viewmodels/useUserProfileViewModel';
import {
  getDisplayName,
  resolveUserProfileActions,
  type UserProfileActionKind,
} from './user-profile.view';
import { UserProfileHero } from './components/UserProfileHero';
import { UserProfileIdentityCard } from './components/UserProfileIdentityCard';
import { UserProfileFactsGrid } from './components/UserProfileFactsGrid';
import { UserProfileActionsPanel } from './components/UserProfileActionsPanel';
import { UserActionReasonDialog } from './components/UserActionReasonDialog';
import { UserProfileWorkOverview } from './components/UserProfileWorkOverview';

function UserProfileLoadingState() {
  return (
    <div className="space-y-4 text-[#e8e6e3]">
      <div className="flex items-center gap-2 text-sm text-[#9d9588]">
        <Skeleton className="h-8 w-8 rounded-full bg-[#1e232d]" />
        <Skeleton className="h-4 w-16 bg-[#1e232d]" />
        <Skeleton className="h-4 w-2 bg-[#1e232d]" />
        <Skeleton className="h-4 w-16 bg-[#1e232d]" />
      </div>

      <section className="rounded-[14px] border border-[#7f7668] bg-[#0a0d12] p-6">
        <Skeleton className="h-5 w-20 bg-[#1e232d]" />
        <Skeleton className="mt-2 h-10 w-56 bg-[#1e232d]" />
        <Skeleton className="mt-2 h-4 w-72 bg-[#1e232d]" />
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
        <section className="rounded-[14px] border border-[#7f7668] bg-[#0a0d12] p-6">
          <div className="flex flex-col items-center gap-3">
            <Skeleton className="size-[84px] rounded-[20px] bg-[#1e232d]" />
            <Skeleton className="h-6 w-40 bg-[#1e232d]" />
            <Skeleton className="h-4 w-48 bg-[#1e232d]" />
          </div>
        </section>

        <div className="space-y-4">
          <section className="rounded-[14px] border border-[#7f7668] bg-[#0a0d12] p-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-[92px] rounded-[12px] bg-[#1e232d]" />
              ))}
            </div>
          </section>
          <section className="rounded-[14px] border border-[#7f7668] bg-[#0a0d12] p-5">
            <Skeleton className="h-10 w-full rounded-[10px] bg-[#1e232d]" />
            <Skeleton className="mt-3 h-10 w-full rounded-[10px] bg-[#1e232d]" />
          </section>
        </div>
      </div>
    </div>
  );
}

interface UserProfileErrorStateProps {
  message: string;
  onRetry: () => void;
}

function UserProfileErrorState({ message, onRetry }: UserProfileErrorStateProps) {
  return (
    <section className="rounded-[14px] border border-[#7f7668] bg-[#0a0d12] p-6 text-[#e8e6e3]">
      <h1 className="text-lg font-semibold">Failed to load user profile</h1>
      <p className="mt-2 text-sm text-[#f38b8b]">{message}</p>
      <div className="mt-4 flex gap-2">
        <Button
          type="button"
          onClick={onRetry}
          className="h-9 rounded-[10px] border border-[#7b7265] bg-[#151725] text-[#e8e6e3]"
        >
          Retry
        </Button>
        <Button
          type="button"
          asChild
          className="h-9 rounded-[10px] border border-[#7b7265] bg-[#151725] text-[#e8e6e3]"
        >
          <Link to="/users">Back to Users</Link>
        </Button>
      </div>
    </section>
  );
}

export function UserProfileScreen() {
  const params = useParams({ strict: false });
  const userId = (params as { userId?: string }).userId ?? '';
  const vm = useUserProfileViewModel(userId);
  const [selectedActionKind, setSelectedActionKind] = useState<UserProfileActionKind | null>(null);

  const user = vm.user;
  const displayName = user ? getDisplayName(user) : 'User Profile';

  const actions = useMemo(
    () => (user ? resolveUserProfileActions(user.status) : []),
    [user],
  );

  const selectedAction = useMemo(
    () => actions.find((action) => action.kind === selectedActionKind) ?? null,
    [actions, selectedActionKind],
  );

  const handleActionConfirm = async (reason?: string) => {
    if (!selectedAction) return false;
    const isSuccess = await vm.executeAction({ kind: selectedAction.kind, reason });
    if (isSuccess) {
      setSelectedActionKind(null);
    }
    return isSuccess;
  };

  if (vm.isLoading) {
    return <UserProfileLoadingState />;
  }

  if (!userId) {
    return (
      <section className="rounded-[14px] border border-[#7f7668] bg-[#0a0d12] p-6 text-[#e8e6e3]">
        <h1 className="text-lg font-semibold">Invalid user route</h1>
        <p className="mt-2 text-sm text-[#9d9588]">Unable to resolve the selected user id.</p>
        <Button
          type="button"
          asChild
          className="mt-4 h-9 rounded-[10px] border border-[#7b7265] bg-[#151725] text-[#e8e6e3]"
        >
          <Link to="/users">Back to Users</Link>
        </Button>
      </section>
    );
  }

  if (vm.error) {
    return (
      <UserProfileErrorState
        message={vm.error instanceof Error ? vm.error.message : 'Unexpected error'}
        onRetry={() => {
          void vm.refetch();
        }}
      />
    );
  }

  if (!user) {
    return (
      <section className="rounded-[14px] border border-[#7f7668] bg-[#0a0d12] p-6 text-[#e8e6e3]">
        <h1 className="text-lg font-semibold">User not found</h1>
        <p className="mt-2 text-sm text-[#9d9588]">The selected user record is not available.</p>
        <Button
          type="button"
          asChild
          className="mt-4 h-9 rounded-[10px] border border-[#7b7265] bg-[#151725] text-[#e8e6e3]"
        >
          <Link to="/users">Back to Users</Link>
        </Button>
      </section>
    );
  }

  return (
    <div className="space-y-4 text-[#e8e6e3]">
      <div className="flex items-center gap-2 text-sm text-[#9d9588]">
        <Link
          to="/users"
          className="inline-flex size-8 items-center justify-center rounded-full border border-[#7f7668] bg-[#0a0d12] text-[#e8e6e3] hover:bg-[#121722]"
          aria-label="Back to users"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <Link to="/" className="hover:text-[#e8e6e3]">Dashboard</Link>
        <ChevronRight className="size-3.5" />
        <Link to="/users" className="hover:text-[#e8e6e3]">Users</Link>
        <ChevronRight className="size-3.5" />
        <span className="text-[#e8e6e3]">View Profile</span>
      </div>

      <UserProfileHero
        userId={user.id}
        displayName={displayName}
        subtitle="Manage account identity and moderation status."
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
        <UserProfileIdentityCard user={user} displayName={displayName} />
        <div className="space-y-4">
          <UserProfileFactsGrid user={user} />
          <UserProfileActionsPanel
            actions={actions}
            isBusy={vm.isActionPending}
            pendingAction={vm.pendingAction}
            onSelectAction={setSelectedActionKind}
          />
          <UserProfileWorkOverview
            userId={user.id}
            investigation={vm.investigation}
            isInvestigationLoading={vm.isInvestigationLoading}
            investigationError={vm.investigationError}
            wallet={vm.wallet}
            walletTimeline={vm.walletTimeline}
            isWalletLoading={vm.isWalletLoading}
            walletError={vm.walletError}
          />
        </div>
      </div>

      <UserActionReasonDialog
        open={Boolean(selectedAction)}
        action={selectedAction}
        isSubmitting={vm.isActionPending}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setSelectedActionKind(null);
          }
        }}
        onConfirm={handleActionConfirm}
      />
    </div>
  );
}

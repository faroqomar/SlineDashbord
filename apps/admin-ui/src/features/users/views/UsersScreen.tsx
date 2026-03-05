'use client';

import { toast } from 'sonner';
import { useUsersViewModel } from '../viewmodels/useUsersViewModel';
import { useUsersInviteViewModel } from '../viewmodels/useUsersInviteViewModel';
import { getUsersKpiValues } from './users.view';
import { UsersHeroBanner } from './components/UsersHeroBanner';
import { UsersInviteDialog } from './components/UsersInviteDialog';
import { UsersKpiGrid } from './components/UsersKpiGrid';
import { UsersTable } from './components/UsersTable';
import { UsersToolbar } from './components/UsersToolbar';

export function UsersScreen() {
  const vm = useUsersViewModel();
  const inviteVm = useUsersInviteViewModel();
  const kpiValues = getUsersKpiValues(vm.totalUsers, vm.kpiCounts);

  const openInvite = () => {
    if (!inviteVm.canInvite) {
      toast.info(inviteVm.inviteDisabledReason);
      return;
    }
    inviteVm.setOpen(true);
  };

  const submitInvite = async () => {
    const invitedEmail = inviteVm.email.trim();
    const result = await inviteVm.submit();
    if (result.success) {
      toast.success(`Invite sent to ${invitedEmail}`);
      return;
    }
    toast.error('Failed to send invite', {
      description: result.error || 'Unknown error',
    });
  };

  return (
    <div className="space-y-4 text-[#e8e6e3]">
      <UsersHeroBanner
        onInvite={openInvite}
        inviteDisabled={!inviteVm.canInvite || inviteVm.isRoleLoading}
        inviteDisabledReason={inviteVm.inviteDisabledReason}
      />

      <UsersKpiGrid
        totalUsers={kpiValues.totalUsers}
        activeUsers={kpiValues.activeUsers}
        inactiveUsers={kpiValues.inactiveUsers}
        joinedThisMonth={kpiValues.joinedThisMonth}
      />

      <section className="overflow-hidden rounded-[14px] border border-[#7f7668] bg-[#0a0d12]">
        <UsersToolbar
          tab={vm.tab}
          query={vm.query}
          tabCounts={{
            all: vm.tabCounts.all,
            active: vm.tabCounts.active,
            inactive: vm.tabCounts.inactive,
          }}
          onTabChange={vm.setTab}
          onQueryChange={vm.setQuery}
        />
        <UsersTable
          users={vm.users}
          isLoading={vm.isLoading}
          error={vm.error}
          page={vm.page}
          totalPages={vm.totalPages}
          totalUsers={vm.totalUsers}
          onPageChange={vm.setPage}
        />
      </section>

      <UsersInviteDialog
        open={inviteVm.isOpen}
        onOpenChange={inviteVm.setOpen}
        fullName={inviteVm.fullName}
        email={inviteVm.email}
        role={inviteVm.role}
        isSubmitting={inviteVm.isSubmitting}
        submitError={inviteVm.submitError}
        onFullNameChange={inviteVm.setFullName}
        onEmailChange={inviteVm.setEmail}
        onRoleChange={inviteVm.setRole}
        onCancel={inviteVm.close}
        onSubmit={submitInvite}
      />
    </div>
  );
}

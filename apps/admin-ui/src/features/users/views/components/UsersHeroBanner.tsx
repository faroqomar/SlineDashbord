import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

interface UsersHeroBannerProps {
  onInvite: () => void;
  inviteDisabled: boolean;
  inviteDisabledReason: string;
}

export function UsersHeroBanner({
  onInvite,
  inviteDisabled,
  inviteDisabledReason,
}: UsersHeroBannerProps) {
  return (
    <section className="relative overflow-hidden rounded-[14px] border border-[#7f7668] bg-[linear-gradient(172deg,#0e0f13_0%,#151226_60%,#0e0f13_100%)] p-6">
      <div className="absolute -right-12 -top-20 size-[220px] rounded-full bg-[radial-gradient(circle,rgba(13,15,140,0.18)_0%,rgba(13,15,140,0)_70%)]" />
      <div className="relative flex items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm text-[#afa89d]">Platform</p>
          <h1 className="text-[38px] font-bold leading-[1.05] text-[#c7f8e5]">Users</h1>
          <p className="text-sm text-[#9d9588]">Manage and monitor platform participants.</p>
        </div>
        <Button
          type="button"
          onClick={onInvite}
          disabled={inviteDisabled}
          title={inviteDisabled ? inviteDisabledReason : undefined}
          className="h-10 rounded-[10px] border border-[#242989] bg-[linear-gradient(163deg,#0d0f8c_0%,#1d169c_100%)] px-4 text-sm font-medium text-[#e8e6e3] shadow-[0px_0px_20px_0px_rgba(13,15,140,0.2)] hover:opacity-95"
        >
          <UserPlus className="mr-2 size-4" />
          Invite User
        </Button>
      </div>
    </section>
  );
}

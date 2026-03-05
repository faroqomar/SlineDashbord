import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { UserDetailsDTO } from '../../services/users_api';
import { getStatusTone } from '../user-profile.view';

interface UserProfileIdentityCardProps {
  user: UserDetailsDTO;
  displayName: string;
}

function getInitials(value: string): string {
  const words = value.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'U';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0] ?? ''}${words[1][0] ?? ''}`.toUpperCase();
}

export function UserProfileIdentityCard({ user, displayName }: UserProfileIdentityCardProps) {
  const tone = getStatusTone(user.status);

  return (
    <aside className="rounded-[14px] border border-[#7f7668] bg-[#0a0d12] p-6">
      <div className="flex flex-col items-center text-center">
        <Avatar className="size-[84px] rounded-[20px] border border-[#2f3a55] bg-[#101724]">
          <AvatarImage src={user.avatar_url} alt={displayName} />
          <AvatarFallback className="rounded-[20px] bg-[#173ead] text-sm font-bold text-[#e8e6e3]">
            {getInitials(displayName)}
          </AvatarFallback>
        </Avatar>

        <h2 className="mt-4 text-[24px] font-semibold leading-tight text-[#e8e6e3]">{displayName}</h2>
        <p className="mt-1 text-sm text-[#9d9588]">{user.email || '--'}</p>
        <p className="mt-2 text-[11px] uppercase tracking-[0.08em] text-[#7f7668]">ID: {user.id}</p>

        <div className="mt-5 flex w-full flex-wrap items-center justify-center gap-2">
          <span className={`size-1.5 rounded-full ${tone.dotClass}`} />
          <Badge
            variant="outline"
            className={`rounded-full border px-2 py-0 text-xs font-medium ${tone.badgeClass}`}
          >
            {tone.label}
          </Badge>
          <Badge
            variant="outline"
            className="rounded-full border border-[#7b7265] bg-[#151725] px-2 py-0 text-xs text-[#b0a99f]"
          >
            {user.active_role || user.role}
          </Badge>
        </div>
      </div>
    </aside>
  );
}

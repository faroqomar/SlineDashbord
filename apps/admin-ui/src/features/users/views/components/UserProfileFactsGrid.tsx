import type { ComponentType } from 'react';
import {
  BadgeCheck,
  CalendarDays,
  Mail,
  Phone,
  Shield,
  UserCog,
} from 'lucide-react';
import type { UserDetailsDTO } from '../../services/users_api';
import {
  formatProfileDate,
  formatProfileDateTime,
  formatProfileValue,
  formatRoleList,
} from '../user-profile.view';

interface UserProfileFactsGridProps {
  user: UserDetailsDTO;
}

interface FactItem {
  key: string;
  label: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
}

function FactCard({ item }: { item: FactItem }) {
  const Icon = item.icon;

  return (
    <article className="rounded-[12px] border border-[#2a3143] bg-[#0d1119] p-4">
      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.08em] text-[#9d9588]">
        <Icon className="size-4 text-[#6f84ad]" />
        {item.label}
      </div>
      <p className="break-words text-sm font-medium text-[#e8e6e3]">{item.value}</p>
    </article>
  );
}

export function UserProfileFactsGrid({ user }: UserProfileFactsGridProps) {
  const facts: FactItem[] = [
    {
      key: 'email',
      label: 'Email',
      value: formatProfileValue(user.email),
      icon: Mail,
    },
    {
      key: 'phone',
      label: 'Phone',
      value: formatProfileValue(user.phone),
      icon: Phone,
    },
    {
      key: 'joined',
      label: 'Joined',
      value: formatProfileDate(user.created_at),
      icon: CalendarDays,
    },
    {
      key: 'last-active',
      label: 'Last Active',
      value: formatProfileDateTime(user.last_sign_in_at),
      icon: BadgeCheck,
    },
    {
      key: 'roles',
      label: 'Roles',
      value: formatRoleList(user.roles),
      icon: UserCog,
    },
    {
      key: 'provider',
      label: 'Auth Provider',
      value: formatProfileValue(user.auth_provider),
      icon: Shield,
    },
  ];

  return (
    <section className="rounded-[14px] border border-[#7f7668] bg-[#0a0d12] p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-[#e8e6e3]">Profile Facts</h3>
        <p className="text-xs text-[#9d9588]">Identity and account signals from the live user record.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {facts.map((item) => (
          <FactCard key={item.key} item={item} />
        ))}
      </div>

      <div className="mt-3 rounded-[12px] border border-[#2a3143] bg-[#0d1119] p-4">
        <p className="mb-2 text-xs uppercase tracking-[0.08em] text-[#9d9588]">Bio</p>
        <p className="text-sm text-[#d2cec7]">{formatProfileValue(user.bio)}</p>
      </div>
    </section>
  );
}

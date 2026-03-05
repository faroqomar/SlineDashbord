import { Link } from '@tanstack/react-router';
import { SearchCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserProfileHeroProps {
  userId: string;
  displayName: string;
  subtitle: string;
}

export function UserProfileHero({ userId, displayName, subtitle }: UserProfileHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[14px] border border-[#7f7668] bg-[linear-gradient(172deg,#0e0f13_0%,#151226_60%,#0e0f13_100%)] p-6">
      <div className="absolute -right-12 -top-20 size-[220px] rounded-full bg-[radial-gradient(circle,rgba(13,15,140,0.18)_0%,rgba(13,15,140,0)_70%)]" />
      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm text-[#afa89d]">Platform</p>
          <h1 className="text-[30px] font-bold leading-[1.05] tracking-[0.05px] text-[#c7f8e5] md:text-[34px]">
            {displayName}
          </h1>
          <p className="text-sm text-[#9d9588]">{subtitle}</p>
        </div>
        <Button
          asChild
          className="h-10 rounded-[10px] border border-[#242989] bg-[linear-gradient(163deg,#0d0f8c_0%,#1d169c_100%)] px-4 text-sm font-medium text-[#e8e6e3] shadow-[0px_0px_20px_0px_rgba(13,15,140,0.2)] hover:opacity-95"
        >
          <Link to="/users/$userId/investigation" params={{ userId }}>
            <SearchCheck className="mr-2 size-4" />
            Investigation
          </Link>
        </Button>
      </div>
    </section>
  );
}

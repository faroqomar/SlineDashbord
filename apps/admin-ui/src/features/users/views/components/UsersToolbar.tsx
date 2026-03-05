import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import type { UsersTabKey } from '../../viewmodels/useUsersViewModel';

interface UsersToolbarProps {
  tab: UsersTabKey;
  query: string;
  tabCounts: Record<UsersTabKey, number>;
  onTabChange: (tab: UsersTabKey) => void;
  onQueryChange: (value: string) => void;
}

export function UsersToolbar({
  tab,
  query,
  tabCounts,
  onTabChange,
  onQueryChange,
}: UsersToolbarProps) {
  const tabs: Array<{ key: UsersTabKey; label: string; count: number }> = [
    { key: 'all', label: 'All', count: tabCounts.all },
    { key: 'active', label: 'Active', count: tabCounts.active },
    { key: 'inactive', label: 'Inactive', count: tabCounts.inactive },
  ];

  return (
    <div className="flex flex-col gap-3 border-b border-[#7f7668] px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-2">
        {tabs.map((item) => (
          <Button
            key={item.key}
            type="button"
            variant="ghost"
            className={cn(
              'h-8 rounded-[8px] px-3 text-xs text-[#9d9588] hover:bg-[#161a25] hover:text-[#e8e6e3]',
              tab === item.key && 'bg-[#1a1d2d] text-[#e8e6e3]',
            )}
            onClick={() => onTabChange(item.key)}
          >
            {item.label}
            <span className="ml-2 rounded-full bg-[#222636] px-1.5 py-0.5 text-[10px] leading-none text-[#b0a99f]">
              {item.count}
            </span>
          </Button>
        ))}
      </div>

      <div className="relative w-full lg:w-[420px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9d9588]" />
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search by name, email, ID..."
          className="h-9 border-[#7f7668] bg-[#070b12] pl-9 text-sm text-[#e8e6e3] placeholder:text-[#8d8579] focus-visible:ring-[#2a2f44]"
        />
      </div>
    </div>
  );
}

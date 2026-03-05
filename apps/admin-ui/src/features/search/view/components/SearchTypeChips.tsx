import {
  Banknote,
  CalendarCheck,
  Flag,
  FolderOpen,
  ListTodo,
  Scale,
  Search,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SearchFilterChip, SearchFilterKey } from '../../models/search-ui.model';

interface SearchTypeChipsProps {
  chips: SearchFilterChip[];
  activeFilter: SearchFilterKey;
  onChange: (filter: SearchFilterKey) => void;
}

const ICON_BY_FILTER: Record<SearchFilterKey, typeof Search> = {
  all: Search,
  user: User,
  booking: CalendarCheck,
  task: ListTodo,
  dispute: Scale,
  report: Flag,
  case: FolderOpen,
  transaction: Banknote,
};

export function SearchTypeChips({ chips, activeFilter, onChange }: SearchTypeChipsProps) {
  return (
    <div className="rounded-[14px] border border-[#7f7668] bg-[#0e0f13] p-1">
      <div className="flex flex-wrap items-center gap-1 overflow-x-auto">
        {chips.map((chip) => {
          const Icon = ICON_BY_FILTER[chip.key];
          const isActive = chip.key === activeFilter;

          return (
            <Button
              key={chip.key}
              type="button"
              variant="ghost"
              onClick={() => onChange(chip.key)}
              className={`h-[34px] rounded-[14px] border px-3 text-xs ${
                isActive
                  ? 'border-[rgba(73,79,82,0.13)] bg-[rgba(63,76,95,0.07)] text-[#b0a99f]'
                  : 'border-transparent text-[#9e9589] hover:border-[rgba(73,79,82,0.13)] hover:bg-[#141a25] hover:text-[#cecac4]'
              }`}
            >
              <Icon className="mr-1.5 h-[13px] w-[13px]" />
              <span>{chip.label}</span>
              <span className="ml-2 rounded-[4px] bg-[#181a26] px-1.5 text-[9px] font-bold text-[#b1aaa0]">
                {chip.count}
              </span>
              {chip.isMock ? <span className="ml-1 text-[9px] text-[#7f8695]">M</span> : null}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

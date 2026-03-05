import {
  Banknote,
  CalendarCheck,
  Flag,
  FolderOpen,
  ListTodo,
  Scale,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { SearchRowPills } from './SearchRowPills';
import { getEntityTone } from '../search.theme';
import type { SearchFilterKey, SearchResultRow as SearchResultRowModel } from '../../models/search-ui.model';

interface SearchResultRowProps {
  row: SearchResultRowModel;
  onOpen: (row: SearchResultRowModel) => void;
}

const ICON_BY_TYPE: Record<SearchFilterKey, typeof User> = {
  all: User,
  user: User,
  booking: CalendarCheck,
  task: ListTodo,
  dispute: Scale,
  report: Flag,
  case: FolderOpen,
  transaction: Banknote,
};

const ICON_CONTAINER_BY_TONE: Record<string, string> = {
  info: 'border-[rgba(5,68,147,0.14)] bg-[rgba(5,67,145,0.07)] text-[#5eb1fa]',
  success: 'border-[rgba(27,158,76,0.14)] bg-[rgba(27,158,75,0.07)] text-[#4ae081]',
  warning: 'border-[rgba(171,110,7,0.14)] bg-[rgba(195,126,8,0.07)] text-[#f6a823]',
  danger: 'border-[rgba(150,13,13,0.14)] bg-[rgba(159,14,14,0.07)] text-[#f04d4d]',
  neutral: 'border-[rgba(88,96,100,0.14)] bg-[rgba(88,96,100,0.07)] text-[#9e9589]',
  accent: 'border-[rgba(38,6,133,0.14)] bg-[rgba(34,5,118,0.07)] text-[#9c7df9]',
};

function getIconContainerClass(type: SearchFilterKey): string {
  const tone = getEntityTone(type);
  return ICON_CONTAINER_BY_TONE[tone] ?? ICON_CONTAINER_BY_TONE.neutral;
}

export function SearchResultRow({ row, onOpen }: SearchResultRowProps) {
  const Icon = ICON_BY_TYPE[row.entityType] ?? User;
  const relevanceWidth = Math.max(1, Math.min(24, Math.round((row.relevance / 100) * 24)));

  return (
    <TableRow className="border-[#81786a] hover:bg-[rgba(24,26,27,0.2)]">
      <TableCell className="py-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-[10px] border ${getIconContainerClass(row.entityType)}`}>
            <Icon className="h-[15px] w-[15px]" />
          </div>
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <SearchRowPills
                entityType={row.entityType}
                entityLabel={row.entityLabel}
                statusLabel={row.statusLabel}
                statusTone={row.statusTone}
                showStatus={false}
                isMock={row.isMock}
              />
            </div>
            <p className="truncate text-sm text-[#cecac4]">{row.primaryText}</p>
            {row.secondaryText ? <p className="truncate text-xs text-[#9d9588]">{row.secondaryText}</p> : null}
          </div>
        </div>
      </TableCell>
      <TableCell className="py-3">
        <SearchRowPills
          entityType={row.entityType}
          entityLabel={row.entityLabel}
          statusLabel={row.statusLabel}
          statusTone={row.statusTone}
          showEntity={false}
        />
      </TableCell>
      <TableCell className="py-3 text-sm text-[#9d9588]">{row.detailLine}</TableCell>
      <TableCell className="py-3 text-xs text-[#b1aaa0]">{row.timeLabel}</TableCell>
      <TableCell className="py-3">
        <div className="flex items-center justify-end gap-2">
          <div className="h-1.5 w-6 overflow-hidden rounded-full bg-[#181a26]">
            <div className="h-full rounded-full bg-[#054391]" style={{ width: `${relevanceWidth}px` }} />
          </div>
          {row.link && !row.isMock ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-[10px] text-[#afa89d] hover:bg-[#181a26] hover:text-[#e8e6e3]"
              onClick={() => onOpen(row)}
            >
              Open
            </Button>
          ) : null}
        </div>
      </TableCell>
    </TableRow>
  );
}

import { Badge } from '@/components/ui/badge';
import { getEntityTone, getToneBadgeClass } from '../search.theme';
import type { SearchFilterKey, SearchTone } from '../../models/search-ui.model';

interface SearchRowPillsProps {
  entityType: SearchFilterKey;
  entityLabel: string;
  statusLabel: string;
  statusTone: SearchTone;
  isMock?: boolean;
  showEntity?: boolean;
  showStatus?: boolean;
}

export function SearchRowPills({
  entityType,
  entityLabel,
  statusLabel,
  statusTone,
  isMock,
  showEntity = true,
  showStatus = true,
}: SearchRowPillsProps) {
  const entityTone = getEntityTone(entityType);

  return (
    <div className="flex items-center gap-2">
      {showEntity ? (
        <Badge
          variant="outline"
          className={`h-5 rounded-[8px] px-2 text-[9px] font-semibold tracking-[0.16px] ${getToneBadgeClass(entityTone)}`}
        >
          {entityLabel}
        </Badge>
      ) : null}
      {showStatus ? (
        <Badge
          variant="outline"
          className={`h-5 rounded-[8px] px-2 text-[10px] font-semibold tracking-[0.11px] ${getToneBadgeClass(statusTone)}`}
        >
          {statusLabel}
        </Badge>
      ) : null}
      {isMock ? (
        <Badge variant="outline" className="h-5 rounded-[8px] border-[#3e4957] bg-[#181a26] px-2 text-[9px] text-[#afa89d]">
          Mock
        </Badge>
      ) : null}
    </div>
  );
}

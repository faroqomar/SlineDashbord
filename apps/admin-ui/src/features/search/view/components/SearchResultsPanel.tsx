import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SearchResultRow } from './SearchResultRow';
import { SearchEmptyState } from './SearchEmptyState';
import type { SearchResultRow as SearchResultRowModel } from '../../models/search-ui.model';

interface SearchResultsPanelProps {
  rows: SearchResultRowModel[];
  query: string;
  onOpen: (row: SearchResultRowModel) => void;
  onClearQuery: () => void;
}

export function SearchResultsPanel({ rows, query, onOpen, onClearQuery }: SearchResultsPanelProps) {
  const hasMockRows = rows.some((row) => row.isMock);

  return (
    <Card className="overflow-hidden rounded-[14px] border-[#7f7668] bg-[#0e0f13]">
      <CardHeader className="flex h-[41px] flex-row items-center justify-between border-b border-[#7f7668] bg-[#0a0c11] px-5 py-0">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-[1.2px] text-[#afa89d]">All Records</p>
          <Badge className="h-4 rounded-[4px] bg-[#181a26] px-1.5 text-[9px] text-[#9e9589]">{rows.length}</Badge>
          {hasMockRows ? (
            <Badge variant="outline" className="h-4 border-[#3e4957] bg-[#181a26] px-1.5 text-[9px] text-[#afa89d]">
              Includes mock
            </Badge>
          ) : null}
        </div>
        <p className="text-xs text-[#b1aaa0]">
          Sort by: <span className="font-semibold text-[#afa89d]">Relevance</span>
        </p>
      </CardHeader>
      <CardContent className="p-0">
        {rows.length === 0 ? (
          <div className="p-4">
            <SearchEmptyState query={query} onClear={onClearQuery} />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-[#81786a] hover:bg-transparent">
                <TableHead className="h-7 text-[9px] uppercase tracking-[0.62px] text-[#b1aaa0]">Entity</TableHead>
                <TableHead className="h-7 text-[9px] uppercase tracking-[0.62px] text-[#b1aaa0]">Status</TableHead>
                <TableHead className="h-7 text-[9px] uppercase tracking-[0.62px] text-[#b1aaa0]">Details</TableHead>
                <TableHead className="h-7 text-[9px] uppercase tracking-[0.62px] text-[#b1aaa0]">Time</TableHead>
                <TableHead className="h-7 text-right text-[9px] uppercase tracking-[0.62px] text-[#b1aaa0]">
                  Rel.
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <SearchResultRow key={row.id} row={row} onOpen={onOpen} />
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

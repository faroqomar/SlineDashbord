
"use client";

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { Column } from "../DataTable";

interface DataTableHeaderProps<T> {
  columns: Column<T>[];
  selectable: boolean;
  actions?: boolean;
  selectedCount: number;
  totalCount: number;
  sortKey: string | null;
  sortDirection: "asc" | "desc";
  onSelectAll: () => void;
  onSort: (key: string) => void;
}

export function DataTableHeader<T>({
  columns,
  selectable,
  actions,
  selectedCount,
  totalCount,
  sortKey,
  sortDirection,
  onSelectAll,
  onSort,
}: DataTableHeaderProps<T>) {
  return (
    <TableHeader>
      <TableRow className="bg-muted/50 hover:bg-muted/50">
        {selectable && (
          <TableHead className="w-12">
            <Checkbox
              checked={selectedCount === totalCount && totalCount > 0}
              onCheckedChange={onSelectAll}
            />
          </TableHead>
        )}
        {columns.map((col) => (
          <TableHead key={col.key} className={col.className}>
            {col.sortable ? (
              <button
                onClick={() => onSort(col.key)}
                className="flex items-center gap-1 hover:text-foreground transition-colors font-medium text-xs uppercase tracking-wider"
              >
                {col.header}
                {sortKey === col.key ? (
                  sortDirection === "asc" ? (
                    <ArrowUp className="w-3 h-3" />
                  ) : (
                    <ArrowDown className="w-3 h-3" />
                  )
                ) : (
                  <ArrowUpDown className="w-3 h-3 opacity-50" />
                )}
              </button>
            ) : (
              <span className="font-medium text-xs uppercase tracking-wider">{col.header}</span>
            )}
          </TableHead>
        ))}
        {actions && <TableHead className="w-12" />}
      </TableRow>
    </TableHeader>
  );
}

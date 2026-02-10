
"use client";

import { ReactNode } from "react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Column } from "../DataTable";

interface DataTableBodyProps<T extends { id: string | number }> {
  data: T[];
  columns: Column<T>[];
  selectable: boolean;
  actions?: (item: T) => { label: string; onClick: () => void; destructive?: boolean }[];
  selectedRows: Set<string | number>;
  dense: boolean;
  onRowClick?: (item: T) => void;
  onSelect: (id: string | number) => void;
}

export function DataTableBody<T extends { id: string | number }>({
  data,
  columns,
  selectable,
  actions,
  selectedRows,
  dense,
  onRowClick,
  onSelect,
}: DataTableBodyProps<T>) {
  return (
    <TableBody>
      {data.map((item) => (
        <TableRow
          key={item.id}
          className={cn(
            "transition-colors",
            selectedRows.has(item.id) && "bg-muted/50",
            onRowClick && "cursor-pointer hover:bg-muted/50"
          )}
          onClick={() => onRowClick?.(item)}
        >
          {selectable && (
            <TableCell onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={selectedRows.has(item.id)}
                onCheckedChange={() => onSelect(item.id)}
              />
            </TableCell>
          )}
          {columns.map((col) => (
            <TableCell
              key={col.key}
              className={cn(dense && "py-2", col.className)}
            >
              {col.render
                ? col.render(item)
                : (item[col.key] as ReactNode)}
            </TableCell>
          ))}
          {actions && (
            <TableCell onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {actions(item).map((action, i) => (
                    <DropdownMenuItem
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        action.onClick();
                      }}
                      className={cn(action.destructive && "text-destructive focus:text-destructive")}
                    >
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          )}
        </TableRow>
      ))}
    </TableBody>
  );
}

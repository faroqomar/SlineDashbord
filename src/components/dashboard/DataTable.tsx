"use client";

import { useState, ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./datatable/DataTablePagination";
import { DataTableHeader } from "./datatable/DataTableHeader";
import { DataTableBody } from "./datatable/DataTableBody";
import { DataTableToolbar } from "./datatable/DataTableToolbar";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string & keyof T;
  header: string;
  sortable?: boolean;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T extends { id: string | number }> {
  columns: Column<T>[];
  data: T[];
  selectable?: boolean;
  actions?: (item: T) => { label: string; onClick: () => void; destructive?: boolean }[];
  loading?: boolean;
  emptyState?: ReactNode;
  dense?: boolean;
  onRowClick?: (item: T) => void;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  selectable = false,
  actions,
  loading = false,
  emptyState,
  dense = false,
  onRowClick,
}: DataTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const toggleSelectAll = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data.map((item) => item.id)));
    }
  };

  const toggleSelect = (id: string | number) => {
    const newSet = new Set(selectedRows);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedRows(newSet);
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const sortedData = sortKey
    ? [...data].sort((a, b) => {
        const key = sortKey as keyof T;
        const aVal = a[key];
        const bVal = b[key];
        const direction = sortDirection === "asc" ? 1 : -1;
        
        if (typeof aVal === "string" && typeof bVal === "string") {
          return aVal.localeCompare(bVal) * direction;
        }
        if (typeof aVal === "number" && typeof bVal === "number") {
            return (aVal - bVal) * direction;
        }
         return 0;
      })
    : data;

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) {
    return (
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {selectable && <TableHead className="w-12" />}
              {columns.map((col) => (
                <TableHead key={col.key} className={col.className}>
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </TableHead>
              ))}
              {actions && <TableHead className="w-12" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {selectable && (
                  <TableCell>
                    <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                  </TableCell>
                )}
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    <div className="h-4 w-full bg-muted animate-pulse rounded" />
                  </TableCell>
                ))}
                {actions && (
                  <TableCell>
                    <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className="space-y-4">
      <DataTableToolbar selectedCount={selectedRows.size} />

      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <Table>
          <DataTableHeader 
            columns={columns}
            selectable={selectable}
            actions={!!actions}
            selectedCount={selectedRows.size}
            totalCount={data.length}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSelectAll={toggleSelectAll}
            onSort={handleSort}
          />
          <DataTableBody
             data={paginatedData}
             columns={columns}
             selectable={selectable}
             actions={actions}
             selectedRows={selectedRows}
             dense={dense}
             onRowClick={onRowClick}
             onSelect={toggleSelect}
          />
        </Table>
      </div>

      <DataTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={sortedData.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}


"use client";

import { Button } from "@/components/ui/button";

interface DataTableToolbarProps {
  selectedCount: number;
}

export function DataTableToolbar({ selectedCount }: DataTableToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg animate-in fade-in slide-in-from-top-2">
      <span className="text-sm font-medium">
        {selectedCount} selected
      </span>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="h-8">
          Bulk Edit
        </Button>
        <Button size="sm" variant="destructive" className="h-8">
          Delete Selected
        </Button>
      </div>
    </div>
  );
}

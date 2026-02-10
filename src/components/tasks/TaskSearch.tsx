"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "@/hooks/use-debounce";

export function TaskSearch() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1'); // Reset pagination
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${window.location.pathname}?${params.toString()}`);
  }, 300);

  const handleStatusFilter = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (value && value !== 'all') {
      params.set('status', value);
    } else {
      params.delete('status');
    }
    replace(`${window.location.pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          className="pl-8"
          defaultValue={searchParams.get('query')?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <Select 
        defaultValue={searchParams.get('status')?.toString() || "all"} 
        onValueChange={handleStatusFilter}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="assigned">Assigned</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="canceled">Canceled</SelectItem>
          <SelectItem value="review">Review</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

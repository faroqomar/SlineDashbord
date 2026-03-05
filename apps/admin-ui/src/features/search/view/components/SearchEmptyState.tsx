import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchEmptyStateProps {
  query: string;
  onClear: () => void;
}

export function SearchEmptyState({ query, onClear }: SearchEmptyStateProps) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-[14px] border border-dashed border-[#7f7668] bg-[#0a0c11] p-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-[12px] border border-[#3e4957] bg-[#121625]">
        <Search className="h-5 w-5 text-[#5eb1fa]" />
      </div>
      <h3 className="text-lg font-semibold text-[#e8e6e3]">No results found</h3>
      <p className="max-w-md text-sm text-[#afa89d]">
        {query.trim()
          ? `No records matched "${query}". Try a different keyword or switch entity filters.`
          : 'Start typing to search across users, bookings, tasks, disputes, and transactions.'}
      </p>
      {query.trim() ? (
        <Button
          variant="outline"
          onClick={onClear}
          className="border-[#7f7668] bg-[#0e0f13] text-[#cecac4] hover:bg-[#181a26]"
        >
          Clear query
        </Button>
      ) : null}
    </div>
  );
}

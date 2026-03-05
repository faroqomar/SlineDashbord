import { CornerDownLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { SearchShortcutHint } from '../../models/search-ui.model';

interface SearchHeroPanelProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  shortcutHints: SearchShortcutHint[];
}

export function SearchHeroPanel({
  query,
  onQueryChange,
  onSubmit,
  onClear,
  shortcutHints,
}: SearchHeroPanelProps) {
  const canSearch = query.trim().length >= 2;

  return (
    <section className="relative overflow-hidden rounded-[16px] border border-[#7d7466] bg-[linear-gradient(166deg,#081220_0%,#0c1222_35%,#0e0618_70%,#081220_100%)] p-8">
      <div className="pointer-events-none absolute -left-10 top-20 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(34,5,118,0.45)_0%,rgba(0,0,0,0)_70%)] opacity-40" />
      <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(5,67,145,0.5)_0%,rgba(0,0,0,0)_70%)] opacity-30" />
      <div className="pointer-events-none absolute left-1/3 -top-12 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(6,119,169,0.35)_0%,rgba(0,0,0,0)_70%)] opacity-20" />

      <div className="relative space-y-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,rgba(5,67,145,0.14)_0%,rgba(34,5,118,0.08)_100%)] shadow-[0_0_24px_rgba(5,67,145,0.08)]">
            <Search className="h-[22px] w-[22px] text-[#5eb1fa]" />
          </div>
          <div>
            <h2 className="text-[36px] font-bold leading-[1.1] tracking-tight text-[#e8e6e3]">Global Search</h2>
            <p className="text-lg text-[#afa89d]">
              Search across users, bookings, tasks, disputes, reports, cases and transactions
            </p>
          </div>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
          className="space-y-3"
        >
          <div className="rounded-[14px] border border-[#4b568f] bg-[#0a0d12] p-1 shadow-[0_4px_24px_rgba(0,0,0,0.19)]">
            <div className="flex items-center gap-2">
              <Search className="ml-3 h-[18px] w-[18px] text-[#afa89d]" />
              <Input
                autoFocus
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder="Search by name, email, ID, booking number, or keyword..."
                className="h-12 flex-1 border-0 bg-transparent px-0 text-sm text-[#cecac4] placeholder:text-[#b2aba1] focus-visible:ring-0"
              />
              <Button
                type="submit"
                disabled={!canSearch}
                className="mr-1 h-[34px] rounded-[10px] border border-[rgba(5,68,147,0.19)] bg-[rgba(5,67,145,0.09)] px-4 text-xs font-semibold text-[#5eb1fa] hover:bg-[rgba(5,67,145,0.18)] disabled:opacity-60"
              >
                Search
                <CornerDownLeft className="ml-1.5 h-[11px] w-[11px]" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 px-1">
            {shortcutHints.map((hint) => (
              <div key={hint.keyLabel} className="flex items-center gap-1.5">
                <kbd className="h-[19.5px] rounded-[4px] border border-[#7b7265] bg-[#181a26] px-1.5 text-[9px] leading-[19.5px] text-[#b1aaa0]">
                  {hint.keyLabel}
                </kbd>
                <span className="text-[9px] text-[#b1aaa0]">{hint.label}</span>
              </div>
            ))}
            {query ? (
              <Button
                type="button"
                variant="ghost"
                onClick={onClear}
                className="h-[19.5px] rounded-[4px] border border-[#7b7265] bg-[#181a26] px-2 text-[9px] text-[#b1aaa0] hover:bg-[#202634]"
              >
                Clear query
              </Button>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  );
}

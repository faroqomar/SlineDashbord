import { useNavigate } from '@tanstack/react-router';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { SearchHeroPanel } from './components/SearchHeroPanel';
import { SearchKpiGrid } from './components/SearchKpiGrid';
import { SearchTypeChips } from './components/SearchTypeChips';
import { SearchResultsPanel } from './components/SearchResultsPanel';
import { SearchRightRail } from './components/SearchRightRail';
import { SearchSkeleton } from './components/SearchSkeleton';
import { useGlobalSearchViewModel } from '../viewmodels/useGlobalSearch.vm';
import type { SearchResultRow } from '../models/search-ui.model';

export function SearchScreen() {
  const vm = useGlobalSearchViewModel();
  const navigate = useNavigate();

  const handleOpenRow = (row: SearchResultRow) => {
    if (!row.link || row.isMock) return;
    navigate({ to: row.link });
  };

  const showResultsSkeleton = vm.loading && vm.query.trim().length >= 2 && vm.activeFilter !== 'report' && vm.activeFilter !== 'case';

  return (
    <div className="space-y-4 pb-8">
      <SearchHeroPanel
        query={vm.query}
        onQueryChange={vm.setQuery}
        onSubmit={vm.submitSearch}
        onClear={vm.clearSearch}
        shortcutHints={vm.shortcutHints}
      />

      {vm.timedOut ? (
        <Alert className="border-[#7f7668] bg-[#2a1414] text-[#f3c2c2]">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Search timed out</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-4">
            <span>The search took too long. Try a more specific query.</span>
            <Button variant="outline" size="sm" onClick={vm.retry} className="border-[#7f7668] bg-[#0e0f13]">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {vm.error ? (
        <Alert className="border-[#7f7668] bg-[#2a1414] text-[#f3c2c2]">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Search failed</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-4">
            <span>{vm.error}</span>
            <Button variant="outline" size="sm" onClick={vm.retry} className="border-[#7f7668] bg-[#0e0f13]">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      <SearchKpiGrid items={vm.kpis} />

      <SearchTypeChips chips={vm.chips} activeFilter={vm.activeFilter} onChange={vm.setActiveFilter} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_284px] xl:items-start">
        <div>
          {showResultsSkeleton ? (
            <SearchSkeleton rowCount={8} />
          ) : (
            <SearchResultsPanel
              rows={vm.resultRows}
              query={vm.query}
              onOpen={handleOpenRow}
              onClearQuery={vm.clearSearch}
            />
          )}
        </div>

        <SearchRightRail
          savedSearches={vm.savedSearches}
          recentSearches={vm.recentSearches}
          onApplySavedSearch={vm.applySavedSearch}
          onApplyRecentSearch={vm.applyRecentSearch}
          onClearRecentSearches={vm.clearRecentSearches}
          volumeData={vm.searchVolume}
          tips={vm.searchTips}
        />
      </div>
    </div>
  );
}

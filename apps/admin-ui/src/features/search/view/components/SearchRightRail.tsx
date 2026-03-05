import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';
import {
  BarChart3,
  BookmarkCheck,
  ChevronRight,
  Clock3,
  Filter,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type {
  SearchRecentSearch,
  SearchSavedSearch,
  SearchTip,
  SearchVolumePoint,
} from '../../models/search-ui.model';
import { getToneBadgeClass } from '../search.theme';

interface SearchRightRailProps {
  savedSearches: SearchSavedSearch[];
  recentSearches: SearchRecentSearch[];
  onApplySavedSearch: (savedSearchId: string) => void;
  onApplyRecentSearch: (query: string) => void;
  onClearRecentSearches: () => void;
  volumeData: SearchVolumePoint[];
  tips: SearchTip[];
}

export function SearchRightRail({
  savedSearches,
  recentSearches,
  onApplySavedSearch,
  onApplyRecentSearch,
  onClearRecentSearches,
  volumeData,
  tips,
}: SearchRightRailProps) {
  return (
    <div className="space-y-4">
      <Card className="overflow-hidden rounded-[14px] border-[#7f7668] bg-[#0e0f13]">
        <CardHeader className="flex h-[41px] flex-row items-center justify-between border-b border-[#7f7668] bg-[#0a0c11] px-4 py-0">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="h-[13px] w-[13px] text-[#cecac4]" />
            <p className="text-xs font-semibold text-[#cecac4]">Saved Searches</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="h-4 border-[#3e4957] bg-[#181a26] px-1.5 text-[9px] text-[#afa89d]">
              Mock
            </Badge>
            <span className="text-xs text-[#b1aaa0]">{savedSearches.length}</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {savedSearches.map((saved) => (
            <Button
              key={saved.id}
              variant="ghost"
              onClick={() => onApplySavedSearch(saved.id)}
              className="h-[54px] w-full justify-between rounded-none border-b border-[#81786a] px-4 last:border-b-0 hover:bg-[#141a25]"
            >
              <div className="flex items-center gap-3 text-left">
                <span className={`flex h-6 w-6 items-center justify-center rounded-[8px] border ${getToneBadgeClass(saved.tone)}`}>
                  <Filter className="h-[11px] w-[11px]" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-[#cecac4]">{saved.title}</span>
                  <span className="block text-[10px] text-[#b1aaa0]">{saved.resultLabel}</span>
                </span>
              </div>
              <ChevronRight className="h-3 w-3 text-[#9d9588]" />
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-[14px] border-[#7f7668] bg-[#0e0f13]">
        <CardHeader className="flex h-[41px] flex-row items-center justify-between border-b border-[#7f7668] bg-[#0a0c11] px-4 py-0">
          <div className="flex items-center gap-2">
            <Clock3 className="h-[13px] w-[13px] text-[#cecac4]" />
            <p className="text-xs font-semibold text-[#cecac4]">Recent Searches</p>
          </div>
          <Button
            variant="ghost"
            onClick={onClearRecentSearches}
            className="h-6 px-1 text-[10px] text-[#b1aaa0] hover:bg-[#181a26]"
          >
            Clear all
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {recentSearches.map((recent) => (
            <Button
              key={recent.id}
              variant="ghost"
              onClick={() => onApplyRecentSearch(recent.text)}
              className="h-[37px] w-full justify-between rounded-none border-b border-[#81786a] px-4 last:border-b-0 hover:bg-[#141a25]"
            >
              <span className="truncate text-sm text-[#afa89d]">{recent.text}</span>
              <span className="text-[10px] text-[#bdb7ae]">{recent.timeAgo}</span>
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-[14px] border-[#7f7668] bg-[#0e0f13]">
        <CardHeader className="flex h-[41px] flex-row items-center justify-between border-b border-[#7f7668] bg-[#0a0c11] px-4 py-0">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-[13px] w-[13px] text-[#cecac4]" />
            <p className="text-xs font-semibold text-[#cecac4]">Search Volume Today</p>
          </div>
          <span className="text-xs text-[#b1aaa0]">Hourly</span>
        </CardHeader>
        <CardContent className="space-y-1 p-4">
          <div className="h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="search-volume-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9c7df9" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#9c7df9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  cursor={false}
                  contentStyle={{
                    background: '#0e0f13',
                    border: '1px solid #7f7668',
                    color: '#cecac4',
                    borderRadius: 8,
                  }}
                />
                <Area type="monotone" dataKey="value" stroke="#9c7df9" strokeWidth={2} fill="url(#search-volume-gradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between text-[8px] text-[#b1aaa0]">
            <span>6AM</span>
            <span>12PM</span>
            <span>5PM</span>
          </div>
          <p className="text-[10px] text-[#7f8695]">Mock</p>
        </CardContent>
      </Card>

      <Card className="rounded-[14px] border-[#376aa4] bg-[#0a1525]">
        <CardHeader className="flex flex-row items-center justify-between px-4 pb-1 pt-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-[13px] w-[13px] text-[#7dc4ff]" />
            <p className="text-xs font-semibold text-[#7dc4ff]">Search Tips</p>
          </div>
          <Badge variant="outline" className="h-4 border-[#3e4957] bg-[#181a26] px-1.5 text-[9px] text-[#afa89d]">
            Mock
          </Badge>
        </CardHeader>
        <CardContent className="space-y-1 px-4 pb-4 pt-1">
          {tips.map((tip) => (
            <p key={tip.id} className="flex items-start gap-2 text-sm text-[#9d9588]">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#054391]" />
              <span>{tip.text}</span>
            </p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

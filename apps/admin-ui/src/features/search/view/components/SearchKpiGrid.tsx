import { Activity, AlertCircle, Search, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getToneBadgeClass } from '../search.theme';
import type { SearchKpiCard } from '../../models/search-ui.model';

interface SearchKpiGridProps {
  items: SearchKpiCard[];
}

function toSparklinePath(values: number[]): string {
  if (values.length === 0) return '';
  const max = Math.max(...values);
  const min = Math.min(...values);
  const spread = Math.max(1, max - min);

  return values
    .map((value, index) => {
      const x = (index / Math.max(1, values.length - 1)) * 56;
      const y = 22 - ((value - min) / spread) * 18;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
}

const ICON_BY_ID = {
  searches_today: Search,
  avg_results: Activity,
  instant_matches: Zap,
  zero_results: AlertCircle,
} as const;

const DELTA_TEXT_CLASS: Record<SearchKpiCard['tone'], string> = {
  info: 'text-[#5eb1fa]',
  success: 'text-[#4ae081]',
  warning: 'text-[#f6a823]',
  danger: 'text-[#f04d4d]',
  neutral: 'text-[#9e9589]',
  accent: 'text-[#9c7df9]',
};

export function SearchKpiGrid({ items }: SearchKpiGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = ICON_BY_ID[item.id as keyof typeof ICON_BY_ID] ?? Activity;
        const sparklinePath = toSparklinePath(item.sparkline);

        return (
          <Card key={item.id} className="rounded-[14px] border-[#7f7668] bg-[#0e0f13]">
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <div className={`flex h-9 w-9 items-center justify-center rounded-[14px] border ${getToneBadgeClass(item.tone)}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <svg viewBox="0 0 56 24" className="h-8 w-14">
                  <polyline
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    points={sparklinePath}
                    className="text-[#5eb1fa]"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[33px] font-semibold leading-none text-[#e8e6e3]">{item.value}</p>
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-sm text-[#9d9588]">{item.label}</p>
                  <p className={`text-sm font-semibold ${DELTA_TEXT_CLASS[item.tone]}`}>{item.delta}</p>
                </div>
                <p className="mt-1 text-[10px] text-[#7f8695]">{item.isMock ? 'Mock' : item.isStale ? 'Live (stale)' : 'Live'}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

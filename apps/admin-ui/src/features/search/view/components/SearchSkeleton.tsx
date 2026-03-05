import { Skeleton } from '@/components/ui/skeleton';

interface SearchSkeletonProps {
  rowCount?: number;
}

export function SearchSkeleton({ rowCount = 6 }: SearchSkeletonProps) {
  return (
    <div className="space-y-3 rounded-[14px] border border-[#7f7668] bg-[#0e0f13] p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28 bg-[#1a1f2a]" />
        <Skeleton className="h-4 w-24 bg-[#1a1f2a]" />
      </div>
      <Skeleton className="h-8 w-full bg-[#1a1f2a]" />
      <div className="space-y-2">
        {Array.from({ length: rowCount }).map((_, index) => (
          <Skeleton key={index} className="h-[58px] w-full bg-[#151a24]" />
        ))}
      </div>
    </div>
  );
}

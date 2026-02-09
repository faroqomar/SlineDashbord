import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <Skeleton className="h-9 w-32" />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-6 border rounded-xl space-y-2">
            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <Skeleton className="h-8 w-[60px]" />
            <Skeleton className="h-3 w-[80px]" />
          </div>
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 border rounded-xl p-6 h-[350px]">
            <Skeleton className="h-full w-full" />
        </div>
        <div className="col-span-3 border rounded-xl p-6 h-[350px]">
             <Skeleton className="h-full w-full" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <div className="col-span-3 border rounded-xl p-6 h-[300px]">
             <Skeleton className="h-full w-full" />
        </div>
        <div className="col-span-3 border rounded-xl p-6 h-[300px]">
             <Skeleton className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ChartSkeleton({ title, description, colSpan = 4 }: { title: string; description: string; colSpan?: number }) {
  return (
    <Card className={`col-span-${colSpan} lg:col-span-${colSpan}`}>
      <CardHeader>
        <CardTitle><Skeleton className="h-6 w-3/4" /></CardTitle>
        <CardDescription><Skeleton className="h-4 w-1/2" /></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full flex items-center justify-center">
            <Skeleton className="h-[250px] w-full rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}

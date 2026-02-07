import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KPIStat } from "@/data/mock/overview";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsGridProps {
  stats: KPIStat[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 stagger-children">
      {stats.map((stat, i) => (
        <Card key={i} className="kpi-card relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={cn("p-2 rounded-full", stat.iconBg)}>
              <stat.icon className={cn("h-4 w-4", stat.iconColor)} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              {stat.trend === "up" && <ArrowUpRight className="h-3 w-3 text-success" />}
              {stat.trend === "down" && <ArrowDownRight className="h-3 w-3 text-destructive" />}
              {stat.trend === "neutral" && <Minus className="h-3 w-3 text-muted-foreground" />}
              <span
                className={cn(
                  stat.trend === "up" && "text-success",
                  stat.trend === "down" && "text-destructive"
                )}
              >
                {stat.change}
              </span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

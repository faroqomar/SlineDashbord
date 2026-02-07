import { ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: ReactNode;
  loading?: boolean;
}

export function KPICard({
  title,
  value,
  change,
  changeLabel = "vs last period",
  icon,
  loading = false,
}: KPICardProps) {
  const getTrendIcon = () => {
    if (change === undefined || change === 0) {
      return <Minus className="w-3 h-3" />;
    }
    return change > 0 ? (
      <TrendingUp className="w-3 h-3" />
    ) : (
      <TrendingDown className="w-3 h-3" />
    );
  };

  const getTrendClass = () => {
    if (change === undefined || change === 0) return "text-muted-foreground";
    return change > 0 ? "trend-up" : "trend-down";
  };

  if (loading) {
    return (
      <div className="kpi-card p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="skeleton w-24 h-4" />
          <div className="skeleton w-10 h-10 rounded-lg" />
        </div>
        <div className="skeleton w-32 h-8 mb-2" />
        <div className="skeleton w-20 h-4" />
      </div>
    );
  }

  return (
    <div className="kpi-card p-6 transition-all duration-200 hover:shadow-medium group">
      <div className="flex items-start justify-between mb-4">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold tracking-tight mb-1">{value}</div>
      {change !== undefined && (
        <div className={cn("flex items-center gap-1 text-sm", getTrendClass())}>
          {getTrendIcon()}
          <span className="font-medium">{Math.abs(change)}%</span>
          <span className="text-muted-foreground">{changeLabel}</span>
        </div>
      )}
    </div>
  );
}

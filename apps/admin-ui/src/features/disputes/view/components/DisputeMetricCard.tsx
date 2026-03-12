import { cn } from "@/lib/utils";

type Trend = "up" | "down" | "neutral";

export interface DisputeMetricCardProps {
  label: string;
  value: string | number;
  trend?: Trend;
  trendLabel?: string;
  icon: React.ReactNode;
  accent: "blue" | "red" | "green" | "amber";
  className?: string;
}

const accentStyles: Record<DisputeMetricCardProps["accent"], { bg: string; border: string; trendBg: string; trendText: string }> = {
  blue: {
    bg: "bg-[rgba(5,67,145,0.09)]",
    border: "border-[rgba(5,67,145,0.13)]",
    trendBg: "bg-[#08190e]",
    trendText: "text-[#4ae081]",
  },
  red: {
    bg: "bg-[rgba(159,14,14,0.09)]",
    border: "border-[rgba(159,14,14,0.13)]",
    trendBg: "bg-[#220c0c]",
    trendText: "text-[#f04d4d]",
  },
  green: {
    bg: "bg-[rgba(27,158,75,0.09)]",
    border: "border-[rgba(27,158,75,0.13)]",
    trendBg: "bg-[#08190e]",
    trendText: "text-[#4ae081]",
  },
  amber: {
    bg: "bg-[rgba(195,126,8,0.09)]",
    border: "border-[rgba(195,126,8,0.13)]",
    trendBg: "bg-[#08190e]",
    trendText: "text-[#4ae081]",
  },
};

export function DisputeMetricCard({
  label,
  value,
  trend = "neutral",
  trendLabel,
  icon,
  accent,
  className,
}: DisputeMetricCardProps) {
  const styles = accentStyles[accent];
  return (
    <div
      className={cn(
        "rounded-[14px] border border-[#7f7668] bg-[#0e0f13] overflow-hidden relative p-4 flex flex-col gap-3",
        className
      )}
      data-node-id="2:27633"
    >
      <div className="flex items-start justify-between gap-2">
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-[10px]", styles.bg)}>
          {icon}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-[12px] uppercase tracking-wider text-[#9d9588]">{label}</p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-2xl font-bold text-[#e8e6e3]">{value}</span>
          {trendLabel != null && trendLabel !== "—" && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                styles.trendBg,
                styles.trendText
              )}
            >
              {trendLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

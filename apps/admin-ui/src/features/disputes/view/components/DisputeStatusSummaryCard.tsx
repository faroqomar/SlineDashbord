import { cn } from "@/lib/utils";

export interface DisputeStatusSummaryCardProps {
  label: string;
  count: number;
  icon: React.ReactNode;
  variant: "open" | "active" | "resolved" | "canceled";
  className?: string;
}

const variantStyles = {
  open: "border-[rgba(150,13,13,0.19)] bg-gradient-to-b from-[rgba(159,14,14,0.13)] to-[rgba(159,14,14,0.02)] text-[#f04d4d]",
  active: "border-amber-500/20 bg-amber-500/5 text-amber-400",
  resolved: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400",
  canceled: "border-zinc-500/20 bg-zinc-500/5 text-zinc-400",
};

export function DisputeStatusSummaryCard({
  label,
  count,
  icon,
  variant,
  className,
}: DisputeStatusSummaryCardProps) {
  return (
    <div
      className={cn(
        "rounded-[14px] border flex flex-col gap-2 p-3 min-h-[50px]",
        variantStyles[variant],
        className
      )}
      data-node-id="2:27743"
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-black/20">
            {icon}
          </div>
          <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
        </div>
        <span className="rounded-lg bg-black/20 px-2 py-0.5 text-xs font-bold">{count}</span>
      </div>
    </div>
  );
}


import { cn } from "@/lib/utils";
import { CheckCircle, Clock, AlertCircle, XCircle, Circle, AlertTriangle } from "lucide-react";

type StatusType = "open" | "pending" | "resolved" | "closed" | "error" | "warning" | "info" | "in_review" | "in_progress";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  showIcon?: boolean;
  size?: "sm" | "md";
  className?: string;
}

const statusConfig: Record<
  StatusType,
  { icon: React.ElementType; className: string; defaultLabel: string }
> = {
  open: {
    icon: Circle,
    className: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    defaultLabel: "Open",
  },
  pending: {
    icon: Clock,
    className: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    defaultLabel: "Pending",
  },
  resolved: {
    icon: CheckCircle,
    className: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    defaultLabel: "Resolved",
  },
  closed: {
    icon: XCircle,
    className: "text-slate-500 bg-slate-500/10 border-slate-500/20",
    defaultLabel: "Closed",
  },
  error: {
    icon: AlertCircle,
    className: "text-red-500 bg-red-500/10 border-red-500/20",
    defaultLabel: "Error",
  },
  warning: {
    icon: AlertTriangle,
    className: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    defaultLabel: "Warning",
  },
  in_review: {
    icon: Clock,
    className: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    defaultLabel: "In Review",
  },
  in_progress: {
    icon: Clock,
    className: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    defaultLabel: "In Progress",
  },
  info: {
    icon: Circle,
    className: "text-sky-500 bg-sky-500/10 border-sky-500/20",
    defaultLabel: "Info",
  },
};

export function StatusBadge({
  status,
  label,
  showIcon = true,
  size = "md",
}: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.info;
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        config.className,
        size === "sm" && "px-2 py-0.5 text-[10px]"
      )}
    >
      {showIcon && (
        <Icon className={cn("shrink-0", size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5")} />
      )}
      {label || config.defaultLabel}
    </span>
  );
}

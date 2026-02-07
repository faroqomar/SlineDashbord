import { cn } from "@/lib/utils";
import { CheckCircle, Clock, AlertCircle, XCircle, Circle, AlertTriangle } from "lucide-react";

type StatusType = "open" | "pending" | "resolved" | "closed" | "error" | "warning" | "info";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  showIcon?: boolean;
  size?: "sm" | "md";
}

const statusConfig: Record<
  StatusType,
  { icon: React.ElementType; className: string; defaultLabel: string }
> = {
  open: {
    icon: Circle,
    className: "status-open",
    defaultLabel: "Open",
  },
  pending: {
    icon: Clock,
    className: "status-pending",
    defaultLabel: "Pending",
  },
  resolved: {
    icon: CheckCircle,
    className: "status-resolved",
    defaultLabel: "Resolved",
  },
  closed: {
    icon: XCircle,
    className: "status-closed",
    defaultLabel: "Closed",
  },
  error: {
    icon: AlertCircle,
    className: "status-error",
    defaultLabel: "Error",
  },
  warning: {
    icon: AlertTriangle,
    className: "status-pending",
    defaultLabel: "Warning",
  },
  info: {
    icon: Circle,
    className: "status-open",
    defaultLabel: "Info",
  },
};

export function StatusBadge({
  status,
  label,
  showIcon = true,
  size = "md",
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "status-badge",
        config.className,
        size === "sm" && "px-2 py-0.5 text-2xs"
      )}
    >
      {showIcon && (
        <Icon className={cn("shrink-0", size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5")} />
      )}
      {label || config.defaultLabel}
    </span>
  );
}

import { cn } from "@/lib/utils";
import { Flag } from "lucide-react";

type PriorityType = "high" | "medium" | "low";

interface PriorityBadgeProps {
  priority: PriorityType;
  showIcon?: boolean;
}

const priorityConfig: Record<PriorityType, { className: string; label: string }> = {
  high: {
    className: "priority-high",
    label: "High",
  },
  medium: {
    className: "priority-medium",
    label: "Medium",
  },
  low: {
    className: "priority-low",
    label: "Low",
  },
};

export function PriorityBadge({ priority, showIcon = true }: PriorityBadgeProps) {
  const config = priorityConfig[priority];

  return (
    <span className={cn("status-badge", config.className)}>
      {showIcon && <Flag className="w-3 h-3" />}
      {config.label}
    </span>
  );
}

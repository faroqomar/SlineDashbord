import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const variant = status === "resolved" || status === "closed" ? "secondary" : status === "open" ? "default" : "outline";
  return (
    <Badge variant={variant} className={cn(size === "sm" && "text-[10px] px-1.5 py-0")}>
      {status}
    </Badge>
  );
}

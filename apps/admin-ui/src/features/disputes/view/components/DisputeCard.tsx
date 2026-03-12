import { useNavigate } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { DisputeDTO } from "../../models/dispute.schema";

const severityStyles: Record<string, string> = {
  low: "bg-slate-500/20 text-slate-300",
  med: "bg-amber-500/20 text-amber-300",
  high: "bg-orange-500/20 text-orange-300",
  crit: "bg-red-500/20 text-red-300",
};

function formatAmount(amount: number): string {
  return `IQD${Math.round(amount || 0).toLocaleString()}`;
}

function shortId(id: string): string {
  return id.slice(0, 8).toUpperCase();
}

export interface DisputeCardProps {
  dispute: DisputeDTO;
  className?: string;
}

export function DisputeCard({ dispute, className }: DisputeCardProps) {
  const navigate = useNavigate();
  const sev = String(dispute.severity ?? "med").toLowerCase();
  const complainant = dispute.complainant;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate({ to: `/disputes/${dispute.id}` as any })}
      onKeyDown={(e) => e.key === "Enter" && navigate({ to: `/disputes/${dispute.id}` as any })}
      className={cn(
        "rounded-[14px] border border-[rgba(127,118,104,0.3)] bg-[#0a0d12] p-3 cursor-pointer transition-colors hover:border-[#7f7668]/50 hover:bg-[#0e0f13]",
        className
      )}
      data-node-id="2:27753"
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-mono text-xs text-[#9d9588]">DSP-{shortId(dispute.id)}</span>
        <span className="text-xs text-[#b1aaa0]">{new Date(dispute.created_at).toLocaleDateString()}</span>
      </div>
      <p className="font-semibold text-sm text-[#d9d6d1] line-clamp-2 mb-2">
        {dispute.task?.title || dispute.reason || "—"}
      </p>
      <div className="flex flex-wrap gap-1.5 mb-2">
        <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium", severityStyles[sev] ?? severityStyles.med)}>
          {sev === "crit" ? "Crit" : sev === "med" ? "Med" : sev.charAt(0).toUpperCase() + sev.slice(1)}
        </span>
        {dispute.category && (
          <span className="rounded bg-[#151725] px-1.5 py-0.5 text-[10px] text-[#b0a99f]">
            {dispute.category}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-5 w-5 rounded-full border border-[rgba(159,14,14,0.13)]">
            <AvatarImage src={complainant?.avatar_url ?? undefined} />
            <AvatarFallback className="text-[8px] bg-[rgba(159,14,14,0.13)] text-[#f04d4d]">
              {complainant?.full_name?.slice(0, 2) ?? "?"}
            </AvatarFallback>
          </Avatar>
          <span className="flex items-center gap-1 text-xs text-[#9d9588]">
            <MessageSquare className="h-3 w-3" />
            {Number(dispute.comments_count ?? 0)}
          </span>
        </div>
        <span className="text-xs font-semibold text-[#cecac4]">{formatAmount(dispute.amount ?? 0)}</span>
      </div>
    </div>
  );
}

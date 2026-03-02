import { Button } from "@/components/ui/button";
import { useSearchParams, useSetSearchParams } from "@/lib/navigation-shim";

interface PaginationControlsProps {
  totalPages: number;
}

export function PaginationControls({ totalPages }: PaginationControlsProps) {
  const searchParams = useSearchParams();
  const setSearchParams = useSetSearchParams();
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));

  const setPage = (p: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(Math.max(1, Math.min(p, totalPages))));
    setSearchParams(next);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
        Next
      </Button>
    </div>
  );
}

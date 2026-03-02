import { Input } from "@/components/ui/input";
import { useSearchParams, useSetSearchParams } from "@/lib/navigation-shim";

export function UserSearch() {
  const searchParams = useSearchParams();
  const setSearchParams = useSetSearchParams();
  const query = searchParams.get("query") ?? "";

  return (
    <Input
      placeholder="Search users..."
      value={query}
      onChange={(e) => {
        const next = new URLSearchParams(searchParams);
        next.set("query", e.target.value);
        next.set("page", "1");
        setSearchParams(next);
      }}
      className="max-w-sm"
    />
  );
}

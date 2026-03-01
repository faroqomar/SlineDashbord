import { Suspense } from "react";
import { SupportScreen } from "@/features/support/view/SupportScreen";
import { getTickets } from "@/features/support/services/support_actions";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { requireAdminRole } from "@/features/core/security/security_guards";
import { SUPPORT_READ_ROLES } from "@/features/support/models/support.schema";

export default async function SupportPage() {
  // Ensure access
  const { userId } = await requireAdminRole(SUPPORT_READ_ROLES);

  const res = await getTickets();
  const tickets = res.success ? res.data.tickets : [];

  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground animate-pulse">Initializing Support Desk...</p>
        </div>
    </div>}>
      <SupportScreen initialTickets={tickets} adminId={userId} />
    </Suspense>
  );
}

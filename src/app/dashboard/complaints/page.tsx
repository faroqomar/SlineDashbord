import { Suspense } from "react";
import { SupportDashboard } from "@/components/complaints/SupportDashboard";
import { getTickets } from "@/app/actions/support";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function SupportPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }
  
  // We need the admin user ID. 
  // If the auth user is the admin_users entry, we use user.id.
  // If utilizing separate table, we might need to look up.
  // Current assumption: Anth Id = Admin User Id (from Phase 2).
  const adminId = user.id;

  const tickets = await getTickets();

  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full">Loading support dashboard...</div>}>
      <SupportDashboard initialTickets={tickets} adminId={adminId} />
    </Suspense>
  );
}

import { CaseFileLayout } from "@/components/disputes/CaseFileLayout";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getDisputeDetails } from "@/actions/disputes";

// Remove static params for dynamic updates
// export function generateStaticParams() { ... }

export default async function DisputePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let dispute;
  try {
      dispute = await getDisputeDetails(id);
  } catch (error) {
      console.error(error);
  }

  if (!dispute) {
    notFound();
  }

  // Normalize data for CaseFileLayout if needed, or pass as is and update Layout
  // The layout expects 'Dispute' mock type. We might need to map it or relax the type.
  // For now, let's map essential fields.
  const mappedDispute = {
      ...dispute,
      title: dispute.task?.title || "Dispute",
      amount: dispute.task?.price || "0",
      createdAt: dispute.created_at, // Map snake_case to camelCase
      client: dispute.initiator, // Assuming initiator is client for now, need logic
      freelancer: {}, // We might need to fetch freelancer from task
      messages: dispute.messages || [],
      evidence: dispute.evidence || [],
  };

  return (
    <div className="space-y-4 h-full">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/disputes">
            <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Disputes
            </Button>
        </Link>
      </div>
      <CaseFileLayout dispute={mappedDispute} />
    </div>
  );
}

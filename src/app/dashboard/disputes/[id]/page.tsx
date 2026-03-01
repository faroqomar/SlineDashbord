import { CaseFileLayout } from "@/components/disputes/CaseFileLayout";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getDisputeDetails } from "@/features/disputes/services/dispute_actions";
import { TimelineEvent } from "@/data/mock/disputes";

// Remove static params for dynamic updates
// export function generateStaticParams() { ... }

export default async function DisputePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let disputeData;
  try {
      const res = await getDisputeDetails(id);
      disputeData = res.success ? res.data : null;
  } catch (error) {
      console.error(error);
  }

  if (!disputeData) {
    notFound();
  }

  // Determine Client vs Freelancer
  const isComplainantClient = disputeData.complainant.role === 'client';
  const client = isComplainantClient ? disputeData.complainant : disputeData.defendant;
  const freelancer = isComplainantClient ? disputeData.defendant : disputeData.complainant;

  // Construct Timeline
  const timeline: TimelineEvent[] = [
    {
      id: '1',
      timestamp: disputeData.created_at,
      title: 'Dispute Filed',
      description: `Dispute opened by ${disputeData.complainant.full_name}`,
      actor: (isComplainantClient ? 'Client' : 'Freelancer') as "Client" | "Freelancer",
      type: 'creation' as const
    }
  ];

  if (disputeData.status === 'resolved' || disputeData.status === 'dismissed') {
      timeline.unshift({
          id: '2',
          timestamp: disputeData.resolved_at || new Date().toISOString(),
          title: `Dispute ${disputeData.status === 'resolved' ? 'Resolved' : 'Dismissed'}`,
          description: disputeData.resolution || 'Case closed.',
          actor: 'Admin' as const,
          type: 'resolution' as const
      });
  }

  const mappedDispute = {
      id: disputeData.id,
      jobId: disputeData.task_id,
      title: disputeData.task_title || "Dispute Case",
      status: (disputeData.status.charAt(0).toUpperCase() + disputeData.status.slice(1)) as any, 
      priority: "Medium" as const,
      amount: disputeData.amount.toString(),
      currency: "USD" as const,
      client: {
          id: client.id,
          name: client.full_name,
          email: client.email,
          avatar: client.avatar_url,
          rating: 0, 
          totalSpent: "IQD 0"
      },
      freelancer: {
          id: freelancer.id,
          name: freelancer.full_name,
          email: freelancer.email,
          avatar: freelancer.avatar_url,
          rating: 0,
          totalEarned: "IQD 0"
      },
      reason: "Other" as const,
      description: disputeData.reason,
      messages: disputeData.messages.map((m: any) => ({
          id: m.id,
          sender: m.is_admin ? 'Admin' : (m.sender?.full_name || 'System'),
          content: m.content,
          timestamp: m.created_at
      })), 
      evidence: disputeData.evidence.map((e: any) => ({
          id: e.id,
          name: e.description || e.file_url.split('/').pop() || 'File',
          type: (e.file_type?.includes('image') ? 'image' : e.file_type?.includes('video') ? 'video' : 'document') as any,
          url: e.file_url,
          size: 'Unknown', // No file_size column in schema currently
          uploadedBy: e.uploader?.full_name || 'System',
          uploadedAt: e.created_at
      })), 
      timeline: timeline,
      createdAt: disputeData.created_at,
      updatedAt: disputeData.resolved_at || disputeData.created_at,
      resolutionOptions: {
          canRefund: true,
          canRelease: true,
          canSplit: true
      }
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

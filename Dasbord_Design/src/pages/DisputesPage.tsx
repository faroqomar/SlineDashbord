import { useState } from "react";
import {
  Scale,
  Clock,
  AlertTriangle,
  FileText,
  Download,
  ChevronRight,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Image,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { PriorityBadge } from "@/components/dashboard/PriorityBadge";
import { FilterPanel } from "@/components/dashboard/FilterPanel";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface Dispute {
  id: string;
  title: string;
  status: "open" | "under_review" | "resolved" | "escalated";
  priority: "high" | "medium" | "low";
  slaRemaining: string;
  slaUrgent: boolean;
  amount: number;
  client: {
    name: string;
    avatar: string;
    email: string;
  };
  freelancer: {
    name: string;
    avatar: string;
    email: string;
  };
  createdAt: string;
  description: string;
  clientEvidence: {
    type: "text" | "image" | "file";
    content: string;
    name?: string;
  }[];
  freelancerEvidence: {
    type: "text" | "image" | "file";
    content: string;
    name?: string;
  }[];
  timeline: {
    id: string;
    action: string;
    actor: string;
    timestamp: string;
    details?: string;
  }[];
}

const mockDisputes: Dispute[] = [
  {
    id: "DSP-001",
    title: "Quality of delivered work below expectations",
    status: "open",
    priority: "high",
    slaRemaining: "2h 30m",
    slaUrgent: true,
    amount: 1500,
    client: {
      name: "Michael Brown",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      email: "michael@client.com",
    },
    freelancer: {
      name: "John Doe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      email: "john@freelancer.com",
    },
    createdAt: "Mar 10, 2024",
    description: "The client claims the delivered website does not match the agreed specifications. The freelancer maintains all requirements were met as per the original brief.",
    clientEvidence: [
      { type: "text", content: "The navigation menu doesn't match the wireframe we agreed on. Missing 3 pages." },
      { type: "image", content: "/placeholder.svg", name: "wireframe_comparison.png" },
      { type: "file", content: "/file", name: "original_requirements.pdf" },
    ],
    freelancerEvidence: [
      { type: "text", content: "All pages were delivered as per the final approved scope. The client requested changes after the deadline." },
      { type: "image", content: "/placeholder.svg", name: "delivered_screenshots.png" },
      { type: "file", content: "/file", name: "approved_scope.pdf" },
    ],
    timeline: [
      { id: "1", action: "Dispute created", actor: "Michael Brown", timestamp: "Mar 10, 2024, 10:00 AM" },
      { id: "2", action: "Freelancer responded", actor: "John Doe", timestamp: "Mar 10, 2024, 11:30 AM" },
      { id: "3", action: "Assigned for review", actor: "Admin Team", timestamp: "Mar 10, 2024, 12:00 PM", details: "Priority set to high due to amount" },
    ],
  },
  {
    id: "DSP-002",
    title: "Project deadline missed by freelancer",
    status: "under_review",
    priority: "medium",
    slaRemaining: "12h",
    slaUrgent: false,
    amount: 800,
    client: {
      name: "Sarah Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      email: "sarah@client.com",
    },
    freelancer: {
      name: "Emily Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
      email: "emily@freelancer.com",
    },
    createdAt: "Mar 9, 2024",
    description: "Freelancer delivered the project 5 days late without prior notice.",
    clientEvidence: [],
    freelancerEvidence: [],
    timeline: [],
  },
];

const filterOptions = [
  {
    key: "status",
    label: "Status",
    type: "select" as const,
    options: [
      { value: "open", label: "Open" },
      { value: "under_review", label: "Under Review" },
      { value: "resolved", label: "Resolved" },
      { value: "escalated", label: "Escalated" },
    ],
  },
  {
    key: "priority",
    label: "Priority",
    type: "select" as const,
    options: [
      { value: "high", label: "High" },
      { value: "medium", label: "Medium" },
      { value: "low", label: "Low" },
    ],
  },
];

export default function DisputesPage() {
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(mockDisputes[0]);
  const [resolution, setResolution] = useState("");
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [resolutionType, setResolutionType] = useState<"full_client" | "full_freelancer" | "split" | null>(null);

  const getStatusType = (status: Dispute["status"]) => {
    switch (status) {
      case "open": return "open";
      case "under_review": return "pending";
      case "resolved": return "resolved";
      case "escalated": return "error";
      default: return "info";
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Dispute List */}
      <div className="w-full lg:w-96 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Disputes</h1>
            <Badge variant="destructive">8 Active</Badge>
          </div>
          <FilterPanel
            filters={filterOptions}
            onFilterChange={(filters) => console.log(filters)}
            onSearch={(query) => console.log(query)}
            searchPlaceholder="Search disputes..."
          />
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {mockDisputes.map((dispute) => (
              <div
                key={dispute.id}
                onClick={() => setSelectedDispute(dispute)}
                className={cn(
                  "p-4 rounded-lg cursor-pointer transition-colors border-l-4",
                  selectedDispute?.id === dispute.id
                    ? "bg-accent border-l-primary"
                    : "hover:bg-muted border-l-transparent"
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs text-muted-foreground">{dispute.id}</span>
                  <div className="flex gap-1">
                    <PriorityBadge priority={dispute.priority} />
                  </div>
                </div>
                <h3 className="font-medium text-sm line-clamp-2 mb-2">{dispute.title}</h3>
                
                {/* SLA Timer */}
                <div className={cn(
                  "flex items-center gap-2 text-xs mb-3",
                  dispute.slaUrgent ? "sla-urgent" : "sla-normal"
                )}>
                  <Clock className="w-3.5 h-3.5" />
                  <span>SLA: {dispute.slaRemaining}</span>
                </div>

                {/* Parties */}
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    <Avatar className="w-6 h-6 border-2 border-background">
                      <AvatarImage src={dispute.client.avatar} />
                      <AvatarFallback>{dispute.client.name[0]}</AvatarFallback>
                    </Avatar>
                    <Avatar className="w-6 h-6 border-2 border-background">
                      <AvatarImage src={dispute.freelancer.avatar} />
                      <AvatarFallback>{dispute.freelancer.name[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                  <span className="text-sm font-semibold">${dispute.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Dispute Details */}
      {selectedDispute ? (
        <div className="hidden lg:flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-muted-foreground">{selectedDispute.id}</span>
                  <StatusBadge
                    status={getStatusType(selectedDispute.status)}
                    label={selectedDispute.status.replace("_", " ")}
                  />
                  <PriorityBadge priority={selectedDispute.priority} />
                </div>
                <h2 className="text-lg font-semibold">{selectedDispute.title}</h2>
              </div>
              <div className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg",
                selectedDispute.slaUrgent ? "bg-destructive/10" : "bg-muted"
              )}>
                <Clock className={cn("w-4 h-4", selectedDispute.slaUrgent && "text-destructive")} />
                <div className="text-sm">
                  <div className="text-muted-foreground">SLA Remaining</div>
                  <div className={cn("font-semibold", selectedDispute.slaUrgent && "text-destructive")}>
                    {selectedDispute.slaRemaining}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{selectedDispute.description}</p>
            <div className="flex items-center gap-4 mt-3">
              <Badge variant="outline">Amount: ${selectedDispute.amount}</Badge>
              <span className="text-sm text-muted-foreground">Created: {selectedDispute.createdAt}</span>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex">
            {/* Main Content - Two Column */}
            <div className="flex-1 overflow-auto">
              <div className="p-4 grid grid-cols-2 gap-4">
                {/* Client Side */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={selectedDispute.client.avatar} />
                        <AvatarFallback>{selectedDispute.client.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{selectedDispute.client.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">Client</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm font-medium">Evidence & Claims</div>
                    {selectedDispute.clientEvidence.map((evidence, i) => (
                      <div key={i} className="p-3 bg-muted rounded-lg">
                        {evidence.type === "text" && (
                          <p className="text-sm">{evidence.content}</p>
                        )}
                        {evidence.type === "image" && (
                          <div className="flex items-center gap-2">
                            <Image className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-primary hover:underline cursor-pointer">
                              {evidence.name}
                            </span>
                          </div>
                        )}
                        {evidence.type === "file" && (
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-primary hover:underline cursor-pointer">
                              {evidence.name}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Freelancer Side */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={selectedDispute.freelancer.avatar} />
                        <AvatarFallback>{selectedDispute.freelancer.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{selectedDispute.freelancer.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">Freelancer</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm font-medium">Evidence & Response</div>
                    {selectedDispute.freelancerEvidence.map((evidence, i) => (
                      <div key={i} className="p-3 bg-muted rounded-lg">
                        {evidence.type === "text" && (
                          <p className="text-sm">{evidence.content}</p>
                        )}
                        {evidence.type === "image" && (
                          <div className="flex items-center gap-2">
                            <Image className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-primary hover:underline cursor-pointer">
                              {evidence.name}
                            </span>
                          </div>
                        )}
                        {evidence.type === "file" && (
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-primary hover:underline cursor-pointer">
                              {evidence.name}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Resolution Panel */}
              <div className="p-4 border-t border-border">
                <h3 className="font-medium mb-4">Resolution</h3>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <Button
                    variant={resolutionType === "full_client" ? "default" : "outline"}
                    className="flex flex-col h-auto py-4"
                    onClick={() => setResolutionType("full_client")}
                  >
                    <User className="w-5 h-5 mb-2" />
                    <span className="text-sm font-medium">Full refund to client</span>
                    <span className="text-xs text-muted-foreground">${selectedDispute.amount}</span>
                  </Button>
                  <Button
                    variant={resolutionType === "split" ? "default" : "outline"}
                    className="flex flex-col h-auto py-4"
                    onClick={() => setResolutionType("split")}
                  >
                    <Scale className="w-5 h-5 mb-2" />
                    <span className="text-sm font-medium">Split payment</span>
                    <span className="text-xs text-muted-foreground">50/50</span>
                  </Button>
                  <Button
                    variant={resolutionType === "full_freelancer" ? "default" : "outline"}
                    className="flex flex-col h-auto py-4"
                    onClick={() => setResolutionType("full_freelancer")}
                  >
                    <User className="w-5 h-5 mb-2" />
                    <span className="text-sm font-medium">Pay freelancer</span>
                    <span className="text-xs text-muted-foreground">${selectedDispute.amount}</span>
                  </Button>
                </div>

                <Textarea
                  placeholder="Add resolution notes..."
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="mb-4"
                />

                <div className="flex gap-2">
                  <Button className="flex-1" disabled={!resolutionType} onClick={() => setShowResolveDialog(true)}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Resolve Dispute
                  </Button>
                  <Button variant="outline">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Escalate
                  </Button>
                </div>
              </div>
            </div>

            {/* Timeline Sidebar */}
            <div className="w-72 border-l border-border bg-muted/30 flex flex-col">
              <div className="p-4 border-b border-border">
                <h3 className="font-medium">Audit Trail</h3>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {selectedDispute.timeline.map((event, index) => (
                    <div key={event.id} className="relative pl-6">
                      {index < selectedDispute.timeline.length - 1 && (
                        <div className="absolute left-[7px] top-6 bottom-0 w-0.5 bg-border" />
                      )}
                      <div className="absolute left-0 top-1 w-3.5 h-3.5 rounded-full border-2 border-primary bg-background" />
                      <div>
                        <p className="text-sm font-medium">{event.action}</p>
                        <p className="text-xs text-muted-foreground">{event.actor}</p>
                        {event.details && (
                          <p className="text-xs text-muted-foreground mt-1">{event.details}</p>
                        )}
                        <p className="text-2xs text-muted-foreground mt-1">{event.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center text-muted-foreground">
          Select a dispute to view details
        </div>
      )}

      {/* Resolve Confirmation */}
      <ConfirmDialog
        open={showResolveDialog}
        onOpenChange={setShowResolveDialog}
        type="success"
        title="Resolve Dispute"
        description={`This will resolve the dispute with a ${resolutionType?.replace("_", " ")} decision. Both parties will be notified.`}
        confirmLabel="Confirm Resolution"
        onConfirm={() => {
          console.log("Resolved:", resolutionType, resolution);
          setShowResolveDialog(false);
        }}
      />
    </div>
  );
}

import { Dispute } from "@/data/mock/disputes";
import { EvidenceGallery } from "./EvidenceGallery";
import { Timeline } from "./Timeline";
import { ResolutionModal } from "./ResolutionModal";
import { DisputeMessages } from "./DisputeMessages";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { MessageSquare, FileText, AlertTriangle, CheckCircle, Clock, Gavel, ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

interface CaseFileLayoutProps {
  dispute: Dispute;
}

export function CaseFileLayout({ dispute }: CaseFileLayoutProps) {
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "Investigating": return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20";
      case "Mediation": return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20";
      case "Resolved": return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      default: return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-100px)]">
      {/* LEFT COLUMN: Summary (3 cols) */}
      <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
        <Card className="flex-1 overflow-hidden flex flex-col">
          <CardHeader className="bg-muted/30 pb-4">
             <div className="flex justify-between items-start mb-2">
                 <Badge variant="outline" className={getStatusColor(dispute.status)}>
                    {dispute.status}
                 </Badge>
                 <Badge variant="outline">{dispute.priority} Priority</Badge>
             </div>
            <CardTitle className="text-lg leading-tight">{dispute.title}</CardTitle>
            <CardDescription className="font-mono text-xs">ID: {dispute.id}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto pt-6 space-y-6">
            
            {/* Resolution Action */}
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                <h4 className="text-xs font-semibold uppercase text-primary mb-3 flex items-center gap-2">
                    <Gavel className="h-3 w-3" /> Admin Actions
                </h4>
                <ResolutionModal dispute={dispute} />
            </div>

            <Separator />
            
            {/* Amount */}
            <div>
                 <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Dispute Amount</h4>
                 <div className="text-2xl font-bold font-mono text-primary">
                    {dispute.currency === 'USD' ? '$' : ''}{dispute.amount} {dispute.currency}
                 </div>
            </div>

            <Separator />

             {/* Involved Parties */}
             <div className="space-y-4">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground">Involved Parties</h4>
                
                {/* Client */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border/50">
                    <Avatar>
                        <AvatarImage src={dispute.client.avatar} />
                        <AvatarFallback>{dispute.client.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium truncate">{dispute.client.name}</p>
                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5">Client</Badge>
                    </div>
                </div>

                <div className="flex justify-center">
                    <div className="h-4 w-px bg-border"></div>
                </div>

                {/* Freelancer */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border/50">
                    <Avatar>
                        <AvatarImage src={dispute.freelancer.avatar} />
                        <AvatarFallback>{dispute.freelancer.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium truncate">{dispute.freelancer.name}</p>
                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5">Freelancer</Badge>
                    </div>
                </div>
             </div>
             
             <Separator />

             {/* Description */}
             <div>
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Details</h4>
                <p className="text-sm text-foreground/80 leading-relaxed">
                    {dispute.description}
                </p>
             </div>

          </CardContent>
        </Card>
      </div>

      {/* CENTER COLUMN: Content (6 cols) */}
      <div className="col-span-12 lg:col-span-6 flex flex-col">
        <Tabs defaultValue="messages" className="flex-1 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="messages" className="gap-2">
                        <MessageSquare className="h-4 w-4" /> Messages
                    </TabsTrigger>
                    <TabsTrigger value="evidence" className="gap-2">
                        <FileText className="h-4 w-4" /> Evidence
                    </TabsTrigger>
                </TabsList>
            </div>

            <Card className="flex-1 overflow-hidden flex flex-col border-dashed border-2">
                <CardContent className="p-0 flex-1 flex flex-col h-full relative">
                    <TabsContent value="messages" className="flex-1 p-0 m-0 data-[state=active]:flex flex-col h-full absolute inset-0">
                         <DisputeMessages messages={dispute.messages} />
                    </TabsContent>
                    
                    <TabsContent value="evidence" className="flex-1 p-6 m-0 overflow-y-auto absolute inset-0 bg-background">
                        <EvidenceGallery evidence={dispute.evidence} />
                    </TabsContent>
                </CardContent>
            </Card>
        </Tabs>
      </div>

     {/* RIGHT COLUMN: Timeline (3 cols) */}
      <div className="col-span-12 lg:col-span-3 flex flex-col">
         <Card className="flex-1 overflow-hidden bg-background">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Case Timeline</CardTitle>
            </CardHeader>
            <CardContent className="h-full pt-2">
                <Timeline events={dispute.timeline} />
            </CardContent>
         </Card>
      </div>

    </div>
  );
}

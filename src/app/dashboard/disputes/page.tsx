"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MOCK_DISPUTES, Dispute } from "@/data/mock/disputes";
import { AlertCircle, Clock, CheckCircle, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DisputesPage() {
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);

  const getStatusColor = (status: Dispute["status"]) => {
    switch (status) {
      case "Open": return "bg-destructive text-destructive-foreground";
      case "Investigating": return "bg-warning text-warning-foreground";
      case "Resolved": return "bg-success text-success-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusIcon = (status: Dispute["status"]) => {
    switch (status) {
      case "Open": return AlertCircle;
      case "Investigating": return Clock;
      case "Resolved": return CheckCircle;
      default: return AlertCircle;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-10rem)]">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dispute Center</h2>
        <div className="flex gap-2">
            <Button variant="outline">List View</Button>
            <Button>Kanban View</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {["Open", "Investigating", "Resolved"].map((status) => (
          <div key={status} className="flex flex-col h-full bg-secondary/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">{status}</h3>
              <Badge variant="outline" className="bg-background">
                {MOCK_DISPUTES.filter(d => d.status === status).length}
              </Badge>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="space-y-3 pr-4">
                {MOCK_DISPUTES.filter(d => d.status === status).map((dispute) => (
                   <Sheet key={dispute.id}>
                    <SheetTrigger asChild>
                        <Card 
                            className="cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
                            onClick={() => setSelectedDispute(dispute)}
                        >
                            <CardHeader className="p-4 space-y-2">
                            <div className="flex justify-between items-start">
                                <Badge className={getStatusColor(dispute.status as any)}>
                                    {dispute.status}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{dispute.createdAt}</span>
                            </div>
                            <CardTitle className="text-sm font-medium line-clamp-1">
                                {dispute.reason}
                            </CardTitle>
                             <CardDescription className="text-xs">
                                ID: {dispute.id} • {dispute.amount}
                            </CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                                    <div className="flex -space-x-2">
                                         <Avatar className="h-6 w-6 border-2 border-background">
                                            <AvatarImage src={dispute.client.avatar} />
                                            <AvatarFallback>C</AvatarFallback>
                                        </Avatar>
                                         <Avatar className="h-6 w-6 border-2 border-background">
                                            <AvatarImage src={dispute.freelancer.avatar} />
                                            <AvatarFallback>F</AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MessageSquare className="h-3 w-3" />
                                        {dispute.messages.length}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </SheetTrigger>
                    <SheetContent className="w-[400px] sm:w-[540px] flex flex-col h-full">
                        <SheetHeader className="mb-4">
                            <SheetTitle className="flex items-center gap-2">
                                Dispute Details
                                <Badge variant="outline">{dispute.id}</Badge>
                            </SheetTitle>
                            <SheetDescription>
                                Opened on {dispute.createdAt} for Job #{dispute.jobId}
                            </SheetDescription>
                        </SheetHeader>
                        
                        <div className="flex-1 flex flex-col overflow-hidden">
                             {/* Participants */}
                             <div className="flex justify-between items-center p-4 bg-secondary/50 rounded-lg mb-4">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={dispute.client.avatar} />
                                        <AvatarFallback>C</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">Client</p>
                                        <p className="text-xs text-muted-foreground">{dispute.client.name}</p>
                                    </div>
                                </div>
                                <div className="h-px w-8 bg-muted-foreground/30"></div>
                                 <div className="flex items-center gap-2 text-right">
                                    <div>
                                        <p className="text-sm font-medium">Freelancer</p>
                                        <p className="text-xs text-muted-foreground">{dispute.freelancer.name}</p>
                                    </div>
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={dispute.freelancer.avatar} />
                                        <AvatarFallback>F</AvatarFallback>
                                    </Avatar>
                                </div>
                             </div>

                             <h4 className="text-sm font-semibold mb-2">Message History</h4>
                             <ScrollArea className="flex-1 pr-4 -mr-4">
                                <div className="space-y-4 pr-4">
                                    {dispute.messages.map((msg) => (
                                        <div 
                                            key={msg.id} 
                                            className={cn(
                                                "flex flex-col max-w-[80%] rounded-lg p-3 text-sm",
                                                msg.sender === 'Admin' ? "bg-primary text-primary-foreground self-center items-center w-full max-w-full my-2 text-center" : 
                                                msg.sender === 'Client' ? "bg-muted self-start" : "bg-blue-100 dark:bg-blue-900/30 self-end items-end"
                                            )}
                                        >
                                            <span className="text-xs opacity-70 mb-1">{msg.sender} • {msg.timestamp}</span>
                                            <p>{msg.content}</p>
                                        </div>
                                    ))}
                                    {dispute.messages.length === 0 && (
                                        <div className="text-center text-muted-foreground py-8 text-sm">
                                            No messages in this dispute yet.
                                        </div>
                                    )}
                                </div>
                             </ScrollArea>
                        </div>

                        <SheetFooter className="mt-4 pt-4 border-t flex-col sm:flex-col gap-2">
                            <div className="grid grid-cols-2 gap-2 w-full">
                                <Button variant="destructive" className="w-full">
                                    Refund Client
                                </Button>
                                <Button className="w-full bg-success hover:bg-success/90">
                                    Release to Freelancer
                                </Button>
                            </div>
                            <Button variant="outline" className="w-full">
                                Request More Info
                            </Button>
                        </SheetFooter>
                    </SheetContent>
                   </Sheet>
                ))}
              </div>
            </ScrollArea>
          </div>
        ))}
      </div>
    </div>
  );
}

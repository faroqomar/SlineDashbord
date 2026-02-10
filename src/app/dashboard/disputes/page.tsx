import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Clock, CheckCircle, MessageSquare, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { getDisputes } from "@/app/actions/disputes";

export default async function DisputesPage() {
  const [openDisputes, investigatingDisputes, resolvedDisputes] = await Promise.all([
    getDisputes(1, 'open', 50),
    getDisputes(1, 'investigating', 50),
    getDisputes(1, 'resolved', 50)
  ]);

  const columns = [
    { title: "Open", status: "open", data: openDisputes.disputes, color: "text-red-500", bgColor: "bg-red-500/10", borderColor: "border-red-500/20" },
    { title: "Investigating", status: "investigating", data: investigatingDisputes.disputes, color: "text-orange-500", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/20" },
    { title: "Resolved", status: "resolved", data: resolvedDisputes.disputes, color: "text-green-500", bgColor: "bg-green-500/10", borderColor: "border-green-500/20" }
  ];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "open": return "destructive";
      case "investigating": return "secondary"; // Custom styling applied in className
      case "resolved": return "outline";
      default: return "secondary";
    }
  };

  const getStatusClassName = (status: string) => {
      switch (status) {
          case "open": return "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20";
          case "investigating": return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20";
          case "resolved": return "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20";
          default: return "";
      }
  }

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
        {columns.map((col) => (
          <div key={col.status} className="flex flex-col h-full bg-secondary/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">{col.title}</h3>
              <Badge variant="outline" className="bg-background">
                {col.data.length}
              </Badge>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="space-y-3 pr-4">
                {col.data.map((dispute: any) => (
                    <Link key={dispute.id} href={`/dashboard/disputes/${dispute.id}`} className="block">
                         <Card 
                             className="cursor-pointer hover:shadow-md transition-all active:scale-[0.98] border-l-4"
                             style={{ borderLeftColor: col.status === 'open' ? 'red' : col.status === 'investigating' ? 'orange' : 'green' }}
                         >
                             <CardHeader className="p-4 space-y-2">
                             <div className="flex justify-between items-start">
                                 <Badge variant="outline" className={getStatusClassName(dispute.status)}>
                                     {dispute.status}
                                 </Badge>
                                 <span className="text-xs text-muted-foreground">{new Date(dispute.created_at).toLocaleDateString()}</span>
                             </div>
                             <CardTitle className="text-sm font-medium line-clamp-1">
                                 {dispute.task?.title || "Dispute Case"}
                             </CardTitle>
                              <CardDescription className="text-xs flex items-center gap-2">
                                 <span className="font-mono text-[10px] text-muted-foreground">{dispute.id.slice(0, 8)}...</span>
                                 <span>•</span>
                                 <span className="font-semibold text-primary">${dispute.amount?.toFixed(2) || "0.00"}</span>
                             </CardDescription>
                             </CardHeader>
                             <CardContent className="p-4 pt-0">
                                 <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                                     <div className="flex -space-x-2">
                                         {/* We might need to fetch participants or just show complainant */}
                                          <Avatar className="h-6 w-6 border-2 border-background">
                                             <AvatarImage src={dispute.complainant?.avatar_url} />
                                             <AvatarFallback>{dispute.complainant?.full_name?.charAt(0) || "?"}</AvatarFallback>
                                         </Avatar>
                                     </div>
                                 </div>
                             </CardContent>
                         </Card>
                    </Link>
                ))}
                {col.data.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground text-sm">
                        No {col.status} disputes.
                    </div>
                )}
              </div>
            </ScrollArea>
          </div>
        ))}
      </div>
    </div>
  );
}

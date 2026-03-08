import React, { useState } from 'react';
import { useDisputeDetailViewModel } from '../viewmodels/use_dispute_detail_viewmodel';
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
    CardDescription, 
    CardFooter 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
    ArrowLeft, 
    ShieldAlert, 
    User, 
    Briefcase, 
    MessageCircle, 
    FileText, 
    CheckCircle2, 
    XCircle,
    Scale,
    AlertTriangle,
    Download
} from "lucide-react";
import { Link, useParams } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function DisputeDetailScreen() {
    const { disputeId } = useParams({ from: '/auth/disputes/$disputeId' } as any);
    const vm = useDisputeDetailViewModel(disputeId);
    const [resolutionNote, setResolutionNote] = useState("");
    const [resolutionStatus, setResolutionStatus] = useState("resolved");
    const [financialDecision, setFinancialDecision] = useState("none");

    if (vm.isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!vm.dispute) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold italic opacity-50">Dispute not found</h2>
                <Link to="/disputes">
                    <Button variant="link">Back to Dispute Center</Button>
                </Link>
            </div>
        );
    }

    const { dispute } = vm;

    const handleResolve = () => {
        vm.resolve({
            status: resolutionStatus,
            resolution: resolutionNote,
            decision: financialDecision === "none" ? undefined : financialDecision
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/disputes">
                        <Button variant="ghost" size="sm" className="h-8">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                    </Link>
                    <div className="h-4 w-[1px] bg-border hidden sm:block" />
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">Case Investigation</h2>
                        <p className="text-xs text-muted-foreground font-mono italic opacity-70">CASE-{dispute.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Badge variant="outline" className={cn("px-4 py-1 border-2", 
                        dispute.status === 'open' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                        dispute.status === 'resolved' ? "bg-green-500/10 text-green-500 border-green-500/20" :
                        "bg-orange-500/10 text-orange-500 border-orange-500/20"
                    )}>
                        {dispute.status.toUpperCase()}
                    </Badge>
                    {dispute.status !== 'resolved' && (
                        <Button size="sm" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2 px-6" onClick={() => vm.setIsResolving(true)}>
                            <Scale className="h-4 w-4" /> Resolve Case
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-12 overflow-visible">
                {/* Left Column: Details & Evidence */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Summary Card */}
                    <Card className="glass-card !border-none !shadow-2xl overflow-hidden relative">
                         <div className="absolute top-0 right-0 p-4 opacity-5">
                            <ShieldAlert size={120} />
                         </div>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-primary" />
                                Incident Context
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="bg-muted/10 p-5 rounded-2xl border border-primary/5 italic shadow-inner relative overflow-hidden">
                                <span className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
                                <h4 className="text-xs font-bold uppercase text-primary/60 mb-2">Complainant's Reason</h4>
                                <p className="text-sm leading-relaxed text-foreground/90">
                                    "{dispute.reason}"
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-muted/20 border border-muted-foreground/10 space-y-3">
                                    <h5 className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2">
                                        <Briefcase className="h-3 w-3" /> Linked Project
                                    </h5>
                                    <div>
                                        <div className="font-bold text-sm truncate">{dispute.task?.title}</div>
                                        <div className="text-[10px] font-mono text-primary font-bold">IQD {dispute.amount?.toLocaleString()} Escrow</div>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-muted/20 border border-muted-foreground/10 space-y-3">
                                    <h5 className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2">
                                        <Scale className="h-3 w-3" /> Creation Timestamp
                                    </h5>
                                    <div>
                                        <div className="font-bold text-sm">{new Date(dispute.created_at).toLocaleDateString()}</div>
                                        <div className="text-[10px] text-muted-foreground">{new Date(dispute.created_at).toLocaleTimeString()}</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Messages/Evidence Log */}
                    <Card className="glass-card !border-none !shadow-lg">
                        <CardHeader className="border-b bg-muted/10 pb-4">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <MessageCircle className="h-4 w-4 text-primary" />
                                Evidence & Communication Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                             {dispute.messages?.length === 0 && dispute.evidence?.length === 0 ? (
                                <div className="p-12 text-center text-sm text-muted-foreground italic">
                                    No statements or evidence provided yet for this investigation.
                                </div>
                             ) : (
                                <ScrollArea className="h-[400px]">
                                    <div className="p-4 space-y-6 relative">
                                        {/* Discussion Thread */}
                                        {dispute.messages?.map((msg: any) => (
                                            <div key={msg.id} className={cn("flex gap-3 max-w-[85%]", msg.is_admin ? "ml-auto flex-row-reverse text-right" : "")}>
                                                <Avatar className="h-8 w-8 ring-2 ring-background shrink-0 mt-1">
                                                    <AvatarFallback className={msg.is_admin ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}>
                                                        {msg.sender?.full_name?.charAt(0) || "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 mb-1 justify-end">
                                                        <span className="text-[9px] font-bold uppercase opacity-50">{msg.sender?.full_name}</span>
                                                        <span className="text-[9px] opacity-40">{new Date(msg.created_at).toLocaleTimeString()}</span>
                                                    </div>
                                                    <div className={cn(
                                                        "p-3 rounded-2xl text-xs",
                                                        msg.is_admin ? "bg-primary text-primary-foreground rounded-tr-none shadow-md shadow-primary/10" : "bg-muted rounded-tl-none"
                                                    )}>
                                                        {msg.content}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Evidence Attachments */}
                                        {dispute.evidence?.map((file: any) => (
                                            <div key={file.id} className="p-4 rounded-xl border-2 border-dashed border-primary/10 bg-primary/5 flex items-center justify-between group">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                        <FileText className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-bold">{file.description || "Evidence Document"}</div>
                                                        <div className="text-[10px] text-primary/60 font-mono">By {file.uploader?.full_name}</div>
                                                    </div>
                                                </div>
                                                <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                             )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Participants */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="glass-card !border-none !shadow-lg">
                        <CardHeader className="bg-muted/10 border-b pb-4">
                            <CardTitle className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                                <User className="h-3.5 w-3.5" />
                                Involved Entities
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-8">
                            {/* Complainant */}
                            <div className="relative">
                                <div className="text-[9px] font-black text-red-500 absolute -top-4 left-0 uppercase">Complainant / Reporter</div>
                                <div className="flex items-center gap-4 group">
                                    <Avatar className="h-12 w-12 border-2 border-red-500/20 ring-4 ring-background shadow-xl">
                                        <AvatarImage src={dispute.complainant?.avatar_url} />
                                        <AvatarFallback className="bg-red-500/10 text-red-500">{dispute.complainant?.full_name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-sm tracking-tight">{dispute.complainant?.full_name}</div>
                                        <div className="text-[10px] text-muted-foreground italic truncate">{dispute.complainant?.email}</div>
                                        <Link to={`/users/${dispute.complainant?.id}` as any} className="text-[9px] font-black text-primary hover:underline mt-1 block uppercase">Audit Profile</Link>
                                    </div>
                                </div>
                            </div>

                            <Separator className="opacity-30" />

                            {/* Defendant */}
                            <div className="relative">
                                <div className="text-[9px] font-black text-orange-500 absolute -top-4 left-0 uppercase">Defendant / Subject</div>
                                <div className="flex items-center gap-4 group">
                                    <Avatar className="h-12 w-12 border-2 border-orange-500/20 ring-4 ring-background shadow-xl">
                                        <AvatarImage src={dispute.defendant?.avatar_url} />
                                        <AvatarFallback className="bg-orange-500/10 text-orange-500">{dispute.defendant?.full_name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-sm tracking-tight">{dispute.defendant?.full_name}</div>
                                        <div className="text-[10px] text-muted-foreground italic truncate">{dispute.defendant?.email}</div>
                                        <Link to={`/users/${dispute.defendant?.id}` as any} className="text-[9px] font-black text-primary hover:underline mt-1 block uppercase">Audit Profile</Link>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pro-active Tip */}
                    <Card className="bg-orange-500/5 border-orange-500/20 shadow-none border-dashed border-2">
                        <CardHeader className="p-4 pb-0">
                            <CardTitle className="text-xs font-bold text-orange-600 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                Legal Audit Notice
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 text-[11px] text-orange-600/80 leading-snug italic">
                            Administrators are required to review all evidence before executing financial decisions. 
                            Escrow reversals are immediate and can only be undone via manual ledger correction.
                        </CardContent>
                    </Card>

                    {/* RESOLUTION HISTORY if resolved */}
                    {dispute.status === 'resolved' && dispute.resolution && (
                         <Card className="bg-green-500/5 border-green-500/20 shadow-none border-2 border-solid">
                             <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-xs font-bold text-green-600 flex items-center gap-2 uppercase tracking-wide">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Final Resolution Note
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 text-xs text-green-700/80 italic leading-relaxed">
                                {dispute.resolution}
                                {dispute.resolved_at && (
                                    <div className="mt-2 font-mono text-[9px] opacity-60">Resolved on: {new Date(dispute.resolved_at).toLocaleString()}</div>
                                )}
                            </CardContent>
                         </Card>
                    )}
                </div>
            </div>

            {/* Resolution Dialog */}
            <Dialog open={vm.isResolving} onOpenChange={vm.setIsResolving}>
                <DialogContent className="sm:max-w-[500px] !border-none shadow-2xl p-0 overflow-hidden bg-transparent">
                    {/* Solid backing layer so the panel is never transparent */}
                    <div
                        className="absolute inset-0 rounded-lg -z-10"
                        style={{ backgroundColor: 'hsl(var(--background))' }}
                        aria-hidden
                    />
                    <div className="relative grid gap-4 p-6">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3 text-xl font-black italic">
                            <Scale className="h-6 w-6 text-primary" />
                            Final Case Decision
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            This decision will be permanently logged in the audit trail.
                            Financial triggers will be executed based on your selection.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6 py-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Investigation Decision</label>
                            <Select value={resolutionStatus} onValueChange={setResolutionStatus}>
                                <SelectTrigger className="bg-muted/30">
                                    <SelectValue placeholder="Select outcome" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="resolved">Resolved with Decision</SelectItem>
                                    <SelectItem value="dismissed">Dismiss Case (No fault)</SelectItem>
                                    <SelectItem value="escalated">Escalate to Legal Ops</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {resolutionStatus === 'resolved' && (
                             <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                                <label className="text-[10px] font-black uppercase text-red-500 ml-1">Financial Reconciliation Trigger</label>
                                <Select value={financialDecision} onValueChange={setFinancialDecision}>
                                    <SelectTrigger className="bg-red-500/5 border-red-500/20 text-red-500 font-bold">
                                        <SelectValue placeholder="Choose financial action" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">No Financial Change</SelectItem>
                                        <SelectItem value="refund_client">Refund Full Escrow to Client</SelectItem>
                                        <SelectItem value="release_freelancer">Release Full Escrow to Freelancer</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-[9px] text-muted-foreground italic px-1">
                                    Escrow size: <span className="text-primary font-bold">IQD {dispute.amount?.toLocaleString()}</span>
                                </p>
                             </div>
                        )}

                        <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Official Resolution Reasoning</label>
                             <Textarea 
                                placeholder="State the facts and reasons for this decision..." 
                                className="min-h-[120px] bg-muted/30 text-xs leading-relaxed"
                                value={resolutionNote}
                                onChange={(e) => setResolutionNote(e.target.value)}
                             />
                        </div>
                    </div>

                    <DialogFooter className="gap-3">
                        <Button variant="ghost" className="text-xs" onClick={() => vm.setIsResolving(false)}>
                            Cancel Investigation
                        </Button>
                        <Button 
                            className="bg-primary hover:bg-primary/90 text-xs px-8 shadow-md shadow-primary/20"
                            onClick={handleResolve}
                            disabled={vm.isResolvingAction || resolutionNote.length < 10}
                        >
                            {vm.isResolvingAction ? "Executing Decision..." : "Execute Case Resolution"}
                        </Button>
                    </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

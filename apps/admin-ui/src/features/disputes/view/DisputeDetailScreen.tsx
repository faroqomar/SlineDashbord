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
import { Input } from "@/components/ui/input";
import type { ResolveOutcome } from "@sline/shared";

export function DisputeDetailScreen() {
    const { disputeId } = useParams({ from: '/auth/disputes/$disputeId' } as any);
    const vm = useDisputeDetailViewModel(disputeId);
    const [decisionAction, setDecisionAction] = useState<'cancel' | 'resolve' | null>(null);
    const [reason, setReason] = useState("");
    const [outcome, setOutcome] = useState<ResolveOutcome>("refund_client");
    const [settlementTargetId, setSettlementTargetId] = useState<string>("");
    const [clientRefundAmount, setClientRefundAmount] = useState<string>("");
    const av = vm.actionAvailability;

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
    const heldSettlementCandidates = (dispute?.settlement_candidates ?? []).filter(
        (candidate: { payment_status?: string }) => String(candidate.payment_status ?? "").toLowerCase() === "held"
    );
    const selectedSettlementCandidate =
        heldSettlementCandidates.find((candidate: { target_id: string }) => candidate.target_id === settlementTargetId) ??
        (heldSettlementCandidates.length === 1 ? heldSettlementCandidates[0] : null);
    const splitGrossAmount = Number(selectedSettlementCandidate?.amount_cents ?? 0);
    const splitFeeBps = Number(selectedSettlementCandidate?.fee_rate_bps ?? 0);
    const splitFeeAmount = Math.floor((splitGrossAmount * splitFeeBps) / 10000);
    const splitDistributableAmount = Math.max(splitGrossAmount - splitFeeAmount, 0);
    const splitRefundValue = Math.min(Number(clientRefundAmount || 0), splitDistributableAmount);
    const splitPayoutValue = Math.max(splitDistributableAmount - splitRefundValue, 0);
    const splitEnteredTotal = splitRefundValue + splitPayoutValue;
    const splitHasSettlementBasis = Boolean(selectedSettlementCandidate) && splitDistributableAmount > 0;
    const splitAmountsValid =
        outcome !== 'split_settlement' ||
        (splitHasSettlementBasis && splitEnteredTotal === splitDistributableAmount && splitRefundValue >= 0);

    const settlementTargetLabel = (targetType?: 'booking' | 'task_request' | 'direct_offer') => {
        if (targetType === 'task_request') return 'tender';
        if (targetType === 'direct_offer') return 'direct offer';
        return 'booking';
    };

    const setSplitRefundPreset = (refundAmount: number) => {
        const normalized = Math.min(Math.max(Math.floor(refundAmount), 0), splitDistributableAmount);
        setClientRefundAmount(String(normalized));
    };

    const handleSplitRefundInput = (value: string) => {
        const digitsOnly = value.replace(/[^\d]/g, '');
        if (!digitsOnly) {
            setClientRefundAmount('');
            return;
        }
        setSplitRefundPreset(Number(digitsOnly));
    };

    const handleCancel = () => {
        if (reason.trim().length < 1) return;
        vm.cancel(reason.trim());
    };
    const handleResolve = () => {
        if (reason.trim().length < 1) return;
        const payload: {
            reason: string;
            outcome: ResolveOutcome;
            booking_id?: string;
            task_request_id?: string;
            client_refund_amount?: number;
            freelancer_payout_amount?: number;
        } = { reason: reason.trim(), outcome };
        if (selectedSettlementCandidate?.target_type === 'booking') payload.booking_id = selectedSettlementCandidate.target_id;
        if (selectedSettlementCandidate?.target_type === 'task_request') payload.task_request_id = selectedSettlementCandidate.target_id;
        if (outcome === 'split_settlement') {
            if (!splitAmountsValid) return;
            payload.client_refund_amount = splitRefundValue;
            payload.freelancer_payout_amount = splitPayoutValue;
        }
        vm.resolve(payload);
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
                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className={cn("px-4 py-1 border-2", 
                        dispute.status === 'open' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                        dispute.status === 'resolved' || dispute.status === 'canceled' ? "bg-green-500/10 text-green-500 border-green-500/20" :
                        "bg-orange-500/10 text-orange-500 border-orange-500/20"
                    )}>
                        {dispute.status.toUpperCase()}
                    </Badge>
                    {av.can_accept && (
                        <Button size="sm" variant="secondary" onClick={() => vm.accept()} disabled={vm.isAccepting}>
                            {vm.isAccepting ? "Accepting…" : "Accept (open → active)"}
                        </Button>
                    )}
                    {av.can_cancel && (
                        <Button size="sm" variant="outline" onClick={() => { setDecisionAction('cancel'); setReason(''); vm.setDecisionModalOpen(true); }} disabled={vm.isCanceling}>
                            Cancel dispute
                        </Button>
                    )}
                    {av.can_resolve && (
                        <Button size="sm" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2" onClick={() => { setDecisionAction('resolve'); setReason(''); setOutcome('refund_client'); setSettlementTargetId(heldSettlementCandidates.length === 1 ? heldSettlementCandidates[0].target_id : ''); setClientRefundAmount(''); vm.setDecisionModalOpen(true); }}>
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

            {/* Decision modal: Cancel or Resolve */}
            <Dialog open={vm.decisionModalOpen} onOpenChange={(open) => { if (!open) setDecisionAction(null); vm.setDecisionModalOpen(open); }}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                            <Scale className="h-6 w-6 text-primary" />
                            {decisionAction === 'cancel' ? 'Cancel dispute' : 'Resolve dispute'}
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Reason is required. This will be logged in the audit trail.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-muted-foreground">Reason</label>
                            <Textarea
                                placeholder="State the reason..."
                                className="min-h-[100px]"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                        </div>
                        {decisionAction === 'resolve' && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Financial outcome</label>
                                    <Select
                                        value={outcome}
                                        onValueChange={(value) => {
                                            const nextOutcome = value as ResolveOutcome;
                                            setOutcome(nextOutcome);
                                            if (nextOutcome === 'split_settlement') {
                                                setSplitRefundPreset(Math.floor(splitDistributableAmount / 2));
                                            }
                                        }}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="refund_client">Refund to client</SelectItem>
                                            <SelectItem value="release_freelancer">Release to freelancer</SelectItem>
                                            <SelectItem value="split_settlement">Split settlement</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {outcome === 'split_settlement' && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase text-muted-foreground">Client refund amount</label>
                                            <Input
                                                inputMode="numeric"
                                                placeholder="e.g. 27000"
                                                value={clientRefundAmount}
                                                onChange={(e) => handleSplitRefundInput(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <Button type="button" variant="outline" size="sm" onClick={() => setSplitRefundPreset(splitDistributableAmount)}>
                                                Full refund
                                            </Button>
                                            <Button type="button" variant="outline" size="sm" onClick={() => setSplitRefundPreset(Math.floor(splitDistributableAmount / 2))}>
                                                50 / 50
                                            </Button>
                                            <Button type="button" variant="outline" size="sm" onClick={() => setSplitRefundPreset(0)}>
                                                Full payout
                                            </Button>
                                        </div>
                                        <div className="rounded-xl border border-primary/10 bg-primary/5 p-3 text-xs text-muted-foreground">
                                            Split settlement is calculated automatically. Enter the client refund and the freelancer payout will be derived after the platform fee is kept.
                                        </div>
                                        {selectedSettlementCandidate && (
                                            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-100">
                                                <div>Gross held amount: <span className="font-mono">IQD {splitGrossAmount.toLocaleString()}</span></div>
                                                <div>Platform fee ({(splitFeeBps / 100).toFixed(2)}%): <span className="font-mono">IQD {splitFeeAmount.toLocaleString()}</span></div>
                                                <div>Client refund: <span className="font-mono">IQD {splitRefundValue.toLocaleString()}</span></div>
                                                <div>Freelancer payout: <span className="font-mono">IQD {splitPayoutValue.toLocaleString()}</span></div>
                                                <div>Client receives in wallet: <span className="font-mono">IQD {splitRefundValue.toLocaleString()}</span></div>
                                                <div>Freelancer receives in wallet: <span className="font-mono">IQD {splitPayoutValue.toLocaleString()}</span></div>
                                                <div>Platform keeps: <span className="font-mono">IQD {splitFeeAmount.toLocaleString()}</span></div>
                                            </div>
                                        )}
                                    </>
                                )}
                                {outcome !== 'split_settlement' && (
                                    <div className="rounded-xl border border-primary/10 bg-primary/5 p-3 text-xs text-muted-foreground">
                                        {outcome === 'refund_client'
                                            ? 'Refund goes to the client main wallet (`available_balance`).'
                                            : 'Payout goes to the freelancer main wallet (`available_balance`) and the platform fee is kept in platform revenue.'}
                                    </div>
                                )}
                                {av.requires_settlement_target && heldSettlementCandidates.length > 1 && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Settlement target (required)</label>
                                        <Select
                                            value={settlementTargetId}
                                            onValueChange={(value) => {
                                                setSettlementTargetId(value);
                                                if (outcome === 'split_settlement') {
                                                    const nextCandidate = heldSettlementCandidates.find((candidate: { target_id: string }) => candidate.target_id === value);
                                                    const nextGross = Number(nextCandidate?.amount_cents ?? 0);
                                                    const nextFeeBps = Number(nextCandidate?.fee_rate_bps ?? 0);
                                                    const nextDistributable = Math.max(nextGross - Math.floor((nextGross * nextFeeBps) / 10000), 0);
                                                    setClientRefundAmount(String(Math.floor(nextDistributable / 2)));
                                                }
                                            }}
                                        >
                                            <SelectTrigger><SelectValue placeholder="Select settlement target" /></SelectTrigger>
                                            <SelectContent>
                                                {heldSettlementCandidates.map((candidate: { target_id: string; target_type: 'booking' | 'task_request' | 'direct_offer'; status: string; payment_status?: string; amount_cents?: number }) => (
                                                    <SelectItem key={candidate.target_id} value={candidate.target_id}>
                                                        {settlementTargetLabel(candidate.target_type).replace(/\b\w/g, (char) => char.toUpperCase())} {candidate.target_id.slice(0, 8)} ({candidate.status}/{candidate.payment_status}){candidate.amount_cents != null ? ` · IQD ${Number(candidate.amount_cents).toLocaleString()}` : ''}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                                {av.requires_settlement_target && heldSettlementCandidates.length === 1 && (
                                    <div className="rounded-xl border border-primary/10 bg-primary/5 p-3 text-xs text-muted-foreground">
                                        Settlement will use {settlementTargetLabel(heldSettlementCandidates[0].target_type)} <span className="font-mono">{heldSettlementCandidates[0].target_id.slice(0, 8)}</span>.
                                    </div>
                                )}
                                {av.requires_settlement_target && heldSettlementCandidates.length === 0 && (
                                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-200">
                                        This dispute is active, but no held booking, tender request, or direct offer was found yet. Resolve is unavailable until the dispute has a settlement target.
                                    </div>
                                )}
                                {outcome === 'split_settlement' && !splitHasSettlementBasis && (
                                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-200">
                                        Split settlement needs one held settlement target with a distributable amount greater than zero.
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => vm.setDecisionModalOpen(false)}>Close</Button>
                        {decisionAction === 'cancel' && (
                            <Button onClick={handleCancel} disabled={vm.isCanceling || reason.trim().length < 1}>
                                {vm.isCanceling ? 'Canceling…' : 'Cancel dispute'}
                            </Button>
                        )}
                        {decisionAction === 'resolve' && (
                            <Button
                                onClick={handleResolve}
                                disabled={
                                    vm.isResolving ||
                                    reason.trim().length < 1 ||
                                    (av.requires_settlement_target && heldSettlementCandidates.length > 1 && !settlementTargetId) ||
                                    (av.requires_settlement_target && heldSettlementCandidates.length === 0) ||
                                    (outcome === 'split_settlement' &&
                                        (!splitHasSettlementBasis ||
                                            splitRefundValue < 0 ||
                                            !splitAmountsValid))
                                }
                            >
                                {vm.isResolving ? 'Resolving…' : 'Resolve'}
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

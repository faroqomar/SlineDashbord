'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowRight,
  CalendarClock,
  FileText,
  HandCoins,
  NotebookText,
  ShieldAlert,
  UserRound,
  Wallet,
} from 'lucide-react';
import type {
  JournalLedgerEntry,
  TransactionActorSummary,
  TransactionEntityContext,
} from '../models/finance.model';
import { getStatusBadgeClass } from '../models/finance.model';

interface TransactionDetailContentProps {
  detail: JournalLedgerEntry;
  isUnmasked: boolean;
  onReveal?: () => void;
  revealLoading?: boolean;
}

function formatCurrency(value?: number | null): string {
  return `IQD ${Number(value ?? 0).toLocaleString()}`;
}

function formatSignedCurrency(value?: number | null): string {
  const numeric = Number(value ?? 0);
  const prefix = numeric > 0 ? '+' : '';
  return `${prefix}${formatCurrency(numeric)}`;
}

function titleCase(value?: string | null): string {
  return (value ?? 'unknown')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getInitials(name?: string | null, fallback = 'U'): string {
  const value = (name ?? '').trim();
  if (!value) return fallback;
  const parts = value.split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] ?? fallback) + (parts[1]?.[0] ?? '');
}

function renderActorCard(
  actor: TransactionActorSummary | null | undefined,
  label: string,
  fallbackText: string
) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/70 p-3">
      <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        <UserRound className="h-3.5 w-3.5" />
        {label}
      </div>
      {actor ? (
        <div className="flex items-center gap-3">
          <Avatar size="lg" className="ring-1 ring-border/70">
            <AvatarImage src={actor.avatar_url ?? undefined} alt={actor.full_name} />
            <AvatarFallback>{getInitials(actor.full_name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{actor.full_name}</p>
            <p className="truncate font-mono text-xs text-muted-foreground">{actor.id}</p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg bg-muted/60 px-3 py-4 text-sm text-muted-foreground">
          {fallbackText}
        </div>
      )}
    </div>
  );
}

function renderKeyValue(
  label: string,
  value: string | number | null | undefined
) {
  if (value == null || value === '') return null;
  return (
    <div className="rounded-lg border border-border/50 bg-background/60 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm text-foreground">{String(value)}</p>
    </div>
  );
}

function renderRequirements(requirements?: Record<string, unknown> | null) {
  if (!requirements || Object.keys(requirements).length === 0) return null;
  return (
    <Card className="gap-3 border-border/60 bg-background/70 py-4">
      <CardHeader className="px-4 pb-0">
        <CardTitle className="text-sm">Requirements</CardTitle>
        <CardDescription>Captured from the original work request.</CardDescription>
      </CardHeader>
      <CardContent className="px-4">
        <pre className="overflow-x-auto rounded-lg bg-muted/70 p-3 text-xs text-muted-foreground">
          {JSON.stringify(requirements, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}

function renderEntityContext(entity: TransactionEntityContext | null | undefined) {
  if (!entity) {
    return (
      <Card className="border-dashed border-border/70 bg-muted/20 py-4">
        <CardContent className="px-4 text-sm text-muted-foreground">
          No booking or task context is attached to this transaction.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-border/60 bg-[linear-gradient(180deg,rgba(32,38,56,0.98),rgba(18,22,33,0.98))] py-0 text-white">
        <CardHeader className="border-b border-white/10 px-5 py-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Badge variant="outline" className="border-white/20 bg-white/5 text-white/90">
                  {titleCase(entity.kind)}
                </Badge>
                {entity.status ? (
                  <Badge variant="secondary" className="border-0 bg-white/10 text-white">
                    {titleCase(entity.status)}
                  </Badge>
                ) : null}
                {entity.payment_status ? (
                  <Badge variant="secondary" className="border-0 bg-emerald-500/15 text-emerald-200">
                    {titleCase(entity.payment_status)}
                  </Badge>
                ) : null}
              </div>
              <CardTitle className="text-xl text-white">{entity.title}</CardTitle>
              {entity.subtitle ? (
                <CardDescription className="mt-1 text-white/65">{entity.subtitle}</CardDescription>
              ) : null}
            </div>
            <div className="min-w-[140px] rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-right">
              <p className="text-[11px] uppercase tracking-[0.14em] text-white/55">Entity Amount</p>
              <p className="mt-1 text-lg font-semibold text-white">{formatCurrency(entity.price)}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 px-5 py-5 md:grid-cols-2">
          {renderActorCard(entity.client, 'Client', 'No client attached')}
          {renderActorCard(entity.provider, 'Provider', 'No provider attached')}
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        {renderKeyValue('Created', entity.created_at ? new Date(entity.created_at).toLocaleString() : null)}
        {renderKeyValue('Linked Task', typeof entity.task?.title === 'string' ? entity.task.title : null)}
        {renderKeyValue('Task Status', typeof entity.task?.status === 'string' ? titleCase(entity.task.status) : null)}
        {renderKeyValue('Deadline', typeof entity.timeline?.deadline === 'string' ? new Date(entity.timeline.deadline).toLocaleString() : null)}
        {renderKeyValue('Delivery Days', entity.timeline?.days as number | null | undefined)}
        {renderKeyValue(
          'Payment Deadline',
          typeof entity.timeline?.payment_deadline === 'string'
            ? new Date(entity.timeline.payment_deadline).toLocaleString()
            : null
        )}
        {renderKeyValue(
          'Delivered At',
          typeof entity.timeline?.delivered_at === 'string'
            ? new Date(entity.timeline.delivered_at).toLocaleString()
            : null
        )}
        {renderKeyValue(
          'Review Expires',
          typeof entity.timeline?.review_expires_at === 'string'
            ? new Date(entity.timeline.review_expires_at).toLocaleString()
            : null
        )}
      </div>

      {entity.note || entity.description ? (
        <Card className="gap-3 border-border/60 bg-background/70 py-4">
          <CardHeader className="px-4 pb-0">
            <CardTitle className="flex items-center gap-2 text-sm">
              <NotebookText className="h-4 w-4" />
              Notes
            </CardTitle>
            <CardDescription>Work instructions, offer note, or booking note.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 px-4">
            {entity.note ? (
              <div className="rounded-lg bg-muted/70 p-3 text-sm text-foreground">{entity.note}</div>
            ) : null}
            {entity.description ? (
              <div className="rounded-lg border border-border/50 bg-background/60 p-3 text-sm text-muted-foreground">
                {entity.description}
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {renderRequirements(entity.requirements)}
    </div>
  );
}

export function TransactionDetailContent({
  detail,
  isUnmasked,
  onReveal,
  revealLoading = false,
}: TransactionDetailContentProps) {
  const metadata = detail.meta_full ?? detail.meta_masked ?? {};

  return (
    <Tabs defaultValue="overview" className="mt-5">
      <TabsList variant="line" className="w-full justify-start rounded-none border-b bg-transparent p-0">
        <TabsTrigger value="overview" className="px-4 py-2">Overview</TabsTrigger>
        <TabsTrigger value="context" className="px-4 py-2">Context</TabsTrigger>
        <TabsTrigger value="metadata" className="px-4 py-2">Metadata</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4 pt-4">
        <Card className="overflow-hidden border-border/60 bg-[linear-gradient(180deg,rgba(12,18,34,0.98),rgba(17,24,39,0.96))] py-0 text-white">
          <CardHeader className="border-b border-white/10 px-5 py-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="outline" className="border-white/20 bg-white/5 text-white">
                    {titleCase(detail.event_type)}
                  </Badge>
                  <Badge variant="secondary" className="border-0 bg-white/10 text-white">
                    {titleCase(detail.status)}
                  </Badge>
                </div>
                <CardTitle className="text-xl text-white">
                  Journal {detail.journal_id.slice(0, 8)}
                </CardTitle>
                <CardDescription className="mt-1 text-white/65">
                  {new Date(detail.created_at).toLocaleString()}
                </CardDescription>
              </div>
              <div className="grid min-w-[210px] grid-cols-3 gap-2">
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-center">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-white/55">Gross</p>
                  <p className="mt-1 text-sm font-semibold text-white">{formatCurrency(detail.gross_amount)}</p>
                </div>
                <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-3 text-center">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-red-100/70">Fee</p>
                  <p className="mt-1 text-sm font-semibold text-red-100">{formatCurrency(detail.fee_amount)}</p>
                </div>
                <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-3 text-center">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-emerald-100/70">Net</p>
                  <p className="mt-1 text-sm font-semibold text-emerald-100">{formatCurrency(detail.net_amount)}</p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 px-5 py-5 md:grid-cols-[1fr_auto_1fr]">
            {renderActorCard(detail.payer, 'Money From', 'System debit or internal ledger source')}
            <div className="flex items-center justify-center text-white/50">
              <ArrowRight className="h-5 w-5" />
            </div>
            {renderActorCard(detail.payee, 'Money To', 'Platform or internal destination')}
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="gap-4 border-border/60 bg-background/70 py-4">
            <CardHeader className="px-4 pb-0">
              <CardTitle className="flex items-center gap-2 text-sm">
                <HandCoins className="h-4 w-4" />
                Money Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Gross amount</span>
                <span className="font-semibold">{formatCurrency(detail.gross_amount)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Platform fee</span>
                <span className="font-semibold text-red-500">{formatCurrency(detail.fee_amount)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Net released</span>
                <span className="font-semibold text-emerald-600">{formatCurrency(detail.net_amount)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="gap-4 border-border/60 bg-background/70 py-4">
            <CardHeader className="px-4 pb-0">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Wallet className="h-4 w-4" />
                Ledger Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-4">
              {renderKeyValue('Entity Type', detail.entity_type ? titleCase(detail.entity_type) : null)}
              {renderKeyValue('Entity ID', detail.entity_id)}
              {renderKeyValue('Payer User ID', detail.payer_user_id)}
              {renderKeyValue('Payee User ID', detail.payee_user_id)}
              {renderKeyValue('Initiator', detail.initiator?.full_name ?? detail.initiator_user_id)}
            </CardContent>
          </Card>

          <Card className="gap-4 border-border/60 bg-background/70 py-4">
            <CardHeader className="px-4 pb-0">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Wallet className="h-4 w-4" />
                Treasury Impact
              </CardTitle>
              <CardDescription>How this journal moved the admin finance pools.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 px-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Escrow Held</span>
                <span className="font-semibold">{formatSignedCurrency(detail.escrow_delta_iqd)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">User Available</span>
                <span className="font-semibold">{formatSignedCurrency(detail.user_available_delta_iqd)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Freelancer Payables</span>
                <span className="font-semibold">{formatSignedCurrency(detail.freelancer_payables_available_delta_iqd)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Pending Payouts</span>
                <span className="font-semibold">{formatSignedCurrency(detail.pending_payouts_delta_iqd)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Platform Revenue</span>
                <span className="font-semibold">{formatSignedCurrency(detail.platform_revenue_delta_iqd)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Platform Cash</span>
                <span className="font-semibold">{formatSignedCurrency(detail.platform_cash_delta_iqd)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="context" className="space-y-4 pt-4">
        {renderEntityContext(detail.entity_context)}
      </TabsContent>

      <TabsContent value="metadata" className="space-y-4 pt-4">
        <Card className="gap-3 border-border/60 bg-background/70 py-4">
          <CardHeader className="px-4 pb-0">
            <CardTitle className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4" />
              Raw Metadata
            </CardTitle>
            <CardDescription>
              Technical journal metadata for audit and debugging.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 px-4">
            <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/30 px-3 py-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarClock className="h-3.5 w-3.5" />
                {isUnmasked ? 'Full metadata visible' : 'Sensitive fields masked'}
              </div>
              {!isUnmasked && onReveal ? (
                <Button variant="outline" size="sm" onClick={onReveal} disabled={revealLoading}>
                  {revealLoading ? 'Loading…' : 'Reveal full metadata'}
                </Button>
              ) : null}
            </div>
            {!isUnmasked ? (
              <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-3 text-xs text-amber-700 dark:text-amber-200">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                Full metadata access is audit-logged. Use reveal only when you need the sensitive gateway or internal fields.
              </div>
            ) : null}
            <pre className="overflow-x-auto rounded-lg bg-muted/70 p-3 text-xs text-muted-foreground">
              {JSON.stringify(metadata, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

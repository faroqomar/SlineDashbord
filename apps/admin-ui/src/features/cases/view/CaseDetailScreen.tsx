import { useCaseDetailViewModel } from '../viewmodels/use_case_detail_viewmodel';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft, Link2, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Link, useParams } from '@tanstack/react-router';
import { useState } from 'react';
import type { CaseEntityType } from '@sline/shared';

const ENTITY_TYPES: { value: CaseEntityType; label: string }[] = [
  { value: 'task', label: 'Task' },
  { value: 'user', label: 'User' },
  { value: 'conversation', label: 'Conversation' },
  { value: 'booking', label: 'Booking' },
  { value: 'dispute', label: 'Dispute' },
];

export function CaseDetailScreen() {
  const params = useParams({ strict: false });
  const caseId = (params as { caseId?: string })?.caseId ?? '';
  const vm = useCaseDetailViewModel(caseId || undefined);
  const [attachType, setAttachType] = useState<CaseEntityType>('task');
  const [attachEntityId, setAttachEntityId] = useState('');
  const [attachError, setAttachError] = useState<string | null>(null);

  const handleAttach = async () => {
    if (!attachEntityId.trim()) return;
    setAttachError(null);
    const ok = await vm.attachEntity({ entity_type: attachType, entity_id: attachEntityId.trim() });
    if (ok) {
      setAttachEntityId('');
    } else {
      setAttachError(vm.error ?? 'Failed to attach entity');
    }
  };

  if (!caseId) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Missing case</AlertTitle>
        <AlertDescription>No case ID in URL.</AlertDescription>
      </Alert>
    );
  }

  if (vm.isLoading && !vm.caseDetail) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (vm.error && !vm.caseDetail) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{vm.error}</AlertDescription>
        <Button asChild variant="outline" className="mt-2">
          <Link to="/cases">Back to cases</Link>
        </Button>
      </Alert>
    );
  }

  const c = vm.caseDetail!;
  const entities = c.entities ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/cases">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Case: {c.subject}</h2>
            <p className="text-muted-foreground text-sm">
              {c.source ?? '—'} · {c.status ?? '—'} · {c.priority ?? '—'}
            </p>
          </div>
        </div>
        {vm.refreshCase && (
          <Button variant="outline" onClick={vm.refreshCase} disabled={vm.isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${vm.isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
          <CardDescription>Created {c.created_at ? new Date(c.created_at).toLocaleString() : '—'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><span className="text-muted-foreground">Subject:</span> {c.subject}</p>
          <p><span className="text-muted-foreground">Source:</span> {c.source ?? '—'}</p>
          <p><span className="text-muted-foreground">Status:</span> {c.status ?? '—'}</p>
          <p><span className="text-muted-foreground">Priority:</span> {c.priority ?? '—'}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attached entities</CardTitle>
          <CardDescription>Entities linked to this case (e.g. for chat access gating).</CardDescription>
        </CardHeader>
        <CardContent>
          {entities.length === 0 ? (
            <p className="text-muted-foreground py-4">No entities attached yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Entity ID</TableHead>
                  <TableHead>Attached</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entities.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>{e.entity_type}</TableCell>
                    <TableCell className="font-mono text-xs">{e.entity_id}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {e.created_at ? new Date(e.created_at).toLocaleString() : '—'}
                    </TableCell>
                    <TableCell>
                      {e.entity_type === 'conversation' && (
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            to="/chat/threads/$threadId"
                            params={{ threadId: e.entity_id }}
                            search={{ caseId }}
                          >
                            View thread
                          </Link>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            Attach entity
          </CardTitle>
          <CardDescription>Link a task, user, conversation, booking, or dispute to this case.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="grid gap-2 min-w-[140px]">
              <Label>Type</Label>
              <Select value={attachType} onValueChange={(v: CaseEntityType) => setAttachType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ENTITY_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2 min-w-[280px]">
              <Label>Entity ID (UUID)</Label>
              <Input
                value={attachEntityId}
                onChange={(e) => setAttachEntityId(e.target.value)}
                placeholder="00000000-0000-0000-0000-000000000000"
              />
            </div>
            <Button onClick={handleAttach} disabled={!attachEntityId.trim() || vm.isAttaching}>
              {vm.isAttaching ? 'Attaching…' : 'Attach'}
            </Button>
          </div>
          {(attachError || vm.error) && (
            <Alert variant="destructive">
              <AlertDescription>{attachError ?? vm.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

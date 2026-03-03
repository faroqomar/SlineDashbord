import { useCaseDetailViewModel } from '../viewmodels/use_case_detail_viewmodel';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Link, useParams } from '@tanstack/react-router';
import { useState } from 'react';
import type { CaseEntityType } from '@sline/shared';
import { CaseOverviewCard } from './CaseOverviewCard';
import { CaseControlsCard } from './CaseControlsCard';
import { CaseEntitiesCard } from './CaseEntitiesCard';
import { CaseEvidenceCard } from './CaseEvidenceCard';
import { CaseTimelineCard } from './CaseTimelineCard';
import { CaseNotesCard } from './CaseNotesCard';
import { CaseAttachEntityCard } from './CaseAttachEntityCard';

export function CaseDetailScreen() {
  const params = useParams({ strict: false });
  const caseId = (params as { caseId?: string })?.caseId ?? '';
  const vm = useCaseDetailViewModel(caseId || undefined);

  const [attachType, setAttachType] = useState<CaseEntityType>('task');
  const [attachEntityId, setAttachEntityId] = useState('');
  const [attachError, setAttachError] = useState<string | null>(null);
  const [assigneeId, setAssigneeId] = useState('');
  const [assignReason, setAssignReason] = useState('');
  const [status, setStatus] = useState<'open' | 'in_progress' | 'pending' | 'closed'>('open');
  const [statusReason, setStatusReason] = useState('');
  const [note, setNote] = useState('');
  const [noteError, setNoteError] = useState<string | null>(null);

  const handleAttach = async () => {
    if (!attachEntityId.trim()) return;
    setAttachError(null);
    const ok = await vm.attachEntity({ entity_type: attachType, entity_id: attachEntityId.trim() });
    if (ok) setAttachEntityId('');
    else setAttachError(vm.error ?? 'Failed to attach entity');
  };

  const handleAssign = async () => {
    if (!assignReason.trim()) return;
    const ok = await vm.assignCase({ assignee_id: assigneeId.trim() ? assigneeId.trim() : null, reason: assignReason.trim() });
    if (ok) setAssignReason('');
  };

  const handleStatusUpdate = async () => {
    if (!statusReason.trim()) return;
    const ok = await vm.updateStatus({ status, reason: statusReason.trim() });
    if (ok) setStatusReason('');
  };

  const handleAddNote = async () => {
    if (!note.trim()) return;
    setNoteError(null);
    const ok = await vm.addNote({ note: note.trim(), visibility: 'internal' });
    if (ok) setNote('');
    else setNoteError(vm.error ?? 'Failed to add note');
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
  const evidence = c.evidence ?? [];
  const timeline = c.timeline ?? [];
  const notes = c.notes ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/cases"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Case: {c.subject}</h2>
            <p className="text-muted-foreground text-sm">{c.source ?? '—'} · {c.status ?? '—'} · {c.priority ?? '—'}</p>
          </div>
        </div>
        {vm.refreshCase && (
          <Button variant="outline" onClick={vm.refreshCase} disabled={vm.isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${vm.isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        )}
      </div>

      <CaseOverviewCard
        subject={c.subject}
        source={c.source ?? null}
        status={c.status ?? null}
        priority={c.priority ?? null}
        assigneeId={c.assignee_id ?? null}
        assigneeName={c.assignee_name ?? null}
        slaDueAt={c.sla_due_at ?? null}
        createdAt={c.created_at ?? null}
      />

      <CaseControlsCard
        assigneeId={assigneeId}
        setAssigneeId={setAssigneeId}
        assignReason={assignReason}
        setAssignReason={setAssignReason}
        onAssign={handleAssign}
        isAssigning={vm.isAssigning}
        status={status}
        setStatus={setStatus}
        statusReason={statusReason}
        setStatusReason={setStatusReason}
        onStatusUpdate={handleStatusUpdate}
        isUpdatingStatus={vm.isUpdatingStatus}
      />

      <CaseEntitiesCard caseId={caseId} entities={entities} />
      <CaseEvidenceCard evidence={evidence} />
      <CaseTimelineCard timeline={timeline} />
      <CaseNotesCard
        note={note}
        setNote={setNote}
        onAddNote={handleAddNote}
        isAddingNote={vm.isAddingNote}
        noteError={noteError}
        notes={notes}
      />
      <CaseAttachEntityCard
        attachType={attachType}
        setAttachType={setAttachType}
        attachEntityId={attachEntityId}
        setAttachEntityId={setAttachEntityId}
        onAttach={handleAttach}
        isAttaching={vm.isAttaching}
        attachError={attachError}
        vmError={vm.error}
      />
    </div>
  );
}

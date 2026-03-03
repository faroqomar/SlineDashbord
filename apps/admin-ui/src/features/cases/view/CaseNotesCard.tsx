import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

export interface NoteItem {
  id: string;
  note: string;
  created_at: string;
  admin_user_id: string;
}

export interface CaseNotesCardProps {
  note: string;
  setNote: (v: string) => void;
  onAddNote: () => void;
  isAddingNote: boolean;
  noteError: string | null;
  notes: NoteItem[];
}

export function CaseNotesCard({ note, setNote, onAddNote, isAddingNote, noteError, notes }: CaseNotesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Internal notes</CardTitle>
        <CardDescription>Case-scoped notes for moderators/admins.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add an internal note" className="min-h-[100px]" />
        <Button onClick={onAddNote} disabled={isAddingNote || !note.trim()}>
          {isAddingNote ? 'Saving…' : 'Add note'}
        </Button>
        {noteError && (
          <Alert variant="destructive">
            <AlertDescription>{noteError}</AlertDescription>
          </Alert>
        )}
        {notes.length === 0 ? (
          <p className="text-muted-foreground text-sm">No notes yet.</p>
        ) : (
          <ul className="space-y-2">
            {notes.map((n) => (
              <li key={n.id} className="rounded-md border border-border p-3">
                <p>{n.note}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(n.created_at).toLocaleString()} · {n.admin_user_id}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

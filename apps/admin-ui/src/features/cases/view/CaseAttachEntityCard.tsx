import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link2 } from 'lucide-react';
import type { CaseEntityType } from '@sline/shared';

const ENTITY_TYPES: { value: CaseEntityType; label: string }[] = [
  { value: 'task', label: 'Task' },
  { value: 'user', label: 'User' },
  { value: 'conversation', label: 'Conversation' },
  { value: 'booking', label: 'Booking' },
  { value: 'dispute', label: 'Dispute' },
  { value: 'report', label: 'Report' },
];

export interface CaseAttachEntityCardProps {
  attachType: CaseEntityType;
  setAttachType: (v: CaseEntityType) => void;
  attachEntityId: string;
  setAttachEntityId: (v: string) => void;
  onAttach: () => void;
  isAttaching: boolean;
  attachError: string | null;
  vmError: string | null;
}

export function CaseAttachEntityCard({
  attachType,
  setAttachType,
  attachEntityId,
  setAttachEntityId,
  onAttach,
  isAttaching,
  attachError,
  vmError,
}: CaseAttachEntityCardProps) {
  return (
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
          <Button onClick={onAttach} disabled={!attachEntityId.trim() || isAttaching}>
            {isAttaching ? 'Attaching…' : 'Attach'}
          </Button>
        </div>
        {(attachError || vmError) && (
          <Alert variant="destructive">
            <AlertDescription>{attachError ?? vmError}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

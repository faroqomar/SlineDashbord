'use client';

import React from 'react';
import { Percent, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PlatformFeeSettings } from '@sline/shared';
import { PlatformFeeEditDialog } from './PlatformFeeEditDialog';

interface PlatformFeeCardProps {
  feeSettings: PlatformFeeSettings | undefined;
  isLoading: boolean;
  canEdit: boolean;
  onUpdated: () => void;
  /** When provided, dialog open state is controlled by parent (e.g. for header button). */
  editOpen?: boolean;
  onEditOpenChange?: (open: boolean) => void;
}

export function PlatformFeeCard({ feeSettings, isLoading, canEdit, onUpdated, editOpen: controlledOpen, onEditOpenChange }: PlatformFeeCardProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const editOpen = controlledOpen ?? internalOpen;
  const setEditOpen = onEditOpenChange ?? setInternalOpen;

  const rateBps = feeSettings?.fee_rate_default_bps ?? 1000;
  const maxBps = feeSettings?.max_fee_rate_bps ?? 2000;
  const ratePct = (rateBps / 100).toFixed(1);
  const updatedAt = feeSettings?.updated_at
    ? new Date(feeSettings.updated_at).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })
    : '—';

  return (
    <>
      <div className="relative overflow-hidden rounded-xl border border-[#7f7668] bg-[#0e0f13] p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[rgba(34,5,118,0.09)]">
            <Percent className="h-4 w-4 text-[#9c7df9]" />
          </div>
          {canEdit && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 text-[#9d9588] hover:text-[#e8e6e3]"
              onClick={() => setEditOpen(true)}
              disabled={isLoading}
            >
              <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
            </Button>
          )}
        </div>
        <p className="text-[11px] uppercase tracking-[0.12em] text-[#9d9588]">Platform fee (default)</p>
        {isLoading ? (
          <p className="mt-1 text-2xl font-bold text-[#7f7668]">…</p>
        ) : (
          <p className="mt-1 text-2xl font-bold tracking-tight text-[#e8e6e3]">{ratePct}%</p>
        )}
        <p className="mt-1 text-xs text-[#9d9588]">
          Max {maxBps / 100}% · Applies only to future lock points
        </p>
        <p className="mt-1 text-[10px] text-[#7f7668]">Updated {updatedAt}</p>
      </div>

      <PlatformFeeEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        currentBps={rateBps}
        maxBps={maxBps}
        onSuccess={() => {
          setEditOpen(false);
          onUpdated();
        }}
      />
    </>
  );
}

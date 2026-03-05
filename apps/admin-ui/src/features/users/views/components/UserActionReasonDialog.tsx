import { useEffect, useState, type FormEvent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ResolvedUserProfileAction } from '../user-profile.view';

const REQUIRED_REASON_MIN_LENGTH = 5;

interface UserActionReasonDialogProps {
  open: boolean;
  action: ResolvedUserProfileAction | null;
  isSubmitting: boolean;
  onOpenChange: (nextOpen: boolean) => void;
  onConfirm: (reason?: string) => Promise<boolean>;
}

export function UserActionReasonDialog({
  open,
  action,
  isSubmitting,
  onOpenChange,
  onConfirm,
}: UserActionReasonDialogProps) {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!open) {
      setReason('');
    }
  }, [open, action?.kind]);

  const trimmedReason = reason.trim();
  const requiresReason = Boolean(action?.requiresReason);
  const isReasonTooShort = requiresReason && trimmedReason.length < REQUIRED_REASON_MIN_LENGTH;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!action) return;

    const isSuccess = await onConfirm(trimmedReason.length > 0 ? trimmedReason : undefined);
    if (isSuccess) {
      onOpenChange(false);
      setReason('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[480px] rounded-[14px] border-[#7f7668] bg-[#0a0d12] text-[#e8e6e3]"
        showCloseButton={!isSubmitting}
      >
        <DialogHeader>
          <DialogTitle>{action?.confirmTitle ?? 'Confirm action'}</DialogTitle>
          <DialogDescription className="text-[#9d9588]">
            {action?.confirmDescription ?? 'This action will update the selected user account.'}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-3" onSubmit={handleSubmit}>
          {action ? (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="user-action-reason" className="text-xs uppercase tracking-[0.08em] text-[#9d9588]">
                  {action.reasonLabel}
                </Label>
                <Textarea
                  id="user-action-reason"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder={action.reasonPlaceholder}
                  className="min-h-[96px] border-[#2a3143] bg-[#0d1119] text-[#e8e6e3] placeholder:text-[#7f7668]"
                  disabled={isSubmitting}
                />
                {isReasonTooShort ? (
                  <p className="text-xs text-[#f38b8b]">
                    Reason must be at least {REQUIRED_REASON_MIN_LENGTH} characters.
                  </p>
                ) : null}
                {!requiresReason ? (
                  <p className="text-xs text-[#9d9588]">Reason is optional for this action.</p>
                ) : null}
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-[#7b7265] bg-[#151725] text-[#e8e6e3]"
                  disabled={isSubmitting}
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || isReasonTooShort}
                  className={action.danger
                    ? 'border border-[#c63b3b] bg-[#2a0f12] text-[#f38b8b] hover:bg-[#381419]'
                    : 'border border-[#7b7265] bg-[#151725] text-[#e8e6e3] hover:bg-[#1b2030]'}
                >
                  {isSubmitting ? 'Applying...' : action.confirmLabel}
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </form>
      </DialogContent>
    </Dialog>
  );
}

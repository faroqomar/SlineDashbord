import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, Loader2 } from 'lucide-react';

type InviteRole = 'support' | 'moderator' | 'admin';

interface UsersInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fullName: string;
  email: string;
  role: InviteRole;
  isSubmitting: boolean;
  submitError: string | null;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onRoleChange: (value: InviteRole) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export function UsersInviteDialog({
  open,
  onOpenChange,
  fullName,
  email,
  role,
  isSubmitting,
  submitError,
  onFullNameChange,
  onEmailChange,
  onRoleChange,
  onCancel,
  onSubmit,
}: UsersInviteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
          <DialogDescription>
            Send an admin invite using the existing Team invite flow.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="users-invite-full-name">Full Name</Label>
            <Input
              id="users-invite-full-name"
              placeholder="Jane Smith"
              value={fullName}
              onChange={(event) => onFullNameChange(event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="users-invite-email">Email address</Label>
            <Input
              id="users-invite-email"
              type="email"
              placeholder="jane@sline.io"
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="users-invite-role">Role</Label>
            <Select value={role} onValueChange={(value) => onRoleChange(value as InviteRole)}>
              <SelectTrigger id="users-invite-role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="support">Support</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {submitError ? (
            <div className="flex items-center gap-2 rounded-md border border-[#c63b3b] bg-[#2a0f12] px-3 py-2 text-xs text-[#f3b2b2]">
              <AlertCircle className="size-3.5" />
              <span>{submitError}</span>
            </div>
          ) : null}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
            Send Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

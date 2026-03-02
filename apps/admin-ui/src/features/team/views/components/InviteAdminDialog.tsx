"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Mail, Plus, Loader2 } from "lucide-react";
import { inviteMember } from "@/features/team/services/team_api";
import { useRouter } from "@/lib/navigation-shim";

export function InviteAdminDialog() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("support");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleInvite = () => {
    if (!email || !fullName) return;
    
    startTransition(() => {
        void (async () => {
        try {
            const res = await inviteMember(email, role, fullName);
            if (res.success) {
                toast.success(`Invite sent to ${email}`, {
                    description: `Role assigned: ${role}`
                });
                setOpen(false);
                setEmail("");
                setFullName("");
                router.refresh();
            } else {
                toast.error("Failed to send invite", {
                    description: res.error || "Unknown error"
                });
            }
        } catch (error) {
            toast.error("Failed to send invite", {
                description: error instanceof Error ? error.message : "Unknown error"
            });
        }
        })();
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
            <Plus className="h-4 w-4" /> Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Add a new administrator to the team.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="fullname">Full Name</Label>
            <Input
              id="fullname"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              placeholder="colleague@sline.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="support">Support</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
                {role === 'admin' && 'Full access to users, disputes, and settings.'}
                {role === 'moderator' && 'Can resolve disputes and view users.'}
                {role === 'support' && 'Read-only access to user data.'}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleInvite} disabled={!email || !fullName || isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Invite"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

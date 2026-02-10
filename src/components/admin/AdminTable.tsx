"use client";

import { useState, useTransition } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Shield, UserX, UserCheck, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminUserDTO, removeMember } from "@/app/actions/team";
import { useRouter } from "next/navigation";

interface AdminTableProps {
  initialUsers: AdminUserDTO[];
}

export function AdminTable({ initialUsers }: AdminTableProps) {
  const [users, setUsers] = useState<AdminUserDTO[]>(initialUsers);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = async (id: string) => {
    // Optimistic update
    const previousUsers = [...users];
    setUsers(users.filter(u => u.id !== id));
    
    startTransition(async () => {
        try {
            await removeMember(id);
            toast.success("User access revoked");
            router.refresh();
        } catch (error) {
            setUsers(previousUsers); // Revert
            toast.error("Failed to revoke access");
        }
    });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Super Admin": return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border-purple-200";
      case "Admin": return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-200";
      case "Moderator": return "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-200";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const getUserStatusColor = (status: string) => {
      switch(status) {
          case 'Active': return 'bg-green-500';
          case 'Invited': return 'bg-yellow-500';
          case 'Suspended': return 'bg-red-500';
          default: return 'bg-gray-500';
      }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatar_url} alt={user.full_name} />
                  <AvatarFallback>{user.full_name?.charAt(0) || user.email.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{user.full_name}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
              </TableCell>
              
              <TableCell>
                <Badge variant="outline" className={getRoleBadge(user.role)}>
                    {user.role}
                </Badge>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${getUserStatusColor(user.status)}`} />
                    <span className="text-sm text-muted-foreground">{user.status}</span>
                </div>
              </TableCell>
              
              <TableCell className="text-muted-foreground text-sm">
                {new Date(user.last_active_at).toLocaleDateString()}
              </TableCell>
              
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" /> Resend Invite
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Shield className="mr-2 h-4 w-4" /> Edit Permissions
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(user.id)}
                        disabled={isPending}
                    >
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserX className="mr-2 h-4 w-4" />}
                        Revoke Access
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {users.length === 0 && (
              <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                      No team members found.
                  </TableCell>
              </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

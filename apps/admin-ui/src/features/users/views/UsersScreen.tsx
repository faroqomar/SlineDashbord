'use client';

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserSearch } from "@/components/users/UserSearch";
import { PaginationControls } from "@/components/users/PaginationControls";
import { UserActionsMenu } from "@/components/users/UserActionsMenu";
import { useUsersViewModel } from "../viewmodels/useUsersViewModel";

export function UsersScreen() {
  const vm = useUsersViewModel();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
        <Button>Add User</Button>
      </div>

      <UserSearch />

      {vm.error && (
        <div className="p-4 rounded-md bg-destructive/10 text-destructive border border-destructive/20">
          <p className="font-medium">Error loading users</p>
          <p className="text-sm">{vm.error}</p>
        </div>
      )}

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vm.isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : vm.users.length > 0 ? (
              vm.users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar_url} alt={user.full_name || "User"} />
                      <AvatarFallback>{(user.full_name || user.email || "U").charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.full_name || "Unknown"}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {user.roles?.map((r: string) => (
                        <Badge key={r} variant="outline" className="capitalize">{r}</Badge>
                      )) || <Badge variant="outline" className="capitalize">{user.active_role || "User"}</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={user.status === 'active' ? 'default' : user.status === 'suspended' ? 'destructive' : 'secondary'}
                      className={user.status === 'active' ? 'bg-success hover:bg-success/80' : ''}
                    >
                      {user.status || "Unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <UserActionsMenu userId={user.id} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        No users found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationControls totalPages={vm.totalPages} />
    </div>
  );
}

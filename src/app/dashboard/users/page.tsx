"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { MOCK_USERS } from "@/data/mock/users";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter Logic
  const filteredUsers = MOCK_USERS.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || 
                          user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to page 1 on search
  };

  const handleRoleFilter = (value: string) => {
    setRoleFilter(value);
    setCurrentPage(1); // Reset to page 1 on filter
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
        <Button>Add User</Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={search}
            onChange={handleSearch}
          />
        </div>
        <Select value={roleFilter} onValueChange={handleRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="User">User</SelectItem>
            <SelectItem value="Moderator">Moderator</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={user.status === 'Active' ? 'default' : user.status === 'Suspended' ? 'destructive' : 'secondary'}
                      className={user.status === 'Active' ? 'bg-success hover:bg-success/80' : ''}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link href={`/dashboard/users/${user.id}`}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Ban User</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <div className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

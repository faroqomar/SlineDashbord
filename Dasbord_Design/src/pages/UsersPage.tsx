import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MoreHorizontal,
  Eye,
  Ban,
  Shield,
  History,
  RefreshCw,
  UserPlus,
  Download,
  Columns,
   UserCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/dashboard/DataTable";
import { FilterPanel } from "@/components/dashboard/FilterPanel";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { EmptyState } from "@/components/dashboard/EmptyState";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
 import { ImpersonationStartDialog } from "@/components/impersonation/ImpersonationStartDialog";
 import { useImpersonation } from "@/contexts/ImpersonationContext";
 import { ImpersonatedUser } from "@/contexts/ImpersonationContext";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "client" | "freelancer" | "both";
  status: "active" | "suspended" | "banned" | "pending";
  joinDate: string;
  lastActive: string;
  reports: number;
  complaints: number;
  verified: boolean;
}

// Mock data
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    role: "freelancer",
    status: "active",
    joinDate: "Jan 15, 2024",
    lastActive: "2 hours ago",
    reports: 0,
    complaints: 1,
    verified: true,
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    role: "client",
    status: "active",
    joinDate: "Feb 3, 2024",
    lastActive: "5 min ago",
    reports: 0,
    complaints: 0,
    verified: true,
  },
  {
    id: "3",
    name: "Mike Wilson",
    email: "mike.w@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
    role: "both",
    status: "suspended",
    joinDate: "Dec 20, 2023",
    lastActive: "3 days ago",
    reports: 2,
    complaints: 4,
    verified: false,
  },
  {
    id: "4",
    name: "Emily Johnson",
    email: "emily.j@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
    role: "freelancer",
    status: "active",
    joinDate: "Mar 1, 2024",
    lastActive: "1 hour ago",
    reports: 0,
    complaints: 0,
    verified: true,
  },
  {
    id: "5",
    name: "David Kim",
    email: "david.kim@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
    role: "client",
    status: "pending",
    joinDate: "Mar 10, 2024",
    lastActive: "Never",
    reports: 0,
    complaints: 0,
    verified: false,
  },
  {
    id: "6",
    name: "Lisa Brown",
    email: "lisa.b@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
    role: "freelancer",
    status: "banned",
    joinDate: "Nov 5, 2023",
    lastActive: "30 days ago",
    reports: 8,
    complaints: 12,
    verified: true,
  },
];

const filterOptions = [
  {
    key: "status",
    label: "Status",
    type: "select" as const,
    options: [
      { value: "active", label: "Active" },
      { value: "suspended", label: "Suspended" },
      { value: "banned", label: "Banned" },
      { value: "pending", label: "Pending" },
    ],
  },
  {
    key: "role",
    label: "Role",
    type: "select" as const,
    options: [
      { value: "client", label: "Client" },
      { value: "freelancer", label: "Freelancer" },
      { value: "both", label: "Both" },
    ],
  },
  {
    key: "verified",
    label: "Verified",
    type: "select" as const,
    options: [
      { value: "true", label: "Verified" },
      { value: "false", label: "Unverified" },
    ],
  },
];

export default function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
   const [showImpersonateDialog, setShowImpersonateDialog] = useState(false);
   const [impersonateUser, setImpersonateUser] = useState<ImpersonatedUser | null>(null);
   const { isImpersonating } = useImpersonation();

  const getStatusType = (status: User["status"]) => {
    switch (status) {
      case "active":
        return "resolved";
      case "suspended":
        return "warning";
      case "banned":
        return "error";
      case "pending":
        return "pending";
      default:
        return "info";
    }
  };

  const columns = [
    {
      key: "name",
      header: "User",
      sortable: true,
      render: (user: User) => (
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{user.name}</span>
              {user.verified && (
                <Shield className="w-3.5 h-3.5 text-primary" />
              )}
            </div>
            <span className="text-sm text-muted-foreground">{user.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      sortable: true,
      render: (user: User) => (
        <Badge variant="secondary" className="capitalize">
          {user.role}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (user: User) => (
        <StatusBadge
          status={getStatusType(user.status)}
          label={user.status.charAt(0).toUpperCase() + user.status.slice(1)}
        />
      ),
    },
    {
      key: "joinDate",
      header: "Joined",
      sortable: true,
    },
    {
      key: "lastActive",
      header: "Last Active",
      sortable: true,
      className: "text-muted-foreground",
    },
    {
      key: "reports",
      header: "Reports",
      sortable: true,
      render: (user: User) => (
        <span className={user.reports > 0 ? "text-destructive font-medium" : "text-muted-foreground"}>
          {user.reports}
        </span>
      ),
    },
  ];

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setDetailsOpen(true);
  };

   const handleImpersonate = (user: User) => {
     setImpersonateUser({
       id: user.id,
       name: user.name,
       email: user.email,
       avatar: user.avatar,
     });
     setShowImpersonateDialog(true);
   };

  const getActions = (user: User) => [
    {
      label: "View Details",
      onClick: () => handleViewDetails(user),
    },
     {
       label: "Impersonate",
       onClick: () => handleImpersonate(user),
       disabled: isImpersonating,
     },
    {
      label: user.status === "suspended" ? "Unsuspend" : "Suspend",
      onClick: () => console.log("Toggle suspend", user.id),
    },
    {
      label: user.status === "banned" ? "Unban" : "Ban User",
      onClick: () => {
        setSelectedUser(user);
        setShowBanDialog(true);
      },
      destructive: user.status !== "banned",
    },
    {
      label: "View History",
      onClick: () => console.log("View history", user.id),
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage and monitor all users on the platform
          </p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Columns className="w-4 h-4 mr-2" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>User</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked>Role</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked>Status</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked>Joined</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked>Last Active</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked>Reports</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Total Users</div>
            <div className="text-2xl font-bold">12,428</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Active</div>
            <div className="text-2xl font-bold text-success">11,892</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Suspended</div>
            <div className="text-2xl font-bold text-warning">423</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Banned</div>
            <div className="text-2xl font-bold text-destructive">113</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs & Table */}
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="suspended">Suspended</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
          <FilterPanel
            filters={filterOptions}
            onFilterChange={(filters) => console.log(filters)}
            onSearch={(query) => console.log(query)}
            searchPlaceholder="Search users..."
          />
        </div>

        <TabsContent value="all" className="mt-0">
          <DataTable
            columns={columns}
            data={users}
            selectable
            actions={getActions}
            onRowClick={handleViewDetails}
          />
        </TabsContent>
        <TabsContent value="active">
          <DataTable
            columns={columns}
            data={users.filter((u) => u.status === "active")}
            selectable
            actions={getActions}
            onRowClick={handleViewDetails}
          />
        </TabsContent>
        <TabsContent value="suspended">
          <DataTable
            columns={columns}
            data={users.filter((u) => u.status === "suspended")}
            selectable
            actions={getActions}
            onRowClick={handleViewDetails}
          />
        </TabsContent>
        <TabsContent value="pending">
          <DataTable
            columns={columns}
            data={users.filter((u) => u.status === "pending")}
            selectable
            actions={getActions}
            onRowClick={handleViewDetails}
          />
        </TabsContent>
      </Tabs>

      {/* User Details Sheet */}
      <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          {selectedUser && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={selectedUser.avatar} />
                    <AvatarFallback>
                      {selectedUser.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle className="flex items-center gap-2">
                      {selectedUser.name}
                      {selectedUser.verified && (
                        <Shield className="w-4 h-4 text-primary" />
                      )}
                    </SheetTitle>
                    <SheetDescription>{selectedUser.email}</SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Status & Role */}
                <div className="flex gap-2">
                  <StatusBadge
                    status={getStatusType(selectedUser.status)}
                    label={selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                  />
                  <Badge variant="secondary" className="capitalize">
                    {selectedUser.role}
                  </Badge>
                </div>

                {/* Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Joined</div>
                    <div className="font-medium">{selectedUser.joinDate}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Last Active</div>
                    <div className="font-medium">{selectedUser.lastActive}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Reports</div>
                    <div className="font-medium">{selectedUser.reports}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Complaints</div>
                    <div className="font-medium">{selectedUser.complaints}</div>
                  </div>
                </div>

                <Separator />

                {/* Actions */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      <History className="w-4 h-4 mr-2" />
                      View History
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reset Flags
                    </Button>
                    <Button
                      variant={selectedUser.status === "suspended" ? "outline" : "secondary"}
                      size="sm"
                    >
                      <Ban className="w-4 h-4 mr-2" />
                      {selectedUser.status === "suspended" ? "Unsuspend" : "Suspend"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setShowBanDialog(true)}
                    >
                      <Ban className="w-4 h-4 mr-2" />
                      {selectedUser.status === "banned" ? "Unban" : "Ban"}
                    </Button>
                     <Button
                       variant="outline"
                       size="sm"
                       onClick={() => handleImpersonate(selectedUser)}
                       disabled={isImpersonating}
                       className="col-span-2"
                     >
                       <UserCheck className="w-4 h-4 mr-2" />
                       Impersonate User
                     </Button>
                  </div>
                </div>

                <Separator />

                {/* Activity */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Recent Activity</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Logged in</span>
                      <span>2 hours ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Updated profile</span>
                      <span>3 days ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Completed task</span>
                      <span>5 days ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Ban Confirmation Dialog */}
      <ConfirmDialog
        open={showBanDialog}
        onOpenChange={setShowBanDialog}
        type="danger"
        title={selectedUser?.status === "banned" ? "Unban User" : "Ban User"}
        description={
          selectedUser?.status === "banned"
            ? `Are you sure you want to unban ${selectedUser?.name}? They will regain access to the platform.`
            : `Are you sure you want to ban ${selectedUser?.name}? This will permanently restrict their access to the platform.`
        }
        confirmLabel={selectedUser?.status === "banned" ? "Unban" : "Ban User"}
        onConfirm={() => {
          console.log("User banned/unbanned");
          setShowBanDialog(false);
        }}
      />

       {/* Impersonation Dialog */}
       {impersonateUser && (
         <ImpersonationStartDialog
           open={showImpersonateDialog}
           onOpenChange={setShowImpersonateDialog}
           user={impersonateUser}
         />
       )}
    </div>
  );
}

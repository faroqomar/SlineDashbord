"use client";

import { Check, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const PERMISSIONS = [
  { id: "view_users", label: "View Users", category: "Users" },
  { id: "manage_users", label: "Manage Users", category: "Users" },
  { id: "view_disputes", label: "View Disputes", category: "Disputes" },
  { id: "manage_disputes", label: "Resolve Disputes", category: "Disputes" },
  { id: "view_analytics", label: "View Analytics", category: "Analytics" },
  { id: "manage_settings", label: "Manage Settings", category: "System" },
  { id: "view_logs", label: "View Audit Logs", category: "System" },
];

const ROLES = [
  { name: "Super Admin", permissions: ["all"] },
  { name: "Admin", permissions: ["manage_users", "manage_disputes", "view_analytics", "manage_settings", "view_logs", "view_users", "view_disputes"] },
  { name: "Moderator", permissions: ["manage_disputes", "view_users", "view_disputes"] },
  { name: "Support", permissions: ["view_users", "view_disputes"] },
];

export function PermissionMatrix() {
  const hasPermission = (rolePerms: string[], permId: string) => {
    return rolePerms.includes("all") || rolePerms.includes(permId);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Permission</TableHead>
            {ROLES.map((role) => (
              <TableHead key={role.name} className="text-center">{role.name}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {PERMISSIONS.map((perm) => (
            <TableRow key={perm.id}>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                    <span>{perm.label}</span>
                    <span className="text-xs text-muted-foreground">{perm.category}</span>
                </div>
              </TableCell>
              {ROLES.map((role) => (
                <TableCell key={`${role.name}-${perm.id}`} className="text-center">
                  <div className="flex justify-center">
                    {hasPermission(role.permissions, perm.id) ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground/30" />
                    )}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

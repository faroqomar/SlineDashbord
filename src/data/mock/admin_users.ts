export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Admin" | "Moderator" | "Support";
  status: "Active" | "Inactive" | "Invited";
  lastActive: string;
  avatar?: string;
  permissions: string[];
}

export const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    id: "adm_001",
    name: "Eros",
    email: "eros@sline.io",
    role: "Super Admin",
    status: "Active",
    lastActive: "Just now",
    avatar: "https://github.com/shadcn.png",
    permissions: ["all"],
  },
  {
    id: "adm_002",
    name: "Sarah Connors",
    email: "sarah@sline.io",
    role: "Admin",
    status: "Active",
    lastActive: "2 hours ago",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    permissions: ["manage_users", "manage_disputes", "view_analytics"],
  },
  {
    id: "adm_003",
    name: "Mike Ross",
    email: "mike@sline.io",
    role: "Moderator",
    status: "Active",
    lastActive: "5 mins ago",
    avatar: "https://i.pravatar.cc/150?u=mike",
    permissions: ["manage_disputes", "view_users"],
  },
  {
    id: "adm_004",
    name: "New Hire",
    email: "new.hire@sline.io",
    role: "Support",
    status: "Invited",
    lastActive: "-",
    permissions: ["view_users", "view_disputes"],
  },
];

export const ROLE_PERMISSIONS = {
  "Super Admin": ["all"],
  "Admin": ["manage_users", "manage_disputes", "view_analytics", "manage_settings"],
  "Moderator": ["manage_disputes", "view_users"],
  "Support": ["view_users", "view_disputes"],
};

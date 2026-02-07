import { useState } from "react";
import {
  Settings as SettingsIcon,
  Users,
  Shield,
  Key,
  Globe,
  Bell,
  Database,
  Lock,
  Smartphone,
  Check,
  X,
  Plus,
  Trash,
  Edit,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Record<string, boolean>;
  userCount: number;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  lastActive: string;
  mfaEnabled: boolean;
}

const mockRoles: Role[] = [
  {
    id: "1",
    name: "Super Admin",
    description: "Full access to all features",
    permissions: {
      users_view: true,
      users_edit: true,
      users_delete: true,
      disputes_view: true,
      disputes_resolve: true,
      settings_view: true,
      settings_edit: true,
      analytics_view: true,
      audit_view: true,
    },
    userCount: 2,
  },
  {
    id: "2",
    name: "Admin",
    description: "Standard admin access",
    permissions: {
      users_view: true,
      users_edit: true,
      users_delete: false,
      disputes_view: true,
      disputes_resolve: true,
      settings_view: true,
      settings_edit: false,
      analytics_view: true,
      audit_view: true,
    },
    userCount: 5,
  },
  {
    id: "3",
    name: "Support",
    description: "Customer support access",
    permissions: {
      users_view: true,
      users_edit: false,
      users_delete: false,
      disputes_view: true,
      disputes_resolve: false,
      settings_view: false,
      settings_edit: false,
      analytics_view: false,
      audit_view: false,
    },
    userCount: 12,
  },
];

const mockAdmins: AdminUser[] = [
  {
    id: "1",
    name: "Alex Chen",
    email: "alex@company.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    role: "Super Admin",
    lastActive: "2 min ago",
    mfaEnabled: true,
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah@company.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    role: "Admin",
    lastActive: "1 hour ago",
    mfaEnabled: true,
  },
  {
    id: "3",
    name: "Mike Wilson",
    email: "mike@company.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
    role: "Support",
    lastActive: "3 hours ago",
    mfaEnabled: false,
  },
];

const permissionCategories = [
  {
    name: "Users",
    permissions: [
      { key: "users_view", label: "View users" },
      { key: "users_edit", label: "Edit users" },
      { key: "users_delete", label: "Delete users" },
    ],
  },
  {
    name: "Disputes",
    permissions: [
      { key: "disputes_view", label: "View disputes" },
      { key: "disputes_resolve", label: "Resolve disputes" },
    ],
  },
  {
    name: "Settings",
    permissions: [
      { key: "settings_view", label: "View settings" },
      { key: "settings_edit", label: "Edit settings" },
    ],
  },
  {
    name: "Other",
    permissions: [
      { key: "analytics_view", label: "View analytics" },
      { key: "audit_view", label: "View audit logs" },
    ],
  },
];

const featureFlags = [
  { id: "dark_mode", name: "Dark Mode", description: "Enable dark mode for all users", enabled: true },
  { id: "new_dashboard", name: "New Dashboard", description: "Show new dashboard UI", enabled: false },
  { id: "ai_support", name: "AI Support", description: "Enable AI-powered support responses", enabled: true },
  { id: "advanced_analytics", name: "Advanced Analytics", description: "Show advanced analytics features", enabled: false },
];

export default function SettingsPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [mfaRequired, setMfaRequired] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("60");
  const [flags, setFlags] = useState(featureFlags);

  const toggleFlag = (id: string) => {
    setFlags(flags.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f)));
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage admin roles, permissions, and system configuration
        </p>
      </div>

      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList>
          <TabsTrigger value="roles" className="gap-2">
            <Shield className="w-4 h-4" />
            Roles & Permissions
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-2">
            <Users className="w-4 h-4" />
            Team
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Lock className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="features" className="gap-2">
            <SettingsIcon className="w-4 h-4" />
            Features
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Globe className="w-4 h-4" />
            Integrations
          </TabsTrigger>
        </TabsList>

        {/* Roles & Permissions */}
        <TabsContent value="roles" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Roles List */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">Roles</CardTitle>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Role
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {mockRoles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role)}
                      className={cn(
                        "w-full p-4 text-left transition-colors hover:bg-muted",
                        selectedRole?.id === role.id && "bg-accent"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{role.name}</p>
                          <p className="text-sm text-muted-foreground">{role.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{role.userCount} users</Badge>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Permission Matrix */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">
                  {selectedRole ? `Permissions: ${selectedRole.name}` : "Select a role"}
                </CardTitle>
                <CardDescription>
                  Configure what actions this role can perform
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedRole ? (
                  <div className="space-y-6">
                    {permissionCategories.map((category) => (
                      <div key={category.name}>
                        <h4 className="text-sm font-medium mb-3">{category.name}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {category.permissions.map((perm) => (
                            <div
                              key={perm.key}
                              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                            >
                              <span className="text-sm">{perm.label}</span>
                              <Switch
                                checked={selectedRole.permissions[perm.key] || false}
                                disabled={selectedRole.name === "Super Admin"}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-2 pt-4">
                      <Button>Save Changes</Button>
                      <Button variant="outline">Reset</Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-12">
                    Select a role from the list to view and edit permissions
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Team */}
        <TabsContent value="team" className="mt-0">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base">Admin Team</CardTitle>
                <CardDescription>Manage team members and their roles</CardDescription>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Invite Member
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>MFA</TableHead>
                    <TableHead className="w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAdmins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={admin.avatar} />
                            <AvatarFallback>{admin.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{admin.name}</p>
                            <p className="text-sm text-muted-foreground">{admin.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{admin.role}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{admin.lastActive}</TableCell>
                      <TableCell>
                        {admin.mfaEnabled ? (
                          <Badge className="bg-success/10 text-success">
                            <Check className="w-3 h-3 mr-1" />
                            Enabled
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <X className="w-3 h-3 mr-1" />
                            Disabled
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* MFA Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  Multi-Factor Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Require MFA for all admins</p>
                    <p className="text-sm text-muted-foreground">
                      All team members must enable 2FA
                    </p>
                  </div>
                  <Switch checked={mfaRequired} onCheckedChange={setMfaRequired} />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>MFA Methods</Label>
                  <div className="space-y-2">
                    {["Authenticator App", "SMS", "Email"].map((method) => (
                      <div key={method} className="flex items-center gap-2">
                        <Checkbox id={method} defaultChecked={method === "Authenticator App"} />
                        <label htmlFor={method} className="text-sm">{method}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Session Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  Session Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Session Timeout</Label>
                  <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="480">8 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Allowed IP Addresses</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Restrict admin access to specific IPs
                  </p>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input placeholder="Enter IP address or CIDR" />
                      <Button variant="outline">Add</Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      No IP restrictions configured
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Feature Flags */}
        <TabsContent value="features" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Feature Flags</CardTitle>
              <CardDescription>
                Enable or disable features across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {flags.map((flag) => (
                  <div
                    key={flag.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{flag.name}</p>
                      <p className="text-sm text-muted-foreground">{flag.description}</p>
                    </div>
                    <Switch
                      checked={flag.enabled}
                      onCheckedChange={() => toggleFlag(flag.id)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Stripe", description: "Payment processing", connected: true },
              { name: "Twilio", description: "SMS notifications", connected: true },
              { name: "SendGrid", description: "Email delivery", connected: false },
              { name: "Slack", description: "Team notifications", connected: false },
              { name: "Zapier", description: "Automation workflows", connected: false },
              { name: "Google Analytics", description: "Traffic analytics", connected: true },
            ].map((integration) => (
              <Card key={integration.name}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{integration.name}</p>
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                    </div>
                    {integration.connected ? (
                      <Badge className="bg-success/10 text-success">Connected</Badge>
                    ) : (
                      <Button size="sm" variant="outline">Connect</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

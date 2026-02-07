import { useState } from "react";
import {
  FileText,
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  User,
  Settings,
  Shield,
  Database,
  Trash,
  Edit,
  Eye,
  Plus,
  Download,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FilterPanel } from "@/components/dashboard/FilterPanel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface AuditLog {
  id: string;
  action: string;
  actionType: "create" | "update" | "delete" | "access" | "security";
  admin: {
    name: string;
    avatar: string;
    role: string;
  };
  target: {
    type: string;
    id: string;
    name: string;
  };
  timestamp: string;
  ipAddress: string;
  details?: {
    before?: Record<string, any>;
    after?: Record<string, any>;
    reason?: string;
  };
}

const mockAuditLogs: AuditLog[] = [
  {
    id: "1",
    action: "Updated user status",
    actionType: "update",
    admin: {
      name: "Alex Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      role: "Super Admin",
    },
    target: {
      type: "User",
      id: "usr_123",
      name: "John Doe",
    },
    timestamp: "Mar 10, 2024 at 2:45 PM",
    ipAddress: "192.168.1.1",
    details: {
      before: { status: "active" },
      after: { status: "suspended" },
      reason: "Repeated policy violations",
    },
  },
  {
    id: "2",
    action: "Deleted dispute",
    actionType: "delete",
    admin: {
      name: "Sarah Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      role: "Admin",
    },
    target: {
      type: "Dispute",
      id: "dsp_456",
      name: "Dispute #456",
    },
    timestamp: "Mar 10, 2024 at 1:30 PM",
    ipAddress: "192.168.1.2",
  },
  {
    id: "3",
    action: "Created notification campaign",
    actionType: "create",
    admin: {
      name: "Mike Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
      role: "Admin",
    },
    target: {
      type: "Notification",
      id: "ntf_789",
      name: "Weekly Digest",
    },
    timestamp: "Mar 10, 2024 at 11:00 AM",
    ipAddress: "192.168.1.3",
    details: {
      after: {
        title: "Weekly Digest",
        segment: "All Users",
        scheduled: "Mar 12, 2024",
      },
    },
  },
  {
    id: "4",
    action: "Accessed user data",
    actionType: "access",
    admin: {
      name: "Emily Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
      role: "Support",
    },
    target: {
      type: "User",
      id: "usr_321",
      name: "Client Data Export",
    },
    timestamp: "Mar 10, 2024 at 10:15 AM",
    ipAddress: "192.168.1.4",
  },
  {
    id: "5",
    action: "Changed security settings",
    actionType: "security",
    admin: {
      name: "Alex Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      role: "Super Admin",
    },
    target: {
      type: "Settings",
      id: "set_001",
      name: "MFA Settings",
    },
    timestamp: "Mar 9, 2024 at 4:30 PM",
    ipAddress: "192.168.1.1",
    details: {
      before: { mfaRequired: false },
      after: { mfaRequired: true },
    },
  },
];

const actionTypeConfig: Record<AuditLog["actionType"], { icon: React.ElementType; className: string }> = {
  create: { icon: Plus, className: "bg-success/10 text-success" },
  update: { icon: Edit, className: "bg-info/10 text-info" },
  delete: { icon: Trash, className: "bg-destructive/10 text-destructive" },
  access: { icon: Eye, className: "bg-warning/10 text-warning" },
  security: { icon: Shield, className: "bg-primary/10 text-primary" },
};

const filterOptions = [
  {
    key: "actionType",
    label: "Action Type",
    type: "select" as const,
    options: [
      { value: "create", label: "Create" },
      { value: "update", label: "Update" },
      { value: "delete", label: "Delete" },
      { value: "access", label: "Access" },
      { value: "security", label: "Security" },
    ],
  },
  {
    key: "targetType",
    label: "Target Type",
    type: "select" as const,
    options: [
      { value: "user", label: "User" },
      { value: "dispute", label: "Dispute" },
      { value: "notification", label: "Notification" },
      { value: "settings", label: "Settings" },
    ],
  },
  {
    key: "admin",
    label: "Admin",
    type: "select" as const,
    options: [
      { value: "alex", label: "Alex Chen" },
      { value: "sarah", label: "Sarah Chen" },
      { value: "mike", label: "Mike Wilson" },
    ],
  },
];

export default function AuditLogsPage() {
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [view, setView] = useState<"timeline" | "table">("timeline");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const toggleExpand = (id: string) => {
    const newSet = new Set(expandedLogs);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedLogs(newSet);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">
            Track all admin actions and system changes
          </p>
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Clock className="w-4 h-4" />
                {dateRange?.from && dateRange?.to
                  ? `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d")}`
                  : "Select dates"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <FilterPanel
          filters={filterOptions}
          onFilterChange={(filters) => console.log(filters)}
          onSearch={(query) => console.log(query)}
          searchPlaceholder="Search logs..."
        />
        <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
          <TabsList>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Logs List */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-20rem)]">
                <div className="divide-y divide-border">
                  {mockAuditLogs.map((log) => {
                    const config = actionTypeConfig[log.actionType];
                    const Icon = config.icon;
                    const isExpanded = expandedLogs.has(log.id);

                    return (
                      <Collapsible
                        key={log.id}
                        open={isExpanded}
                        onOpenChange={() => toggleExpand(log.id)}
                      >
                        <div
                          className={cn(
                            "p-4 transition-colors cursor-pointer",
                            selectedLog?.id === log.id && "bg-accent/50"
                          )}
                          onClick={() => setSelectedLog(log)}
                        >
                          <div className="flex items-start gap-4">
                            {/* Timeline dot */}
                            <div className="flex flex-col items-center">
                              <div className={cn("p-2 rounded-lg", config.className)}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="w-0.5 h-full bg-border mt-2 flex-1" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="font-medium">{log.action}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-2xs">
                                      {log.target.type}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                      {log.target.name}
                                    </span>
                                  </div>
                                </div>
                                <CollapsibleTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                    }}
                                  >
                                    {isExpanded ? (
                                      <ChevronDown className="w-4 h-4" />
                                    ) : (
                                      <ChevronRight className="w-4 h-4" />
                                    )}
                                  </Button>
                                </CollapsibleTrigger>
                              </div>

                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Avatar className="w-5 h-5">
                                    <AvatarImage src={log.admin.avatar} />
                                    <AvatarFallback>{log.admin.name[0]}</AvatarFallback>
                                  </Avatar>
                                  <span>{log.admin.name}</span>
                                </div>
                                <span>•</span>
                                <span>{log.timestamp}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <CollapsibleContent>
                          {log.details && (
                            <div className="px-4 pb-4 pt-0 ml-14">
                              <div className="p-4 bg-muted rounded-lg space-y-3">
                                {log.details.reason && (
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Reason</p>
                                    <p className="text-sm">{log.details.reason}</p>
                                  </div>
                                )}
                                {log.details.before && (
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Before</p>
                                    <pre className="text-xs bg-background p-2 rounded border overflow-x-auto">
                                      {JSON.stringify(log.details.before, null, 2)}
                                    </pre>
                                  </div>
                                )}
                                {log.details.after && (
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">After</p>
                                    <pre className="text-xs bg-background p-2 rounded border overflow-x-auto">
                                      {JSON.stringify(log.details.after, null, 2)}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Details Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Log Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedLog ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Action</p>
                    <p className="font-medium">{selectedLog.action}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground">Performed by</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={selectedLog.admin.avatar} />
                        <AvatarFallback>{selectedLog.admin.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedLog.admin.name}</p>
                        <p className="text-xs text-muted-foreground">{selectedLog.admin.role}</p>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground">Target</p>
                    <p className="font-medium">{selectedLog.target.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedLog.target.type} • {selectedLog.target.id}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground">Timestamp</p>
                    <p className="font-medium">{selectedLog.timestamp}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">IP Address</p>
                    <p className="font-mono text-sm">{selectedLog.ipAddress}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Select a log to view details
                </p>
              )}
            </CardContent>
          </Card>

          {/* Activity Summary */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Activity Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(actionTypeConfig).map(([type, config]) => {
                  const count = mockAuditLogs.filter((l) => l.actionType === type).length;
                  const Icon = config.icon;
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn("p-1.5 rounded", config.className)}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="capitalize text-sm">{type}</span>
                      </div>
                      <span className="font-medium">{count}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

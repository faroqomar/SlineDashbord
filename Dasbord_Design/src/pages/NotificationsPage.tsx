import { useState } from "react";
import {
  Bell,
  Send,
  Clock,
  Users,
  Target,
  Calendar,
  Eye,
  Copy,
  Trash,
  MoreVertical,
  Plus,
  CheckCircle,
  XCircle,
  Smartphone,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { DataTable } from "@/components/dashboard/DataTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  body: string;
  segment: string;
  status: "sent" | "scheduled" | "draft" | "failed";
  sentAt?: string;
  scheduledFor?: string;
  recipients: number;
  delivered?: number;
  opened?: number;
  clicked?: number;
}

interface Template {
  id: string;
  name: string;
  title: string;
  body: string;
  category: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New feature: Dark mode is here!",
    body: "We've added dark mode to make your experience even better. Try it now in settings.",
    segment: "All Users",
    status: "sent",
    sentAt: "Mar 10, 2024 at 10:00 AM",
    recipients: 12428,
    delivered: 12100,
    opened: 4850,
    clicked: 1200,
  },
  {
    id: "2",
    title: "Complete your profile",
    body: "Add more details to your profile to get more visibility and job opportunities.",
    segment: "Incomplete Profiles",
    status: "scheduled",
    scheduledFor: "Mar 12, 2024 at 9:00 AM",
    recipients: 2340,
  },
  {
    id: "3",
    title: "Weekly digest",
    body: "Check out the top freelancers and projects this week.",
    segment: "Active Users",
    status: "draft",
    recipients: 8294,
  },
];

const mockTemplates: Template[] = [
  {
    id: "1",
    name: "Welcome Message",
    title: "Welcome to {{app_name}}!",
    body: "Hi {{name}}, thanks for joining. Get started by completing your profile.",
    category: "Onboarding",
  },
  {
    id: "2",
    name: "Payment Received",
    title: "You've received a payment!",
    body: "Great news! {{amount}} has been deposited to your account.",
    category: "Transactions",
  },
  {
    id: "3",
    name: "Project Reminder",
    title: "Deadline approaching",
    body: "Your project '{{project_name}}' is due in {{days}} days.",
    category: "Reminders",
  },
];

const segments = [
  { value: "all", label: "All Users", count: 12428 },
  { value: "active", label: "Active Users", count: 8294 },
  { value: "clients", label: "Clients Only", count: 5200 },
  { value: "freelancers", label: "Freelancers Only", count: 7228 },
  { value: "new", label: "New Users (30 days)", count: 1543 },
  { value: "inactive", label: "Inactive Users", count: 2134 },
];

export default function NotificationsPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [segment, setSegment] = useState("all");
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const [isScheduled, setIsScheduled] = useState(false);

  const selectedSegment = segments.find((s) => s.value === segment);

  const getStatusType = (status: Notification["status"]) => {
    switch (status) {
      case "sent": return "resolved";
      case "scheduled": return "pending";
      case "draft": return "info";
      case "failed": return "error";
      default: return "info";
    }
  };

  const columns = [
    {
      key: "title",
      header: "Notification",
      render: (item: Notification) => (
        <div>
          <div className="font-medium">{item.title}</div>
          <div className="text-sm text-muted-foreground line-clamp-1">{item.body}</div>
        </div>
      ),
    },
    {
      key: "segment",
      header: "Segment",
      render: (item: Notification) => (
        <Badge variant="secondary">{item.segment}</Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: Notification) => (
        <StatusBadge
          status={getStatusType(item.status)}
          label={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        />
      ),
    },
    {
      key: "recipients",
      header: "Recipients",
      render: (item: Notification) => (
        <span>{item.recipients.toLocaleString()}</span>
      ),
    },
    {
      key: "stats",
      header: "Performance",
      render: (item: Notification) => {
        if (item.status !== "sent") return <span className="text-muted-foreground">—</span>;
        const openRate = ((item.opened || 0) / (item.delivered || 1) * 100).toFixed(1);
        return (
          <div className="text-sm">
            <span className="text-success">{openRate}% opened</span>
          </div>
        );
      },
    },
    {
      key: "date",
      header: "Date",
      render: (item: Notification) => (
        <span className="text-muted-foreground">
          {item.sentAt || item.scheduledFor || "Draft"}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Send and manage push notifications to users
          </p>
        </div>
      </div>

      <Tabs defaultValue="compose" className="space-y-6">
        <TabsList>
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        {/* Compose Tab */}
        <TabsContent value="compose" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Compose Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">New Notification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      placeholder="Enter notification title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Message</Label>
                    <Textarea
                      placeholder="Enter notification message..."
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      {body.length}/200 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Target Segment</Label>
                    <Select value={segment} onValueChange={setSegment}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {segments.map((seg) => (
                          <SelectItem key={seg.value} value={seg.value}>
                            <div className="flex items-center justify-between w-full gap-4">
                              <span>{seg.label}</span>
                              <Badge variant="secondary" className="ml-auto">
                                {seg.count.toLocaleString()}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Schedule for later</Label>
                      <p className="text-xs text-muted-foreground">
                        Send at a specific date and time
                      </p>
                    </div>
                    <Switch checked={isScheduled} onCheckedChange={setIsScheduled} />
                  </div>

                  {isScheduled && (
                    <div className="space-y-2">
                      <Label>Schedule Date & Time</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !scheduleDate && "text-muted-foreground"
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {scheduleDate ? format(scheduleDate, "PPP 'at' p") : "Pick a date and time"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={scheduleDate}
                            onSelect={setScheduleDate}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1" disabled={!title || !body}>
                      <Send className="w-4 h-4 mr-2" />
                      {isScheduled ? "Schedule Notification" : "Send Now"}
                    </Button>
                    <Button variant="outline">
                      Save as Draft
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-2xl p-4 space-y-3">
                    {/* Phone Frame */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Smartphone className="w-3 h-3" />
                      Push Notification
                    </div>
                    <div className="bg-card rounded-xl p-3 shadow-soft">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Bell className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm line-clamp-1">
                            {title || "Notification title"}
                          </div>
                          <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                            {body || "Your notification message will appear here..."}
                          </div>
                          <div className="text-2xs text-muted-foreground mt-1">now</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Audience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {selectedSegment?.count.toLocaleString() || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    users will receive this notification
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notification History</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={mockNotifications}
                actions={(item) => [
                  { label: "View Details", onClick: () => console.log("View", item.id) },
                  { label: "Duplicate", onClick: () => console.log("Duplicate", item.id) },
                  { label: "Delete", onClick: () => console.log("Delete", item.id), destructive: true },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="mt-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Notification Templates</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-medium transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">{template.category}</Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Use Template
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{template.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{template.body}</p>
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

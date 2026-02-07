import { useState } from "react";
import {
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Send,
  Paperclip,
  MoreVertical,
  ChevronRight,
  StickyNote,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { FilterPanel } from "@/components/dashboard/FilterPanel";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
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
import { cn } from "@/lib/utils";

interface Ticket {
  id: string;
  subject: string;
  status: "open" | "in_review" | "resolved" | "closed";
  priority: "high" | "medium" | "low";
  category: string;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  assignee?: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
  messages: {
    id: string;
    sender: "user" | "admin";
    senderName: string;
    senderAvatar: string;
    content: string;
    timestamp: string;
  }[];
  internalNotes: {
    id: string;
    author: string;
    content: string;
    timestamp: string;
  }[];
}

const mockTickets: Ticket[] = [
  {
    id: "TKT-001",
    subject: "Payment not received for completed task",
    status: "open",
    priority: "high",
    category: "Payment",
    user: {
      name: "John Doe",
      email: "john@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    },
    createdAt: "Mar 10, 2024 at 10:30 AM",
    updatedAt: "2 hours ago",
    messages: [
      {
        id: "1",
        sender: "user",
        senderName: "John Doe",
        senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
        content: "I completed a task 5 days ago but haven't received my payment yet. The client marked it as complete but the funds are still pending. Order ID: #12345",
        timestamp: "Mar 10, 2024 at 10:30 AM",
      },
      {
        id: "2",
        sender: "admin",
        senderName: "Support Team",
        senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
        content: "Hi John, thank you for reaching out. We're looking into this issue. Could you please confirm the payment method linked to your account?",
        timestamp: "Mar 10, 2024 at 11:45 AM",
      },
      {
        id: "3",
        sender: "user",
        senderName: "John Doe",
        senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
        content: "Sure, I have PayPal linked to my account. The email is john@example.com",
        timestamp: "Mar 10, 2024 at 12:15 PM",
      },
    ],
    internalNotes: [
      {
        id: "1",
        author: "Sarah Chen",
        content: "Checked payment logs - payment is stuck in processing. Escalating to finance team.",
        timestamp: "Mar 10, 2024 at 2:00 PM",
      },
    ],
  },
  {
    id: "TKT-002",
    subject: "Account verification taking too long",
    status: "in_review",
    priority: "medium",
    category: "Account",
    user: {
      name: "Sarah Chen",
      email: "sarah@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    },
    assignee: {
      name: "Mike Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
    },
    createdAt: "Mar 9, 2024 at 3:00 PM",
    updatedAt: "1 day ago",
    messages: [],
    internalNotes: [],
  },
  {
    id: "TKT-003",
    subject: "Feature request: Dark mode",
    status: "resolved",
    priority: "low",
    category: "Feature Request",
    user: {
      name: "Emily Johnson",
      email: "emily@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
    },
    createdAt: "Mar 8, 2024 at 9:00 AM",
    updatedAt: "3 days ago",
    messages: [],
    internalNotes: [],
  },
];

const filterOptions = [
  {
    key: "status",
    label: "Status",
    type: "select" as const,
    options: [
      { value: "open", label: "Open" },
      { value: "in_review", label: "In Review" },
      { value: "resolved", label: "Resolved" },
      { value: "closed", label: "Closed" },
    ],
  },
  {
    key: "priority",
    label: "Priority",
    type: "select" as const,
    options: [
      { value: "high", label: "High" },
      { value: "medium", label: "Medium" },
      { value: "low", label: "Low" },
    ],
  },
  {
    key: "category",
    label: "Category",
    type: "select" as const,
    options: [
      { value: "payment", label: "Payment" },
      { value: "account", label: "Account" },
      { value: "feature", label: "Feature Request" },
      { value: "bug", label: "Bug Report" },
    ],
  },
];

const adminUsers = [
  { id: "1", name: "Sarah Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah" },
  { id: "2", name: "Mike Wilson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike" },
  { id: "3", name: "Alex Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex" },
];

export default function ComplaintsPage() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(mockTickets[0]);
  const [replyContent, setReplyContent] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<Ticket["status"] | null>(null);

  const getStatusType = (status: Ticket["status"]) => {
    switch (status) {
      case "open": return "open";
      case "in_review": return "pending";
      case "resolved": return "resolved";
      case "closed": return "closed";
      default: return "info";
    }
  };

  const getPriorityClass = (priority: Ticket["priority"]) => {
    switch (priority) {
      case "high": return "priority-high";
      case "medium": return "priority-medium";
      case "low": return "priority-low";
      default: return "";
    }
  };

  const handleStatusChange = (status: Ticket["status"]) => {
    if (status === "closed" || status === "resolved") {
      setPendingStatus(status);
      setShowStatusDialog(true);
    } else {
      // Direct status change
      console.log("Status changed to:", status);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Ticket List */}
      <div className="w-full lg:w-96 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Complaints</h1>
            <Badge variant="secondary">23 Open</Badge>
          </div>
          <FilterPanel
            filters={filterOptions}
            onFilterChange={(filters) => console.log(filters)}
            onSearch={(query) => console.log(query)}
            searchPlaceholder="Search tickets..."
          />
        </div>

        <Tabs defaultValue="open" className="flex-1 flex flex-col">
          <TabsList className="mx-4 mt-2 grid grid-cols-4">
            <TabsTrigger value="open" className="text-xs">Open</TabsTrigger>
            <TabsTrigger value="in_review" className="text-xs">Review</TabsTrigger>
            <TabsTrigger value="resolved" className="text-xs">Resolved</TabsTrigger>
            <TabsTrigger value="closed" className="text-xs">Closed</TabsTrigger>
          </TabsList>

          <TabsContent value="open" className="flex-1 m-0">
            <ScrollArea className="h-full">
              <div className="p-2 space-y-1">
                {mockTickets.filter(t => t.status === "open").map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer transition-colors",
                      selectedTicket?.id === ticket.id
                        ? "bg-accent"
                        : "hover:bg-muted"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-xs text-muted-foreground">{ticket.id}</span>
                      <span className={cn("status-badge text-2xs", getPriorityClass(ticket.priority))}>
                        {ticket.priority}
                      </span>
                    </div>
                    <h3 className="font-medium text-sm line-clamp-1">{ticket.subject}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-5 h-5">
                          <AvatarImage src={ticket.user.avatar} />
                          <AvatarFallback className="text-2xs">
                            {ticket.user.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{ticket.user.name}</span>
                      </div>
                      <span className="text-2xs text-muted-foreground">{ticket.updatedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="in_review" className="flex-1 m-0">
            <ScrollArea className="h-full">
              <div className="p-2 space-y-1">
                {mockTickets.filter(t => t.status === "in_review").map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer transition-colors",
                      selectedTicket?.id === ticket.id ? "bg-accent" : "hover:bg-muted"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-xs text-muted-foreground">{ticket.id}</span>
                      <span className={cn("status-badge text-2xs", getPriorityClass(ticket.priority))}>
                        {ticket.priority}
                      </span>
                    </div>
                    <h3 className="font-medium text-sm line-clamp-1">{ticket.subject}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={ticket.user.avatar} />
                        <AvatarFallback className="text-2xs">
                          {ticket.user.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">{ticket.user.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="resolved" className="flex-1 m-0">
            <ScrollArea className="h-full">
              <div className="p-2 space-y-1">
                {mockTickets.filter(t => t.status === "resolved").map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer transition-colors",
                      selectedTicket?.id === ticket.id ? "bg-accent" : "hover:bg-muted"
                    )}
                  >
                    <h3 className="font-medium text-sm line-clamp-1">{ticket.subject}</h3>
                    <span className="text-xs text-muted-foreground">{ticket.id}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="closed" className="flex-1 m-0">
            <div className="p-8 text-center text-muted-foreground">
              No closed tickets
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Ticket Details */}
      {selectedTicket ? (
        <div className="hidden lg:flex flex-1 flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-muted-foreground">{selectedTicket.id}</span>
                  <StatusBadge
                    status={getStatusType(selectedTicket.status)}
                    label={selectedTicket.status.replace("_", " ")}
                    size="sm"
                  />
                </div>
                <h2 className="text-lg font-semibold">{selectedTicket.subject}</h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>Category: {selectedTicket.category}</span>
                  <span>Created: {selectedTicket.createdAt}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={selectedTicket.status}
                  onValueChange={(value) => handleStatusChange(value as Ticket["status"])}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_review">In Review</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Merge tickets</DropdownMenuItem>
                    <DropdownMenuItem>Export conversation</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete ticket</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Assignment */}
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Assigned to:</span>
                <Select defaultValue={selectedTicket.assignee?.name || "unassigned"}>
                  <SelectTrigger className="w-40 h-8">
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {adminUsers.map((user) => (
                      <SelectItem key={user.id} value={user.name}>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-5 h-5">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          {user.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotes(!showNotes)}
                className={cn(showNotes && "bg-accent")}
              >
                <StickyNote className="w-4 h-4 mr-2" />
                Internal Notes
                {selectedTicket.internalNotes.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedTicket.internalNotes.length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Conversation */}
            <div className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4 max-w-2xl">
                  {/* User Info Card */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={selectedTicket.user.avatar} />
                          <AvatarFallback>
                            {selectedTicket.user.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{selectedTicket.user.name}</div>
                          <div className="text-sm text-muted-foreground">{selectedTicket.user.email}</div>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto">
                          <User className="w-4 h-4 mr-2" />
                          View Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Messages */}
                  {selectedTicket.messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3",
                        message.sender === "admin" && "flex-row-reverse"
                      )}
                    >
                      <Avatar className="w-8 h-8 shrink-0">
                        <AvatarImage src={message.senderAvatar} />
                        <AvatarFallback>
                          {message.senderName.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={cn(
                          "flex-1 max-w-md",
                          message.sender === "admin" && "text-right"
                        )}
                      >
                        <div
                          className={cn(
                            "rounded-lg p-3",
                            message.sender === "admin"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-2xs text-muted-foreground">
                          <span>{message.senderName}</span>
                          <span>•</span>
                          <span>{message.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Reply Box */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-3">
                  <Textarea
                    placeholder="Type your reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                </div>
                <div className="flex items-center justify-between mt-3">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="w-4 h-4 mr-2" />
                    Attach
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Save Draft
                    </Button>
                    <Button size="sm">
                      <Send className="w-4 h-4 mr-2" />
                      Send Reply
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Internal Notes Panel */}
            {showNotes && (
              <div className="w-80 border-l border-border flex flex-col bg-muted/30">
                <div className="p-4 border-b border-border">
                  <h3 className="font-medium">Internal Notes</h3>
                  <p className="text-xs text-muted-foreground">
                    Only visible to team members
                  </p>
                </div>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-3">
                    {selectedTicket.internalNotes.map((note) => (
                      <div key={note.id} className="p-3 bg-warning/10 rounded-lg border border-warning/20">
                        <p className="text-sm">{note.content}</p>
                        <div className="flex items-center gap-2 mt-2 text-2xs text-muted-foreground">
                          <span>{note.author}</span>
                          <span>•</span>
                          <span>{note.timestamp}</span>
                        </div>
                      </div>
                    ))}
                    {selectedTicket.internalNotes.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No internal notes yet
                      </p>
                    )}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t border-border">
                  <Textarea
                    placeholder="Add internal note..."
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    className="min-h-[60px] resize-none mb-2"
                  />
                  <Button size="sm" className="w-full">
                    Add Note
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center text-muted-foreground">
          Select a ticket to view details
        </div>
      )}

      {/* Status Change Confirmation */}
      <ConfirmDialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        type={pendingStatus === "closed" ? "warning" : "success"}
        title={`Mark as ${pendingStatus}`}
        description={`Are you sure you want to mark this ticket as ${pendingStatus}? ${
          pendingStatus === "closed" ? "This will close the ticket permanently." : "The user will be notified."
        }`}
        confirmLabel={`Mark as ${pendingStatus}`}
        onConfirm={() => {
          console.log("Status changed to:", pendingStatus);
          setShowStatusDialog(false);
        }}
      />
    </div>
  );
}

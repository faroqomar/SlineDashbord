export interface TicketUser {
  name: string;
  email: string;
  avatar: string;
}

export interface TicketMessage {
  id: string;
  sender: "user" | "admin";
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
}

export interface InternalNote {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  subject: string;
  status: "open" | "in_review" | "resolved" | "closed";
  priority: "high" | "medium" | "low";
  category: string;
  user: TicketUser;
  assignee?: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
  internalNotes: InternalNote[];
}

export const MOCK_TICKETS: Ticket[] = [
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

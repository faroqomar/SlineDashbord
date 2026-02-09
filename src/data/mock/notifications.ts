export interface Notification {
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

export interface Template {
  id: string;
  name: string;
  title: string;
  body: string;
  category: string;
}

export const mockNotifications: Notification[] = [
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

export const mockTemplates: Template[] = [
  {
    id: "1",
    name: "Welcome Message",
    title: "Welcome to Sline!",
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

export const segments = [
  { value: "all", label: "All Users", count: 12428 },
  { value: "active", label: "Active Users", count: 8294 },
  { value: "clients", label: "Clients Only", count: 5200 },
  { value: "freelancers", label: "Freelancers Only", count: 7228 },
  { value: "new", label: "New Users (30 days)", count: 1543 },
  { value: "inactive", label: "Inactive Users", count: 2134 },
];

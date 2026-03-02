import { LucideIcon, CreditCard, Users, Activity, FileWarning } from "lucide-react";

export interface KPIStat {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export interface RevenuePoint {
  name: string;
  total: number;
}

export interface ActivityItem {
  id: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  action: string;
  amount?: string;
  status: "success" | "pending" | "error";
  time: string;
}

export interface PendingItem {
  id: string;
  type: string;
  count: number;
  status: "pending" | "warning" | "open";
}

export const MOCK_KPI_STATS: KPIStat[] = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1% from last month",
    trend: "up",
    icon: CreditCard,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
  },
  {
    title: "Active Users",
    value: "+2350",
    change: "+180.1% from last month",
    trend: "up",
    icon: Users,
    iconColor: "text-info",
    iconBg: "bg-info/10",
  },
  {
    title: "Pending Disputes",
    value: "12",
    change: "-5% from last month",
    trend: "down", // Good thing
    icon: FileWarning,
    iconColor: "text-warning",
    iconBg: "bg-warning/10",
  },
  {
    title: "Active Jobs",
    value: "+573",
    change: "+201 since last hour",
    trend: "up",
    icon: Activity,
    iconColor: "text-destructive",
    iconBg: "bg-destructive/10",
  },
];

export const MOCK_REVENUE_DATA: RevenuePoint[] = [
  { name: "Jan", total: 1200 },
  { name: "Feb", total: 2100 },
  { name: "Mar", total: 1800 },
  { name: "Apr", total: 2400 },
  { name: "May", total: 3200 },
  { name: "Jun", total: 4500 },
  { name: "Jul", total: 4100 },
  { name: "Aug", total: 5200 },
  { name: "Sep", total: 4800 },
  { name: "Oct", total: 6100 },
  { name: "Nov", total: 5800 },
  { name: "Dec", total: 7200 },
];

export const MOCK_RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: "1",
    user: { name: "Olivia Martin", email: "olivia.martin@email.com", avatar: "https://i.pravatar.cc/150?u=1" },
    action: "New Subscription",
    amount: "+$1,999.00",
    status: "success",
    time: "2 min ago",
  },
  {
    id: "2",
    user: { name: "Jackson Lee", email: "jackson.lee@email.com", avatar: "https://i.pravatar.cc/150?u=2" },
    action: "Payment Failed",
    amount: "$39.00",
    status: "error",
    time: "15 min ago",
  },
  {
    id: "3",
    user: { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", avatar: "https://i.pravatar.cc/150?u=3" },
    action: "New Dispute",
    status: "pending",
    time: "1 hr ago",
  },
  {
    id: "4",
    user: { name: "William Kim", email: "will@email.com", avatar: "https://i.pravatar.cc/150?u=4" },
    action: "Subscription Renewed",
    amount: "+$99.00",
    status: "success",
    time: "3 hrs ago",
  },
  {
    id: "5",
    user: { name: "Sofia Davis", email: "sofia.davis@email.com", avatar: "https://i.pravatar.cc/150?u=5" },
    action: "Account Created",
    status: "success",
    time: "5 hrs ago",
  },
];

export const MOCK_PENDING_ITEMS: PendingItem[] = [
  { id: "1", type: "Verification", count: 23, status: "pending" },
  { id: "2", type: "Disputes", count: 8, status: "open" },
  { id: "3", type: "Complaints", count: 15, status: "pending" },
  { id: "4", type: "Reports", count: 4, status: "warning" },
];

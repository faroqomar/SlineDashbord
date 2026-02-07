import {
  Users,
  UserCheck,
  UserPlus,
  DollarSign,
  Scale,
  MessageSquare,
  ShieldCheck,
  Bell,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/dashboard/KPICard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { MiniChart } from "@/components/dashboard/MiniChart";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock data
const revenueData = [
  { name: "Mon", value: 4200 },
  { name: "Tue", value: 3800 },
  { name: "Wed", value: 5100 },
  { name: "Thu", value: 4600 },
  { name: "Fri", value: 5400 },
  { name: "Sat", value: 4100 },
  { name: "Sun", value: 3200 },
];

const userGrowthData = [
  { name: "Week 1", newUsers: 120, activeUsers: 890 },
  { name: "Week 2", newUsers: 145, activeUsers: 920 },
  { name: "Week 3", newUsers: 132, activeUsers: 980 },
  { name: "Week 4", newUsers: 168, activeUsers: 1050 },
];

const categoryData = [
  { name: "Design", value: 35, color: "hsl(173, 58%, 39%)" },
  { name: "Development", value: 28, color: "hsl(199, 89%, 48%)" },
  { name: "Marketing", value: 20, color: "hsl(142, 71%, 45%)" },
  { name: "Writing", value: 12, color: "hsl(38, 92%, 50%)" },
  { name: "Other", value: 5, color: "hsl(215, 16%, 47%)" },
];

const recentActivity = [
  {
    id: "1",
    type: "user" as const,
    title: "New user registered",
    description: "john.doe@example.com joined the platform",
    timestamp: "2 min ago",
    user: { name: "John Doe" },
  },
  {
    id: "2",
    type: "dispute" as const,
    title: "Dispute escalated",
    description: "Dispute #4521 requires admin review",
    timestamp: "15 min ago",
  },
  {
    id: "3",
    type: "security" as const,
    title: "Suspicious activity detected",
    description: "Multiple failed login attempts from IP 192.168.1.1",
    timestamp: "32 min ago",
  },
  {
    id: "4",
    type: "complaint" as const,
    title: "Complaint resolved",
    description: "Ticket #3892 marked as resolved by Sarah",
    timestamp: "1 hour ago",
    user: { name: "Sarah Chen" },
  },
  {
    id: "5",
    type: "notification" as const,
    title: "Notification sent",
    description: "Weekly newsletter sent to 12,400 users",
    timestamp: "2 hours ago",
  },
];

const pendingItems = [
  { id: "1", type: "Verification", count: 23, status: "pending" as const },
  { id: "2", type: "Disputes", count: 8, status: "open" as const },
  { id: "3", type: "Complaints", count: 15, status: "pending" as const },
  { id: "4", type: "Reports", count: 4, status: "warning" as const },
];

const sparklineData = [
  { value: 30 }, { value: 45 }, { value: 32 }, { value: 58 }, { value: 42 }, { value: 65 }, { value: 52 },
];

export default function DashboardOverview() {
  return (
    <div className="p-6 lg:p-8 space-y-8 stagger-children">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            View Live Site
          </Button>
          <Button size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Send Notification
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Users"
          value="12,428"
          change={12.5}
          icon={<Users className="w-5 h-5" />}
        />
        <KPICard
          title="Active Users"
          value="8,294"
          change={8.2}
          icon={<UserCheck className="w-5 h-5" />}
        />
        <KPICard
          title="New Signups"
          value="342"
          change={-3.1}
          changeLabel="this week"
          icon={<UserPlus className="w-5 h-5" />}
        />
        <KPICard
          title="Revenue"
          value="$48,294"
          change={15.3}
          changeLabel="this month"
          icon={<DollarSign className="w-5 h-5" />}
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Open Disputes"
          value="8"
          change={-25}
          icon={<Scale className="w-5 h-5" />}
        />
        <KPICard
          title="Open Complaints"
          value="23"
          change={5}
          icon={<MessageSquare className="w-5 h-5" />}
        />
        <KPICard
          title="Pending Verifications"
          value="15"
          icon={<ShieldCheck className="w-5 h-5" />}
        />
        <div className="kpi-card p-6">
          <div className="flex items-start justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Weekly Trend</span>
          </div>
          <MiniChart data={sparklineData} color="primary" height={50} />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Revenue Overview</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-xs">Weekly</Button>
              <Button variant="secondary" size="sm" className="text-xs">Monthly</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(173, 58%, 39%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(173, 58%, 39%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-medium">
                            <p className="text-sm font-medium">${payload[0].value?.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">{payload[0].payload.name}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(173, 58%, 39%)"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[180px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-medium">
                            <p className="text-sm font-medium">{payload[0].payload.name}</p>
                            <p className="text-xs text-muted-foreground">{payload[0].value}%</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="text-muted-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Growth & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userGrowthData} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-medium">
                            <p className="text-xs text-muted-foreground mb-1">{payload[0].payload.name}</p>
                            {payload.map((entry, index) => (
                              <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
                                {entry.name}: {entry.value}
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="newUsers" name="New Users" fill="hsl(173, 58%, 39%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="activeUsers" name="Active Users" fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pending Items */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Requires Attention</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <StatusBadge status={item.status} size="sm" showIcon={false} />
                    <span className="text-sm font-medium">{item.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">{item.count}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
          <Button variant="ghost" size="sm" className="text-xs">
            View All Activity
          </Button>
        </CardHeader>
        <CardContent>
          <ActivityFeed items={recentActivity} />
        </CardContent>
      </Card>
    </div>
  );
}

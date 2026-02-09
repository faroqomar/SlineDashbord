import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { RevenueAreaChart } from "@/components/analytics/RevenueAreaChart";
import { UserBarChart } from "@/components/analytics/UserBarChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { RequiresAttention } from "@/components/dashboard/RequiresAttention";
import { MOCK_RECENT_ACTIVITY, MOCK_PENDING_ITEMS } from "@/data/mock/overview";
import { getOverviewStats } from "@/actions/dashboard";
import { Users, DollarSign, AlertCircle, Activity } from "lucide-react";
import { KPIStat } from "@/data/mock/overview";

export default async function DashboardPage() {
  const statsData = await getOverviewStats();

  const stats: KPIStat[] = [
    {
      title: "Total Users",
      value: statsData.activeUsers.toString(),
      change: "+12% from last month", // Placeholder for now or calculate if historical data exists
      trend: "up",
      icon: Users,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      title: "Total Revenue",
      value: `$${statsData.platformRevenue.toLocaleString()}`,
      change: "+4% from last month",
      trend: "up",
      icon: DollarSign,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100",
    },
    {
      title: "Active Disputes",
      value: statsData.openDisputes.toString(),
      change: statsData.openDisputes > 0 ? "Requires attention" : "All good",
      trend: statsData.openDisputes > 0 ? "down" : "neutral",
      icon: AlertCircle,
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
    },
    {
      title: "Active Subscriptions",
      value: "0", // Not implemented yet
      change: "+0% since last hour",
      trend: "neutral",
      icon: Activity,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      
      <StatsGrid stats={stats} />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RevenueAreaChart />
        <UserBarChart />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <ActivityFeed activity={MOCK_RECENT_ACTIVITY} />
        <RequiresAttention items={MOCK_PENDING_ITEMS} />
      </div>
    </div>
  );
}

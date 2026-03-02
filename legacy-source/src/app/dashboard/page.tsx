export const dynamic = "force-dynamic";

import dynamicImport from "next/dynamic";
import { Suspense } from "react";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { RequiresAttention } from "@/components/dashboard/RequiresAttention";
import { getDashboardOverview } from "@/features/analytics/services/analytics_actions";
import { Users, DollarSign, AlertCircle, Activity } from "lucide-react";
import { KPIStat } from "@/data/mock/overview";
import { ChartSkeleton } from "@/components/dashboard/ChartSkeleton";

// Dynamic imports for heavy chart components
const RevenueAreaChart = dynamicImport(() => import("@/components/analytics/RevenueAreaChart").then(mod => mod.RevenueAreaChart));

const UserBarChart = dynamicImport(() => import("@/components/analytics/UserBarChart").then(mod => mod.UserBarChart));

export default async function DashboardPage() {
  const result = await getDashboardOverview();
  
  if (!result.success) {
    throw new Error(result.error);
  }

  const { stats: statsData, recentActivity, pendingItems, revenueHistory, userGrowth } = result.data;
  const currentMonthRev = revenueHistory[revenueHistory.length - 1]?.revenue || 0;
  const lastMonthRev = revenueHistory[revenueHistory.length - 2]?.revenue || 0;
  const revChangePct = lastMonthRev === 0 ? 100 : Math.round(((currentMonthRev - lastMonthRev) / lastMonthRev) * 100);
  const revChangeStr = `${revChangePct >= 0 ? '+' : ''}${revChangePct}% from last month`;

  const currentMonthUsers = userGrowth[userGrowth.length - 1]?.newUsers || 0;
  const lastMonthUsers = userGrowth[userGrowth.length - 2]?.newUsers || 0;
  const userChangePct = lastMonthUsers === 0 ? 100 : Math.round(((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100);
  const userChangeStr = `${userChangePct >= 0 ? '+' : ''}${userChangePct}% from last month`;

  const stats: KPIStat[] = [
    {
      title: "Total Users",
      value: statsData.activeUsers.toString(),
      change: userChangeStr,
      trend: userChangePct >= 0 ? "up" : "down",
      icon: Users,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      title: "Total Revenue",
      value: `IQD ${statsData.platformRevenue.toLocaleString()}`,
      change: revChangeStr,
      trend: revChangePct >= 0 ? "up" : "down",
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
        <Suspense fallback={<ChartSkeleton title="Revenue Overview" description="Loading revenue trends..." colSpan={4} />}>
          <RevenueAreaChart data={revenueHistory} />
        </Suspense>
        <Suspense fallback={<ChartSkeleton title="User Growth" description="Loading user statistics..." colSpan={3} />}>
          <UserBarChart data={userGrowth} />
        </Suspense>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <ActivityFeed activity={recentActivity} />
        <RequiresAttention items={pendingItems} />
      </div>
    </div>
  );
}

"use client";

import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { MOCK_KPI_STATS, MOCK_REVENUE_DATA, MOCK_RECENT_ACTIVITY } from "@/data/mock/overview";

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      
      <StatsGrid stats={MOCK_KPI_STATS} />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RevenueChart data={MOCK_REVENUE_DATA} />
        <ActivityFeed activity={MOCK_RECENT_ACTIVITY} />
      </div>
    </div>
  );
}

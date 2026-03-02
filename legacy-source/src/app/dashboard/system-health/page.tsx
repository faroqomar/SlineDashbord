export const dynamic = "force-dynamic";


import { ServiceStatusList } from "@/components/health/ServiceStatusList";
import { IncidentFeed } from "@/components/health/IncidentFeed";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSystemHealth } from "@/features/core/services/health_actions";
import { HealthCharts } from "@/components/health/HealthCharts";

const REFRESH_INTERVAL = 30000; // 30s

export default async function SystemHealthPage() {
  const res = await getSystemHealth();
  const services = res.success ? res.data : [];
  const totalServices = services.length;
  const operationalCount = services.filter(s => s.status === 'operational').length;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Health</h1>
          <p className="text-muted-foreground">
            Monitor system performance and service status
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            Status Page
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      <Card className={cn(
        "border-l-4 shadow-sm",
        operationalCount === totalServices ? "border-l-emerald-500" : "border-l-amber-500"
      )}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                operationalCount === totalServices ? "bg-emerald-500/10" : "bg-amber-500/10"
              )}>
                  {operationalCount === totalServices ? (
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-amber-500" />
                  )}
              </div>
              
              <div>
                <p className="font-semibold text-lg">
                  {operationalCount === totalServices
                    ? "All Systems Operational"
                    : "Some Systems Degraded"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {operationalCount}/{totalServices} services operational
                </p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Last checked</p>
              <p className="font-mono text-sm">Just now</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <HealthCharts />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ServiceStatusList services={services} />
        <IncidentFeed />
      </div>
    </div>
  );
}

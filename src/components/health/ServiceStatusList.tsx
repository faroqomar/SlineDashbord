"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server } from "lucide-react";
import { cn } from "@/lib/utils";
import { ServiceStatus } from "@/features/core/services/health_actions";

interface ServiceStatusListProps {
  services: ServiceStatus[];
}

export function ServiceStatusList({ services }: ServiceStatusListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational": return "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]";
      case "degraded": return "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]";
      case "down": return "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]";
      default: return "bg-gray-500";
    }
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Server className="w-4 h-4 text-muted-foreground" />
          Services Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {services.map((service) => (
            <div
              key={service.name}
              className="flex items-center justify-between p-3 bg-muted/40 border rounded-lg hover:bg-muted/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className={cn("w-2.5 h-2.5 rounded-full", getStatusColor(service.status))} />
                <div>
                  <p className="font-medium text-sm">{service.name}</p>
                  <p className="text-[10px] text-muted-foreground">Checked: {new Date(service.lastChecked).toLocaleTimeString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={cn(
                  "text-xs font-medium font-mono",
                  service.latency > 300 && "text-amber-500",
                  service.latency > 500 && "text-red-500"
                )}>
                  {service.latency}ms
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

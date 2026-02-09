"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ServiceStatus {
  name: string;
  status: "operational" | "degraded" | "down";
  uptime: string;
  latency: number;
}

const services: ServiceStatus[] = [
  { name: "API Gateway", status: "operational", uptime: "99.99%", latency: 45 },
  { name: "Authentication", status: "operational", uptime: "99.95%", latency: 120 },
  { name: "Database Primary", status: "operational", uptime: "99.99%", latency: 12 },
  { name: "Database Replica", status: "operational", uptime: "99.97%", latency: 8 },
  { name: "File Storage", status: "operational", uptime: "99.98%", latency: 85 },
  { name: "Payment Processing", status: "degraded", uptime: "99.90%", latency: 450 },
  { name: "Email Service", status: "operational", uptime: "99.95%", latency: 200 },
  { name: "Search Engine", status: "operational", uptime: "99.92%", latency: 55 },
];

export function ServiceStatusList() {
  const getStatusColor = (status: ServiceStatus["status"]) => {
    switch (status) {
      case "operational": return "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]";
      case "degraded": return "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]";
      case "down": return "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]";
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
                  <p className="text-[10px] text-muted-foreground">{service.uptime} uptime</p>
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

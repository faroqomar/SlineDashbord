import { useState } from "react";
import {
  Activity,
  Server,
  Database,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

interface ServiceStatus {
  name: string;
  status: "operational" | "degraded" | "down";
  uptime: string;
  latency: number;
}

interface Incident {
  id: string;
  title: string;
  status: "investigating" | "identified" | "monitoring" | "resolved";
  severity: "minor" | "major" | "critical";
  timestamp: string;
  updates: {
    message: string;
    timestamp: string;
  }[];
}

interface QueueJob {
  name: string;
  pending: number;
  processing: number;
  failed: number;
  avgProcessTime: string;
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

const incidents: Incident[] = [
  {
    id: "1",
    title: "Payment processing delays",
    status: "monitoring",
    severity: "minor",
    timestamp: "Mar 10, 2024 at 2:30 PM",
    updates: [
      { message: "We're monitoring the fix deployed earlier.", timestamp: "2:30 PM" },
      { message: "Root cause identified - third party provider issue.", timestamp: "2:15 PM" },
      { message: "Investigating reports of slow payment processing.", timestamp: "2:00 PM" },
    ],
  },
];

const queueJobs: QueueJob[] = [
  { name: "Email Notifications", pending: 145, processing: 12, failed: 2, avgProcessTime: "1.2s" },
  { name: "Payment Webhooks", pending: 23, processing: 5, failed: 0, avgProcessTime: "0.8s" },
  { name: "Data Exports", pending: 8, processing: 2, failed: 1, avgProcessTime: "15.4s" },
  { name: "Image Processing", pending: 67, processing: 8, failed: 3, avgProcessTime: "3.2s" },
];

const errorRateData = [
  { time: "00:00", rate: 0.12 },
  { time: "04:00", rate: 0.08 },
  { time: "08:00", rate: 0.15 },
  { time: "12:00", rate: 0.22 },
  { time: "16:00", rate: 0.18 },
  { time: "20:00", rate: 0.14 },
  { time: "Now", rate: 0.11 },
];

const latencyData = [
  { time: "00:00", p50: 45, p95: 120, p99: 280 },
  { time: "04:00", p50: 42, p95: 110, p99: 250 },
  { time: "08:00", p50: 55, p95: 145, p99: 320 },
  { time: "12:00", p50: 68, p95: 180, p99: 420 },
  { time: "16:00", p50: 72, p95: 195, p99: 450 },
  { time: "20:00", p50: 58, p95: 155, p99: 350 },
  { time: "Now", p50: 48, p95: 125, p99: 290 },
];

export default function SystemHealthPage() {
  const getStatusColor = (status: ServiceStatus["status"]) => {
    switch (status) {
      case "operational": return "bg-success";
      case "degraded": return "bg-warning";
      case "down": return "bg-destructive";
    }
  };

  const getSeverityColor = (severity: Incident["severity"]) => {
    switch (severity) {
      case "minor": return "bg-warning/10 text-warning border-warning/20";
      case "major": return "bg-destructive/10 text-destructive border-destructive/20";
      case "critical": return "bg-destructive text-destructive-foreground";
    }
  };

  const operationalCount = services.filter((s) => s.status === "operational").length;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Health</h1>
          <p className="text-muted-foreground">
            Monitor system performance and service status
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <ExternalLink className="w-4 h-4 mr-2" />
            Status Page
          </Button>
          <Button variant="outline" size="icon">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      <Card className={cn(
        "border-l-4",
        operationalCount === services.length ? "border-l-success" : "border-l-warning"
      )}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {operationalCount === services.length ? (
                <CheckCircle className="w-6 h-6 text-success" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-warning" />
              )}
              <div>
                <p className="font-semibold">
                  {operationalCount === services.length
                    ? "All Systems Operational"
                    : "Some Systems Degraded"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {operationalCount}/{services.length} services operational
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Last checked</p>
              <p className="font-medium">Just now</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Error Rate */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Error Rate (%)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={errorRateData}>
                  <defs>
                    <linearGradient id="errorGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-medium">
                            <p className="text-sm font-medium">{payload[0].value}%</p>
                            <p className="text-xs text-muted-foreground">{payload[0].payload.time}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="rate"
                    stroke="hsl(0, 72%, 51%)"
                    strokeWidth={2}
                    fill="url(#errorGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Latency */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="w-4 h-4" />
              API Latency (ms)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={latencyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="time"
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
                            <p className="text-xs text-muted-foreground mb-1">{payload[0].payload.time}</p>
                            {payload.map((entry, i) => (
                              <p key={i} className="text-sm" style={{ color: entry.color }}>
                                {entry.name}: {entry.value}ms
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line type="monotone" dataKey="p50" name="p50" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="p95" name="p95" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="p99" name="p99" stroke="hsl(0, 72%, 51%)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-0.5 bg-success rounded" />
                <span>p50</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-0.5 bg-warning rounded" />
                <span>p95</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-0.5 bg-destructive rounded" />
                <span>p99</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Services Status */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Server className="w-4 h-4" />
              Services Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services.map((service) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className={cn("w-2.5 h-2.5 rounded-full", getStatusColor(service.status))} />
                    <div>
                      <p className="font-medium text-sm">{service.name}</p>
                      <p className="text-xs text-muted-foreground">{service.uptime} uptime</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "text-sm font-medium",
                      service.latency > 300 && "text-warning",
                      service.latency > 500 && "text-destructive"
                    )}>
                      {service.latency}ms
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Incidents */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Active Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            {incidents.length > 0 ? (
              <ScrollArea className="h-[280px]">
                <div className="space-y-4">
                  {incidents.map((incident) => (
                    <div key={incident.id} className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-sm">{incident.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getSeverityColor(incident.severity)}>
                              {incident.severity}
                            </Badge>
                            <StatusBadge
                              status={incident.status === "resolved" ? "resolved" : "pending"}
                              label={incident.status}
                              size="sm"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="pl-4 border-l-2 border-border space-y-2">
                        {incident.updates.slice(0, 2).map((update, i) => (
                          <div key={i} className="text-xs">
                            <p className="text-muted-foreground">{update.timestamp}</p>
                            <p>{update.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center h-[280px] text-center">
                <CheckCircle className="w-10 h-10 text-success mb-2" />
                <p className="font-medium">No Active Incidents</p>
                <p className="text-sm text-muted-foreground">All systems are operating normally</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Job Queues */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="w-4 h-4" />
            Job Queue Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {queueJobs.map((job) => (
              <div key={job.name} className="p-4 bg-muted/50 rounded-lg">
                <p className="font-medium text-sm mb-3">{job.name}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pending</span>
                    <span className="font-medium">{job.pending}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Processing</span>
                    <span className="font-medium text-info">{job.processing}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Failed</span>
                    <span className={cn("font-medium", job.failed > 0 && "text-destructive")}>
                      {job.failed}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Avg. time</span>
                      <span>{job.avgProcessTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

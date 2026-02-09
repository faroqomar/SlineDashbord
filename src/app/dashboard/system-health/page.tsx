"use client";

import { ServiceStatusList } from "@/components/health/ServiceStatusList";
import { IncidentFeed } from "@/components/health/IncidentFeed";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, RefreshCw, AlertTriangle, Zap, CheckCircle, Database } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

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

const queueJobs = [
  { name: "Email Notifications", pending: 145, processing: 12, failed: 2, avgProcessTime: "1.2s" },
  { name: "Payment Webhooks", pending: 23, processing: 5, failed: 0, avgProcessTime: "0.8s" },
  { name: "Data Exports", pending: 8, processing: 2, failed: 1, avgProcessTime: "15.4s" },
  { name: "Image Processing", pending: 67, processing: 8, failed: 3, avgProcessTime: "3.2s" },
];

export default function SystemHealthPage() {
  const operationalCount: number = 7; // Mock count
  const totalServices: number = 8; // Mock count

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Error Rate */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-muted-foreground" />
              Error Rate (%)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={errorRateData}>
                  <defs>
                    <linearGradient id="errorGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))", borderRadius: "var(--radius)" }}
                    itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                    formatter={(value: any) => [`${value}%`, "Error Rate"]}
                    labelStyle={{ color: "hsl(var(--muted-foreground))", marginBottom: "0.25rem" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="rate"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fill="url(#errorGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Latency */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="w-4 h-4 text-muted-foreground" />
              API Latency (ms)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={latencyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))", borderRadius: "var(--radius)" }}
                    labelStyle={{ color: "hsl(var(--muted-foreground))", marginBottom: "0.25rem" }}
                  />
                  <Line type="monotone" dataKey="p50" name="p50" stroke="#10b981" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="p95" name="p95" stroke="#f59e0b" strokeWidth={2} dot={false} strokeDasharray="4 4" />
                  <Line type="monotone" dataKey="p99" name="p99" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="2 2" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                <span>p50</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                <span>p95</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
                <span>p99</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ServiceStatusList />
        <IncidentFeed />
      </div>

      {/* Job Queues */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="w-4 h-4 text-muted-foreground" />
            Job Queue Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {queueJobs.map((job) => (
              <div key={job.name} className="p-4 bg-muted/30 border rounded-lg hover:bg-muted/50 transition-colors">
                <p className="font-medium text-sm mb-3 truncate">{job.name}</p>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Pending</span>
                    <span className="font-mono">{job.pending}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Processing</span>
                    <span className="font-mono text-blue-500">{job.processing}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Failed</span>
                    <span className={cn("font-mono", job.failed > 0 && "text-red-500")}>
                      {job.failed}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-dashed">
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>Avg. time</span>
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

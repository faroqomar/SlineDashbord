"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { AlertTriangle, CheckCircle } from "lucide-react";

export interface Incident {
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

export function IncidentFeed() {
  const getSeverityColor = (severity: Incident["severity"]) => {
    switch (severity) {
      case "minor": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "major": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "critical": return "bg-red-500/10 text-red-500 border-red-500/20";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-muted-foreground" />
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
                        <Badge variant="outline" className={getSeverityColor(incident.severity)}>
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
                  <div className="pl-4 border-l-2 border-border space-y-3 relative">
                    {incident.updates.slice(0, 3).map((update, i) => (
                      <div key={i} className="text-xs relative">
                        <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-border" />
                        <p className="text-muted-foreground font-mono">{update.timestamp}</p>
                        <p className="mt-0.5">{update.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center h-[280px] text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
               <CheckCircle className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="font-medium">No Active Incidents</p>
            <p className="text-sm text-muted-foreground mt-1">All systems are operating normally</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

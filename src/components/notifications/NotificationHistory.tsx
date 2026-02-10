"use client";

import { Notification } from "@/data/mock/notifications";
import { DataTable, Column } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";

interface NotificationHistoryProps {
  notifications: Notification[];
}

export function NotificationHistory({ notifications }: NotificationHistoryProps) {
  const getStatusType = (status: Notification["status"]) => {
    switch (status) {
      case "sent": return "resolved";
      case "scheduled": return "pending";
      case "draft": return "info";
      case "failed": return "error";
      default: return "info";
    }
  };

  const columns: Column<Notification>[] = [
    {
      key: "title",
      header: "Notification",
      render: (item) => (
        <div>
          <div className="font-medium text-sm">{item.title}</div>
          <div className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{item.body}</div>
        </div>
      ),
    },
    {
      key: "segment",
      header: "Segment",
      render: (item) => (
        <Badge variant="secondary" className="font-normal text-xs">{item.segment}</Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <StatusBadge
          status={getStatusType(item.status)}
          label={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          size="sm"
        />
      ),
    },
    {
      key: "recipients",
      header: "Recipients",
      render: (item) => (
        <span className="font-mono text-xs">{item.recipients.toLocaleString()}</span>
      ),
    },
    {
      key: "stats" as keyof Notification,
      header: "Performance",
      render: (item) => {
        if (item.status !== "sent") return <span className="text-muted-foreground text-xs">—</span>;
        const openRate = ((item.opened || 0) / (item.delivered || 1) * 100).toFixed(1);
        return (
          <div className="text-xs">
            <span className="text-emerald-600 font-medium">{openRate}% opened</span>
          </div>
        );
      },
    },
    {
      key: "date" as keyof Notification,
      header: "Date",
      render: (item) => (
        <span className="text-muted-foreground text-xs">
          {item.sentAt || item.scheduledFor || "Draft"}
        </span>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
            <History className="w-4 h-4 text-muted-foreground" />
            Notification History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={notifications}
          actions={(item) => [
            { label: "View Details", onClick: () => console.log("View", item.id) },
            { label: "Duplicate", onClick: () => console.log("Duplicate", item.id) },
            { label: "Delete", onClick: () => console.log("Delete", item.id), destructive: true },
          ]}
        />
      </CardContent>
    </Card>
  );
}

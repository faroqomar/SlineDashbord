"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { PendingItem } from "@/data/mock/overview";
import { ArrowRight } from "lucide-react";

interface RequiresAttentionProps {
  items: PendingItem[];
}

export function RequiresAttention({ items }: RequiresAttentionProps) {
  return (
    <Card className="col-span-3 lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Requires Attention</CardTitle>
        <Button variant="ghost" size="sm" className="text-xs">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <StatusBadge 
                    status={item.status === 'open' ? 'info' : item.status === 'warning' ? 'warning' : 'pending'} 
                    size="sm" 
                    showIcon={false} 
                    label="•"
                    className="w-2 h-2 p-0 flex items-center justify-center rounded-full"
                />
                <span className="text-sm font-medium">{item.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">{item.count}</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

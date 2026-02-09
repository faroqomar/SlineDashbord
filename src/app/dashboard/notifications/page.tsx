"use client";

import { NotificationComposer } from "@/components/notifications/NotificationComposer";
import { NotificationHistory } from "@/components/notifications/NotificationHistory";
import { NotificationTemplates } from "@/components/notifications/NotificationTemplates";
import { mockNotifications, mockTemplates, segments } from "@/data/mock/notifications";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NotificationsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Send and manage push notifications to users
          </p>
        </div>
      </div>

      <Tabs defaultValue="compose" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="compose" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Compose</TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">History</TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="mt-0 focus-visible:outline-none">
          <NotificationComposer segments={segments} />
        </TabsContent>

        <TabsContent value="history" className="mt-0 focus-visible:outline-none">
          <NotificationHistory notifications={mockNotifications} />
        </TabsContent>

        <TabsContent value="templates" className="mt-0 focus-visible:outline-none">
          <NotificationTemplates templates={mockTemplates} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

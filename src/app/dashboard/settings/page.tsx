"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Shield, Link2 } from "lucide-react";
import { GeneralTab } from "@/components/settings/GeneralTab";
import { SecurityTab } from "@/components/settings/SecurityTab";
import { IntegrationsTab } from "@/components/settings/IntegrationsTab";

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-10rem)]">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage system-wide configurations and access controls.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
            <TabsTrigger value="general" className="flex items-center gap-2">
                <Settings className="h-4 w-4" /> General
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" /> Security
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
                <Link2 className="h-4 w-4" /> Integrations
            </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-0">
             <GeneralTab />
        </TabsContent>
        
        <TabsContent value="security" className="mt-0">
             <SecurityTab />
        </TabsContent>
        
        <TabsContent value="integrations" className="mt-0">
             <IntegrationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Globe, ShieldAlert, Lock, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner"; // Assuming sonner or similar toast is available, or we'll just mock it.
// Note: If sonner isn't installed, we can just console.log for now or use alerts. 
// For this MVP, we'll assume basic interaction.

export default function SettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [disableSignups, setDisableSignups] = useState(false);

  const handleSave = () => {
    // In a real app, this would make an API call
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Global Settings</h2>
        <p className="text-muted-foreground">Manage system-wide configurations and access controls.</p>
      </div>

      <div className="grid gap-6">
        <Card className={maintenanceMode ? "border-destructive/50 bg-destructive/5" : ""}>
          <CardHeader>
            <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5" />
                <CardTitle>System Status</CardTitle>
            </div>
            <CardDescription>Control the availability of the platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex flex-col space-y-1">
                <Label htmlFor="maintenance-mode" className="font-medium">Maintenance Mode</Label>
                <span className="text-sm text-muted-foreground">
                    When active, only admins can access the platform. Users will see a maintenance page.
                </span>
              </div>
              <Switch 
                id="maintenance-mode" 
                checked={maintenanceMode}
                onCheckedChange={setMaintenanceMode}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <div className="flex flex-col space-y-1">
                <Label htmlFor="disable-signups" className="font-medium">Disable New Signups</Label>
                <span className="text-sm text-muted-foreground">
                    Prevent new users from registering. Existing users can still log in.
                </span>
              </div>
              <Switch 
                id="disable-signups" 
                checked={disableSignups}
                onCheckedChange={setDisableSignups}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    <CardTitle>App Configuration</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex items-center justify-between space-x-2">
                    <div className="flex flex-col space-y-1">
                        <Label className="font-medium">Min Client Version</Label>
                        <span className="text-sm text-muted-foreground">Force users to update their app.</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-mono border rounded px-2 py-1">v1.2.4</span>
                        <Button variant="outline" size="sm">Edit</Button>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                 <div className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5" />
                    <CardTitle>System Actions</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="flex gap-4">
                <Button variant="outline" className="gap-2">
                    Clear Cache
                </Button>
                <Button variant="outline" className="gap-2">
                    Restart Services
                </Button>
            </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2">
            Save Changes
        </Button>
      </div>
    </div>
  );
}

"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Shield, Key, Smartphone, Globe } from "lucide-react";

export function SecurityTab() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            <CardTitle>Authentication</CardTitle>
          </div>
          <CardDescription>
            Manage how users and admins access the platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Two-Factor Authentication (2FA)</Label>
              <p className="text-sm text-muted-foreground">
                Enforce 2FA for all admin accounts.
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Password Expiry</Label>
              <p className="text-sm text-muted-foreground">
                Require users to change passwords every 90 days.
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <CardTitle>Session Management</CardTitle>
          </div>
          <CardDescription>
            Control active sessions and timeout policies.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Session Timeout</Label>
              <p className="text-sm text-muted-foreground">
                Automatically log out inactive users after 30 minutes.
              </p>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm font-mono border rounded px-2 py-1">30m</span>
                <Button variant="outline" size="sm">Edit</Button>
            </div>
          </div>
          <Button variant="destructive" className="w-full sm:w-auto">
             Revoke All Active Sessions
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

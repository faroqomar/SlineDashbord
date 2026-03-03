'use client';

import { Settings, ShieldAlert, Megaphone, Save, Info, AlertTriangle, CheckCircle, XCircle, UserMinus, HardDrive, Smartphone, Tablet } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettingsViewModel } from "../viewmodels/use_settings_viewmodel";
import type { SystemConfig, AppBanner } from "../models/settings.schema";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

interface SettingsScreenProps {
  initialConfigs: SystemConfig[];
  canManage: boolean;
}

export function SettingsScreen({ initialConfigs, canManage }: SettingsScreenProps) {
  const vm = useSettingsViewModel(initialConfigs);
  const [mntMsg, setMntMsg] = useState(vm.maintenance.message);
  const [bnrText, setBnrText] = useState(vm.banner.text);
  const [iosVer, setIosVer] = useState(vm.appVersion.ios);
  const [andVer, setAndVer] = useState(vm.appVersion.android);

  if (!canManage) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center p-6">
        <ShieldAlert className="w-12 h-12 text-red-500 mb-4 opacity-50" />
        <h2 className="text-xl font-bold">Access Restricted</h2>
        <p className="text-muted-foreground mt-2">Only Super Admins can manage global system configurations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="w-8 h-8 text-primary" />
            System Configuration
          </h1>
          <p className="text-muted-foreground mt-1">Manage global platform status, accessibility, and updates.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Column: Access Control & Status */}
        <div className="space-y-6">
            {/* Maintenance Mode */}
            <Card className="border-red-500/10 shadow-sm overflow-hidden">
            <CardHeader className="bg-red-500/5 pb-4 border-b">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                    <CardTitle>Maintenance Mode</CardTitle>
                </div>
                <Switch 
                    checked={vm.maintenance.enabled} 
                    onCheckedChange={vm.toggleMaintenance}
                    disabled={vm.isUpdating}
                />
                </div>
                <CardDescription>
                Disable platform access for regular users during updates.
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4 text-sm">
                <div className="space-y-2">
                <Label>Maintenance Message</Label>
                <div className="flex gap-2">
                    <Input 
                    value={mntMsg} 
                    onChange={(e) => setMntMsg(e.target.value)}
                    placeholder="System under maintenance..."
                    disabled={vm.isUpdating || !vm.maintenance.enabled}
                    />
                    <Button 
                    size="sm" 
                    onClick={() => vm.updateMaintenanceMessage(mntMsg)}
                    disabled={vm.isUpdating || !vm.maintenance.enabled || mntMsg === vm.maintenance.message}
                    >
                    <Save className="w-4 h-4 mr-1" /> Save
                    </Button>
                </div>
                </div>
            </CardContent>
            </Card>

            {/* Registration Controls */}
            <Card className="shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4 border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <UserMinus className="w-5 h-5 text-orange-500" />
                            <CardTitle>Access & Controls</CardTitle>
                        </div>
                        <Switch 
                            checked={vm.disableSignups.enabled} 
                            onCheckedChange={vm.toggleSignups}
                            disabled={vm.isUpdating}
                        />
                    </div>
                    <CardDescription>
                        Disable new user registrations globally.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Info className="w-4 h-4 text-primary shrink-0" />
                        <p>When disabled, the registration API will reject new profile creations.</p>
                    </div>
                </CardContent>
            </Card>

             {/* App Versioning */}
             <Card className="shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4 border-b">
                    <div className="flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-blue-500" />
                        <CardTitle>Platform Versioning</CardTitle>
                    </div>
                    <CardDescription>
                        Force minimum app versions across mobile platforms.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-1.5 opacity-70">
                                <Smartphone className="w-3.5 h-3.5" /> iOS Version
                            </Label>
                            <div className="flex gap-2">
                                <Input 
                                    value={iosVer} 
                                    onChange={(e) => setIosVer(e.target.value)}
                                    className="font-mono text-xs"
                                />
                                <Button size="sm" variant="ghost" onClick={() => vm.updateAppVersion('ios', iosVer)}>
                                    <Save className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-1.5 opacity-70">
                                <Tablet className="w-3.5 h-3.5" /> Android Version
                            </Label>
                            <div className="flex gap-2">
                                <Input 
                                    value={andVer} 
                                    onChange={(e) => setAndVer(e.target.value)}
                                    className="font-mono text-xs"
                                />
                                <Button size="sm" variant="ghost" onClick={() => vm.updateAppVersion('android', andVer)}>
                                    <Save className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Right Column: Communication & Logs */}
        <div className="space-y-6">
            {/* Global Banner */}
            <Card className="border-primary/10 shadow-sm overflow-hidden h-fit">
            <CardHeader className="bg-primary/5 pb-4 border-b">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-primary" />
                    <CardTitle>Public Announcement Banner</CardTitle>
                </div>
                <Switch 
                    checked={vm.banner.enabled} 
                    onCheckedChange={vm.toggleBanner}
                    disabled={vm.isUpdating}
                />
                </div>
                <CardDescription>
                Show a global banner at the top of client apps.
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                <Label>Type & Styling</Label>
                <Select 
                    value={vm.banner.type} 
                    onValueChange={(val: AppBanner['type']) => vm.updateBannerType(val)}
                    disabled={vm.isUpdating || !vm.banner.enabled}
                >
                    <SelectTrigger>
                    <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="info">Information (Blue)</SelectItem>
                    <SelectItem value="warning">Warning (Orange)</SelectItem>
                    <SelectItem value="error">Critical (Red)</SelectItem>
                    <SelectItem value="success">Success (Green)</SelectItem>
                    </SelectContent>
                </Select>
                </div>

                <div className="space-y-2">
                <Label>Announcement Content</Label>
                <div className="flex gap-2">
                    <Input 
                    value={bnrText} 
                    onChange={(e) => setBnrText(e.target.value)}
                    placeholder="Maintenance scheduled for tonight..."
                    disabled={vm.isUpdating || !vm.banner.enabled}
                    />
                    <Button 
                    size="sm" 
                    onClick={() => vm.updateBannerText(bnrText)}
                    disabled={vm.isUpdating || !vm.banner.enabled || bnrText === vm.banner.text}
                    >
                    <Save className="w-4 h-4 mr-1" /> Save
                    </Button>
                </div>
                </div>
            </CardContent>
            </Card>

            <Card className="bg-muted/20 border-dashed">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <HardDrive className="w-5 h-5 text-muted-foreground" />
                        <CardTitle className="text-sm">Audit Persistence</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground space-y-2">
                    <p>
                        All configuration changes are cryptographically logged in the <strong>audit_logs</strong>.
                    </p>
                    <p>
                        Current IP: <span className="text-foreground font-mono">AUTHORIZED_ADMIN_SESSION</span>
                    </p>
                    <Separator />
                    <p className="italic">
                        Ensure you have technical clearance before toggling Maintenance Mode.
                    </p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

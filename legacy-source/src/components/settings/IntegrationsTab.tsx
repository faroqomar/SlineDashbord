"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Cloud, CreditCard, Mail } from "lucide-react";

export function IntegrationsTab() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <CardTitle>Payment Gateways</CardTitle>
          </div>
          <CardDescription>
            Connect and configure payment providers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between border p-4 rounded-lg">
            <div className="flex items-center gap-4">
                <div className="bg-blue-500/10 p-2 rounded">
                    <Cloud className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                    <h4 className="font-semibold">Stripe</h4>
                    <p className="text-sm text-muted-foreground">Credit card processing</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Connected</Badge>
                <Button variant="ghost" size="sm">Configure</Button>
            </div>
          </div>

          <div className="flex items-center justify-between border p-4 rounded-lg">
            <div className="flex items-center gap-4">
                <div className="bg-yellow-500/10 p-2 rounded">
                    <CreditCard className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                    <h4 className="font-semibold">QiCard</h4>
                    <p className="text-sm text-muted-foreground">Local payment gateway</p>
                </div>
            </div>
             <div className="flex items-center gap-2">
                <Badge variant="outline">Disconnected</Badge>
                <Button variant="outline" size="sm">Connect</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
             <Mail className="h-5 w-5" />
            <CardTitle>Email Service</CardTitle>
          </div>
          <CardDescription>
            Configure transactional email provider.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex items-center justify-between border p-4 rounded-lg">
            <div className="flex items-center gap-4">
                <div className="bg-orange-500/10 p-2 rounded">
                    <Mail className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                    <h4 className="font-semibold">Resend</h4>
                    <p className="text-sm text-muted-foreground">Transactional emails</p>
                </div>
            </div>
             <div className="flex items-center gap-2">
                <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Connected</Badge>
                <Button variant="ghost" size="sm">Configure</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

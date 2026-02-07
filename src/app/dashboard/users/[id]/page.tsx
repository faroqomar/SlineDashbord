"use client";

import { use, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MOCK_USERS, User } from "@/data/mock/users";
import { ArrowLeft, Flag, Ban, KeyRound, Mail, Calendar, DollarSign, Star } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { MOCK_RECENT_ACTIVITY } from "@/data/mock/overview";

export default function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  // In a real app, this would be a fetch call.
  // We'll mock finding the user, and if not found (e.g. invalid ID), we could show 404.
  // For demo purposes, we'll just pick the first user if ID doesn't match to avoid errors,
  // or actually try to find it.
  const user = MOCK_USERS.find(u => u.id === id) || MOCK_USERS[0];

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">User Profile</h2>
      </div>

      {/* Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left space-y-1">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <h3 className="text-2xl font-bold">{user.name}</h3>
                  <Badge variant="outline">{user.role}</Badge>
                   <Badge 
                      variant={user.status === 'Active' ? 'default' : user.status === 'Suspended' ? 'destructive' : 'secondary'}
                      className={user.status === 'Active' ? 'bg-success hover:bg-success/80' : ''}
                    >
                      {user.status}
                    </Badge>
                </div>
                <div className="flex flex-col md:flex-row gap-2 md:gap-4 text-muted-foreground text-sm">
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {user.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Joined {user.joinDate}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
               <Button variant="outline" className="flex-1 md:flex-none gap-2">
                <KeyRound className="h-4 w-4" /> Reset Password
               </Button>
               <Button variant="destructive" className="flex-1 md:flex-none gap-2">
                <Ban className="h-4 w-4" /> Ban User
               </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="logs">Security Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.spent}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.rating}</div>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Disputes</CardTitle>
                <Flag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Recent transactions and job activity.</CardDescription>
            </CardHeader>
            <CardContent>
                 {/* Reusing ActivityFeed logic but simplifying for demo */}
                 <ActivityFeed activity={MOCK_RECENT_ACTIVITY} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
           <Card>
            <CardHeader>
              <CardTitle>Security Logs</CardTitle>
              <CardDescription>Recent login attempts and account changes.</CardDescription>
            </CardHeader>
            <CardContent>
               <ScrollArea className="h-[300px]">
                 <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex justify-between items-center border-b pb-2 last:border-0">
                            <div>
                                <p className="text-sm font-medium">Login Successful</p>
                                <p className="text-xs text-muted-foreground">IP: 192.168.1.{i} • User Agent: Chrome (Mac)</p>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {new Date(Date.now() - i * 86400000).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                 </div>
               </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

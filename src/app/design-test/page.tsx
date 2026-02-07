"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Building2, 
  TrendingUp, 
  Users, 
  CreditCard, 
  Activity, 
  ArrowUpRight,
  Bell,
  Search
} from "lucide-react";

export default function DesignSystemTest() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center gap-2 font-bold text-xl mr-8">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              S
            </div>
            Sline Admin
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#" className="text-foreground transition-colors hover:text-foreground">Dashboard</a>
            <a href="#" className="transition-colors hover:text-foreground">Analytics</a>
            <a href="#" className="transition-colors hover:text-foreground">Users</a>
            <a href="#" className="transition-colors hover:text-foreground">Settings</a>
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search..." 
                className="w-64 pl-8 rounded-full bg-secondary border-none focus-visible:ring-1" 
              />
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="container flex-1 py-8 px-4 space-y-8">
        
        {/* Colors Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="space-y-1">
              <div className="h-20 w-full rounded-lg bg-primary shadow-sm hover:scale-105 transition-transform"></div>
              <p className="text-xs font-medium text-muted-foreground text-center">Primary</p>
            </div>
            <div className="space-y-1">
              <div className="h-20 w-full rounded-lg bg-secondary shadow-sm hover:scale-105 transition-transform"></div>
              <p className="text-xs font-medium text-muted-foreground text-center">Secondary</p>
            </div>
            <div className="space-y-1">
              <div className="h-20 w-full rounded-lg bg-accent shadow-sm hover:scale-105 transition-transform"></div>
              <p className="text-xs font-medium text-muted-foreground text-center">Accent</p>
            </div>
            <div className="space-y-1">
              <div className="h-20 w-full rounded-lg bg-destructive shadow-sm hover:scale-105 transition-transform"></div>
              <p className="text-xs font-medium text-muted-foreground text-center">Destructive</p>
            </div>
            <div className="space-y-1">
              <div className="h-20 w-full rounded-lg bg-muted shadow-sm hover:scale-105 transition-transform"></div>
              <p className="text-xs font-medium text-muted-foreground text-center">Muted</p>
            </div>
            <div className="space-y-1">
              <div className="h-20 w-full rounded-lg bg-card border shadow-sm hover:scale-105 transition-transform"></div>
              <p className="text-xs font-medium text-muted-foreground text-center">Card</p>
            </div>
          </div>
        </section>

        <Separator />

        {/* Dashboard Grid Preview */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight animate-in">Dashboard Preview</h2>
          
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4 animate-in">
              {/* KPI Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 stagger-children">
                <Card className="kpi-card relative overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <div className="p-2 bg-primary/10 rounded-full">
                      <CreditCard className="h-4 w-4 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$45,231.89</div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <span className="text-success flex items-center">
                        <ArrowUpRight className="h-3 w-3" /> +20.1%
                      </span>
                      from last month
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="kpi-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
                    <div className="p-2 bg-info/10 rounded-full">
                      <Users className="h-4 w-4 text-info" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+2350</div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <span className="text-success flex items-center">
                        <ArrowUpRight className="h-3 w-3" /> +180.1%
                      </span>
                      from last month
                    </p>
                  </CardContent>
                </Card>

                <Card className="kpi-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sales</CardTitle>
                    <div className="p-2 bg-warning/10 rounded-full">
                      <Activity className="h-4 w-4 text-warning" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+12,234</div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <span className="text-success flex items-center">
                        <ArrowUpRight className="h-3 w-3" /> +19%
                      </span>
                      from last month
                    </p>
                  </CardContent>
                </Card>

                <Card className="kpi-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                    <div className="p-2 bg-destructive/10 rounded-full">
                      <Activity className="h-4 w-4 text-destructive" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+573</div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <span className="text-success flex items-center">
                        <ArrowUpRight className="h-3 w-3" /> +201
                      </span>
                      since last hour
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Area */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 border-none shadow-medium">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <div className="flex h-[350px] items-center justify-center rounded-lg border border-dashed bg-muted/40">
                      <div className="text-center space-y-2">
                        <Activity className="h-8 w-8 text-muted-foreground mx-auto animate-pulse" />
                        <p className="text-sm text-muted-foreground">Chart Area Placeholder</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="col-span-3 border-none shadow-medium">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      You made 265 sales this month.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[350px] pr-4">
                      <div className="space-y-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <div key={i} className="flex items-center animate-slide-in-right" style={{ animationDelay: `${i * 100}ms` }}>
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={`https://i.pravatar.cc/150?u=${i}`} alt="Avatar" />
                              <AvatarFallback>OM</AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                              <p className="text-sm font-medium leading-none">Olivia Martin</p>
                              <p className="text-xs text-muted-foreground">
                                olivia.martin@email.com
                              </p>
                            </div>
                            <div className="ml-auto font-medium">+$1,999.00</div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Table Section */}
              <Card className="col-span-4 border-none shadow-medium w-full">
                <CardHeader>
                  <CardTitle>Transactions</CardTitle>
                  <CardDescription>
                    Recent transactions from your store.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                   <Table>
                    <TableHeader className="data-table-header">
                      <TableRow>
                        <TableHead className="w-[100px]">Invoice</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="data-table-row">
                        <TableCell className="font-medium">INV001</TableCell>
                        <TableCell><Badge variant="outline" className="status-badge status-resolved">Paid</Badge></TableCell>
                        <TableCell>Credit Card</TableCell>
                        <TableCell className="text-right">$250.00</TableCell>
                      </TableRow>
                      <TableRow className="data-table-row">
                        <TableCell className="font-medium">INV002</TableCell>
                        <TableCell><Badge variant="outline" className="status-badge status-pending">Pending</Badge></TableCell>
                        <TableCell>PayPal</TableCell>
                        <TableCell className="text-right">$150.00</TableCell>
                      </TableRow>
                      <TableRow className="data-table-row">
                        <TableCell className="font-medium">INV003</TableCell>
                        <TableCell><Badge variant="outline" className="status-badge status-error">Unpaid</Badge></TableCell>
                        <TableCell>Bank Transfer</TableCell>
                        <TableCell className="text-right">$350.00</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
}

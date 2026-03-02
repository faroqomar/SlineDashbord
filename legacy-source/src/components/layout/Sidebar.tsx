"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Users,
  Scale,
  Banknote,
  FileText,
  Settings,
  Menu,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Disputes",
    href: "/dashboard/disputes",
    icon: Scale,
  },
  {
    title: "Finance",
    href: "/dashboard/finance",
    icon: Banknote,
  },
  {
    title: "System Logs",
    href: "/dashboard/logs",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();

  const NavContent = () => (
    <div className="flex flex-col h-full py-4">
      <div className={cn("flex items-center px-4 mb-8", isCollapsed ? "justify-center" : "justify-between")}>
         {!isCollapsed && (
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              S
            </div>
            <span>Sline Admin</span>
          </div>
        )}
        {isCollapsed && (
           <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
              S
            </div>
        )}
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  isCollapsed && "justify-center px-2"
                )}
                title={isCollapsed ? item.title : undefined}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </div>
      </ScrollArea>

      <div className="mt-auto px-3 pt-4 border-t">
         {!isCollapsed ? (
             <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-secondary/50">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                    AD
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium truncate">Admin User</p>
                    <p className="text-xs text-muted-foreground truncate">admin@sline.io</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                    <LogOut className="h-4 w-4" />
                </Button>
             </div>
         ) : (
            <div className="flex justify-center">
                 <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" title="Logout">
                    <LogOut className="h-4 w-4" />
                </Button>
            </div>
         )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r bg-card transition-all duration-300 h-screen sticky top-0 bg-sidebar",
          isCollapsed ? "w-[70px]" : "w-[240px]"
        )}
      >
        <NavContent />
        <div className="absolute -right-3 top-6">
            <Button
                variant="outline"
                size="icon"
                className="h-6 w-6 rounded-full shadow-md bg-background border border-border"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
            </Button>
        </div>
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-3 left-3 z-50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[240px] bg-sidebar border-r">
             {/* Force expanded state for mobile */}
            <div className="flex flex-col h-full py-4">
                 <div className="flex items-center px-4 mb-8">
                    <div className="flex items-center gap-2 font-bold text-xl text-primary">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                        S
                        </div>
                        <span>Sline Admin</span>
                    </div>
                 </div>
                 <ScrollArea className="flex-1 px-3">
                    <div className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                            isActive 
                                ? "bg-primary/10 text-primary font-medium" 
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                            <span>{item.title}</span>
                        </Link>
                        );
                    })}
                    </div>
                </ScrollArea>
                <div className="mt-auto px-3 pt-4 border-t">
                     <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-secondary/50">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                            AD
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate">Admin User</p>
                            <p className="text-xs text-muted-foreground truncate">admin@sline.io</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                            <LogOut className="h-4 w-4" />
                        </Button>
                     </div>
                </div>
            </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

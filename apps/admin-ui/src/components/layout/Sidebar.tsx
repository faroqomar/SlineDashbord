import * as React from "react";
import { Link, useLocation } from "@tanstack/react-router";
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
  LogOut,
  CalendarCheck,
  Flag,
  FolderOpen,
  Activity,
  Search,
  ListTodo,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onLogout?: () => void;
  userEmail?: string;
}

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Search",
    href: "/search",
    icon: Search,
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
  },
  {
    title: "Disputes",
    href: "/disputes",
    icon: Scale,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: Flag,
  },
  {
    title: "Cases",
    href: "/cases",
    icon: FolderOpen,
  },
  {
    title: "Tasks Queue",
    href: "/tasks",
    icon: ListTodo,
  },
  {
    title: "Finance",
    href: "/finance",
    icon: Banknote,
  },
  {
    title: "Bookings",
    href: "/bookings",
    icon: CalendarCheck,
  },
  {
    title: "System Logs",
    href: "/logs",
    icon: FileText,
  },
  {
    title: "System Health",
    href: "/system-health",
    icon: Activity,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar({ isCollapsed, setIsCollapsed, onLogout, userEmail }: SidebarProps) {
  const location = useLocation();
  const pathname = location.pathname;

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
                to={item.href as any}
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
                    {userEmail?.substring(0, 2).toUpperCase() || 'AD'}
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium truncate">Admin User</p>
                    <p className="text-xs text-muted-foreground truncate">{userEmail || 'admin@sline.io'}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={onLogout}>
                    <LogOut className="h-4 w-4" />
                </Button>
             </div>
         ) : (
            <div className="flex justify-center">
                 <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" title="Logout" onClick={onLogout}>
                    <LogOut className="h-4 w-4" />
                </Button>
            </div>
         )}
      </div>
    </div>
  );

  return (
    <>
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

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-3 left-3 z-50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[240px] bg-sidebar border-r">
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
                            to={item.href as any}
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
                            {userEmail?.substring(0, 2).toUpperCase() || 'AD'}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate">Admin User</p>
                            <p className="text-xs text-muted-foreground truncate">{userEmail || 'admin@sline.io'}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={onLogout}>
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

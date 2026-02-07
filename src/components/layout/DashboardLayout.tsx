"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={cn("flex-1 flex flex-col transition-all duration-300", isCollapsed ? "md:ml-0" : "md:ml-0")}>
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
            {children}
        </main>
      </div>
    </div>
  );
}

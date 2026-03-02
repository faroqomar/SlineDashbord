import * as React from "react";
import { Outlet, useNavigate, useRouteContext } from "@tanstack/react-router";
import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { request } from "@/lib/api";

export function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const context = useRouteContext({ from: '__root__' });
  const user = (context as any).user;

  const handleLogout = async () => {
    try {
      await request('POST', '/auth/logout');
      navigate({ to: '/login' });
    } catch (err) {
      console.error('Logout failed', err);
      // Fallback redirect
      navigate({ to: '/login' });
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        onLogout={handleLogout}
        userEmail={user?.email}
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          userEmail={user?.email}
          onLogout={handleLogout}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
          <div className="animate-in max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

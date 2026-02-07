import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import DashboardOverview from "./pages/DashboardOverview";
import UsersPage from "./pages/UsersPage";
import ComplaintsPage from "./pages/ComplaintsPage";
import DisputesPage from "./pages/DisputesPage";
import NotificationsPage from "./pages/NotificationsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import AuditLogsPage from "./pages/AuditLogsPage";
import SettingsPage from "./pages/SettingsPage";
import SystemHealthPage from "./pages/SystemHealthPage";
import NotFound from "./pages/NotFound";
 import AdminManagementPage from "./pages/AdminManagementPage";
 import { ImpersonationProvider } from "./contexts/ImpersonationContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
       <ImpersonationProvider>
         <Toaster />
         <Sonner />
         <BrowserRouter>
           <Routes>
             <Route element={<DashboardLayout />}>
               <Route path="/" element={<DashboardOverview />} />
               <Route path="/users" element={<UsersPage />} />
               <Route path="/complaints" element={<ComplaintsPage />} />
               <Route path="/disputes" element={<DisputesPage />} />
               <Route path="/notifications" element={<NotificationsPage />} />
               <Route path="/analytics" element={<AnalyticsPage />} />
               <Route path="/audit-logs" element={<AuditLogsPage />} />
               <Route path="/settings" element={<SettingsPage />} />
               <Route path="/system-health" element={<SystemHealthPage />} />
               <Route path="/admin-management" element={<AdminManagementPage />} />
             </Route>
             <Route path="*" element={<NotFound />} />
           </Routes>
         </BrowserRouter>
       </ImpersonationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

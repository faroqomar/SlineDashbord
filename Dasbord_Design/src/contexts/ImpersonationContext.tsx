 import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
 
 export interface ImpersonatedUser {
   id: string;
   name: string;
   email: string;
   avatar?: string;
 }
 
 interface ImpersonationState {
   isImpersonating: boolean;
   impersonatedUser: ImpersonatedUser | null;
   startTime: Date | null;
   expiresAt: Date | null;
   timeoutMinutes: number;
 }
 
 interface ImpersonationContextType extends ImpersonationState {
   startImpersonation: (user: ImpersonatedUser, timeoutMinutes: number) => void;
   stopImpersonation: () => void;
   remainingTime: number; // in seconds
   canPerformFinancialActions: boolean;
 }
 
 const ImpersonationContext = createContext<ImpersonationContextType | undefined>(undefined);
 
 export function ImpersonationProvider({ children }: { children: React.ReactNode }) {
   const [state, setState] = useState<ImpersonationState>({
     isImpersonating: false,
     impersonatedUser: null,
     startTime: null,
     expiresAt: null,
     timeoutMinutes: 30,
   });
   const [remainingTime, setRemainingTime] = useState(0);
 
   const startImpersonation = useCallback((user: ImpersonatedUser, timeoutMinutes: number) => {
     const now = new Date();
     const expiresAt = new Date(now.getTime() + timeoutMinutes * 60 * 1000);
     
     setState({
       isImpersonating: true,
       impersonatedUser: user,
       startTime: now,
       expiresAt,
       timeoutMinutes,
     });
     setRemainingTime(timeoutMinutes * 60);
     
     // Log audit event (mock)
     console.log("[AUDIT] Impersonation started:", {
       adminId: "current-admin-id",
       targetUser: user,
       startTime: now.toISOString(),
       expiresAt: expiresAt.toISOString(),
     });
   }, []);
 
   const stopImpersonation = useCallback(() => {
     if (state.impersonatedUser) {
       // Log audit event (mock)
       console.log("[AUDIT] Impersonation ended:", {
         adminId: "current-admin-id",
         targetUser: state.impersonatedUser,
         endTime: new Date().toISOString(),
         duration: state.startTime
           ? Math.floor((Date.now() - state.startTime.getTime()) / 1000)
           : 0,
       });
     }
     
     setState({
       isImpersonating: false,
       impersonatedUser: null,
       startTime: null,
       expiresAt: null,
       timeoutMinutes: 30,
     });
     setRemainingTime(0);
   }, [state.impersonatedUser, state.startTime]);
 
   // Countdown timer
   useEffect(() => {
     if (!state.isImpersonating || !state.expiresAt) return;
 
     const interval = setInterval(() => {
       const remaining = Math.max(
         0,
         Math.floor((state.expiresAt!.getTime() - Date.now()) / 1000)
       );
       setRemainingTime(remaining);
 
       if (remaining <= 0) {
         stopImpersonation();
       }
     }, 1000);
 
     return () => clearInterval(interval);
   }, [state.isImpersonating, state.expiresAt, stopImpersonation]);
 
   const value: ImpersonationContextType = {
     ...state,
     startImpersonation,
     stopImpersonation,
     remainingTime,
     canPerformFinancialActions: !state.isImpersonating, // Block financial actions during impersonation
   };
 
   return (
     <ImpersonationContext.Provider value={value}>
       {children}
     </ImpersonationContext.Provider>
   );
 }
 
 export function useImpersonation() {
   const context = useContext(ImpersonationContext);
   if (context === undefined) {
     throw new Error("useImpersonation must be used within an ImpersonationProvider");
   }
   return context;
 }
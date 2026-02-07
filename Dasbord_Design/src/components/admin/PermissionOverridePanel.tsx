 import { useState } from "react";
 import { Switch } from "@/components/ui/switch";
 import { Label } from "@/components/ui/label";
 import { Button } from "@/components/ui/button";
 import { Badge } from "@/components/ui/badge";
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
 import { Shield, Save, RotateCcw } from "lucide-react";
 import { toast } from "@/hooks/use-toast";
 
 interface Permission {
   id: string;
   label: string;
   description: string;
   category: string;
   defaultValue: boolean;
   currentValue: boolean;
   isOverridden: boolean;
 }
 
 interface PermissionOverridePanelProps {
   adminId: string;
   adminName: string;
   roleName: string;
   permissions: Permission[];
   onSave: (permissions: Record<string, boolean>) => void;
 }
 
 export function PermissionOverridePanel({
   adminId,
   adminName,
   roleName,
   permissions: initialPermissions,
   onSave,
 }: PermissionOverridePanelProps) {
   const [permissions, setPermissions] = useState(initialPermissions);
   const [hasChanges, setHasChanges] = useState(false);
 
   const handleToggle = (permissionId: string) => {
     setPermissions((prev) =>
       prev.map((p) =>
         p.id === permissionId
           ? { ...p, currentValue: !p.currentValue, isOverridden: !p.currentValue !== p.defaultValue }
           : p
       )
     );
     setHasChanges(true);
   };
 
   const handleReset = (permissionId: string) => {
     setPermissions((prev) =>
       prev.map((p) =>
         p.id === permissionId
           ? { ...p, currentValue: p.defaultValue, isOverridden: false }
           : p
       )
     );
     setHasChanges(true);
   };
 
   const handleSave = () => {
     const overrides = permissions.reduce(
       (acc, p) => ({ ...acc, [p.id]: p.currentValue }),
       {}
     );
     onSave(overrides);
     setHasChanges(false);
     toast({
       title: "Permissions Updated",
       description: `Permission overrides for ${adminName} have been saved.`,
     });
   };
 
   const handleResetAll = () => {
     setPermissions((prev) =>
       prev.map((p) => ({ ...p, currentValue: p.defaultValue, isOverridden: false }))
     );
     setHasChanges(true);
   };
 
   // Group permissions by category
   const groupedPermissions = permissions.reduce((acc, permission) => {
     if (!acc[permission.category]) {
       acc[permission.category] = [];
     }
     acc[permission.category].push(permission);
     return acc;
   }, {} as Record<string, Permission[]>);
 
   const overrideCount = permissions.filter((p) => p.isOverridden).length;
 
   return (
     <Card>
       <CardHeader>
         <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
               <Shield className="w-5 h-5 text-primary" />
             </div>
             <div>
               <CardTitle className="text-base">Permission Overrides</CardTitle>
               <CardDescription>
                 Exceptions to the <Badge variant="secondary">{roleName}</Badge> role for {adminName}
               </CardDescription>
             </div>
           </div>
           {overrideCount > 0 && (
             <Badge variant="outline" className="text-primary">
               {overrideCount} override{overrideCount !== 1 ? "s" : ""}
             </Badge>
           )}
         </div>
       </CardHeader>
       <CardContent className="space-y-6">
         {Object.entries(groupedPermissions).map(([category, perms]) => (
           <div key={category} className="space-y-3">
             <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
               {category}
             </h4>
             <div className="space-y-3">
               {perms.map((permission) => (
                 <div
                   key={permission.id}
                   className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                 >
                   <div className="flex items-center gap-3">
                     <Switch
                       id={permission.id}
                       checked={permission.currentValue}
                       onCheckedChange={() => handleToggle(permission.id)}
                     />
                     <div>
                       <Label
                         htmlFor={permission.id}
                         className="flex items-center gap-2 cursor-pointer"
                       >
                         {permission.label}
                         {permission.isOverridden && (
                           <Badge variant="outline" className="text-xs text-primary">
                             Overridden
                           </Badge>
                         )}
                       </Label>
                       <p className="text-xs text-muted-foreground">
                         {permission.description}
                       </p>
                     </div>
                   </div>
                   {permission.isOverridden && (
                     <Button
                       variant="ghost"
                       size="sm"
                       onClick={() => handleReset(permission.id)}
                       className="text-muted-foreground hover:text-foreground"
                     >
                       <RotateCcw className="w-3 h-3 mr-1" />
                       Reset
                     </Button>
                   )}
                 </div>
               ))}
             </div>
           </div>
         ))}
 
         <div className="flex items-center justify-between pt-4 border-t">
           <Button variant="outline" onClick={handleResetAll} disabled={overrideCount === 0}>
             <RotateCcw className="w-4 h-4 mr-2" />
             Reset All to Role Defaults
           </Button>
           <Button onClick={handleSave} disabled={!hasChanges}>
             <Save className="w-4 h-4 mr-2" />
             Save Overrides
           </Button>
         </div>
       </CardContent>
     </Card>
   );
 }
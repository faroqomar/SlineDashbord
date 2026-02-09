"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Info, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type DialogType = "danger" | "warning" | "info" | "success";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: DialogType;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  loading?: boolean;
}

const typeConfig: Record<DialogType, { icon: React.ElementType; iconClass: string; buttonClass: string }> = {
  danger: {
    icon: AlertTriangle,
    iconClass: "text-destructive bg-destructive/10",
    buttonClass: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-amber-500 bg-amber-500/10",
    buttonClass: "bg-amber-500 text-white hover:bg-amber-600",
  },
  info: {
    icon: Info,
    iconClass: "text-blue-500 bg-blue-500/10",
    buttonClass: "bg-blue-500 text-white hover:bg-blue-600",
  },
  success: {
    icon: CheckCircle,
    iconClass: "text-emerald-500 bg-emerald-500/10",
    buttonClass: "bg-emerald-500 text-white hover:bg-emerald-600",
  },
};

export function ConfirmDialog({
  open,
  onOpenChange,
  type = "danger",
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  loading = false,
}: ConfirmDialogProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <div className="flex items-start gap-4">
            <div className={cn("p-2 rounded-full mt-1", config.iconClass)}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <AlertDialogTitle>{title}</AlertDialogTitle>
              <AlertDialogDescription className="mt-2 text-sm">
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel disabled={loading}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault(); 
              onConfirm();
            }}
            className={cn("w-full sm:w-auto", config.buttonClass)}
            disabled={loading}
          >
            {loading ? "Processing..." : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

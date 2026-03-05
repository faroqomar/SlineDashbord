import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/lib/navigation-shim";
import {
  banUser,
  forceLogoutUser,
  suspendUser,
  unbanUser,
} from "@/features/users/services/users_api";
import {
  AlertTriangle,
  Eye,
  LogOut,
  MoreHorizontal,
  Search,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

interface UserActionsMenuProps {
  userId: string;
  userStatus?: "active" | "suspended" | "banned";
}

function askReason(label: string): string | null {
  const reason = window.prompt(`${label} reason (min 5 chars):`, "");
  if (!reason) return null;
  const trimmed = reason.trim();
  if (trimmed.length < 5) {
    toast.error("Reason must be at least 5 characters.");
    return null;
  }
  return trimmed;
}

export function UserActionsMenu({
  userId,
  userStatus = "active",
}: UserActionsMenuProps) {
  const router = useRouter();
  const [isBusy, setIsBusy] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const closeMenu = () => setIsOpen(false);

  const updateMenuPosition = () => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const menuWidth = 220;
    const viewportPadding = 8;
    const nextLeft = Math.min(
      Math.max(viewportPadding, rect.right - menuWidth),
      window.innerWidth - menuWidth - viewportPadding,
    );
    const nextTop = rect.bottom + 6;
    setMenuPosition({ top: nextTop, left: nextLeft });
  };

  useEffect(() => {
    if (!isOpen) return;
    updateMenuPosition();

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      closeMenu();
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    const onViewportChange = () => updateMenuPosition();
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    window.addEventListener("resize", onViewportChange);
    window.addEventListener("scroll", onViewportChange, true);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("scroll", onViewportChange, true);
    };
  }, [isOpen]);

  const runAsyncAction = async (
    task: () => Promise<{ success: true } | { success: false; error: string }>,
    successMessage: string,
  ) => {
    setIsBusy(true);
    const result = await task();
    setIsBusy(false);
    if (result.success) {
      toast.success(successMessage);
      router.refresh();
      return;
    }
    toast.error(result.error || "Action failed");
  };

  const onViewProfile = () => {
    closeMenu();
    router.push(`/users/${userId}`);
  };

  const onViewInvestigation = () => {
    closeMenu();
    router.push(`/users/${userId}/investigation`);
  };

  const onSuspend = async () => {
    const reason = askReason("Suspend user");
    if (!reason) return;
    await runAsyncAction(
      async () => {
        const res = await suspendUser(userId, reason, "24h");
        if (res.success) return { success: true };
        return { success: false, error: res.error };
      },
      "User suspended for 24h",
    );
  };

  const onBan = async () => {
    const reason = askReason("Ban user");
    if (!reason) return;
    await runAsyncAction(
      async () => {
        const res = await banUser(userId, reason);
        if (res.success) return { success: true };
        return { success: false, error: res.error };
      },
      "User banned",
    );
  };

  const onUnban = async () => {
    await runAsyncAction(
      async () => {
        const res = await unbanUser(userId);
        if (res.success) return { success: true };
        return { success: false, error: res.error };
      },
      "User unbanned",
    );
  };

  const onForceLogout = async () => {
    const reason = window.prompt("Force logout reason (optional):", "")?.trim();
    await runAsyncAction(
      async () => {
        const res = await forceLogoutUser(userId, reason || undefined);
        if (res.success) return { success: true };
        return { success: false, error: res.error };
      },
      "User forced to logout",
    );
  };

  return (
    <>
      <Button
        ref={triggerRef}
        variant="ghost"
        size="icon"
        aria-label="User actions"
        onClick={() => {
          if (isOpen) {
            closeMenu();
            return;
          }
          updateMenuPosition();
          setIsOpen(true);
        }}
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>

      {isOpen
        ? createPortal(
            <div
              ref={menuRef}
              className="fixed z-[2200] w-[220px] rounded-md border border-[#2a3145] bg-[#0f1320] p-1 text-[#e8e6e3] shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
              style={{ top: menuPosition.top, left: menuPosition.left }}
              role="menu"
              aria-label="User actions menu"
            >
              <div className="px-2 py-1.5 text-[11px] uppercase tracking-[0.08em] text-[#9d9588]">
                Actions
              </div>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-[#1a2032]"
                onClick={onViewProfile}
                disabled={isBusy}
              >
                <Eye className="h-4 w-4" />
                View Profile
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-[#1a2032]"
                onClick={onViewInvestigation}
                disabled={isBusy}
              >
                <Search className="h-4 w-4" />
                Investigation
              </button>
              <div className="my-1 h-px bg-[#2a3145]" />
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-[#1a2032]"
                onClick={() => {
                  closeMenu();
                  void onSuspend();
                }}
                disabled={isBusy}
              >
                <AlertTriangle className="h-4 w-4" />
                Suspend 24h
              </button>
              {userStatus === "banned" ? (
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-[#1a2032]"
                  onClick={() => {
                    closeMenu();
                    void onUnban();
                  }}
                  disabled={isBusy}
                >
                  <ShieldCheck className="h-4 w-4" />
                  Unban User
                </button>
              ) : (
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm text-[#f5a7a7] hover:bg-[#2a1a1a]"
                  onClick={() => {
                    closeMenu();
                    void onBan();
                  }}
                  disabled={isBusy}
                >
                  <ShieldAlert className="h-4 w-4" />
                  Ban User
                </button>
              )}
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-[#1a2032]"
                onClick={() => {
                  closeMenu();
                  void onForceLogout();
                }}
                disabled={isBusy}
              >
                <LogOut className="h-4 w-4" />
                Force Logout
              </button>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

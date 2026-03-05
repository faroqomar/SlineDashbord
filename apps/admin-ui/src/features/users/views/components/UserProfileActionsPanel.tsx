import type { ComponentType } from 'react';
import { AlertTriangle, LogOut, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ResolvedUserProfileAction, UserProfileActionKind } from '../user-profile.view';

interface UserProfileActionsPanelProps {
  actions: ResolvedUserProfileAction[];
  isBusy: boolean;
  pendingAction?: UserProfileActionKind;
  onSelectAction: (kind: UserProfileActionKind) => void;
}

const ACTION_ICON: Record<UserProfileActionKind, ComponentType<{ className?: string }>> = {
  suspend: AlertTriangle,
  ban: ShieldAlert,
  unban: ShieldCheck,
  forceLogout: LogOut,
};

export function UserProfileActionsPanel({
  actions,
  isBusy,
  pendingAction,
  onSelectAction,
}: UserProfileActionsPanelProps) {
  return (
    <section className="rounded-[14px] border border-[#7f7668] bg-[#0a0d12] p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-[#e8e6e3]">Administrative Actions</h3>
        <p className="text-xs text-[#9d9588]">
          Live moderation controls. Restricted actions are disabled based on account status.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = ACTION_ICON[action.kind];
          const isPendingThisAction = isBusy && pendingAction === action.kind;

          return (
            <Button
              key={action.kind}
              type="button"
              variant="ghost"
              disabled={isBusy || !action.isEnabled}
              className={`h-11 justify-start rounded-[10px] px-4 text-sm font-medium ${action.buttonClassName}`}
              onClick={() => onSelectAction(action.kind)}
              title={!action.isEnabled ? action.disabledReason : undefined}
            >
              <Icon className="mr-2 size-4" />
              {isPendingThisAction ? `${action.label}...` : action.label}
            </Button>
          );
        })}
      </div>
    </section>
  );
}

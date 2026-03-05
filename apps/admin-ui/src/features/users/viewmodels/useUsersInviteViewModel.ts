import { useEffect, useMemo, useState } from 'react';
import { request } from '@/lib/api';
import { inviteMember } from '@/features/team/services/team_api';

type InviteRole = 'support' | 'moderator' | 'admin';

const USERS_INVITE_ALLOWED_ROLE = 'super_admin';

function normalizeRole(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  return raw.toLowerCase();
}

export function useUsersInviteViewModel() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<InviteRole>('support');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentAdminRole, setCurrentAdminRole] = useState<string>('');
  const [isRoleLoading, setIsRoleLoading] = useState(true);

  useEffect(() => {
    let active = true;

    request<{ user: { role?: string } }>('GET', '/auth/me').then((res) => {
      if (!active) return;
      if (res.ok) {
        setCurrentAdminRole(normalizeRole(res.data?.user?.role));
      } else {
        setCurrentAdminRole('');
      }
      setIsRoleLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const canInvite = currentAdminRole === USERS_INVITE_ALLOWED_ROLE;
  const isFormValid = Boolean(email.trim() && fullName.trim());

  const inviteDisabledReason = useMemo(() => {
    if (isRoleLoading) return 'Checking permissions...';
    if (canInvite) return '';
    return 'Only super admins can invite users.';
  }, [canInvite, isRoleLoading]);

  const resetForm = () => {
    setEmail('');
    setFullName('');
    setRole('support');
    setSubmitError(null);
  };

  const close = () => {
    setIsOpen(false);
    setSubmitError(null);
  };

  const setOpen = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSubmitError(null);
    }
  };

  const submit = async (): Promise<{ success: boolean; error?: string }> => {
    if (!canInvite) {
      const error = 'Only super admins can invite users.';
      setSubmitError(error);
      return { success: false, error };
    }
    if (!isFormValid) {
      const error = 'Full name and email are required.';
      setSubmitError(error);
      return { success: false, error };
    }

    setIsSubmitting(true);
    setSubmitError(null);
    const result = await inviteMember(email.trim(), role, fullName.trim());
    setIsSubmitting(false);

    if (!result.success) {
      setSubmitError(result.error);
      return { success: false, error: result.error };
    }

    resetForm();
    setIsOpen(false);
    return { success: true };
  };

  return {
    isOpen,
    setOpen,
    close,
    email,
    setEmail,
    fullName,
    setFullName,
    role,
    setRole,
    canInvite,
    isRoleLoading,
    inviteDisabledReason,
    isFormValid,
    isSubmitting,
    submitError,
    submit,
  };
}

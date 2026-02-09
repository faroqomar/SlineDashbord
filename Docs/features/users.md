# User Management

## Overview

View, filter, and manage all registered users (Clients & Freelancers). Includes ability to ban/suspend users.

## Architecture

- **Components**: `UserSearch`, `DataTable` (Users), `UserActionsMenu`.
- **Actions**: `getUsers`, `banUser`, `verifyUser`.
- **Models**: `UserProfile`.

## How It Works

1.  **Listing**: Fetches `profiles` via Service Role (Bypassing RLS).
2.  **Search**: Server-side filtering by name/email.
3.  **Actions**:
    - Admin clicks "Ban".
    - Enters reason.
    - `banUser` action updates `profiles.status` to 'banned'.
    - Updates `auth.users` to revoke access.
    - Logs action to `admin_logs`.

## Future Work

- [ ] Impersonation Mode (Login as User).
- [ ] Verification Badge manual approval flow.

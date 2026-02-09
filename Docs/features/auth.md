# Admin Authentication

## Overview

Secure, isolated access control for Dashboard Admins. It ensures Admin accounts are completely separate from App Users, even if they share an email address.

## Architecture

- **Components**: `LoginForm`, `UnauthorizedPage`.
- **Actions**: `login` (Server Action).
- **Models**: `admin_users` table schema.

## How It Works

1.  **Login Flow**:
    - User enters email/password.
    - System prefixes email with `admin.` (e.g., `admin.jane@doe.com`) to check Supabase Auth.
2.  **Middleware Protection**:
    - Intercepts request.
    - Checks if user session exists.
    - Verifies user UUID exists in `admin_users` table.
    - If missing -> Redirects to `/unauthorized`.

3.  **Data Isolation**:
    - App users (in `profiles`) cannot log in here because they are not in `admin_users`.
    - Admins cannot log in to App because their email is namespaced (`admin...`).

## Future Work

- [ ] Implement 2FA/MFA.
- [ ] Password Reset flow for Admins.

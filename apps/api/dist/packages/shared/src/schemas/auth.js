import { z } from 'zod';
/** Canonical admin role enum; must match DB admin_role_enum and RBAC usage. */
export const AdminRoleEnum = z.enum(['support', 'moderator', 'admin', 'super_admin']);
/** GET /api/v1/auth/me response shape. Role may be admin or 'authenticated' (not in admin_users). */
export const AuthMeUserSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email().optional(),
    role: z.union([AdminRoleEnum, z.literal('authenticated')]),
});
export const AuthMeResponseSchema = z.object({
    ok: z.literal(true),
    data: z.object({
        user: AuthMeUserSchema,
    }),
});

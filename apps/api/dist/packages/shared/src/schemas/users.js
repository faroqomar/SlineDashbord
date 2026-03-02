import { z } from 'zod';
/** Canonical profile account status for moderation (marketplace users). */
export const AccountStatusEnum = z.enum(['active', 'suspended', 'banned']);
/** Optional restriction scope for partial restrictions (e.g. posting only). */
export const RestrictionScopeEnum = z.enum(['full', 'posting']).optional();
export const GetUsersSchema = z.object({
    page: z.number().int().positive().default(1),
    query: z.string().default(''),
    role: z.string().default('all'),
});
export const GetUserDetailsSchema = z.object({
    id: z.string().uuid("Invalid User ID"),
});
/** API body for suspend: userId from route, reason + duration in body. */
export const SuspendUserSchema = z.object({
    userId: z.string().uuid("Invalid User ID"),
    reason: z.string().min(5, "Reason must be at least 5 characters").max(500, "Reason is too long"),
    duration: z.enum(['24h', '30d', 'permanent']).default('24h'),
});
export const BanUserSchema = z.object({
    userId: z.string().uuid("Invalid User ID"),
    reason: z.string().min(5, "Reason must be at least 5 characters").max(500, "Reason is too long"),
});
export const UnbanUserSchema = z.object({
    userId: z.string().uuid("Invalid User ID"),
});
export const VerifyUserSchema = z.object({
    userId: z.string().uuid("Invalid User ID"),
});
/** Request for POST /users/:userId/force-logout. userId from path; body may include reason and idempotency_key. */
export const ForceLogoutInputSchema = z.object({
    userId: z.string().uuid("Invalid User ID"),
    reason: z.string().max(500).optional(),
    idempotency_key: z.string().optional(),
});
// Role Access Control Definitions
export const USERS_READ_ROLES = ['support', 'moderator', 'admin', 'super_admin'];
export const USERS_WRITE_ROLES = ['admin', 'super_admin'];

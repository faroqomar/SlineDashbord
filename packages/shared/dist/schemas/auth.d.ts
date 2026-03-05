import { z } from 'zod';
/** Canonical admin role enum; must match DB admin_role_enum and RBAC usage. */
export declare const AdminRoleEnum: z.ZodEnum<["support", "moderator", "admin", "super_admin"]>;
export type AdminRole = z.infer<typeof AdminRoleEnum>;
/** GET /api/v1/auth/me response shape. Role may be admin or 'authenticated' (not in admin_users). */
export declare const AuthMeUserSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    role: z.ZodUnion<[z.ZodEnum<["support", "moderator", "admin", "super_admin"]>, z.ZodLiteral<"authenticated">]>;
}, "strip", z.ZodTypeAny, {
    id: string;
    role: "support" | "moderator" | "admin" | "super_admin" | "authenticated";
    email?: string | undefined;
}, {
    id: string;
    role: "support" | "moderator" | "admin" | "super_admin" | "authenticated";
    email?: string | undefined;
}>;
export declare const AuthMeResponseSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
    data: z.ZodObject<{
        user: z.ZodObject<{
            id: z.ZodString;
            email: z.ZodOptional<z.ZodString>;
            role: z.ZodUnion<[z.ZodEnum<["support", "moderator", "admin", "super_admin"]>, z.ZodLiteral<"authenticated">]>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            role: "support" | "moderator" | "admin" | "super_admin" | "authenticated";
            email?: string | undefined;
        }, {
            id: string;
            role: "support" | "moderator" | "admin" | "super_admin" | "authenticated";
            email?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        user: {
            id: string;
            role: "support" | "moderator" | "admin" | "super_admin" | "authenticated";
            email?: string | undefined;
        };
    }, {
        user: {
            id: string;
            role: "support" | "moderator" | "admin" | "super_admin" | "authenticated";
            email?: string | undefined;
        };
    }>;
}, "strip", z.ZodTypeAny, {
    ok: true;
    data: {
        user: {
            id: string;
            role: "support" | "moderator" | "admin" | "super_admin" | "authenticated";
            email?: string | undefined;
        };
    };
}, {
    ok: true;
    data: {
        user: {
            id: string;
            role: "support" | "moderator" | "admin" | "super_admin" | "authenticated";
            email?: string | undefined;
        };
    };
}>;
export type AuthMeUser = z.infer<typeof AuthMeUserSchema>;
export type AuthMeResponse = z.infer<typeof AuthMeResponseSchema>;

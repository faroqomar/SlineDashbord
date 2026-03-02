import { z } from 'zod';
export type AdminUserDTO = {
    id: string;
    email: string;
    full_name: string;
    avatar_url: string;
    role: string;
    status: string;
    last_active_at: string;
    created_at: string;
};
export declare const InviteMemberSchema: z.ZodObject<{
    email: z.ZodString;
    role: z.ZodEnum<["support", "moderator", "admin", "super_admin"]>;
    fullName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    role: "support" | "moderator" | "admin" | "super_admin";
    email: string;
    fullName: string;
}, {
    role: "support" | "moderator" | "admin" | "super_admin";
    email: string;
    fullName: string;
}>;
export declare const UpdateRoleSchema: z.ZodObject<{
    userId: z.ZodString;
    newRole: z.ZodEnum<["support", "moderator", "admin", "super_admin"]>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    newRole: "support" | "moderator" | "admin" | "super_admin";
}, {
    userId: string;
    newRole: "support" | "moderator" | "admin" | "super_admin";
}>;
export declare const RemoveMemberSchema: z.ZodObject<{
    userId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    userId: string;
}, {
    userId: string;
}>;
export declare const TEAM_READ_ROLES: string[];
export declare const TEAM_WRITE_ROLES: string[];

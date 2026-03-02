import { z } from 'zod';
export declare const GetUsersSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    query: z.ZodDefault<z.ZodString>;
    role: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    page: number;
    query: string;
    role: string;
}, {
    page?: number | undefined;
    query?: string | undefined;
    role?: string | undefined;
}>;
export declare const GetUserDetailsSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const SuspendUserSchema: z.ZodObject<{
    id: z.ZodString;
    reason: z.ZodString;
    duration: z.ZodDefault<z.ZodEnum<["24h", "30d", "permanent"]>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    reason: string;
    duration: "24h" | "30d" | "permanent";
}, {
    id: string;
    reason: string;
    duration?: "24h" | "30d" | "permanent" | undefined;
}>;
export declare const BanUserSchema: z.ZodObject<{
    userId: z.ZodString;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    reason: string;
    userId: string;
}, {
    reason: string;
    userId: string;
}>;
export declare const UnbanUserSchema: z.ZodObject<{
    userId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    userId: string;
}, {
    userId: string;
}>;
export declare const VerifyUserSchema: z.ZodObject<{
    userId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    userId: string;
}, {
    userId: string;
}>;
export declare const USERS_READ_ROLES: string[];
export declare const USERS_WRITE_ROLES: string[];

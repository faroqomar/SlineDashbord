import { describe, it, expect } from 'vitest';
import { AdminRoleEnum, AuthMeResponseSchema } from './auth.js';
describe('auth schemas', () => {
    describe('AdminRoleEnum', () => {
        it('accepts valid roles', () => {
            expect(AdminRoleEnum.safeParse('support').success).toBe(true);
            expect(AdminRoleEnum.safeParse('moderator').success).toBe(true);
            expect(AdminRoleEnum.safeParse('admin').success).toBe(true);
            expect(AdminRoleEnum.safeParse('super_admin').success).toBe(true);
        });
        it('rejects invalid role', () => {
            expect(AdminRoleEnum.safeParse('user').success).toBe(false);
            expect(AdminRoleEnum.safeParse('').success).toBe(false);
            expect(AdminRoleEnum.safeParse(123).success).toBe(false);
        });
    });
    describe('AuthMeResponseSchema', () => {
        it('parses valid GET /me response', () => {
            const res = {
                ok: true,
                data: {
                    user: { id: '00000000-0000-0000-0000-000000000001', email: 'a@b.co', role: 'admin' },
                },
            };
            expect(AuthMeResponseSchema.safeParse(res).success).toBe(true);
        });
        it('rejects missing or wrong shape', () => {
            expect(AuthMeResponseSchema.safeParse({ data: {} }).success).toBe(false);
            expect(AuthMeResponseSchema.safeParse({ ok: true }).success).toBe(false);
        });
    });
});

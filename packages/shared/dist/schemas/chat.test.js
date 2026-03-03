import { describe, it, expect } from 'vitest';
import { GrantChatAccessInputSchema, ChatThreadAccessReceiptSchema, ChatMessageMaskedSchema, ChatMessageFullSchema, ChatThreadSummarySchema, ChatThreadResponseSchema, } from './chat.js';
const validUuid = '00000000-0000-0000-0000-000000000001';
const validUuid2 = '00000000-0000-0000-0000-000000000002';
describe('chat schemas (PAGE 09 contracts)', () => {
    describe('GrantChatAccessInputSchema', () => {
        it('accepts valid caseId only', () => {
            const r = GrantChatAccessInputSchema.safeParse({ caseId: validUuid });
            expect(r.success).toBe(true);
        });
        it('accepts caseId and optional reason', () => {
            const r = GrantChatAccessInputSchema.safeParse({
                caseId: validUuid,
                reason: 'Moderation review',
            });
            expect(r.success).toBe(true);
        });
        it('rejects invalid caseId', () => {
            expect(GrantChatAccessInputSchema.safeParse({ caseId: 'not-a-uuid' }).success).toBe(false);
            expect(GrantChatAccessInputSchema.safeParse({}).success).toBe(false);
        });
    });
    describe('ChatThreadAccessReceiptSchema', () => {
        it('parses receipt shape', () => {
            const r = ChatThreadAccessReceiptSchema.safeParse({
                threadId: validUuid,
                caseId: validUuid2,
                grantedAt: '2025-03-02T12:00:00Z',
            });
            expect(r.success).toBe(true);
        });
        it('accepts optional expiresAt', () => {
            const r = ChatThreadAccessReceiptSchema.safeParse({
                threadId: validUuid,
                caseId: validUuid2,
                grantedAt: '2025-03-02T12:00:00Z',
                expiresAt: '2025-03-03T12:00:00Z',
            });
            expect(r.success).toBe(true);
        });
    });
    describe('ChatMessageMaskedSchema', () => {
        it('parses masked message without body', () => {
            const r = ChatMessageMaskedSchema.safeParse({
                id: validUuid,
                created_at: '2025-03-02T12:00:00Z',
                redacted: false,
            });
            expect(r.success).toBe(true);
        });
    });
    describe('ChatMessageFullSchema', () => {
        it('parses full message', () => {
            const r = ChatMessageFullSchema.safeParse({
                id: validUuid,
                body: 'Hello',
                sender_id: validUuid2,
                created_at: '2025-03-02T12:00:00Z',
                redacted: false,
            });
            expect(r.success).toBe(true);
        });
    });
    describe('ChatThreadSummarySchema', () => {
        it('parses summary with optional fields', () => {
            const r = ChatThreadSummarySchema.safeParse({
                threadId: validUuid,
                participantIds: [validUuid, validUuid2],
                lastMessageAt: '2025-03-02T12:00:00Z',
                messageCount: 10,
            });
            expect(r.success).toBe(true);
        });
    });
    describe('ChatThreadResponseSchema', () => {
        it('parses thread response with messages', () => {
            const r = ChatThreadResponseSchema.safeParse({
                threadId: validUuid,
                messages: [
                    {
                        id: validUuid,
                        body: 'Hi',
                        sender_id: validUuid2,
                        created_at: '2025-03-02T12:00:00Z',
                        redacted: false,
                    },
                ],
            });
            expect(r.success).toBe(true);
        });
    });
});

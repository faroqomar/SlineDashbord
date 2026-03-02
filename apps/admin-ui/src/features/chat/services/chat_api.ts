import { request } from '../../../lib/api';
import type {
  ChatThreadResponse,
  ChatThreadAccessReceipt,
  GrantChatAccessInput,
} from '@sline/shared';

export const chatApi = {
  /**
   * GET /api/v1/chat/threads/:threadId?case_id=...
   * Returns thread messages only when case_id is valid and case is linked to thread.
   */
  getThread: async (threadId: string, caseId: string) => {
    const res = await request<ChatThreadResponse>(
      'GET',
      `/chat/threads/${encodeURIComponent(threadId)}?case_id=${encodeURIComponent(caseId)}`
    );
    if (!res.ok) throw new Error(res.error?.message ?? 'Failed to load thread');
    return res.data;
  },

  /**
   * POST /api/v1/chat/threads/:threadId/access
   * Grant access to thread for a case. Required before viewing if case has no prior link.
   */
  grantThreadAccess: async (
    threadId: string,
    payload: GrantChatAccessInput
  ): Promise<ChatThreadAccessReceipt> => {
    const res = await request<ChatThreadAccessReceipt>(
      'POST',
      `/chat/threads/${encodeURIComponent(threadId)}/access`,
      { caseId: payload.caseId, reason: payload.reason }
    );
    if (!res.ok) throw new Error(res.error?.message ?? 'Failed to grant access');
    return res.data;
  },
};

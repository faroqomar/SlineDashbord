import { useQuery } from '@tanstack/react-query';
import { chatApi } from '../services/chat_api';

export function useChatThread(threadId: string | undefined, caseId: string | undefined) {
  const enabled = !!threadId && !!caseId;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['chat', 'thread', threadId, caseId],
    queryFn: () => chatApi.getThread(threadId!, caseId!),
    enabled,
  });

  return {
    thread: data,
    messages: data?.messages ?? [],
    summary: data?.summary,
    loading: isLoading,
    error: error ? (error as Error).message : null,
    refetch,
    hasAccess: enabled,
  };
}

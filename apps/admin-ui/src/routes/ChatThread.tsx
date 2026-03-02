import React from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { useSearchParams } from '@/lib/navigation-shim';
import { ArrowLeft, MessageSquare, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useChatThread } from '../features/chat/viewmodels/useChatThread.vm';
import { formatDistanceToNow } from 'date-fns';

export function ChatThreadPage() {
  const params = useParams({ strict: false });
  const threadId = params?.threadId as string | undefined;
  const searchParams = useSearchParams();
  const caseIdFromRouter = searchParams.get('caseId');
  const caseIdFromUrl = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('caseId') : null;
  const caseId = caseIdFromRouter ?? caseIdFromUrl ?? undefined;

  const { messages, loading, error, hasAccess } = useChatThread(threadId, caseId);

  if (!caseId) {
    return (
      <div className="container max-w-2xl py-12 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Thread content requires a case
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              To view this chat thread, open it from a case. Create or open a case, attach this conversation, then use &quot;View thread&quot; so every view is logged.
            </p>
            <Button asChild variant="outline">
              <Link to="/">Back to dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container max-w-2xl py-12 flex items-center justify-center min-h-[300px]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-2xl py-12 space-y-6">
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Cannot load thread
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{error}</p>
            <Button asChild variant="outline" className="mt-4">
              <Link to="/">Back to dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-6 space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to dashboard
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">Thread</h1>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Messages (case-gated view)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {messages.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No messages in this thread.
            </div>
          ) : (
            <ul className="space-y-4">
              {messages.map((msg) => (
                <li
                  key={msg.id}
                  className="rounded-lg border bg-muted/20 p-3 text-sm"
                >
                  <div className="flex justify-between gap-2 text-xs text-muted-foreground mb-1">
                    <span>{msg.sender_id ? msg.sender_id.slice(0, 8) + '…' : 'System'}</span>
                    <time>{formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}</time>
                  </div>
                  <p className={msg.redacted ? 'italic text-muted-foreground' : ''}>
                    {msg.redacted ? '[Redacted]' : (msg.body ?? '')}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

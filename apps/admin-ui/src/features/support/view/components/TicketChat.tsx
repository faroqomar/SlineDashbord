"use client";

import { SupportTicketDTO } from "@/features/support/models/support.schema";
import { TicketMessageDTO } from "@/features/support/services/support_actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Paperclip, Send, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect, type SetStateAction, type Dispatch } from "react";
import { formatDistanceToNow } from "date-fns";

interface TicketChatProps {
  ticket: SupportTicketDTO;
  messages: TicketMessageDTO[];
  onSendMessage: (content: string) => void;
  isSending?: boolean;
}

export function TicketChat({ ticket, messages, onSendMessage, isSending }: TicketChatProps) {
  const [replyContent, setReplyContent] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = () => {
    if (!replyContent.trim()) return;
    onSendMessage(replyContent);
    setReplyContent("");
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-3xl mx-auto">
          {/* User Info Card */}
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={ticket.user?.avatar_url || undefined} />
                  <AvatarFallback>{ticket.user?.full_name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-sm">{ticket.user?.full_name || 'Unknown User'}</div>
                  <div className="text-xs text-muted-foreground">{ticket.user?.email || 'No email'}</div>
                </div>
                <Button variant="outline" size="sm" className="ml-auto h-8 text-xs">
                  <User className="w-3 h-3 mr-2" />
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.is_internal && "flex-row-reverse"
              )}
            >
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarImage src={message.sender.avatar_url || undefined} />
                <AvatarFallback>{message.sender.full_name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "flex-1 max-w-md",
                  message.is_internal && "text-right"
                )}
              >
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm shadow-sm",
                    message.is_internal
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-white dark:bg-muted border rounded-tl-none"
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground px-1">
                  <span>{message.sender.full_name}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          ))}
          
          <div ref={scrollRef} />

          {messages.length === 0 && (
             <div className="text-center text-muted-foreground py-10 opacity-50 text-sm">
               No messages in this conversation yet.
             </div>
          )}
        </div>
      </ScrollArea>

      {/* Reply Box */}
      <div className="p-4 border-t bg-background">
        <div className="max-w-3xl mx-auto space-y-4">
            <div className="relative">
                <Textarea
                    placeholder="Type your reply..."
                    value={replyContent}
                    onChange={(e: { target: { value: SetStateAction<string>; }; }) => setReplyContent(e.target.value)}
                    className="min-h-[100px] resize-none pr-12 bg-muted/30 focus:bg-background transition-colors"
                    disabled={isSending}
                />
                <Button 
                    size="icon" 
                    className="absolute bottom-3 right-3 h-8 w-8"
                    onClick={handleSend}
                    disabled={!replyContent.trim() || isSending}
                >
                    <Send className="w-4 h-4" />
                </Button>
            </div>
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" className="text-muted-foreground h-8">
                    <Paperclip className="w-4 h-4 mr-2" />
                    Attach File
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}

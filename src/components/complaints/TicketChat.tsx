"use client";

import { Ticket } from "@/data/mock/complaints";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Paperclip, Send, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { SetStateAction, useState } from "react";

interface TicketChatProps {
  ticket: Ticket;
  onSendMessage: (content: string) => void;
}

export function TicketChat({ ticket, onSendMessage }: TicketChatProps) {
  const [replyContent, setReplyContent] = useState("");

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
                  <AvatarImage src={ticket.user.avatar} />
                  <AvatarFallback>{ticket.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-sm">{ticket.user.name}</div>
                  <div className="text-xs text-muted-foreground">{ticket.user.email}</div>
                </div>
                <Button variant="outline" size="sm" className="ml-auto h-8 text-xs">
                  <User className="w-3 h-3 mr-2" />
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          {ticket.messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.sender === "admin" && "flex-row-reverse"
              )}
            >
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarImage src={message.senderAvatar} />
                <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "flex-1 max-w-md",
                  message.sender === "admin" && "text-right"
                )}
              >
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm shadow-sm",
                    message.sender === "admin"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-white dark:bg-muted border rounded-tl-none"
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground px-1">
                  <span>{message.senderName}</span>
                  <span>•</span>
                  <span>{message.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
          
          {ticket.messages.length === 0 && (
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
                />
                <Button 
                    size="icon" 
                    className="absolute bottom-3 right-3 h-8 w-8"
                    onClick={handleSend}
                    disabled={!replyContent.trim()}
                >
                    <Send className="w-4 h-4" />
                </Button>
            </div>
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" className="text-muted-foreground h-8">
                    <Paperclip className="w-4 h-4 mr-2" />
                    Attach File
                </Button>
                <div className="flex gap-2">
                     {/* Actions like format, templates etc can go here */}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

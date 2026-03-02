import { MessageSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/data/mock/disputes";

interface DisputeMessagesProps {
  messages: Message[];
}

export function DisputeMessages({ messages }: DisputeMessagesProps) {
  return (
    <div className="flex flex-col h-full bg-background">
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col max-w-[80%] ${msg.sender === 'Admin' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
              <div className={`p-3 rounded-lg text-sm ${
                msg.sender === 'Admin' 
                  ? 'bg-primary text-primary-foreground rounded-br-none' 
                  : msg.sender === 'System'
                    ? 'bg-muted w-full text-center italic text-xs py-1 self-center max-w-full rounded-full'
                    : 'bg-muted rounded-bl-none'
              }`}>
                {msg.content}
              </div>
              {msg.sender !== 'System' && (
                <span className="text-[10px] text-muted-foreground mt-1">
                  {msg.sender} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          ))}
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-10 opacity-50">
              <MessageSquare className="h-10 w-10 mx-auto mb-2" />
              No messages yet
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 bg-background border-t mt-auto">
        <div className="h-10 bg-muted/50 rounded-md border border-input flex items-center px-3 text-sm text-muted-foreground">
          Reply as Admin... (Read-only mode)
        </div>
      </div>
    </div>
  );
}

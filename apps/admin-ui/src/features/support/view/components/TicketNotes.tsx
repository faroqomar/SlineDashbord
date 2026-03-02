"use client";

import { Ticket } from "@/data/mock/complaints";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface TicketNotesProps {
  ticket: Ticket;
  onAddNote: (content: string) => void;
  onClose: () => void;
}

export function TicketNotes({ ticket, onAddNote, onClose }: TicketNotesProps) {
  const [noteContent, setNoteContent] = useState("");

  const handleAddNote = () => {
    if (!noteContent.trim()) return;
    onAddNote(noteContent);
    setNoteContent("");
  };

  return (
    <div className="w-80 border-l flex flex-col bg-muted/10 h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
            <h3 className="font-semibold text-sm">Internal Notes</h3>
            <p className="text-[10px] text-muted-foreground">Only visible to team</p>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {(ticket.internalNotes ?? []).map((note: { id: string; content: string; author: string; timestamp: string }) => (
            <div key={note.id} className="p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-lg text-sm">
              <p className="text-foreground/90">{note.content}</p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-yellow-200/50 dark:border-yellow-800/30 text-[10px] text-muted-foreground">
                <span className="font-medium">{note.author}</span>
                <span>{note.timestamp}</span>
              </div>
            </div>
          ))}
          {(ticket.internalNotes ?? []).length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-xs border-2 border-dashed rounded-lg">
              No internal notes yet.
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-background/50 backdrop-blur-sm">
        <Textarea
          placeholder="Add a private note..."
          value={noteContent}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNoteContent(e.target.value)}
          className="min-h-[80px] resize-none mb-3 bg-background text-sm"
        />
        <Button size="sm" className="w-full" onClick={handleAddNote}>
          Add Internal Note
        </Button>
      </div>
    </div>
  );
}

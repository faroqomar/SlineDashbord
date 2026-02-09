"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LogDiffViewerProps {
  before: Record<string, any>;
  after: Record<string, any>;
}

export function LogDiffViewer({ before, after }: LogDiffViewerProps) {
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="grid grid-cols-2 gap-4 border rounded-md bg-background p-4 mt-2">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
           <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Before</Badge>
           <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(JSON.stringify(before, null, 2))}>
              <Copy className="h-3 w-3" />
           </Button>
        </div>
        <ScrollArea className="h-[200px] w-full rounded-md border p-4 bg-muted/50 font-mono text-xs">
           <pre>{JSON.stringify(before, null, 2)}</pre>
        </ScrollArea>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
           <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">After</Badge>
           <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(JSON.stringify(after, null, 2))}>
              <Copy className="h-3 w-3" />
           </Button>
        </div>
        <ScrollArea className="h-[200px] w-full rounded-md border p-4 bg-muted/50 font-mono text-xs">
           <pre>{JSON.stringify(after, null, 2)}</pre>
        </ScrollArea>
      </div>
    </div>
  );
}

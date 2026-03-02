"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Terminal, Download, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface LogEntry {
  id: string;
  created_at: string;
  event_type: string; // Mapped to level/service
  entity_type: string;
  actor?: {
    full_name: string;
    email: string;
  };
  metadata?: any;
}

interface LogsTerminalProps {
  logs: LogEntry[];
  total: number;
}

export function LogsTerminal({ logs, total }: LogsTerminalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "");

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedLogs(newExpanded);
  };

  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      const params = new URLSearchParams(searchParams);
      if (searchTerm) params.set('search', searchTerm);
      else params.delete('search');
      router.push(`?${params.toString()}`);
  }

  const getLevelColor = (type: string) => {
    if (type.includes('error') || type.includes('ban')) return "text-red-500 font-bold";
    if (type.includes('warn') || type.includes('dispute')) return "text-yellow-400";
    return "text-blue-400";
  };

  return (
    <div className="space-y-4 h-[calc(100vh-10rem)] flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Terminal className="h-6 w-6" />
            <h2 className="text-3xl font-bold tracking-tight">System Logs</h2>
        </div>
        <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Export Logs
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
         {/* Filter dropdown can be added here mapping to URL params */}
      </div>

      <div className="flex-1 rounded-md border bg-slate-950 text-slate-50 font-mono text-sm shadow-inner overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400">
            <span>Terminal Output</span>
            <span>{total} events found</span>
        </div>
        <ScrollArea className="flex-1 p-4">
            <div className="space-y-1">
                {logs.map((log) => {
                    const isExpanded = expandedLogs.has(log.id);
                    const hasMetadata = log.metadata && Object.keys(log.metadata).length > 0;
                    
                    return (
                        <div key={log.id} className="group">
                             <div 
                                className={cn(
                                    "grid grid-cols-[20px_160px_100px_140px_1fr] gap-2 p-1 rounded transition-colors cursor-pointer",
                                    isExpanded ? "bg-slate-800" : "hover:bg-slate-900/50"
                                )}
                                onClick={() => hasMetadata && toggleExpand(log.id)}
                            >
                                <span className="flex items-center justify-center text-slate-600">
                                    {hasMetadata && (
                                        isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
                                    )}
                                </span>
                                <span className="text-slate-500 text-xs mt-0.5">{new Date(log.created_at).toLocaleTimeString()}</span>
                                <span className={getLevelColor(log.event_type)}>{log.event_type}</span>
                                <span className="text-cyan-400">{log.entity_type}</span>
                                <span className="text-slate-300 break-words flex items-center gap-2">
                                    Action by {log.actor?.full_name || 'System'}
                                    {hasMetadata && !isExpanded && (
                                        <Badge variant="outline" className="text-[10px] h-4 px-1 py-0 border-slate-700 text-slate-500">Details</Badge>
                                    )}
                                </span>
                            </div>
                            
                            {isExpanded && hasMetadata && (
                                <div className="pl-6 pr-2 pb-2 bg-slate-900/30 rounded-b border-x border-b border-slate-800 mb-2">
                                    <pre className="text-xs text-slate-400 overflow-x-auto">
                                        {JSON.stringify(log.metadata, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    );
                })}
                
                {logs.length === 0 && (
                    <div className="text-center text-slate-600 py-10 italic">
                        No logs found.
                    </div>
                )}
            </div>
        </ScrollArea>
      </div>
    </div>
  );
}

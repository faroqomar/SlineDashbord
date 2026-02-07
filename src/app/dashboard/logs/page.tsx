"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MOCK_LOGS, LogEntry } from "@/data/mock/logs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Terminal, Download } from "lucide-react";

export default function LogsPage() {
  const [filterLevel, setFilterLevel] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = MOCK_LOGS.filter(log => {
    const matchesLevel = filterLevel === "ALL" || log.level === filterLevel;
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.service.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const getLevelColor = (level: LogEntry["level"]) => {
    switch (level) {
      case "INFO": return "text-blue-400";
      case "WARN": return "text-yellow-400";
      case "ERROR": return "text-red-500 font-bold";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-8rem)] flex flex-col">
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
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterLevel} onValueChange={setFilterLevel}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Levels</SelectItem>
            <SelectItem value="INFO">Info</SelectItem>
            <SelectItem value="WARN">Warning</SelectItem>
            <SelectItem value="ERROR">Error</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 rounded-md border bg-slate-950 text-slate-50 font-mono text-sm shadow-inner overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400">
            <span>Terminal Output</span>
            <span>{filteredLogs.length} events found</span>
        </div>
        <ScrollArea className="flex-1 p-4">
            <div className="space-y-1">
                {filteredLogs.map((log) => (
                    <div key={log.id} className="grid grid-cols-[160px_80px_140px_1fr] gap-2 hover:bg-slate-900/50 p-1 rounded transition-colors">
                        <span className="text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        <span className={getLevelColor(log.level)}>{log.level}</span>
                        <span className="text-cyan-400">{log.service}</span>
                        <span className="text-slate-300 break-words">
                            {log.message}
                            {log.metadata && (
                                <span className="ml-2 text-slate-600">
                                    {JSON.stringify(log.metadata)}
                                </span>
                            )}
                        </span>
                    </div>
                ))}
                {filteredLogs.length === 0 && (
                    <div className="text-center text-slate-600 py-10 italic">
                        No logs found matching your criteria.
                    </div>
                )}
            </div>
        </ScrollArea>
      </div>
    </div>
  );
}

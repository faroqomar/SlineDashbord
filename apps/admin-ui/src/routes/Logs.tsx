import React from 'react';
import { FileText } from 'lucide-react';

export function LogsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold font-inter tracking-tight">System Logs</h2>
        <p className="text-slate-400 mt-1">Audit and system logs (coming soon).</p>
      </div>
      <div className="glass-card flex flex-col items-center justify-center py-16 text-center">
        <FileText className="h-12 w-12 text-slate-500 mb-4" />
        <p className="text-slate-400">Logs view will be available in a later release.</p>
      </div>
    </div>
  );
}

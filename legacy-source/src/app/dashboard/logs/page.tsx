import { getSystemLogs } from "@/features/logs/services/log_actions";
import { LogsTerminal } from "@/components/logs/LogsTerminal";

export default async function LogsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const page = typeof params.page === 'string' ? parseInt(params.page) : 1;
  const type = typeof params.type === 'string' ? params.type : 'all';

  const res = await getSystemLogs(page, type, 50);
  const { logs, count } = res.success ? res.data : { logs: [], count: 0 };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <LogsTerminal logs={logs} total={count} />
    </div>
  );
}

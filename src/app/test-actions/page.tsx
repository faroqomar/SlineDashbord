import { getOverviewStats } from '@/actions/dashboard';
import { getUsers } from '@/actions/users';

export default async function TestActionsPage() {
  const stats = await getOverviewStats();
  const users = await getUsers(1, 10);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Test Actions Verification</h1>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Dashboard Stats</h2>
        <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-auto">
          {JSON.stringify(stats, null, 2)}
        </pre>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Users List (First 10)</h2>
        <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-auto">
          {JSON.stringify(users, null, 2)}
        </pre>
      </div>
    </div>
  );
}

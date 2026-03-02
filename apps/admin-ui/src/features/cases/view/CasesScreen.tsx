import { useCasesViewModel } from '../viewmodels/use_cases_viewmodel';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw, FolderOpen, Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import type { AdminCaseCreateInput } from '@sline/shared';
import { casesApi } from '../services/cases_api';

export function CasesScreen() {
  const vm = useCasesViewModel();
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);
  const [createSubject, setCreateSubject] = useState('');
  const [createSource, setCreateSource] = useState('dashboard');
  const [createPriority, setCreatePriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [createError, setCreateError] = useState<string | null>(null);

  const handleCreateSubmit = async () => {
    if (!createSubject.trim()) return;
    setCreateError(null);
    try {
      const created = await casesApi.createCase({
        subject: createSubject.trim(),
        source: createSource,
        priority: createPriority,
      });
      setCreateOpen(false);
      setCreateSubject('');
      setCreateSource('dashboard');
      setCreatePriority('medium');
      vm.refreshCases();
      navigate({ to: '/cases/$caseId', params: { caseId: created.id } });
    } catch (e) {
      setCreateError(e instanceof Error ? e.message : 'Failed to create case');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cases</h2>
          <p className="text-muted-foreground">
            Investigation and moderation cases (required for chat access gating).
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={vm.refreshCases} disabled={vm.isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${vm.isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New case
          </Button>
        </div>
      </div>

      {vm.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{vm.error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total cases</CardTitle>
          <FolderOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{vm.count}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Case list</CardTitle>
          <CardDescription>Click a row to open case detail and attach entities.</CardDescription>
        </CardHeader>
        <CardContent>
          {vm.isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : vm.cases.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No cases yet. Create one to get started.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vm.cases.map((c) => (
                  <TableRow
                    key={c.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate({ to: '/cases/$caseId', params: { caseId: c.id } })}
                  >
                    <TableCell className="font-medium">{c.subject}</TableCell>
                    <TableCell>{c.status ?? '—'}</TableCell>
                    <TableCell>{c.priority ?? '—'}</TableCell>
                    <TableCell>{c.source ?? '—'}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString() : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {vm.totalPages > 1 && (
            <div className="flex justify-between mt-4">
              <p className="text-xs text-muted-foreground">
                Showing {vm.cases.length} of {vm.count} cases
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={vm.filters.page === 1 || vm.isLoading}
                  onClick={() => vm.changeFilters({ page: (vm.filters.page ?? 1) - 1 })}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={(vm.filters.page ?? 1) >= vm.totalPages || vm.isLoading}
                  onClick={() => vm.changeFilters({ page: (vm.filters.page ?? 1) + 1 })}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create case</DialogTitle>
            <DialogDescription>Add a new investigation or moderation case.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={createSubject}
                onChange={(e) => setCreateSubject(e.target.value)}
                placeholder="e.g. User report #123"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                value={createSource}
                onChange={(e) => setCreateSource(e.target.value)}
                placeholder="dashboard"
              />
            </div>
            <div className="grid gap-2">
              <Label>Priority</Label>
              <Select value={createPriority} onValueChange={(v: 'low' | 'medium' | 'high') => setCreatePriority(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {createError && (
              <Alert variant="destructive">
                <AlertDescription>{createError}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSubmit} disabled={!createSubject.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import React from 'react';
import { useReportsViewModel } from '../viewmodels/use_reports_viewmodel';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw, Flag } from 'lucide-react';
import { ReportsTable } from './ReportsTable';
import { ReportDetailModal } from './ReportDetailModal';

export function ReportsScreen() {
  const vm = useReportsViewModel();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Flag className="h-8 w-8 text-primary" />
            Reports Queue
          </h2>
          <p className="text-muted-foreground">
            Triage and close user reports for tasks, users, and chats.
          </p>
        </div>
        <Button variant="outline" onClick={vm.refreshList} disabled={vm.loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${vm.loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {vm.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{vm.error}</AlertDescription>
        </Alert>
      )}

      <ReportsTable
        filters={vm.filters}
        reports={vm.reports}
        total={vm.total}
        loading={vm.loading}
        changeFilters={vm.changeFilters}
        openDetail={vm.openDetail}
        refreshList={vm.refreshList}
      />

      <ReportDetailModal
        open={!!vm.selectedReport || vm.detailLoading}
        loading={vm.detailLoading}
        report={vm.selectedReport}
        actionReason={vm.actionReason}
        setActionReason={vm.setActionReason}
        onDismiss={vm.handleDismiss}
        onEscalate={vm.handleEscalate}
        onCloseResolved={vm.handleCloseResolved}
        submitting={vm.submitting}
        submitError={vm.submitError}
        onClose={vm.closeDialog}
      />
    </div>
  );
}

import React from 'react';
import { useReportsViewModel } from '../viewmodels/use_reports_viewmodel';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertCircle,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Flag,
  Megaphone,
  RefreshCw,
} from 'lucide-react';
import { ReportsTable } from './ReportsTable';
import { ReportDetailModal } from './ReportDetailModal';
import { CreateReportDialog } from './CreateReportDialog';

const HERO_CHART_WIDTH = 220;
const HERO_CHART_HEIGHT = 80;

function toLinePath(values: number[], width: number, height: number): string {
  if (values.length === 0) return '';
  const max = Math.max(...values);
  const min = Math.min(...values);
  const spread = Math.max(1, max - min);

  return values
    .map((value, index) => {
      const x = (index / Math.max(1, values.length - 1)) * width;
      const y = height - ((value - min) / spread) * (height - 8) - 4;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
}

function toMiniSparkline(values: number[]): string {
  if (values.length === 0) return '';
  const max = Math.max(...values);
  const min = Math.min(...values);
  const spread = Math.max(1, max - min);

  return values
    .map((value, index) => {
      const x = (index / Math.max(1, values.length - 1)) * 56;
      const y = 22 - ((value - min) / spread) * 18;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
}

export function ReportsScreen() {
  const vm = useReportsViewModel();
  const incomingPath = toLinePath(vm.heroTrend.incoming, HERO_CHART_WIDTH, HERO_CHART_HEIGHT);
  const resolvedPath = toLinePath(vm.heroTrend.resolved, HERO_CHART_WIDTH, HERO_CHART_HEIGHT);

  const kpiCards = [
    {
      key: 'total' as const,
      title: 'Total Reports',
      value: vm.kpis.total,
      icon: <Flag className="h-4 w-4 text-[#5eb1fa]" />,
      iconWrapClass: 'border-[rgba(5,68,147,0.2)] bg-[rgba(5,67,145,0.09)]',
      lineColor: '#5eb1fa',
    },
    {
      key: 'open' as const,
      title: 'Open',
      value: vm.kpis.open,
      icon: <Clock3 className="h-4 w-4 text-[#fa7f2a]" />,
      iconWrapClass: 'border-[rgba(169,72,4,0.2)] bg-[rgba(190,81,5,0.09)]',
      lineColor: '#fa7f2a',
    },
    {
      key: 'escalated' as const,
      title: 'Escalated',
      value: vm.kpis.escalated,
      icon: <AlertTriangle className="h-4 w-4 text-[#a957f7]" />,
      iconWrapClass: 'border-[rgba(79,7,148,0.2)] bg-[rgba(81,7,151,0.09)]',
      lineColor: '#a957f7',
    },
    {
      key: 'closed' as const,
      title: 'Closed',
      value: vm.kpis.closed,
      icon: <CheckCircle2 className="h-4 w-4 text-[#4ae081]" />,
      iconWrapClass: 'border-[rgba(27,158,76,0.2)] bg-[rgba(27,158,75,0.09)]',
      lineColor: '#4ae081',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-[16px] border border-[#7f7669] px-6 py-5 [background-image:linear-gradient(167deg,#150e05_0%,#0c1222_40%,#120a06_100%)]">
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[rgba(190,81,5,0.2)] blur-3xl" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-28 w-28 rounded-full bg-[rgba(159,14,14,0.16)] blur-3xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[16px] border border-[rgba(169,72,4,0.25)] bg-[linear-gradient(135deg,rgba(190,81,5,0.19)_0%,rgba(159,14,14,0.13)_100%)]">
              <Flag className="h-6 w-6 text-[#fb9745]" />
            </div>
            <div>
              <h2 className="text-[36px] font-bold leading-none tracking-tight text-[#e8e6e3]">Reports Queue</h2>
              <p className="mt-1 text-sm text-[#afa89d]">
                Triage, investigate, and resolve user reports across the platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={vm.refreshList}
              disabled={vm.loading}
              className="h-[42px] rounded-[14px] border-[rgba(48,52,54,0.4)] bg-[rgba(24,26,27,0.25)] text-[#cecac4] hover:bg-[rgba(24,26,27,0.6)]"
            >
              <RefreshCw className={`mr-2 h-3.5 w-3.5 ${vm.loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              type="button"
              onClick={vm.openCreateDialog}
              className="h-[42px] rounded-[14px] border border-[rgba(169,72,4,0.3)] bg-[linear-gradient(162deg,rgba(190,81,5,0.19)_0%,rgba(190,81,5,0.08)_100%)] text-[#fb9745] opacity-90"
            >
              <Megaphone className="mr-2 h-3.5 w-3.5" />
              New Report
            </Button>
          </div>
        </div>

        <div className="relative mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="flex items-center gap-6 text-xs text-[#9d9588]">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#be5105]" />
              Incoming
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#1b9e4b]" />
              Resolved
            </span>
            <span>{vm.heroTrend.windowLabel}</span>
          </div>
          <svg
            viewBox={`0 0 ${HERO_CHART_WIDTH} ${HERO_CHART_HEIGHT}`}
            className="h-20 w-[220px] text-[#5eb1fa]"
            aria-hidden
          >
            <polyline fill="none" stroke="#be5105" strokeWidth="2" points={incomingPath} />
            <polyline fill="none" stroke="#00f6a4" strokeWidth="2" points={resolvedPath} />
          </svg>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((kpi) => {
          const visual = vm.kpiVisuals[kpi.key];
          const isUp = visual.deltaDirection === 'up';
          const sparkline = toMiniSparkline(visual.sparkline);

          return (
            <div
              key={kpi.key}
              className="relative overflow-hidden rounded-[14px] border border-[#7f7668] bg-[#0e0f13] p-4"
            >
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-white/60 to-transparent opacity-40" />
              <div className="flex items-center justify-between">
                <div className={`flex h-9 w-9 items-center justify-center rounded-[10px] border ${kpi.iconWrapClass}`}>
                  {kpi.icon}
                </div>
                <svg viewBox="0 0 56 24" className="h-8 w-14">
                  <polyline fill="none" stroke={kpi.lineColor} strokeWidth="1.8" points={sparkline} />
                </svg>
              </div>
              <div className="mt-3">
                <p className="text-[12px] uppercase tracking-[1.2px] text-[#9d9588]">{kpi.title}</p>
                <div className="mt-1 flex items-end gap-2">
                  <p className="text-4xl font-bold leading-none text-[#e8e6e3]">
                    {vm.kpiLoading ? '--' : kpi.value}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[12px] font-medium ${
                      isUp
                        ? 'bg-[#08190e] text-[#4ae081]'
                        : 'bg-[#220c0c] text-[#f04d4d]'
                    }`}
                  >
                    {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {visual.deltaLabel}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
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
        searchQuery={vm.searchQuery}
        setSearchQuery={vm.setSearchQuery}
        changeFilters={vm.changeFilters}
        openDetail={vm.openDetail}
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

      <CreateReportDialog
        open={vm.createOpen}
        onOpenChange={(open) => (open ? vm.openCreateDialog() : vm.closeCreateDialog())}
        draft={vm.createDraft}
        updateDraft={vm.updateCreateDraft}
        onSubmit={vm.submitCreateReport}
        submitting={vm.createSubmitting}
        error={vm.createError}
      />
    </div>
  );
}

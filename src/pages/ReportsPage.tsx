import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, FileText } from 'lucide-react';
import { api, unwrap } from '../services/api';
import { EmptyState, Spinner } from '../components/ui/Feedback';
import { GhostButton, inputClass, PrimaryButton } from '../components/ui/Form';
import { DataTable, TabPills, Toolbar, type Column } from '../components/ui/Surface';
import { usePermission } from '../hooks/usePermission';

const tabs = [
  ['bookings', 'Bookings'],
  ['utilization', 'Utilization'],
  ['departments', 'Departments'],
  ['cancellations', 'Cancellations'],
  ['peak-hours', 'Peak hours'],
] as const;

type ReportType = (typeof tabs)[number][0];
type Row = Record<string, unknown>;

function humanize(key: string) {
  return key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ');
}

export function ReportsPage() {
  const { can } = usePermission();
  const [type, setType] = useState<ReportType>('bookings');
  const [from, setFrom] = useState(new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10));
  const [to, setTo] = useState(new Date().toISOString().slice(0, 10));
  const path =
    type === 'peak-hours' ? '/reports/peak-hours' : type === 'cancellations' ? '/reports/cancellations' : `/reports/${type}`;
  const { data, isLoading } = useQuery({
    queryKey: ['report', type, from, to],
    queryFn: () => unwrap<Row[]>(api.get(path, { params: { from, to } })),
  });
  const rows = data ?? [];
  const columns: Column<Row>[] = (rows[0] ? Object.keys(rows[0]) : []).map((key) => ({
    key,
    header: humanize(key),
    render: (row) => String(row[key] ?? '—'),
  }));
  const download = async (format: 'xlsx' | 'pdf') => {
    const res = await api.get('/reports/export', {
      params: { type, format, from, to },
      responseType: 'blob',
    });
    const url = URL.createObjectURL(res.data as Blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div>
      <div className="mb-4">
        <TabPills tabs={tabs} value={type} onChange={setType} />
      </div>
      <Toolbar>
        <label className="text-xs font-semibold uppercase tracking-[0.1em] text-navy-800/50">
          From
          <input type="date" className={`${inputClass} mt-1`} value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.1em] text-navy-800/50">
          To
          <input type="date" className={`${inputClass} mt-1`} value={to} onChange={(e) => setTo(e.target.value)} />
        </label>
        {can('reports.export') ? (
          <div className="ml-auto flex gap-2">
            <PrimaryButton type="button" onClick={() => void download('xlsx')}>
              <Download className="h-4 w-4" />
              Excel
            </PrimaryButton>
            <GhostButton type="button" onClick={() => void download('pdf')}>
              <FileText className="h-4 w-4" />
              PDF
            </GhostButton>
          </div>
        ) : null}
      </Toolbar>
      {isLoading ? (
        <Spinner />
      ) : !rows.length ? (
        <EmptyState title="No data for this range" hint="Widen the date range or pick another report." />
      ) : (
        <DataTable columns={columns} rows={rows} rowKey={(_, i) => String(i)} />
      )}
    </div>
  );
}

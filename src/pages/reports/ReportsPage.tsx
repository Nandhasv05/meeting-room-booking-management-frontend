// AUTHOR : NANDNHAKUMAR SV 
// DATE : 28/08/2026
// DESCRIPTION : Reports page to view reports
import { useEffect, useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { EmptyState, Spinner } from '../../components/ui/Feedback';
import { GhostButton, inputClass, PrimaryButton } from '../../components/ui/Form';
import { DataTable, TabPills, Toolbar, type Column } from '../../components/ui/Surface';
import { usePermission } from '../../hooks/usePermission';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchReportStart } from '../../redux/reports/reports.action';
import { selectReportLoading, selectRows } from '../../redux/reports/reports.selector';
import { exportReportCall } from '../../redux/reports/reports.services';
import { tabs, ReportType, humanizeKey } from '../../helpers/reports/reportsValidation';

export function ReportsPage() {

  /******* STATE *******/
  const { can } = usePermission();
  const dispatch = useAppDispatch();
  const [type, setType] = useState<ReportType>('bookings');
  const [from, setFrom] = useState(new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10));
  const [to, setTo] = useState(new Date().toISOString().slice(0, 10));

  /******* SELECTORS *******/
  const path =
    type === 'peak-hours' ? '/reports/peak-hours' : type === 'cancellations' ? '/reports/cancellations' : `/reports/${type}`;
  const data = useAppSelector(selectRows) as Record<string, unknown>[] | undefined;
  const isLoading = useAppSelector(selectReportLoading);

  /******* EFFECTS *******/
  useEffect(() => {
    dispatch(fetchReportStart({ path, from, to }));
  }, [path, from, to, dispatch]);


  const rows = data ?? [];
  const columns: Column<Record<string, unknown>>[] = (rows[0] ? Object.keys(rows[0]) : []).map((key) => ({
    key,
    header: humanizeKey(key),
    render: (row) => String(row[key] ?? '—'),
  }));

  /******* HANDLERS *******/
  const download = async (format: 'xlsx' | 'pdf') => {
    const res = await exportReportCall({ type, format, from, to });
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
export default ReportsPage;


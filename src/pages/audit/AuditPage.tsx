// AUTHOR : NANDNHAKUMAR SV 
// DATE : 27/08/2026
// DESCRIPTION : Audit page to view audit logs
import { useEffect } from 'react';
import type { Paged } from '../../types/api';
import { EmptyState, Spinner } from '../../components/ui/Feedback';
import { DataTable, type Column } from '../../components/ui/Surface';
import { fmtDateTime } from '../../utils/format';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchAuditLogsStart } from '../../redux/audit/audit.action';
import { selectAuditPage, selectAuditLoading } from '../../redux/audit/audit.selector';
import { audit_logs_type } from '../../helpers/audit/auditValidations';

export function AuditPage() {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectAuditPage) as Paged<audit_logs_type> | null;
  const isLoading = useAppSelector(selectAuditLoading);

  useEffect(() => {
    dispatch(fetchAuditLogsStart({ pageSize: 50 }));
  }, [dispatch]);

  // DEFINE THE COLUMNS FOR THE AUDIT LOGS TABLE
  const columns: Column<audit_logs_type>[] = [
    {
      key: 'when',
      header: 'When',
      render: (l) => <span className="whitespace-nowrap text-navy-800/70">{fmtDateTime(l.CreatedAt)}</span>,
    },
    { key: 'user', header: 'User', render: (l) => <span className="font-medium text-navy-900">{l.UserName ?? '—'}</span> },
    {
      key: 'action',
      header: 'Action',
      render: (l) => (
        <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-semibold text-navy-700">{l.Action}</span>
      ),
    },
    { key: 'module', header: 'Module', render: (l) => l.Module },
    {
      key: 'record',
      header: 'Record',
      render: (l) => <span className="font-mono text-xs text-navy-800/50">{l.RecordId ?? '—'}</span>,
    },
    { key: 'ip', header: 'IP', render: (l) => <span className="text-navy-800/60">{l.IpAddress ?? '—'}</span> },
  ];
 
  // GET THE ROWS FOR THE AUDIT LOGS TABLE
  const rows = data?.items ?? [];

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : !rows.length ? (
        <EmptyState title="No activity recorded yet" />
      ) : (
        <DataTable columns={columns} rows={rows} rowKey={(l) => l.Id} />
      )}
    </div>
  );
}

// AUTHOR : NANDNHAKUMAR SV 
// DATE : 27/08/2026
// DESCRIPTION : Audit page to view audit logs
import { useQuery } from '@tanstack/react-query';
import { api, unwrap } from '../services/api';
import type { Paged } from '../types/api';
import { EmptyState, Spinner } from '../components/ui/Feedback';
import { DataTable, type Column } from '../components/ui/Surface';
import { fmtDateTime } from '../utils/format';

// Interface for the audit logs
type Log = {
  Id: string;
  UserName: string | null;
  Action: string;
  Module: string;
  RecordId: string | null;
  IpAddress: string | null;
  CreatedAt: string;
};

export function AuditPage() {

  // GET AUDIT LOGS DETAILS FROM THE API CALLS
  const { data, isLoading } = useQuery({
    queryKey: ['audit'],
    queryFn: () => unwrap<Paged<Log>>(api.get('/audit-logs', { params: { pageSize: 50 } })),
  });

  // DEFINE THE COLUMNS FOR THE AUDIT LOGS TABLE
  const columns: Column<Log>[] = [
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

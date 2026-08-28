// AUTHOR : NANDHAKUMAR S V
// DATE : 28/08/2026
// DESCRIPTION : Users page — CLIENT_API_LIVE directory (read-only)
import { useEffect, useState } from 'react';
import type { Paged } from '../../types/api';
import { EmptyState, PageHeader, Spinner, StatusBadge } from '../../components/ui/Feedback';
import { DataTable, SearchField, Toolbar, type Column } from '../../components/ui/Surface';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchUsersStart } from '../../redux/users/users.action';
import { selectUsersLoading, selectUsersPage } from '../../redux/users/users.selector';
import { UserRow, initials } from '../../helpers/setting/userValidation';

export function UsersPage() {
  const dispatch = useAppDispatch();
  const [q, setQ] = useState('');
  const data = useAppSelector(selectUsersPage) as Paged<UserRow> | null;
  const isLoading = useAppSelector(selectUsersLoading);

  useEffect(() => {
    dispatch(fetchUsersStart({ q, pageSize: 50 }));
  }, [q, dispatch]);

  const columns: Column<UserRow>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (u) => (
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-600">
            {initials(u.FirstName, u.LastName)}
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold text-navy-900">
              {u.FirstName} {u.LastName}
            </p>
            <p className="truncate text-xs text-navy-800/45">{u.Email}</p>
          </div>
        </div>
      ),
    },
    { key: 'employee', header: 'Username', render: (u) => u.EmployeeId },
    { key: 'department', header: 'Department', render: (u) => u.DepartmentName ?? '—' },
    {
      key: 'role',
      header: 'Role',
      render: (u) => (
        <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-semibold text-navy-700">{u.RoleName}</span>
      ),
    },
    { key: 'status', header: 'Status', render: (u) => <StatusBadge value={u.Status} /> },
  ];

  const rows = data?.items ?? [];

  return (
    <div>
      <Toolbar>
        <SearchField value={q} onChange={setQ} placeholder="Search by username or email" />
      </Toolbar>
      {isLoading ? (
        <Spinner />
      ) : !rows.length ? (
        <EmptyState title="No users found" hint="Adjust your search, or check dbo.users on CLIENT_API_LIVE." />
      ) : (
        <DataTable columns={columns} rows={rows} rowKey={(u) => u.Id} />
      )}
    </div>
  );
}
export default UsersPage;

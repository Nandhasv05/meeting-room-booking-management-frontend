// AUTHOR : NANDHAKUMAR S V
// DATE : 28/08/2026
// DESCRIPTION : Users page to view and manage users
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus } from 'lucide-react';
import { celebrate } from '../../components/ui/SuccessFx';
import type { Paged } from '../../types/api';
import { EmptyState, PageHeader, Spinner, StatusBadge } from '../../components/ui/Feedback';
import { Field as Labeled, inputClass, Modal, PrimaryButton } from '../../components/ui/Form';
import { DataTable, SearchField, Toolbar, type Column } from '../../components/ui/Surface';
import { usePermission } from '../../hooks/usePermission';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  createUserResponseResetStart,
  createUserStart,
  fetchUsersStart,
} from '../../redux/users/users.action';
import {
  selectCreateUserLoading,
  selectCreateUserResponse,
  selectUsersLoading,
  selectUsersPage,
} from '../../redux/users/users.selector';
import { fetchRolesStart } from '../../redux/roles/roles.action';
import { selectRoles } from '../../redux/roles/roles.selector';
import { fetchDepartmentsStart } from '../../redux/departments/departments.action';
import { selectDepartments } from '../../redux/departments/departments.selector';
import { useReduxResponse } from '../../redux/_common/useReduxResponse';
import { UserRow, schema, FormData, initials } from '../../helpers/setting/userValidation';


export function UsersPage() {

  /******* STATE *******/
  const { can } = usePermission();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');

  /******* SELECTORS *******/
  const data = useAppSelector(selectUsersPage) as Paged<UserRow> | null;
  const isLoading = useAppSelector(selectUsersLoading);
  const roles = useAppSelector(selectRoles) as { Id: string; Name: string }[] | undefined;
  const departments = useAppSelector(selectDepartments) as { Id: string; Name: string }[] | undefined;
  const creating = useAppSelector(selectCreateUserLoading);
  const createResponse = useAppSelector(selectCreateUserResponse);

  /******* FORM *******/
  const { register, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      employeeId: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      departmentId: '',
      designation: '',
      roleId: '',
      password: 'Corp@2026',
    },
  });

  /******* EFFECTS *******/
  useEffect(() => {
    dispatch(fetchUsersStart({ q, pageSize: 50 }));
  }, [q, dispatch]);

  useEffect(() => {
    dispatch(fetchRolesStart());
    dispatch(fetchDepartmentsStart());
  }, [dispatch]);

  /******* HANDLERS *******/
  const resetCreate = useCallback(() => dispatch(createUserResponseResetStart()), [dispatch]);
  useReduxResponse(createResponse, resetCreate, () => {
    celebrate('User created', 'They can sign in with the password you set.');
    setOpen(false);
    reset();
    dispatch(fetchUsersStart({ q, pageSize: 50 }));
  });

  /******* COLUMNS *******/
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
      <PageHeader
        title="Users"
        description="CLIENT_API_LIVE directory (SP_GET_USERS). TCS department = full access; all other departments = employee."
        actions={
          can('users.manage') ? (
            <PrimaryButton type="button" onClick={() => setOpen(true)}>
              <UserPlus className="h-4 w-4" />
              Add user
            </PrimaryButton>
          ) : null
        }
      />
      <Toolbar>
        <SearchField value={q} onChange={setQ} placeholder="Search by username or email" />
      </Toolbar>
      {isLoading ? (
        <Spinner />
      ) : !rows.length ? (
        <EmptyState title="No users found" hint="Adjust your search or add a new user." />
      ) : (
        <DataTable columns={columns} rows={rows} rowKey={(u) => u.Id} />
      )}
      <Modal open={open} title="New user" onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit((v) => dispatch(createUserStart(v)))}>
          <div className="grid gap-x-4 sm:grid-cols-2">
            <Labeled label="Employee ID">
              <input className={inputClass} {...register('employeeId')} />
            </Labeled>
            <Labeled label="Email">
              <input className={inputClass} {...register('email')} />
            </Labeled>
            <Labeled label="First name">
              <input className={inputClass} {...register('firstName')} />
            </Labeled>
            <Labeled label="Last name">
              <input className={inputClass} {...register('lastName')} />
            </Labeled>
            <Labeled label="Department">
              <select className={inputClass} {...register('departmentId')}>
                <option value="">—</option>
                {(departments ?? []).map((d) => (
                  <option key={d.Id} value={d.Id}>
                    {d.Name}
                  </option>
                ))}
              </select>
            </Labeled>
            <Labeled label="Role">
              <select className={inputClass} {...register('roleId')}>
                <option value="">—</option>
                {(roles ?? []).map((r) => (
                  <option key={r.Id} value={r.Id}>
                    {r.Name}
                  </option>
                ))}
              </select>
            </Labeled>
          </div>
          <Labeled label="Temporary password" hint="The user should change this after first sign-in.">
            <input className={inputClass} {...register('password')} />
          </Labeled>
          <PrimaryButton type="submit" disabled={creating}>
            Create user
          </PrimaryButton>
        </form>
      </Modal>
    </div>
  );
}
export default UsersPage;
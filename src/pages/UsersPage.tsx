// AUTHOR : NANDHAKUMAR S V
// DATE : 27/08/2026
// DESCRIPTION : Users page to view and manage users
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';
import { api, apiError, unwrap } from '../services/api';
import { celebrate } from '../components/ui/SuccessFx';
import type { Paged } from '../types/api';
import { EmptyState, PageHeader, Spinner, StatusBadge } from '../components/ui/Feedback';
import { Field as Labeled, inputClass, Modal, PrimaryButton } from '../components/ui/Form';
import { DataTable, SearchField, Toolbar, type Column } from '../components/ui/Surface';
import { useState } from 'react';
import { usePermission } from '../hooks/usePermission';

type UserRow = {
  Id: string;
  EmployeeId: string;
  FirstName: string;
  LastName: string;
  Email: string;
  DepartmentName: string | null;
  Designation: string | null;
  RoleName: string;
  RoleId: string;
  Status: string;
};

const schema = Yup.object({
  employeeId: Yup.string().required(),
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  email: Yup.string().email().required(),
  roleId: Yup.string().required(),
  password: Yup.string().min(8).required(),
});

function initials(first: string, last: string) {
  return `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase();
}

export function UsersPage() {
  const { can } = usePermission();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['users', q],
    queryFn: () => unwrap<Paged<UserRow>>(api.get('/users', { params: { q, pageSize: 50 } })),
  });
  const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: () => unwrap<{ Id: string; Name: string }[]>(api.get('/roles')),
  });
  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: () => unwrap<{ Id: string; Name: string }[]>(api.get('/departments')),
  });
  const create = useMutation({
    mutationFn: (body: object) => unwrap(api.post('/users', body)),
    onSuccess: () => {
      celebrate('User created', 'They can sign in with the password you set.');
      setOpen(false);
      void qc.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (e) => toast.error(apiError(e)),
  });

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
    { key: 'employee', header: 'Employee ID', render: (u) => u.EmployeeId },
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
        description="Accounts, roles, and access status."
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
        <SearchField value={q} onChange={setQ} placeholder="Search by name, email, or ID" />
      </Toolbar>
      {isLoading ? (
        <Spinner />
      ) : !rows.length ? (
        <EmptyState title="No users found" hint="Adjust your search or add a new user." />
      ) : (
        <DataTable columns={columns} rows={rows} rowKey={(u) => u.Id} />
      )}
      <Modal open={open} title="New user" onClose={() => setOpen(false)}>
        <Formik
          initialValues={{
            employeeId: '',
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            departmentId: '',
            designation: '',
            roleId: '',
            password: 'Corp@2026',
          }}
          validationSchema={schema}
          onSubmit={(v) => create.mutate(v)}
        >
          <Form>
            <div className="grid gap-x-4 sm:grid-cols-2">
              <Labeled label="Employee ID">
                <Field name="employeeId" className={inputClass} />
              </Labeled>
              <Labeled label="Email">
                <Field name="email" className={inputClass} />
              </Labeled>
              <Labeled label="First name">
                <Field name="firstName" className={inputClass} />
              </Labeled>
              <Labeled label="Last name">
                <Field name="lastName" className={inputClass} />
              </Labeled>
              <Labeled label="Department">
                <Field as="select" name="departmentId" className={inputClass}>
                  <option value="">—</option>
                  {(departments ?? []).map((d) => (
                    <option key={d.Id} value={d.Id}>
                      {d.Name}
                    </option>
                  ))}
                </Field>
              </Labeled>
              <Labeled label="Role">
                <Field as="select" name="roleId" className={inputClass}>
                  <option value="">—</option>
                  {(roles ?? []).map((r) => (
                    <option key={r.Id} value={r.Id}>
                      {r.Name}
                    </option>
                  ))}
                </Field>
              </Labeled>
            </div>
            <Labeled label="Temporary password" hint="The user should change this after first sign-in.">
              <Field name="password" className={inputClass} />
            </Labeled>
            <PrimaryButton type="submit" disabled={create.isPending}>
              Create user
            </PrimaryButton>
          </Form>
        </Formik>
      </Modal>
    </div>
  );
}

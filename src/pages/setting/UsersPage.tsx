// AUTHOR : NANDHAKUMAR S V
// DATE : 01/09/2026
// DESCRIPTION : Users page — offcanvas add / manage with full account controls
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { useForm, type UseFormRegister } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Pencil, Plus } from 'lucide-react';
import type { Paged } from '../../types/api';
import { celebrate } from '../../components/ui/SuccessFx';
import { EmptyState, Spinner, StatusBadge } from '../../components/ui/Feedback';
import { Field, GhostButton, inputClass, Offcanvas, PrimaryButton } from '../../components/ui/Form';
import { DataTable, SearchField, Toolbar, type Column } from '../../components/ui/Surface';
import { useAppDispatch, useAppSelector } from '../../store';
import { useAuth } from '../../hooks/useAuth';
import { isAdminRole } from '../../utils/roles';
import { fetchDepartmentsStart } from '../../redux/departments/departments.action';
import { selectDepartments } from '../../redux/departments/departments.selector';
import {
  createUserResponseResetStart,
  createUserStart,
  fetchUsersStart,
  updateUserResponseResetStart,
  updateUserStart,
} from '../../redux/users/users.action';
import {
  selectCreateUserLoading,
  selectCreateUserResponse,
  selectUpdateUserLoading,
  selectUpdateUserResponse,
  selectUsersLoading,
  selectUsersPage,
} from '../../redux/users/users.selector';
import { getUserCall } from '../../redux/users/users.services';
import { useReduxResponse } from '../../redux/_common/useReduxResponse';
import { Department } from '../../helpers/department/departmentValidation';
import {
  ADMIN_PERMISSIONS,
  EMPLOYEE_PERMISSIONS,
  emptyUserForm,
  formFromUser,
  permissionModules,
  permissionsForRole,
  ROLES,
  updateSchema,
  type UserForm,
  type UserRow,
  initials,
} from '../../helpers/setting/userValidation';

function asDepartments(value: unknown): Department[] {
  if (Array.isArray(value)) return value as Department[];
  if (value && typeof value === 'object' && Array.isArray((value as { items?: unknown }).items)) {
    return (value as { items: Department[] }).items;
  }
  return [];
}

function SecretField({
  label,
  hint,
  readOnly,
  register,
  name,
  value,
}: {
  label: string;
  hint?: string;
  readOnly?: boolean;
  register?: UseFormRegister<UserForm>;
  name?: 'password' | 'confirmPassword';
  value?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <Field label={label} hint={hint}>
      <div className="relative">
        <input
          className={`${inputClass} pr-11`}
          type={visible ? 'text' : 'password'}
          autoComplete={readOnly ? 'off' : 'new-password'}
          readOnly={readOnly}
          {...(readOnly ? { value: value ?? '' } : register && name ? register(name) : {})}
        />
        <button
          type="button"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-navy-800/40 transition hover:bg-mist hover:text-navy-900"
          onClick={() => setVisible((on) => !on)}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </Field>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-5 rounded-2xl border border-navy-800/8 bg-mist/25 p-4">
      <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-navy-800/50">{title}</h3>
      {children}
    </section>
  );
}

export function UsersPage() {
  const dispatch = useAppDispatch();
  const { user: actor } = useAuth();
  const admin = isAdminRole(actor?.roleCode);
  const [q, setQ] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [mode, setMode] = useState<'closed' | 'create' | 'edit'>('closed');
  const [editing, setEditing] = useState<UserRow | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [permissionSet, setPermissionSet] = useState<Set<string>>(() => new Set(EMPLOYEE_PERMISSIONS));

  const data = useAppSelector(selectUsersPage) as Paged<UserRow> | null;
  const isLoading = useAppSelector(selectUsersLoading);
  const creating = useAppSelector(selectCreateUserLoading);
  const updating = useAppSelector(selectUpdateUserLoading);
  const createResponse = useAppSelector(selectCreateUserResponse);
  const updateResponse = useAppSelector(selectUpdateUserResponse);
  const departments = asDepartments(useAppSelector(selectDepartments));

  const form = useForm<UserForm>({
    resolver: zodResolver(updateSchema),
    defaultValues: emptyUserForm(),
  });

  const roleId = form.watch('roleId');
  const departmentValue = form.watch('department');
  const modules = permissionModules(ADMIN_PERMISSIONS);

  useEffect(() => {
    dispatch(fetchUsersStart({ q, roleId: roleFilter || undefined, pageSize: 50 }));
  }, [q, roleFilter, dispatch]);

  useEffect(() => {
    dispatch(fetchDepartmentsStart({ all: true }));
  }, [dispatch]);

  useEffect(() => {
    if (mode === 'closed') return;
    const current = form.getValues('department');
    if (!current) return;
    const match = departments.find(
      (d) => d.Name === current || d.Code === current || String(d.Id) === current,
    );
    if (match && match.Name !== current) form.setValue('department', match.Name);
  }, [departments, form, mode]);

  const reload = useCallback(() => {
    dispatch(fetchUsersStart({ q, roleId: roleFilter || undefined, pageSize: 50 }));
  }, [dispatch, q, roleFilter]);

  const closePanel = useCallback(() => {
    setMode('closed');
    setEditing(null);
    setCurrentPassword('');
    form.reset(emptyUserForm());
    setPermissionSet(new Set(EMPLOYEE_PERMISSIONS));
  }, [form]);

  const resetCreate = useCallback(() => dispatch(createUserResponseResetStart()), [dispatch]);
  const resetUpdate = useCallback(() => dispatch(updateUserResponseResetStart()), [dispatch]);

  useReduxResponse(createResponse, resetCreate, () => {
    celebrate('User created');
    closePanel();
    reload();
  });
  useReduxResponse(updateResponse, resetUpdate, () => {
    celebrate('User updated');
    closePanel();
    reload();
  });

  const applyRole = (nextRole: UserForm['roleId']) => {
    form.setValue('roleId', nextRole, { shouldDirty: true });
    setPermissionSet(new Set(permissionsForRole(nextRole)));
  };

  const togglePermission = (code: string) => {
    const next = new Set(permissionSet);
    if (next.has(code)) next.delete(code);
    else next.add(code);
    setPermissionSet(next);
    const employeeCodes = new Set<string>(EMPLOYEE_PERMISSIONS);
    const adminOn = [...next].some((code) => !employeeCodes.has(code));
    form.setValue('roleId', adminOn ? 'ADMINISTRATOR' : 'EMPLOYEE', { shouldDirty: true });
  };

  const openCreate = () => {
    setEditing(null);
    setCurrentPassword('');
    form.reset(emptyUserForm());
    setPermissionSet(new Set(EMPLOYEE_PERMISSIONS));
    setMode('create');
  };

  const openEdit = async (user: UserRow) => {
    const nextRole = user.RoleId === 'ADMINISTRATOR' ? 'ADMINISTRATOR' : 'EMPLOYEE';
    setEditing(user);
    setCurrentPassword(user.CurrentPassword ?? '');
    form.reset(formFromUser(user));
    setPermissionSet(new Set(permissionsForRole(nextRole)));
    setMode('edit');
    try {
      const res = await getUserCall({ id: user.Id });
      const detail = (res.data?.data ?? res.data) as UserRow | undefined;
      if (!detail) return;
      setCurrentPassword(detail.CurrentPassword ?? '');
      const merged = {
        ...user,
        EmployeeId: detail.EmployeeId || user.EmployeeId,
        Email: detail.Email || user.Email,
        RoleId: detail.RoleId || user.RoleId,
        Status: detail.Status || user.Status,
        DepartmentName: detail.DepartmentName || user.DepartmentName,
      };
      const role = merged.RoleId === 'ADMINISTRATOR' ? 'ADMINISTRATOR' : 'EMPLOYEE';
      form.reset(formFromUser(merged));
      setPermissionSet(new Set(permissionsForRole(role)));
    } catch {
      /* keep list row if detail fetch fails */
    }
  };

  const onSubmit = (values: UserForm) => {
    if (mode === 'create' && !values.password) {
      form.setError('password', { type: 'manual', message: 'Password is required' });
      return;
    }
    const nextPassword = values.password?.trim() ?? '';
    const payload = {
      employeeId: values.employeeId,
      firstName: values.employeeId,
      lastName: '',
      email: values.email,
      department: values.department || null,
      designation: values.designation || undefined,
      roleId: values.roleId,
      status: values.status,
      password: nextPassword && nextPassword !== currentPassword ? nextPassword : undefined,
    };
    if (mode === 'create') {
      dispatch(createUserStart(payload));
      return;
    }
    if (!editing) return;
    dispatch(updateUserStart({ id: editing.Id, ...payload }));
  };

  const columns: Column<UserRow>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (u) => (
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-600">
            {initials(u.EmployeeId, '')}
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold text-navy-900">{u.EmployeeId}</p>
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
    {
      key: 'actions',
      header: 'Manage',
      align: 'right',
      render: (u) => (
        <GhostButton
          type="button"
          className="!px-3 !py-1.5"
          onClick={(e) => {
            e.stopPropagation();
            openEdit(u);
          }}
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </GhostButton>
      ),
    },
  ];

  const rows = data?.items ?? [];
  const saving = creating || updating;
  const selectedRole = ROLES.find((role) => role.id === roleId);
  const deptOptions = (() => {
    const list = departments.filter((d) => d?.Name);
    const names = new Set(list.map((d) => d.Name));
    const extras = [
      departmentValue,
      ...rows.map((row) => row.DepartmentName),
    ]
      .map((name) => String(name ?? '').trim())
      .filter((name) => name && !names.has(name) && !list.some((d) => d.Code === name || String(d.Id) === name));
    const uniqueExtras = [...new Set(extras)];
    return [
      ...uniqueExtras.map((name) => ({ Id: name, Code: name, Name: name, IsActive: true })),
      ...list,
    ];
  })();

  return (
    <div>
      <Toolbar>
        <SearchField value={q} onChange={setQ} placeholder="Search by username or email" />
        <select
          className={`${inputClass} sm:max-w-[12rem]`}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          aria-label="Filter by role"
        >
          <option value="">All roles</option>
          {ROLES.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
        <div className="ml-auto">
          <PrimaryButton type="button" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add user
          </PrimaryButton>
        </div>
      </Toolbar>
      {isLoading ? (
        <Spinner />
      ) : !rows.length ? (
        <EmptyState title="No users found" hint="Add a user, or adjust the search." />
      ) : (
        <DataTable columns={columns} rows={rows} rowKey={(u) => u.Id} onRowClick={openEdit} />
      )}

      <Offcanvas
        open={mode !== 'closed'}
        title={mode === 'edit' ? `Manage ${editing?.EmployeeId ?? 'user'}` : 'Add user'}
        subtitle="Account, department, role, status, password, and permissions."
        onClose={closePanel}
        footer={
          <div className="flex justify-end gap-2">
            <GhostButton type="button" onClick={closePanel}>
              Cancel
            </GhostButton>
            <PrimaryButton type="submit" form="user-manage-form" disabled={saving}>
              {saving ? 'Saving…' : mode === 'edit' ? 'Save changes' : 'Create user'}
            </PrimaryButton>
          </div>
        }
      >
        <form id="user-manage-form" onSubmit={form.handleSubmit(onSubmit)}>
          <Section title="Profile">
            <Field label="Username" hint={form.formState.errors.employeeId?.message}>
              <input
                className={inputClass}
                autoComplete="off"
                disabled={mode === 'edit' && !admin}
                {...form.register('employeeId')}
              />
            </Field>
            <Field label="Email" hint={form.formState.errors.email?.message}>
              <input className={inputClass} type="email" autoComplete="off" {...form.register('email')} />
            </Field>
          </Section>

          <Section title="Organisation">
            <Field label="Department" hint={form.formState.errors.department?.message}>
              <select className={inputClass} {...form.register('department')}>
                <option value="">Select department</option>
                {deptOptions.map((dept) => (
                  <option key={dept.Id} value={dept.Name}>
                    {dept.Name}
                    {dept.Code && dept.Code !== dept.Name ? ` (${dept.Code})` : ''}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Designation">
              <input className={inputClass} {...form.register('designation')} />
            </Field>
          </Section>

          <Section title="Role & access">
            <Field label="Role" hint={selectedRole?.hint}>
              <select
                className={inputClass}
                value={roleId}
                onChange={(e) => applyRole(e.target.value as UserForm['roleId'])}
              >
                {ROLES.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <select className={inputClass} {...form.register('status')}>
                <option value="ACTIVE">Active</option>
                <option value="DISABLED">Disabled</option>
              </select>
            </Field>
            <div className="space-y-3">
              <p className="text-xs font-semibold text-navy-800/55">
                Permissions for {selectedRole?.name ?? 'this role'}
              </p>
              {modules.map(([module, codes]) => (
                <div key={module}>
                  <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-navy-800/40">{module}</p>
                  <div className="grid gap-1.5 sm:grid-cols-2">
                    {codes.map((code) => {
                      const on = permissionSet.has(code);
                      return (
                        <label
                          key={code}
                          className={`flex cursor-pointer items-center gap-2 rounded-xl border px-2.5 py-2 text-xs ${
                            on
                              ? 'border-brand-400/35 bg-brand-50 text-navy-900'
                              : 'border-navy-800/8 bg-white/70 text-navy-800/45'
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="accent-brand-500"
                            checked={on}
                            onChange={() => togglePermission(code)}
                          />
                          <span className="truncate">{code}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Password">
            {mode === 'edit' ? (
              <SecretField
                label="Current password"
                readOnly
                value={currentPassword}
                hint={
                  currentPassword
                    ? 'Visible to administrators. Use New password below to change it.'
                    : 'This password is stored as a hash. Save a new password to keep a visible copy.'
                }
              />
            ) : null}
            <SecretField
              label={mode === 'edit' ? 'New password' : 'Password'}
              hint={
                form.formState.errors.password?.message ??
                (mode === 'edit' ? 'Leave blank to keep the current password.' : undefined)
              }
              register={form.register}
              name="password"
            />
            <SecretField
              label="Confirm password"
              hint={form.formState.errors.confirmPassword?.message}
              register={form.register}
              name="confirmPassword"
            />
          </Section>
        </form>
      </Offcanvas>
    </div>
  );
}
export default UsersPage;

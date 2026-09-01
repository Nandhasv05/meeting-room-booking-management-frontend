import z from "zod";

// AUTHOR : NANDHAKUMR S V
export type UserRow = {
    Id: string;
    EmployeeId: string;
    FirstName: string;
    LastName: string;
    Email: string;
    Phone: string | null;
    DepartmentName: string | null;
    Designation: string | null;
    RoleName: string;
    RoleId: string;
    Status: string;
    CurrentPassword?: string;
  };

export const ROLES = [
  { id: 'EMPLOYEE', name: 'Employee', hint: 'Book halls, calendar, and notifications.' },
  { id: 'ADMINISTRATOR', name: 'Administrator', hint: 'Full hall, user, role, and settings access.' },
] as const;

export const EMPLOYEE_PERMISSIONS = [
  'dashboard.view',
  'halls.view',
  'bookings.view',
  'bookings.create',
  'bookings.update',
  'bookings.cancel',
  'calendar.view',
  'events.view',
  'attendees.view',
  'checkin.perform',
  'notifications.view',
  'display.view',
] as const;

export const ADMIN_PERMISSIONS = [
  ...EMPLOYEE_PERMISSIONS,
  'halls.create',
  'halls.update',
  'halls.delete',
  'halls.manage_facilities',
  'bookings.view_all',
  'bookings.approve',
  'events.manage',
  'attendees.manage',
  'reports.view',
  'reports.export',
  'users.view',
  'users.manage',
  'roles.manage',
  'departments.manage',
  'settings.manage',
  'audit.view',
  'maintenance.view',
  'maintenance.manage',
] as const;

export function permissionsForRole(roleId: string): readonly string[] {
  return roleId === 'ADMINISTRATOR' ? ADMIN_PERMISSIONS : EMPLOYEE_PERMISSIONS;
}

export function permissionModules(codes: readonly string[]) {
  const groups = new Map<string, string[]>();
  for (const code of codes) {
    const module = code.split('.')[0] ?? code;
    const list = groups.get(module) ?? [];
    list.push(code);
    groups.set(module, list);
  }
  return [...groups.entries()];
}

const passwordRule = z.string().min(8, 'Min 8 characters');

export const userFormSchema = z.object({
    employeeId: z.string().min(2, 'Username is required'),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email('Enter a valid email'),
    phone: z.string().optional(),
    department: z.string().optional(),
    designation: z.string().optional(),
    roleId: z.enum(['ADMINISTRATOR', 'EMPLOYEE']),
    status: z.enum(['ACTIVE', 'DISABLED']),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  }).superRefine((value, ctx) => {
    if (value.password) {
      if (value.password.length < 8) {
        ctx.addIssue({ code: 'custom', message: 'Min 8 characters', path: ['password'] });
      }
      if (value.password !== (value.confirmPassword ?? '')) {
        ctx.addIssue({ code: 'custom', message: 'Passwords do not match', path: ['confirmPassword'] });
      }
    }
  });

export const createSchema = userFormSchema.superRefine((value, ctx) => {
  if (!value.password) {
    ctx.addIssue({ code: 'custom', message: 'Password is required', path: ['password'] });
  }
});

export const updateSchema = userFormSchema;

export type UserForm = z.infer<typeof userFormSchema>;
export type CreateForm = UserForm;
export type UpdateForm = UserForm;

export const emptyUserForm = (): UserForm => ({
  employeeId: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  department: '',
  designation: '',
  roleId: 'EMPLOYEE',
  status: 'ACTIVE',
  password: '',
  confirmPassword: '',
});

export function formFromUser(user: UserRow): UserForm {
  return {
    employeeId: user.EmployeeId,
    firstName: user.FirstName ?? '',
    lastName: user.LastName ?? '',
    email: user.Email,
    phone: user.Phone ?? '',
    department: user.DepartmentName ?? '',
    designation: user.Designation ?? '',
    roleId: user.RoleId === 'ADMINISTRATOR' ? 'ADMINISTRATOR' : 'EMPLOYEE',
    status: user.Status === 'DISABLED' || user.Status === 'LOCKED' ? 'DISABLED' : 'ACTIVE',
    password: '',
    confirmPassword: '',
  };
}

export function initials(first: string, last: string) {
  return `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase() || '?';
}

export { passwordRule };

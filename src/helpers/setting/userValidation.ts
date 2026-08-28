import z from "zod";

// AUTHOR : NANDHAKUMR S V
export type UserRow = {
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
  
export const schema = z.object({
    employeeId: z.string().min(1, 'Required'),
    firstName: z.string().min(1, 'Required'),
    lastName: z.string().min(1, 'Required'),
    email: z.string().email('Enter a valid email'),
    phone: z.string().optional(),
    departmentId: z.string().optional(),
    designation: z.string().optional(),
    roleId: z.string().min(1, 'Required'),
    password: z.string().min(8, 'Min 8 characters'),
  });
  
  export type FormData = z.infer<typeof schema>;
  
  export function initials(first: string, last: string) {
    return `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase();
  }
// AUTHOR : NANDNHAKUMAR SV 
// DATE : 28/08/2026
// DESCRIPTION : Login validation schema
import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().min(1, 'Email or username is required'),
    password: z.string().min(1, 'Password is required'),
  });
  
export type LoginFormData = z.infer<typeof loginSchema>;
  
export const TEST_USERS = [
    { label: 'Admin', email: 'admin@evoloclothing.com' },
    { label: 'Manager', email: 'manager@evlovcolthing.com' },
    { label: 'Nandhakumar', email: 'nandhakumar@evolvclothing.com' },
  ] as const;
  
export const TEST_PASSWORD = 'password#1';

// LOGIN FIELD
export const loginField =
'w-full rounded-xl border border-navy-800/10 bg-white px-3 py-2 text-sm text-ink outline-none transition placeholder:text-navy-800/30 focus:border-brand-400 focus:ring-4 focus:ring-brand-400/10 disabled:bg-mist/50 disabled:text-navy-800/50';
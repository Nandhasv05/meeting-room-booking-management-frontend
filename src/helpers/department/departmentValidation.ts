// AUTHOR : NANDNHAKUMAR SV 
// DATE : 27/08/2026
// DESCRIPTION : Department validation helpers
import { z } from "zod";

export type Department = { Id: string; Code: string; Name: string; IsActive: boolean };

/******* SCHEMA *******/
export const schema = z.object({
  code: z.string().min(1, 'Code is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

/******* FORM DATA *******/
export type FormData = z.infer<typeof schema>;

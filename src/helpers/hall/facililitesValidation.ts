// AUTHOR : NANDNHAKUMAR SV 
// DATE : 28/08/2026
// DESCRIPTION : Validation schema for facilities and halls
import { z } from "zod";

/******* TYPES *******/
export type Fac = { Id: string; Code: string; Name: string; IsActive: boolean };

export const schema = z.object({
  code: z.string().min(1, 'Code is required'),
  name: z.string().min(1, 'Name is required'),
});

export type FormData = z.infer<typeof schema>;

export const hallSchema = z
  .object({
    name: z.string().min(1, 'Hall name is required'),
    code: z.string().min(1, 'Hall code is required'),
    description: z.string().optional(),
    location: z.string().optional(),
    building: z.string().optional(),
    floor: z.string().optional(),
    capacity: z.coerce.number().positive('Capacity must be at least 1'),
    hallType: z.string().min(1),
    openingTime: z.string().min(1, 'Opening time is required'),
    closingTime: z.string().min(1, 'Closing time is required'),
    facilityIds: z.array(z.string()),
    layouts: z.array(z.object({ name: z.string(), capacity: z.number(), isDefault: z.boolean() })),
  })
  .refine((v) => !v.openingTime || !v.closingTime || v.closingTime > v.openingTime, {
    message: 'Closing must be after opening',
    path: ['closingTime'],
  });

export const hallField =
  'w-full rounded-xl border border-navy-800/10 bg-white px-3 py-2 text-sm text-ink outline-none transition placeholder:text-navy-800/30 focus:border-brand-400 focus:ring-4 focus:ring-brand-400/10 disabled:bg-mist/50 disabled:text-navy-800/50';

export type HallInput = z.input<typeof hallSchema>;
export type HallValues = z.output<typeof hallSchema>;

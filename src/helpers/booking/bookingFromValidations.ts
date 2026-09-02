import { z } from 'zod';
import type { PickedEmployee } from '../../components/booking/EmployeePicker';

export type Values = {
  name: string;
  eventType: string;
  departmentId: string;
  mailId: string;
  hallId: string;
  hallAttendance: number;
  employees: PickedEmployee[];
  extraEmails: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
};

function localSlot(date: string, time: string): Date {
  const clock = /^\d{2}:\d{2}$/.test(time) ? `${time}:00` : time;
  return new Date(`${date}T${clock}`);
}

export const MAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z0-9]{2,}/gi;
export const MAIL_EXACT = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z0-9]{2,}$/i;

export function cleanMailText(value: string | null | undefined): string {
  return String(value ?? '')
    .normalize('NFKC')
    .replace(/[\u200B-\u200D\uFEFF\u00AD]/g, '')
    .replace(/\uFF20/g, '@')
    .trim();
}

export function isMailId(value: string | null | undefined): boolean {
  return MAIL_EXACT.test(cleanMailText(value).toLowerCase());
}

export const schema: z.ZodType<Values> = z
  .object({
    name: z.string().min(1, 'Title is required'),
    eventType: z.string().min(1),
    departmentId: z.string().min(1, 'Department is required'),
    mailId: z
      .string()
      .min(1, 'Organizer mail ID is required')
      .refine((value) => isMailId(value), 'Enter a valid mail ID'),
    hallId: z.string().min(1, 'Conference hall is required'),
    hallAttendance: z.coerce.number().positive('Must be at least 1'),
    employees: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        email: z.string().optional().default(''),
      }),
    ),
    extraEmails: z.string(),
    date: z.string().min(1),
    startTime: z.string().min(1),
    endTime: z.string().min(1),
    purpose: z.string().min(1, 'Purpose is required'),
  })
  .refine(
    (v) => {
      if (!v.date || !v.startTime || !v.endTime) return true;
      return localSlot(v.date, v.endTime) > localSlot(v.date, v.startTime);
    },
    { message: 'End time must be after start time', path: ['endTime'] },
  )
  .refine(
    (v) => {
      if (!v.date || !v.startTime) return true;
      return localSlot(v.date, v.startTime).getTime() >= Date.now() - 60_000;
    },
    { message: 'Choose a start time in the future (not earlier today).', path: ['startTime'] },
  );

export function pad2(n: number) {
  return String(n).padStart(2, '0');
}

export function toLocalDate(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

/** Next full hour (at least ~1h ahead). Rolls to tomorrow 10:00 if after hall hours. */
export function defaultDateTime() {
  const now = new Date();
  const start = new Date(now);
  start.setMinutes(0, 0, 0);
  start.setHours(start.getHours() + 1);
  if (start.getTime() <= now.getTime() + 5 * 60 * 1000) {
    start.setHours(start.getHours() + 1);
  }
  if (start.getHours() >= 20) {
    start.setDate(start.getDate() + 1);
    start.setHours(10, 0, 0, 0);
  }
  if (start.getHours() < 8) {
    start.setHours(10, 0, 0, 0);
  }
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  return {
    date: toLocalDate(start),
    startTime: `${pad2(start.getHours())}:${pad2(start.getMinutes())}`,
    endTime: `${pad2(end.getHours())}:${pad2(end.getMinutes())}`,
  };
}

export const defaults = defaultDateTime();

/** Pull real addresses out of a paste (commas, names, <brackets>, hidden characters). */
export function parseEmails(raw: string): string[] {
  const cleaned = cleanMailText(raw).toLowerCase();
  const found = cleaned.match(MAIL_RE) ?? [];
  return [...new Set(found)];
}

export function slotIso(date: string, time: string): string | undefined {
  if (!date || !time) return undefined;
  const d = localSlot(date, time);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

export function durationLabel(startAt?: string, endAt?: string) {
  if (!startAt || !endAt) return '—';
  const mins = Math.round((new Date(endAt).getTime() - new Date(startAt).getTime()) / 60000);
  if (mins <= 0) return '—';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h ? `${h}h` : ''}${h && m ? ' ' : ''}${m ? `${m}m` : ''}` || '0m';
}

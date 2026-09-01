// AUTHOR : NANDNHAKUMAR SV
// DATE : 28/08/2026
// DESCRIPTION : Setting validation schema
import { differenceInMinutes, isToday, isYesterday } from 'date-fns';
import { z } from 'zod';
import { fmtDateTime, parseAppDate } from '@/utils/format';

/******* TYPES *******/
export type Maint = {
  Id: string;
  HallId?: string;
  HallName: string;
  HallCode?: string;
  Title: string;
  Description?: string | null;
  StartAt: string;
  EndAt: string;
  Status: string;
};

export type MaintPhase = 'active' | 'upcoming' | 'past';

export function maintenancePhase(m: Maint): MaintPhase {
  const start = parseAppDate(m.StartAt);
  const end = parseAppDate(m.EndAt);
  const now = new Date();
  const closed = m.Status === 'COMPLETED' || m.Status === 'CANCELLED';
  if (closed || Number.isNaN(end.getTime()) || end.getTime() <= now.getTime()) return 'past';
  if (m.Status === 'ONGOING' || m.Status === 'ACTIVE' || (start.getTime() <= now.getTime() && end.getTime() > now.getTime())) {
    return 'active';
  }
  return 'upcoming';
}

export function maintenanceDuration(startAt: string, endAt: string) {
  const mins = Math.max(0, differenceInMinutes(parseAppDate(endAt), parseAppDate(startAt)));
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const rest = mins % 60;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
}

/******* SCHEMA *******/
export const schema = z.object({
  hallId: z.string().min(1, 'Hall is required'),
  title: z.string().min(1, 'Title is required'),
  startAt: z.string().min(1, 'Start is required'),
  endAt: z.string().min(1, 'End is required'),
  description: z.string().optional(),
});

export type FormData = z.infer<typeof schema>;

export type N = {
  Id: string;
  Title: string;
  Message: string;
  IsRead: boolean;
  CreatedAt: string;
  Type: string;
  RelatedModule: string | null;
  RelatedId: string | null;
};

export const FILTERS = [
  ['all', 'All'],
  ['unread', 'Unread'],
  ['bookings', 'Bookings'],
  ['events', 'Events'],
] as const;

export type Filter = (typeof FILTERS)[number][0];

/******* HELPERS *******/
export function tone(type: string) {
  if (type.includes('CANCEL') || type.includes('REJECT')) return 'rose';
  if (type.includes('START') || type === 'ONGOING') return 'live';
  if (type.includes('COMPLETE') || type.includes('APPROV')) return 'signal';
  if (type.includes('REMIND')) return 'amber';
  return 'brand';
}

export function iconClass(kind: string, unread: boolean) {
  const base = unread ? '' : 'opacity-70 ';
  if (kind === 'rose') return `${base}bg-rose-50 text-rose-700`;
  if (kind === 'live') return `${base}bg-brand-100 text-brand-600`;
  if (kind === 'signal') return `${base}bg-signal/12 text-signal`;
  if (kind === 'amber') return `${base}bg-amber-50 text-amber-800`;
  return `${base}bg-brand-50 text-brand-600`;
}

export function dayLabel(iso: string) {
  const d = parseAppDate(iso);
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return fmtDateTime(iso).split(' · ')[0] ?? 'Earlier';
}

export function groupByDay(items: N[]) {
  const map = new Map<string, N[]>();
  for (const n of items) {
    const key = dayLabel(n.CreatedAt);
    const list = map.get(key) ?? [];
    list.push(n);
    map.set(key, list);
  }
  return [...map.entries()];
}

export function matches(n: N, filter: Filter) {
  if (filter === 'unread') return !n.IsRead;
  if (filter === 'bookings') return n.Type.startsWith('BOOKING');
  if (filter === 'events') return n.Type.startsWith('EVENT') || n.Type.includes('REMIND');
  return true;
}
export const MAIL_KEYS = ['smtp.host', 'smtp.port', 'smtp.user', 'smtp.password', 'smtp.from'] as const;

export const PASSWORD_UNCHANGED = '********';


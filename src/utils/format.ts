import { format, parseISO } from 'date-fns';

export function parseAppDate(value: string | Date): Date {
  if (value instanceof Date) return value;
  const iso = parseISO(value);
  if (!Number.isNaN(iso.getTime())) return iso;
  const fallback = new Date(value);
  return Number.isNaN(fallback.getTime()) ? new Date(NaN) : fallback;
}

export function fmtTime(value: string | Date) {
  const d = parseAppDate(value);
  if (Number.isNaN(d.getTime())) return '—';
  return format(d, 'hh:mm a');
}

export function fmtDate(value: string | Date) {
  const d = parseAppDate(value);
  if (Number.isNaN(d.getTime())) return '—';
  return format(d, 'dd MMM yyyy');
}

export function fmtDateTime(value: string | Date) {
  return `${fmtDate(value)} · ${fmtTime(value)}`;
}

export function labelize(value: string) {
  return value.replaceAll('_', ' ');
}

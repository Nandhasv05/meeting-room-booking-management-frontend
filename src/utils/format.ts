import { format, parseISO } from 'date-fns';

export function fmtTime(value: string | Date) {
  const d = typeof value === 'string' ? parseISO(value) : value;
  return format(d, 'hh:mm a');
}

export function fmtDate(value: string | Date) {
  const d = typeof value === 'string' ? parseISO(value) : value;
  return format(d, 'dd MMM yyyy');
}

export function fmtDateTime(value: string | Date) {
  return `${fmtDate(value)} · ${fmtTime(value)}`;
}

export function labelize(value: string) {
  return value.replaceAll('_', ' ');
}

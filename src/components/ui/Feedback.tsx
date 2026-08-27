import type { ReactNode } from 'react';
import { LogoSpinner } from '../brand/LogoSpinner';

const tones: Record<string, string> = {
  AVAILABLE: 'bg-signal/12 text-signal ring-signal/20',
  BOOKED: 'bg-navy-700/8 text-navy-700 ring-navy-700/15',
  OCCUPIED: 'bg-brand-100 text-brand-600 ring-brand-400/20',
  MAINTENANCE: 'bg-stone-200 text-navy-700 ring-navy-800/10',
  BLOCKED: 'bg-rose-100 text-rose-800 ring-rose-300/40',
  PENDING: 'bg-amber-100 text-amber-900 ring-amber-300/40',
  APPROVED: 'bg-sky-100 text-sky-900 ring-sky-300/40',
  CONFIRMED: 'bg-signal/12 text-signal ring-signal/20',
  ONGOING: 'bg-brand-100 text-brand-600 ring-brand-400/20',
  UPCOMING: 'bg-brand-50 text-brand-600 ring-brand-400/20',
  COMPLETED: 'bg-stone-100 text-navy-700 ring-navy-800/10',
  CANCELLED: 'bg-rose-50 text-rose-700 ring-rose-200/60',
  REJECTED: 'bg-rose-100 text-rose-800 ring-rose-300/40',
  DRAFT: 'bg-stone-100 text-navy-700 ring-navy-800/10',
  ACTIVE: 'bg-signal/12 text-signal ring-signal/20',
  DISABLED: 'bg-stone-200 text-navy-700 ring-navy-800/10',
};

export function StatusBadge({ value }: { value: string }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ring-1 ring-inset ${
        tones[value] ?? 'bg-stone-100 text-navy-700 ring-navy-800/10'
      }`}
    >
      {value.replaceAll('_', ' ')}
    </span>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3 animate-rise sm:mb-6">
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-bold tracking-tight text-navy-900 sm:text-[1.75rem]">{title}</h1>
        {description ? <p className="mt-1.5 max-w-2xl text-sm text-navy-800/60">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-navy-800/18 bg-white/50 px-6 py-14 text-center">
      <p className="font-display text-base font-semibold text-navy-900 sm:text-lg">{title}</p>
      {hint ? <p className="mt-1.5 text-sm text-navy-800/55">{hint}</p> : null}
    </div>
  );
}

export function Spinner({ label = 'Loading…' }: { label?: string }) {
  return <LogoSpinner label={label} size="lg" />;
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-3.5 text-sm font-medium text-rose-800">
      {message}
    </div>
  );
}

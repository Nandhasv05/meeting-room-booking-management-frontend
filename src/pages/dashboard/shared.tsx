import { Link } from 'react-router-dom';
import { CalendarClock, DoorOpen } from 'lucide-react';
import type { ReactNode } from 'react';
import { fmtDate } from '../../utils/format';
import { useAppSelector } from '../../store';
import { usePermission } from '../../hooks/usePermission';

export type Dash = {
  stats: Record<string, number>;
  utilization: { HallName: string; HoursBooked: number }[];
  byDepartment: { Department: string; Count: number }[];
  byEventType: { EventType: string; Count: number }[];
  trend: { Period: string; Count: number }[];
  peakHours: { Hour: number; Count: number }[];
  todaySchedule: {
    Id: string;
    EventName: string;
    StartAt: string;
    EndAt: string;
    Status: string;
    HallName: string;
    OrganizerName: string;
  }[];
  upcoming: { Id: string; EventName: string; StartAt: string; HallName: string }[];
  recent: { Id: string; EventName: string; CreatedAt: string; Status: string; HallName: string }[];
  usersByRole: { RoleName: string; RoleCode: string; Count: number }[];
  hallBoard: {
    Id: string;
    Name: string;
    Code: string;
    Status: string;
    Capacity: number;
    CurrentEvent: string | null;
  }[];
};

export function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function PulseStat({
  icon: Icon,
  label,
  value,
  accent,
  warn,
}: {
  icon: typeof DoorOpen;
  label: string;
  value?: number;
  accent?: boolean;
  warn?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border px-3.5 py-3.5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-panel ${
        warn
          ? 'border-amber-300/50 bg-amber-50/80'
          : accent
            ? 'border-brand-400/30 bg-brand-50/80'
            : 'border-navy-800/10 bg-white/85'
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <Icon size={14} className={warn ? 'text-amber-700' : accent ? 'text-brand-400' : 'text-navy-800/40'} />
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-navy-800/45">{label}</span>
      </div>
      <p className="font-display text-2xl font-bold tabular-nums text-navy-900">{value ?? 0}</p>
    </div>
  );
}

export function WelcomeBand({
  kicker,
  subtitle,
  children,
}: {
  kicker: string;
  subtitle: string;
  children?: ReactNode;
}) {
  const user = useAppSelector((s) => s.auth.user);
  const { can } = usePermission();
  return (
    <section className="relative overflow-hidden rounded-3xl border border-navy-800/10 bg-navy-950 text-white shadow-lift animate-rise">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 60% 80% at 90% 20%, rgba(47,122,78,0.45), transparent 55%), linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.04) 100%)',
        }}
      />
      <div className="relative flex flex-col gap-4 p-4 sm:flex-row sm:items-end sm:justify-between sm:p-5 md:p-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
            {kicker} · {fmtDate(new Date())}
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {greeting()}, {user?.firstName ?? 'there'}
          </h2>
          <p className="mt-1.5 max-w-lg text-sm text-white/60">{subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {can('bookings.create') ? (
            <Link
              to="/bookings/new"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-400 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-signal"
            >
              New booking
            </Link>
          ) : null}
          {can('calendar.view') ? (
            <Link
              to="/calendar"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-sm font-medium text-white/90 transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              <CalendarClock size={16} /> Calendar
            </Link>
          ) : null}
          {children}
        </div>
      </div>
    </section>
  );
}

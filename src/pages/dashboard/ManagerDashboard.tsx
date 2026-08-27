import { Link } from 'react-router-dom';
import { ArrowRight, CalendarClock, DoorOpen, Monitor, Users, Wrench } from 'lucide-react';
import { EmptyState, StatusBadge } from '../../components/ui/Feedback';
import { fmtDate, fmtTime } from '../../utils/format';
import { PulseStat, WelcomeBand, type Dash } from './shared';

function hallTone(status: string, occupied: boolean) {
  if (status === 'MAINTENANCE' || status === 'BLOCKED') return 'border-amber-300/50 bg-amber-50';
  if (occupied || status === 'OCCUPIED' || status === 'BOOKED') return 'border-brand-400/30 bg-brand-50';
  return 'border-signal/25 bg-signal/[0.07]';
}

export function ManagerDashboard({ data }: { data: Dash }) {
  const s = data.stats;
  const maxUtil = Math.max(...data.utilization.map((u) => Number(u.HoursBooked) || 0), 1);
  const maxPeak = Math.max(...data.peakHours.map((p) => Number(p.Count) || 0), 1);
  const occupiedNow = (data.hallBoard ?? []).filter((h) => h.CurrentEvent).length;

  return (
    <div className="space-y-4 sm:space-y-5">
      <WelcomeBand
        kicker="Hall manager"
        subtitle={`${occupiedNow} room${occupiedNow === 1 ? '' : 's'} in use · ${s.AvailableHalls ?? 0} free · ${s.TodayBookings ?? 0} on today’s board`}
      />

      <section className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 stagger">
        <PulseStat icon={DoorOpen} label="Halls" value={s.TotalHalls} />
        <PulseStat icon={DoorOpen} label="Free" value={s.AvailableHalls} accent />
        <PulseStat icon={Users} label="In use" value={occupiedNow || s.OccupiedHalls} />
        <PulseStat icon={CalendarClock} label="Today" value={s.TodayBookings} />
        <PulseStat icon={CalendarClock} label="Upcoming" value={s.UpcomingEvents} />
        <PulseStat icon={Wrench} label="Maintenance" value={s.MaintenanceHalls} warn={(s.MaintenanceHalls ?? 0) > 0} />
      </section>

      <section className="rounded-2xl border border-navy-800/10 bg-white/85 p-4 shadow-panel sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold text-navy-900">Live rooms</h3>
          <Link to="/displays" className="text-xs font-semibold text-brand-400 hover:underline">
            Open TV boards
          </Link>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {(data.hallBoard ?? []).map((hall) => {
            const busy = Boolean(hall.CurrentEvent);
            return (
              <li key={hall.Id}>
                <Link
                  to={`/halls/${hall.Id}`}
                  className={`block rounded-2xl border px-3.5 py-3 transition hover:-translate-y-0.5 hover:shadow-soft ${hallTone(hall.Status, busy)}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-navy-900">{hall.Name}</p>
                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-navy-800/45">{hall.Code}</span>
                  </div>
                  <p className="mt-1 truncate text-sm text-navy-800/60">
                    {busy ? hall.CurrentEvent : hall.Status === 'MAINTENANCE' ? 'Under maintenance' : 'Available now'}
                  </p>
                  <p className="mt-1 text-xs text-navy-800/40">{hall.Capacity} seats</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.85fr]">
        <section className="overflow-hidden rounded-2xl border border-navy-800/10 bg-white/85 shadow-panel animate-rise">
          <div className="flex items-center justify-between border-b border-navy-800/8 px-4 py-3.5">
            <h3 className="font-display text-base font-semibold text-navy-900">Today’s timeline</h3>
            <Link to="/bookings" className="text-xs font-semibold text-brand-400 hover:underline">
              All bookings
            </Link>
          </div>
          {data.todaySchedule.length === 0 ? (
            <div className="p-4">
              <EmptyState title="Quiet day" hint="No events scheduled for today." />
            </div>
          ) : (
            <ol className="relative px-4 py-3">
              {data.todaySchedule.map((row, i) => (
                <li key={row.Id} className="relative flex gap-3 pb-5 last:pb-2">
                  {i < data.todaySchedule.length - 1 ? (
                    <span className="absolute left-[11px] top-6 bottom-0 w-px bg-navy-800/10" />
                  ) : null}
                  <span className="relative z-[1] mt-1.5 h-[10px] w-[10px] shrink-0 rounded-full bg-brand-400 ring-4 ring-brand-50" />
                  <div className="min-w-0 flex-1 rounded-xl border border-navy-800/8 bg-stone-50/80 px-3.5 py-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link to={`/bookings/${row.Id}`} className="font-semibold text-navy-900 hover:text-brand-400">
                          {row.EventName}
                        </Link>
                        <p className="mt-0.5 text-xs text-navy-800/55">
                          {row.HallName} · {row.OrganizerName}
                        </p>
                      </div>
                      <StatusBadge value={row.Status} />
                    </div>
                    <p className="mt-2 text-xs font-semibold tabular-nums text-navy-800/75">
                      {fmtTime(row.StartAt)} – {fmtTime(row.EndAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>

        <div className="flex flex-col gap-4">
          <section className="flex-1 overflow-hidden rounded-2xl border border-navy-800/10 bg-white/85 shadow-panel">
            <div className="border-b border-navy-800/8 px-4 py-3.5">
              <h3 className="font-display text-base font-semibold text-navy-900">Up next</h3>
            </div>
            {data.upcoming.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-navy-800/50">No upcoming bookings.</p>
            ) : (
              <ul className="divide-y divide-navy-800/10">
                {data.upcoming.slice(0, 6).map((row) => (
                  <li key={row.Id}>
                    <Link to={`/bookings/${row.Id}`} className="flex items-center gap-3 px-4 py-3 transition hover:bg-brand-50/60">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-950 text-center">
                        <span className="text-[10px] font-bold uppercase leading-none text-white/50">
                          {fmtDate(row.StartAt).split(' ')[1]}
                        </span>
                        <span className="font-display text-sm font-bold leading-none text-white">
                          {fmtDate(row.StartAt).split(' ')[0]}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-navy-900">{row.EventName}</p>
                        <p className="truncate text-xs text-navy-800/55">
                          {row.HallName} · {fmtTime(row.StartAt)}
                        </p>
                      </div>
                      <ArrowRight size={14} className="shrink-0 text-navy-800/30" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="rounded-2xl border border-navy-800/10 bg-white/85 p-4 shadow-panel">
            <h3 className="mb-3 font-display text-sm font-semibold text-navy-900">Operations</h3>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/halls"
                className="rounded-xl border border-navy-800/10 bg-mist/50 px-3 py-2 text-sm font-medium text-navy-800 hover:bg-brand-50"
              >
                Halls
              </Link>
              <Link
                to="/displays"
                className="inline-flex items-center gap-1.5 rounded-xl border border-navy-800/10 bg-mist/50 px-3 py-2 text-sm font-medium text-navy-800 hover:bg-brand-50"
              >
                <Monitor className="h-3.5 w-3.5" /> Displays
              </Link>
              <Link
                to="/admin/maintenance"
                className="rounded-xl border border-navy-800/10 bg-mist/50 px-3 py-2 text-sm font-medium text-navy-800 hover:bg-brand-50"
              >
                Maintenance
              </Link>
              <Link
                to="/reports"
                className="rounded-xl border border-navy-800/10 bg-mist/50 px-3 py-2 text-sm font-medium text-navy-800 hover:bg-brand-50"
              >
                Reports
              </Link>
            </div>
          </section>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-navy-800/10 bg-white/85 p-5 shadow-panel">
          <h3 className="mb-4 font-display text-base font-semibold text-navy-900">Hall hours (30 days)</h3>
          <ul className="space-y-3">
            {data.utilization.slice(0, 6).map((row) => {
              const pct = Math.round((Number(row.HoursBooked) / maxUtil) * 100);
              return (
                <li key={row.HallName}>
                  <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                    <span className="truncate font-medium text-navy-900">{row.HallName}</span>
                    <span className="shrink-0 tabular-nums text-navy-800/55">{Number(row.HoursBooked).toFixed(1)}h</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-stone-200">
                    <div className="h-full rounded-full bg-brand-400 transition-all duration-700" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
        <section className="rounded-2xl border border-navy-800/10 bg-white/85 p-5 shadow-panel">
          <h3 className="mb-3 font-display text-base font-semibold text-navy-900">Peak hours</h3>
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: 24 }, (_, hour) => {
              const row = data.peakHours.find((p) => Number(p.Hour) === hour);
              const count = Number(row?.Count ?? 0);
              const intensity = count / maxPeak;
              return (
                <div key={hour} title={`${hour}:00 — ${count} bookings`} className="flex h-12 w-7 flex-col justify-end sm:w-8">
                  <div
                    className="w-full rounded-md"
                    style={{
                      height: `${Math.max(12, intensity * 100)}%`,
                      backgroundColor: count ? `rgba(18, 35, 21, ${0.18 + intensity * 0.72})` : 'rgba(18, 35, 21, 0.06)',
                    }}
                  />
                  <span className="mt-1 text-center text-[9px] tabular-nums text-navy-800/40">{hour}</span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

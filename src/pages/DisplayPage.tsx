import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { api, unwrap } from '../services/api';
import type { DisplayPayload } from '../types/api';
import { useRealtime } from '../hooks/useRealtime';
import { fmtTime } from '../utils/format';
import { BrandLogo } from '../components/brand/BrandLogo';
import { LogoSpinner } from '../components/brand/LogoSpinner';

const skins: Record<DisplayPayload['state'], string> = {
  AVAILABLE: 'display-board--free',
  UPCOMING: 'display-board--soon',
  ONGOING: 'display-board--live',
  MAINTENANCE: 'display-board--down',
};

function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function clockParts(d: Date) {
  const h = d.getHours();
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return {
    time: `${pad(hour)}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,
    suffix,
    date: d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' }),
  };
}

function remaining(target: Date, now: Date) {
  const ms = target.getTime() - now.getTime();
  if (ms <= 0) return { label: '00:00:00', overdue: true };
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return { label: `${pad(h)}:${pad(m)}:${pad(s % 60)}`, overdue: false };
}

function progress(startIso: string, endIso: string, now: Date) {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  if (end <= start) return 0;
  return Math.min(100, Math.max(0, ((now.getTime() - start) / (end - start)) * 100));
}

export function DisplayPage() {
  const { hallCode } = useParams();
  const now = useNow();
  useRealtime([`hall:${hallCode}`], [['display', hallCode ?? '']]);
  const { data } = useQuery({
    queryKey: ['display', hallCode],
    queryFn: () => unwrap<DisplayPayload>(api.get(`/display/${hallCode}`)),
    refetchInterval: 15_000,
  });

  if (!data) {
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-navy-950">
        <LogoSpinner label="Connecting…" size="lg" light />
      </div>
    );
  }

  const booking = data.current ?? data.next;
  const clock = clockParts(now);
  const endAt = data.current ? new Date(data.current.EndAt) : null;
  const startAt = data.next && data.state !== 'ONGOING' ? new Date(data.next.StartAt) : null;
  const count = data.state === 'ONGOING' && endAt ? remaining(endAt, now) : startAt ? remaining(startAt, now) : null;
  const bar = data.current && data.state === 'ONGOING' ? progress(data.current.StartAt, data.current.EndAt, now) : 0;

  return (
    <div className={`display-board ${skins[data.state]}`}>
      <div className="display-board__grid" />
      <span className="display-board__orb display-board__orb--a" />
      <span className="display-board__orb display-board__orb--b" />
      <span className="display-board__scan" />

      <div className="relative z-10 flex min-h-[100dvh] flex-col px-6 py-6 sm:px-10 md:px-14 md:py-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="animate-rise">
            <BrandLogo variant="light" height={30} to={null} />
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/40">{data.hallCode}</p>
          </div>
          <div className="text-right animate-rise" style={{ animationDelay: '80ms' }}>
            <p className="font-display text-3xl font-bold tabular-nums tracking-tight sm:text-4xl md:text-5xl">
              {clock.time}
              <span className="ml-2 align-top text-sm font-semibold tracking-[0.2em] text-white/55 sm:text-base">
                {clock.suffix}
              </span>
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-white/45 sm:text-sm">{clock.date}</p>
          </div>
        </header>

        <main className="flex flex-1 flex-col justify-center gap-8 py-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div key={`${data.state}-${data.headline}`} className="min-w-0 flex-1 display-enter">
            <StatusChip state={data.state} />
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              {data.hallName}
            </h1>
            <p className="mt-3 font-display text-sm uppercase tracking-[0.28em] text-white/60 sm:text-lg md:text-xl">
              {data.subtitle}
            </p>
            <p className="mt-3 max-w-4xl font-display text-2xl font-semibold leading-tight sm:text-4xl md:text-5xl">
              {data.headline}
            </p>

            {count ? (
              <div className="mt-8 inline-flex items-end gap-4 rounded-2xl border border-white/15 bg-white/8 px-5 py-4 backdrop-blur-sm">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
                    {data.state === 'ONGOING' ? 'Ends in' : 'Starts in'}
                  </p>
                  <p className="mt-1 font-display text-4xl font-bold tabular-nums tracking-tight sm:text-5xl">
                    {count.label}
                  </p>
                </div>
              </div>
            ) : null}

            {data.state === 'ONGOING' && data.current ? (
              <div className="mt-6 max-w-xl">
                <div className="display-progress">
                  <span style={{ width: `${bar}%` }} />
                </div>
                <p className="mt-2 text-sm text-white/55">
                  {fmtTime(data.current.StartAt)} – {fmtTime(data.current.EndAt)}
                </p>
              </div>
            ) : null}

            {data.state === 'AVAILABLE' && data.next ? (
              <p className="mt-6 text-lg text-white/70 sm:text-xl">
                Next: {data.next.EventName} · {fmtTime(data.next.StartAt)}
              </p>
            ) : null}

            {data.state === 'MAINTENANCE' && data.availableFrom ? (
              <p className="mt-6 text-lg text-white/75 sm:text-2xl">Back at {fmtTime(data.availableFrom)}</p>
            ) : null}
          </div>

          {booking && data.state !== 'MAINTENANCE' ? (
            <aside className="w-full max-w-md shrink-0 display-enter" style={{ animationDelay: '120ms' }}>
              <EventCard
                label={data.state === 'ONGOING' ? 'Now in this room' : 'Next in this room'}
                name={booking.EventName}
                start={booking.StartAt}
                end={booking.EndAt}
                organizer={booking.OrganizerName}
                department={booking.DepartmentName}
                guests={booking.AttendeeCount}
                live={data.state === 'ONGOING'}
              />
            </aside>
          ) : null}
        </main>

        <footer className="flex items-center justify-between gap-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/30">
          <span>Live display</span>
          <span className="hidden sm:inline">Auto-refresh · do not power off</span>
        </footer>
      </div>
    </div>
  );
}

function StatusChip({ state }: { state: DisplayPayload['state'] }) {
  const copy = useMemo(
    () =>
      ({
        AVAILABLE: 'Free now',
        UPCOMING: 'Starting soon',
        ONGOING: 'In progress',
        MAINTENANCE: 'Unavailable',
      })[state],
    [state],
  );
  return (
    <span className={`display-chip ${state === 'ONGOING' ? 'display-chip--live' : ''}`}>
      <span className="display-chip__dot" />
      {copy}
    </span>
  );
}

function EventCard({
  label,
  name,
  start,
  end,
  organizer,
  department,
  guests,
  live,
}: {
  label: string;
  name: string;
  start: string;
  end: string;
  organizer: string;
  department: string;
  guests: number;
  live: boolean;
}) {
  return (
    <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-lift backdrop-blur-md">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold leading-snug sm:text-3xl">{name}</p>
      <p className="mt-3 text-lg text-white/80">
        {fmtTime(start)} – {fmtTime(end)}
      </p>
      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">Organizer</dt>
          <dd className="mt-1 truncate text-white/90">{organizer || '—'}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">Department</dt>
          <dd className="mt-1 truncate text-white/90">{department || '—'}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">Expected guests</dt>
          <dd className="mt-1 text-white/90">{guests}</dd>
        </div>
      </dl>
      {live ? (
        <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em]">
          <span className="display-chip__dot" />
          Do not disturb
        </p>
      ) : null}
    </div>
  );
}

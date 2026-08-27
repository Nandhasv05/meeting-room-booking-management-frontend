import { useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api, unwrap } from '../../services/api';
import { fmtTime } from '../../utils/format';

export type DayEvent = {
  Id: string;
  EventName: string;
  StartAt: string;
  EndAt: string;
  Status: string;
  HallName: string;
  HallId: string;
};

const HOUR_PX = 56;
const SNAP_MIN = 15;

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function toLocalDate(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function hhmm(minutes: number) {
  const m = Math.max(0, Math.min(24 * 60 - 1, minutes));
  return `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`;
}

function minutesOf(time: string) {
  const [h, m] = time.split(':').map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

function minutesFromDate(iso: string, day: string) {
  const d = new Date(iso);
  const dayStart = new Date(`${day}T00:00:00`);
  return Math.round((d.getTime() - dayStart.getTime()) / 60000);
}

function shiftDay(date: string, days: number) {
  const d = new Date(`${date}T00:00:00`);
  d.setDate(d.getDate() + days);
  return toLocalDate(d);
}

function hourLabel(hour: number) {
  const h = hour % 24;
  const suffix = h < 12 ? 'AM' : 'PM';
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display} ${suffix}`;
}

/** Packs overlapping events into side-by-side lanes so nothing is hidden. */
function laneLayout(events: DayEvent[], day: string) {
  const sorted = [...events].sort(
    (a, b) => minutesFromDate(a.StartAt, day) - minutesFromDate(b.StartAt, day),
  );
  const laneEnds: number[] = [];
  const placed = sorted.map((event) => {
    const start = minutesFromDate(event.StartAt, day);
    const end = minutesFromDate(event.EndAt, day);
    let lane = laneEnds.findIndex((endsAt) => endsAt <= start);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(end);
    } else {
      laneEnds[lane] = end;
    }
    return { event, start, end, lane };
  });
  return { placed, lanes: Math.max(1, laneEnds.length) };
}

function toneFor(status: string, clashing: boolean) {
  if (clashing) return 'border-rose-300 bg-rose-100 text-rose-900';
  if (status === 'MAINTENANCE') return 'border-stone-200 bg-stone-100 text-navy-800';
  if (status === 'PENDING') return 'border-amber-200 bg-amber-50 text-amber-900';
  if (status === 'CANCELLED') return 'border-navy-800/10 bg-white text-navy-800/40 line-through';
  return 'border-navy-800/10 bg-mist/70 text-navy-800';
}

export function DayPeek({
  date,
  startTime,
  endTime,
  hallId,
  hallName,
  openingTime,
  closingTime,
  onPickSlot,
  onDateChange,
}: {
  date: string;
  startTime: string;
  endTime: string;
  hallId: string;
  hallName: string | null;
  openingTime?: string;
  closingTime?: string;
  onPickSlot: (start: string, end: string) => void;
  onDateChange: (date: string) => void;
}) {
  const gridRef = useRef<HTMLDivElement>(null);

  const draftStart = minutesOf(startTime);
  const draftEnd = minutesOf(endTime);
  const duration = Math.max(SNAP_MIN, draftEnd - draftStart);

  const openMin = openingTime ? minutesOf(String(openingTime).slice(0, 5)) : 8 * 60;
  const closeMin = closingTime ? minutesOf(String(closingTime).slice(0, 5)) : 20 * 60;
  const fromHour = Math.max(0, Math.min(Math.floor(openMin / 60), Math.floor(draftStart / 60)));
  const toHour = Math.min(24, Math.max(Math.ceil(closeMin / 60), Math.ceil(draftEnd / 60) + 1));
  const hours = Array.from({ length: Math.max(1, toHour - fromHour) }, (_, i) => fromHour + i);
  const gridTop = fromHour * 60;
  const gridHeight = hours.length * HOUR_PX;

  const { data, isError } = useQuery({
    queryKey: ['day-peek', date, hallId],
    queryFn: () =>
      unwrap<{ bookings: DayEvent[]; maintenance: DayEvent[] }>(
        api.get('/calendar', {
          params: {
            from: new Date(`${date}T00:00:00`).toISOString(),
            to: new Date(`${date}T23:59:59`).toISOString(),
            hallId: hallId || undefined,
          },
        }),
      ),
    enabled: Boolean(date),
    retry: false,
    staleTime: 15_000,
  });

  const events = useMemo(
    () => [...(data?.bookings ?? []), ...(data?.maintenance ?? [])].filter((e) => e.Status !== 'CANCELLED'),
    [data],
  );
  const { placed, lanes } = useMemo(() => laneLayout(events, date), [events, date]);

  const isToday = date === toLocalDate(new Date());
  const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();

  const pickAt = (clientY: number) => {
    const box = gridRef.current?.getBoundingClientRect();
    if (!box) return;
    const offset = clientY - box.top;
    const raw = gridTop + (offset / HOUR_PX) * 60;
    const snapped = Math.round(raw / SNAP_MIN) * SNAP_MIN;
    const start = Math.max(0, Math.min(24 * 60 - duration, snapped));
    onPickSlot(hhmm(start), hhmm(start + duration));
  };

  const headerDate = new Date(`${date}T00:00:00`);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 px-1 pb-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onDateChange(shiftDay(date, -1))}
            className="grid h-7 w-7 place-items-center rounded-lg text-navy-800/50 transition hover:bg-mist hover:text-navy-900"
            aria-label="Previous day"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDateChange(shiftDay(date, 1))}
            className="grid h-7 w-7 place-items-center rounded-lg text-navy-800/50 transition hover:bg-mist hover:text-navy-900"
            aria-label="Next day"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <p className="ml-1 text-sm font-semibold text-navy-900">
            {headerDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
          </p>
        </div>
        <Link
          to="/calendar"
          className="grid h-7 w-7 place-items-center rounded-lg text-navy-800/40 transition hover:bg-mist hover:text-navy-900"
          aria-label="Open full calendar"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </Link>
      </div>

      <p className="truncate px-1 pb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-navy-800/45">
        {hallName ?? 'All halls'}
      </p>

      <div className="soft-scroll relative flex-1 overflow-y-auto rounded-xl border border-navy-800/10 bg-white/70">
        <div className="relative flex" style={{ height: gridHeight }}>
          <div className="w-12 shrink-0 border-r border-navy-800/8">
            {hours.map((h) => (
              <div key={h} className="relative" style={{ height: HOUR_PX }}>
                <span className="absolute -top-1.5 right-1.5 text-[10px] font-medium text-navy-800/40">
                  {hourLabel(h)}
                </span>
              </div>
            ))}
          </div>

          <div
            ref={gridRef}
            className="relative flex-1 cursor-copy"
            onClick={(e) => pickAt(e.clientY)}
            role="presentation"
          >
            {hours.map((h) => (
              <div key={h} className="border-t border-navy-800/8" style={{ height: HOUR_PX }} />
            ))}

            {openMin > gridTop ? (
              <div
                className="pointer-events-none absolute inset-x-0 bg-navy-800/[0.03]"
                style={{ top: 0, height: ((openMin - gridTop) / 60) * HOUR_PX }}
              />
            ) : null}
            {closeMin < toHour * 60 ? (
              <div
                className="pointer-events-none absolute inset-x-0 bg-navy-800/[0.03]"
                style={{
                  top: ((closeMin - gridTop) / 60) * HOUR_PX,
                  height: ((toHour * 60 - closeMin) / 60) * HOUR_PX,
                }}
              />
            ) : null}

            {placed.map(({ event, start, end, lane }) => {
              const clashing = start < draftEnd && end > draftStart;
              const width = `calc(${100 / lanes}% - 4px)`;
              return (
                <div
                  key={event.Id}
                  className={`pointer-events-none absolute overflow-hidden rounded-lg border px-2 py-1 text-[11px] leading-tight ${toneFor(
                    event.Status,
                    clashing,
                  )}`}
                  style={{
                    top: ((start - gridTop) / 60) * HOUR_PX,
                    height: Math.max(18, ((end - start) / 60) * HOUR_PX - 2),
                    left: `calc(${(lane * 100) / lanes}% + 2px)`,
                    width,
                  }}
                >
                  <p className="truncate font-semibold">{event.EventName}</p>
                  <p className="truncate opacity-70">
                    {fmtTime(event.StartAt)} – {fmtTime(event.EndAt)}
                  </p>
                </div>
              );
            })}

            <div
              className="pointer-events-none absolute inset-x-1 z-10 overflow-hidden rounded-lg border-2 border-white bg-signal px-2 py-1 text-[11px] font-semibold leading-tight text-white shadow-soft"
              style={{
                top: ((draftStart - gridTop) / 60) * HOUR_PX,
                height: Math.max(20, ((draftEnd - draftStart) / 60) * HOUR_PX - 2),
              }}
            >
              <p className="truncate">
                {fmtTime(new Date(`${date}T${startTime}:00`))} – {fmtTime(new Date(`${date}T${endTime}:00`))}
              </p>
            </div>

            {isToday && nowMinutes >= gridTop && nowMinutes <= toHour * 60 ? (
              <div
                className="pointer-events-none absolute inset-x-0 z-20 border-t-2 border-rose-500"
                style={{ top: ((nowMinutes - gridTop) / 60) * HOUR_PX }}
              >
                <span className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-rose-500" />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <p className="px-1 pt-2 text-[11px] text-navy-800/45">
        {isError ? 'Day schedule unavailable for your role.' : 'Click anywhere on the day to move the slot.'}
      </p>
    </div>
  );
}

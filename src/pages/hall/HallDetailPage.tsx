// AUTHOR : NANDNHAKUMAR SV
// DATE : 01/09/2026
// DESCRIPTION : Hall detail — full facts plus 7-day availability and bookings
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { addDays, format, startOfDay } from 'date-fns';
import { CalendarPlus, ExternalLink, Pencil } from 'lucide-react';
import type { Hall } from '../../types/api';
import { EmptyState, PageHeader, Spinner, StatusBadge } from '../../components/ui/Feedback';
import { GhostButton, PrimaryButton } from '../../components/ui/Form';
import { Card, CardHeader, DataTable, DefinitionItem, type Column } from '../../components/ui/Surface';
import { usePermission } from '../../hooks/usePermission';
import { fmtDateTime, fmtTime, parseAppDate } from '../../utils/format';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchHallAvailabilityStart, fetchHallStart } from '../../redux/halls/halls.action';
import {
  selectHall,
  selectHallAvailability,
  selectHallAvailabilityLoading,
  selectHallLoading,
} from '../../redux/halls/halls.selector';

type AvailBooking = {
  Id: string;
  BookingNumber?: string;
  EventName: string;
  StartAt: string;
  EndAt: string;
  Status: string;
  AttendeeCount?: number;
  OrganizerName?: string | null;
};

type AvailMaint = {
  Id: string;
  Title: string;
  StartAt: string;
  EndAt: string;
  Status: string;
};

type AvailPayload = {
  bookings?: AvailBooking[];
  maintenance?: AvailMaint[];
};

function hoursLabel(value: string | null | undefined) {
  return String(value ?? '').slice(0, 5) || '—';
}

function dayTone(busy: number, blocked: boolean) {
  if (blocked) return { label: 'Maintenance', className: 'bg-stone-200 text-navy-700' };
  if (busy === 0) return { label: 'Free', className: 'bg-signal/12 text-signal' };
  return { label: `${busy} booked`, className: 'bg-brand-100 text-brand-700' };
}

function atHour(day: Date, hhmm: string) {
  const [h, m] = String(hhmm || '00:00').slice(0, 5).split(':').map(Number);
  const next = new Date(day);
  next.setHours(h || 0, m || 0, 0, 0);
  return next;
}

function overlapsDay(start: Date, end: Date, day: Date) {
  const from = startOfDay(day);
  const to = addDays(from, 1);
  return start < to && end > from;
}

function itemsOnDay<T extends { StartAt: string; EndAt: string }>(items: T[], day: Date) {
  return items.filter((item) => overlapsDay(parseAppDate(item.StartAt), parseAppDate(item.EndAt), day));
}

function freeWindows(day: Date, opening: string, closing: string, busy: { StartAt: string; EndAt: string }[]) {
  const open = atHour(day, opening);
  const close = atHour(day, closing);
  const blocks = busy
    .map((item) => ({
      start: parseAppDate(item.StartAt) < open ? open : parseAppDate(item.StartAt),
      end: parseAppDate(item.EndAt) > close ? close : parseAppDate(item.EndAt),
    }))
    .filter((item) => item.end > item.start)
    .sort((a, b) => a.start.getTime() - b.start.getTime());
  const gaps: { from: Date; to: Date }[] = [];
  let cursor = open;
  for (const block of blocks) {
    if (block.start > cursor) gaps.push({ from: cursor, to: block.start });
    if (block.end > cursor) cursor = block.end;
  }
  if (cursor < close) gaps.push({ from: cursor, to: close });
  return gaps;
}

export function HallDetailPage() {
  const { id } = useParams();
  const { can } = usePermission();
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectHall) as Hall | null;
  const isLoading = useAppSelector(selectHallLoading);
  const availability = useAppSelector(selectHallAvailability) as AvailPayload | null;
  const availLoading = useAppSelector(selectHallAvailabilityLoading);
  const [anchor, setAnchor] = useState(() => startOfDay(new Date()));
  const [selected, setSelected] = useState(() => startOfDay(new Date()));

  const range = useMemo(() => {
    const from = startOfDay(anchor);
    const to = addDays(from, 7);
    return { from: from.toISOString(), to: to.toISOString(), days: Array.from({ length: 7 }, (_, i) => addDays(from, i)) };
  }, [anchor]);

  useEffect(() => {
    if (!id) return;
    dispatch(fetchHallStart({ id }));
    dispatch(fetchHallAvailabilityStart({ id, from: range.from, to: range.to }));
  }, [id, dispatch, range.from, range.to]);

  const bookings = availability?.bookings ?? [];
  const maintenance = availability?.maintenance ?? [];
  const selectedBookings = itemsOnDay(bookings, selected);
  const selectedMaint = itemsOnDay(maintenance, selected);
  const selectedBusy = [...selectedBookings, ...selectedMaint];
  const selectedGaps = data
    ? freeWindows(selected, hoursLabel(data.OpeningTime), hoursLabel(data.ClosingTime), selectedBusy)
    : [];
  const selectedDateValue = format(selected, 'yyyy-MM-dd');

  const pickDate = (value: string) => {
    const next = startOfDay(parseAppDate(`${value}T00:00:00`));
    if (Number.isNaN(next.getTime())) return;
    setSelected(next);
    const inWeek = range.days.some((day) => day.getTime() === next.getTime());
    if (!inWeek) setAnchor(next);
  };

  const columns: Column<AvailBooking>[] = [
    {
      key: 'event',
      header: 'Event',
      render: (b) => (
        <Link to={`/bookings/${b.Id}`} className="font-semibold text-navy-900 hover:text-brand-600">
          {b.EventName}
        </Link>
      ),
    },
    { key: 'when', header: 'When', render: (b) => `${fmtDateTime(b.StartAt)} – ${fmtTime(b.EndAt)}` },
    { key: 'who', header: 'Organizer', render: (b) => b.OrganizerName || '—' },
    { key: 'guests', header: 'Guests', render: (b) => String(b.AttendeeCount ?? '—') },
    { key: 'status', header: 'Status', render: (b) => <StatusBadge value={b.Status} /> },
  ];

  if (isLoading || !data) return <Spinner />;

  return (
    <div>
      <PageHeader
        title={data.Name}
        description={`${data.Code} · ${data.Building || '—'} · Floor ${data.Floor || '—'}`}
        actions={
          <div className="flex flex-wrap gap-2">
            {can('bookings.create') ? (
              <Link to={`/bookings/new?hallId=${data.Id}`}>
                <PrimaryButton type="button">
                  <CalendarPlus className="h-4 w-4" />
                  Book this hall
                </PrimaryButton>
              </Link>
            ) : null}
            <Link to={`/display/${data.Code}`} target="_blank">
              <GhostButton type="button">
                <ExternalLink className="h-4 w-4" />
                Open display
              </GhostButton>
            </Link>
            {can('halls.update') ? (
              <Link to={`/halls/${data.Id}/edit`}>
                <GhostButton type="button">
                  <Pencil className="h-4 w-4" />
                  Edit
                </GhostButton>
              </Link>
            ) : null}
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Overview" subtitle={data.Description || 'No description'} />
          {data.ImageUrl ? (
            <img src={data.ImageUrl} alt={data.Name} className="mb-3 h-40 w-full rounded-xl object-cover" />
          ) : null}
          <dl className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            <DefinitionItem label="Code" value={data.Code} />
            <DefinitionItem label="Type" value={data.HallType} />
            <DefinitionItem label="Capacity" value={`${data.Capacity} people`} />
            <DefinitionItem label="Building" value={data.Building || '—'} />
            <DefinitionItem label="Floor" value={data.Floor || '—'} />
            <DefinitionItem label="Location" value={data.Location || '—'} />
            <DefinitionItem label="Hours" value={`${hoursLabel(data.OpeningTime)} – ${hoursLabel(data.ClosingTime)}`} />
            <DefinitionItem label="Status" value={<StatusBadge value={data.Status} />} />
            <DefinitionItem label="Active" value={data.IsActive ? 'Yes' : 'No'} />
            <DefinitionItem label="Contact" value={data.ContactName || '—'} />
          </dl>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Facilities" />
            {!data.facilities?.length ? (
              <p className="text-sm text-navy-800/50">No facilities listed.</p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {data.facilities.map((f) => (
                  <li
                    key={f.Id}
                    className="rounded-full border border-navy-800/10 bg-mist/60 px-3 py-1.5 text-xs font-semibold text-navy-700"
                  >
                    {f.Name}
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card>
            <CardHeader title="Seating layouts" />
            {!data.layouts?.length ? (
              <p className="text-sm text-navy-800/50">No layouts configured.</p>
            ) : (
              <ul className="space-y-2">
                {data.layouts.map((layout) => (
                  <li key={layout.Id} className="flex items-center justify-between rounded-xl bg-mist/40 px-3 py-2 text-sm">
                    <span className="font-semibold text-navy-900">{layout.Name}</span>
                    <span className="text-xs text-navy-800/55">
                      {layout.Capacity} seats{layout.IsDefault ? ' · Default' : ''}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>

      <Card className="mt-4">
        <CardHeader
          title="Availability"
          subtitle="Click a date to see free slots and bookings for that day."
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-navy-800/70">
                Date
                <input
                  type="date"
                  className="rounded-xl border border-navy-800/12 bg-white px-3 py-1.5 text-sm font-medium text-navy-900 outline-none focus:border-brand-400"
                  value={selectedDateValue}
                  onChange={(e) => pickDate(e.target.value)}
                />
              </label>
              {can('bookings.create') ? (
                <Link
                  to={`/bookings/new?hallId=${data.Id}&date=${selectedDateValue}`}
                  className="text-sm font-semibold text-brand-600 hover:underline"
                >
                  New booking
                </Link>
              ) : null}
            </div>
          }
        />
        {availLoading && !availability ? (
          <Spinner />
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-7">
            {range.days.map((day) => {
              const dayBookings = itemsOnDay(bookings, day);
              const dayMaint = itemsOnDay(maintenance, day);
              const tone = dayTone(dayBookings.length, dayMaint.length > 0);
              const active = day.getTime() === selected.getTime();
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => setSelected(day)}
                  className={`rounded-2xl border p-3 text-left transition ${
                    active
                      ? 'border-navy-900 bg-navy-900 text-white shadow-soft'
                      : 'border-navy-800/8 bg-mist/30 hover:border-brand-400/40 hover:bg-brand-50'
                  }`}
                >
                  <p className={`text-[11px] font-bold uppercase tracking-[0.12em] ${active ? 'text-white/60' : 'text-navy-800/45'}`}>
                    {format(day, 'EEE')}
                  </p>
                  <p className={`mt-0.5 font-display text-lg font-semibold ${active ? 'text-white' : 'text-navy-900'}`}>
                    {format(day, 'd MMM')}
                  </p>
                  <span
                    className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                      active ? 'bg-white/15 text-white' : tone.className
                    }`}
                  >
                    {tone.label}
                  </span>
                  <p className={`mt-2 truncate text-xs ${active ? 'text-white/70' : 'text-navy-800/50'}`}>
                    {dayBookings[0]?.EventName || dayMaint[0]?.Title || `Open ${hoursLabel(data.OpeningTime)}–${hoursLabel(data.ClosingTime)}`}
                  </p>
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-4 rounded-2xl border border-navy-800/8 bg-white/70 p-4">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-navy-800/45">Selected date</p>
              <h3 className="font-display text-lg font-semibold text-navy-900">{format(selected, 'EEEE, d MMMM yyyy')}</h3>
            </div>
            {can('bookings.create') && selectedGaps.length ? (
              <Link to={`/bookings/new?hallId=${data.Id}&date=${selectedDateValue}&start=${format(selectedGaps[0].from, 'HH:mm')}&end=${format(selectedGaps[0].to, 'HH:mm')}`}>
                <GhostButton type="button">
                  <CalendarPlus className="h-4 w-4" />
                  Book {format(selected, 'd MMM')}
                </GhostButton>
              </Link>
            ) : null}
          </div>

          {selectedMaint.length ? (
            <div className="mb-3">
              <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.1em] text-navy-800/45">Maintenance</p>
              <ul className="space-y-1.5">
                {selectedMaint.map((item) => (
                  <li key={item.Id} className="rounded-xl bg-stone-100 px-3 py-2 text-sm text-navy-800">
                    {item.Title} · {fmtTime(item.StartAt)} – {fmtTime(item.EndAt)}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mb-3">
            <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.1em] text-navy-800/45">Free slots</p>
            {!selectedGaps.length ? (
              <p className="text-sm text-navy-800/50">No free time on this date.</p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {selectedGaps.map((gap) => (
                  <li key={gap.from.toISOString()}>
                    {can('bookings.create') ? (
                      <Link
                        to={`/bookings/new?hallId=${data.Id}&date=${selectedDateValue}&start=${format(gap.from, 'HH:mm')}&end=${format(gap.to, 'HH:mm')}`}
                        className="inline-flex rounded-full border border-signal/25 bg-signal/10 px-3 py-1.5 text-xs font-semibold text-navy-800 hover:bg-signal/20"
                      >
                        {fmtTime(gap.from)} – {fmtTime(gap.to)}
                      </Link>
                    ) : (
                      <span className="inline-flex rounded-full border border-signal/25 bg-signal/10 px-3 py-1.5 text-xs font-semibold text-navy-800">
                        {fmtTime(gap.from)} – {fmtTime(gap.to)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.1em] text-navy-800/45">Bookings on this date</p>
            {!selectedBookings.length ? (
              <p className="text-sm text-navy-800/50">No bookings on {format(selected, 'd MMM')}.</p>
            ) : (
              <ul className="space-y-2">
                {selectedBookings.map((b) => (
                  <li key={b.Id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-mist/50 px-3 py-2">
                    <div>
                      <Link to={`/bookings/${b.Id}`} className="font-semibold text-navy-900 hover:text-brand-600">
                        {b.EventName}
                      </Link>
                      <p className="text-xs text-navy-800/55">
                        {fmtTime(b.StartAt)} – {fmtTime(b.EndAt)}
                        {b.OrganizerName ? ` · ${b.OrganizerName}` : ''}
                        {b.AttendeeCount != null ? ` · ${b.AttendeeCount} guests` : ''}
                      </p>
                    </div>
                    <StatusBadge value={b.Status} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Card>

      <Card className="mt-4">
        <CardHeader
          title={`Bookings · ${format(selected, 'd MMM yyyy')}`}
          subtitle="Reservations for the date you selected."
        />
        {availLoading && !selectedBookings.length ? (
          <Spinner />
        ) : !selectedBookings.length ? (
          <EmptyState title={`No bookings on ${format(selected, 'd MMM')}`} hint="This hall is free on the selected date." />
        ) : (
          <DataTable columns={columns} rows={selectedBookings} rowKey={(b) => b.Id} />
        )}
      </Card>
    </div>
  );
}

export default HallDetailPage;

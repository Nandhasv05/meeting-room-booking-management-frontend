// AUTHOR : NANDHAKUMAR S V
// DATE : 27/08/2026
// DESCRIPTION : Booking detail page to view booking details
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { differenceInMinutes, format, isSameDay, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import {
  ArrowUpRight,
  Building2,
  CalendarRange,
  Clock3,
  MapPin,
  Trash2,
  Users,
  Utensils,
} from 'lucide-react';
import { api, apiError, unwrap } from '../services/api';
import { celebrate } from '../components/ui/SuccessFx';
import type { Booking } from '../types/api';
import { Spinner, StatusBadge } from '../components/ui/Feedback';
import { DangerButton, Field, GhostButton, inputClass, Modal, PrimaryButton } from '../components/ui/Form';
import { fmtDate, fmtDateTime, fmtTime, labelize } from '../utils/format';
import { usePermission } from '../hooks/usePermission';

type Guest = { Id: string; Name: string; Email: string; Department: string | null };

function durationLabel(start: Date, end: Date) {
  const mins = Math.max(0, differenceInMinutes(end, start));
  const hours = Math.floor(mins / 60);
  const rem = mins % 60;
  if (hours && rem) return `${hours}h ${rem}m`;
  if (hours) return `${hours}h`;
  return `${rem}m`;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function BookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { can, user } = usePermission();
  const qc = useQueryClient();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => unwrap<Booking>(api.get(`/bookings/${id}`)),
  });
  const { data: guests } = useQuery({
    queryKey: ['attendees', id],
    queryFn: () => unwrap<Guest[]>(api.get(`/bookings/${id}/attendees`)),
    enabled: Boolean(id),
  });
  const act = useMutation({
    mutationFn: (reason: string) => unwrap(api.post(`/bookings/${id}/cancel`, { reason })),
    onSuccess: () => {
      celebrate('Booking cancelled');
      setConfirmCancel(false);
      setCancelReason('');
      void qc.invalidateQueries({ queryKey: ['booking', id] });
      void qc.invalidateQueries({ queryKey: ['bookings'] });
      void qc.invalidateQueries({ queryKey: ['calendar'] });
    },
    onError: (e) => toast.error(apiError(e)),
  });
  const remove = useMutation({
    mutationFn: () => unwrap(api.delete(`/bookings/${id}`)),
    onSuccess: () => {
      celebrate('Booking deleted');
      void qc.invalidateQueries({ queryKey: ['bookings'] });
      void qc.invalidateQueries({ queryKey: ['calendar'] });
      navigate('/bookings');
    },
    onError: (e) => toast.error(apiError(e)),
  });

  if (isLoading || !data) return <Spinner />;

  const start = parseISO(data.StartAt);
  const end = parseISO(data.EndAt);
  const mine = data.OrganizerId === user?.id;
  const notStarted = start.getTime() > Date.now();
  const canManage = mine || can('bookings.cancel');
  const closed = ['CANCELLED', 'COMPLETED'].includes(data.Status);
  const canDelete = canManage && notStarted && !closed;
  const canCancel = canManage && !closed;
  const guestCount = guests?.length ?? 0;

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <section className="overflow-hidden rounded-3xl border border-navy-800/10 bg-white/90 shadow-panel">
        <div className="grid lg:grid-cols-[10.5rem_minmax(0,1fr)]">
          <div className="relative flex flex-col items-center justify-center bg-navy-900 px-4 py-7 text-white">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">{format(start, 'EEE')}</p>
            <p className="mt-1 font-display text-5xl font-bold leading-none tracking-tight">{format(start, 'd')}</p>
            <p className="mt-1.5 text-sm font-semibold uppercase tracking-[0.16em] text-brand-100">
              {format(start, 'MMM yyyy')}
            </p>
            <span className="pointer-events-none absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 rounded-full bg-[#e8f0eb] lg:block" />
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-navy-800/40">
                  {data.BookingNumber}
                </p>
                <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-navy-900 sm:text-[1.85rem]">
                  {data.EventName}
                </h1>
                <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-navy-800/60">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {data.HallName}
                  </span>
                  <span className="text-navy-800/25">·</span>
                  <span>{labelize(data.EventType)}</span>
                </p>
              </div>
              <StatusBadge value={data.Status} />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {canDelete ? (
                <DangerButton type="button" disabled={remove.isPending} onClick={() => setConfirmDelete(true)}>
                  <Trash2 className="h-4 w-4" />
                  Delete booking
                </DangerButton>
              ) : null}
              {canCancel ? (
                <DangerButton type="button" disabled={act.isPending} onClick={() => setConfirmCancel(true)}>
                  Cancel booking
                </DangerButton>
              ) : null}
              {data.EventId ? (
                <Link to={`/events/${data.EventId}`}>
                  <PrimaryButton type="button">
                    Event details
                    <ArrowUpRight className="h-4 w-4" />
                  </PrimaryButton>
                </Link>
              ) : null}
              <Link to={`/halls/${data.HallId}`}>
                <GhostButton type="button">View hall</GhostButton>
              </Link>
            </div>

            <div className="mt-5 grid items-center gap-3 rounded-2xl bg-mist/55 px-4 py-3.5 sm:grid-cols-[1fr_auto_1fr]">
              <TimePoint label="Starts" time={fmtTime(start)} date={!isSameDay(start, end) ? fmtDate(start) : undefined} />
              <div className="hidden flex-col items-center sm:flex">
                <Clock3 className="h-3.5 w-3.5 text-navy-800/35" />
                <span className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-navy-800/45">
                  {durationLabel(start, end)}
                </span>
                <span className="mt-1 h-px w-20 bg-navy-800/12" />
              </div>
              <TimePoint
                label="Ends"
                time={fmtTime(end)}
                date={!isSameDay(start, end) ? fmtDate(end) : undefined}
                align="end"
              />
            </div>
          </div>
        </div>
      </section>

      <Modal
        open={confirmCancel}
        title="Cancel this booking?"
        onClose={() => {
          if (act.isPending) return;
          setConfirmCancel(false);
          setCancelReason('');
        }}
        footer={
          <div className="flex justify-end gap-2">
            <GhostButton
              type="button"
              disabled={act.isPending}
              onClick={() => {
                setConfirmCancel(false);
                setCancelReason('');
              }}
            >
              No
            </GhostButton>
            <DangerButton
              type="button"
              disabled={act.isPending || cancelReason.trim().length < 3}
              onClick={() => act.mutate(cancelReason.trim())}
            >
              {act.isPending ? 'Cancelling…' : 'Yes'}
            </DangerButton>
          </div>
        }
      >
        <p className="mb-4 text-sm leading-relaxed text-navy-800/70">
          Are you sure you want to cancel <span className="font-semibold text-navy-900">{data.EventName}</span>? Choose
          Yes to cancel or No to keep it.
        </p>
        <Field label="Reason" hint="Required. This is saved with the booking.">
          <textarea
            className={inputClass}
            rows={4}
            maxLength={500}
            value={cancelReason}
            placeholder="Why are you cancelling this meeting?"
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </Field>
      </Modal>

      <Modal
        open={confirmDelete}
        title="Delete this booking?"
        onClose={() => setConfirmDelete(false)}
        footer={
          <div className="flex justify-end gap-2">
            <GhostButton type="button" onClick={() => setConfirmDelete(false)}>
              No
            </GhostButton>
            <DangerButton
              type="button"
              disabled={remove.isPending}
              onClick={() => remove.mutate()}
            >
              {remove.isPending ? 'Deleting…' : 'Yes'}
            </DangerButton>
          </div>
        }
      >
        <p className="text-sm leading-relaxed text-navy-800/70">
          {data.EventName} will be removed from the calendar and the hall will be free. This is only allowed
          before the meeting starts.
        </p>
      </Modal>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-2xl border border-navy-800/10 bg-white/85 p-5 shadow-panel lg:col-span-2">
          <h2 className="font-display text-lg font-semibold text-navy-900">About this session</h2>
          <p className="mt-3 text-sm leading-relaxed text-navy-800/75">{data.Purpose || 'No purpose noted.'}</p>
          {data.SpecialRequirements ? (
            <p className="mt-3 rounded-xl bg-mist/50 px-3.5 py-3 text-sm text-navy-800/70">
              <span className="font-semibold text-navy-900">Requirements. </span>
              {data.SpecialRequirements}
            </p>
          ) : null}
          {data.CancellationReason ? (
            <p className="mt-3 rounded-xl bg-rose-50 px-3.5 py-3 text-sm text-rose-800">
              <span className="font-semibold">Cancelled. </span>
              {data.CancellationReason}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            {data.CateringRequired ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-600">
                <Utensils className="h-3.5 w-3.5" />
                Catering
              </span>
            ) : null}
            {data.facilities?.map((f) => (
              <span
                key={f.Id}
                className="rounded-full border border-navy-800/10 bg-mist/60 px-3 py-1.5 text-xs font-semibold text-navy-700"
              >
                {f.Name}
              </span>
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-navy-800/10 bg-white/85 p-5 shadow-panel">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-800/40">Organizer</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-navy-900 text-sm font-bold text-white">
                {initials(data.OrganizerName)}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-navy-900">{data.OrganizerName}</p>
                <p className="truncate text-sm text-navy-800/55">{data.DepartmentName}</p>
              </div>
            </div>
            {data.ContactNumber ? (
              <p className="mt-3 text-sm text-navy-800/65">{data.ContactNumber}</p>
            ) : null}
          </section>

          <section className="rounded-2xl border border-navy-800/10 bg-white/85 p-5 shadow-panel">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-800/40">Hall</p>
            <p className="mt-2 flex items-center gap-2 font-semibold text-navy-900">
              <Building2 className="h-4 w-4 text-navy-800/40" />
              {data.HallName}
            </p>
            <p className="mt-1 text-sm text-navy-800/55">
              {data.HallCode}
              {data.HallCapacity ? ` · ${data.HallCapacity} seats` : ''}
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-navy-800/70">
              <Users className="h-4 w-4 text-navy-800/40" />
              {data.AttendeeCount} expected
              {guestCount ? ` · ${guestCount} invited` : ''}
            </p>
          </section>
        </aside>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <section className="rounded-2xl border border-navy-800/10 bg-white/85 p-5 shadow-panel lg:col-span-3">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h2 className="font-display text-lg font-semibold text-navy-900">Invited guests</h2>
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy-800/40">
              {guestCount || 'None'}
            </span>
          </div>
          {!guests?.length ? (
            <p className="rounded-xl border border-dashed border-navy-800/12 px-4 py-8 text-center text-sm text-navy-800/50">
              No invitations on this booking.
            </p>
          ) : (
            <ul className="grid gap-2 sm:grid-cols-2">
              {guests.map((g) => (
                <li key={g.Id} className="flex items-center gap-3 rounded-xl bg-mist/45 px-3 py-2.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-xs font-bold text-navy-800">
                    {initials(g.Name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-navy-900">{g.Name}</p>
                    <p className="truncate text-xs text-navy-800/50">{g.Email}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-navy-800/10 bg-white/85 p-5 shadow-panel lg:col-span-2">
          <h2 className="mb-4 font-display text-lg font-semibold text-navy-900">Status history</h2>
          {!data.history?.length ? (
            <p className="text-sm text-navy-800/50">No history yet.</p>
          ) : (
            <ol className="space-y-0">
              {data.history.map((h, i) => (
                <li key={h.Id} className="relative flex gap-3 pb-4 last:pb-0">
                  <span className="relative mt-1.5 flex w-3 shrink-0 justify-center">
                    <span className="h-2.5 w-2.5 rounded-full bg-signal ring-4 ring-signal/15" />
                    {i < (data.history?.length ?? 0) - 1 ? (
                      <span className="absolute top-4 bottom-[-14px] w-px bg-navy-800/10" />
                    ) : null}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-navy-900">
                      {h.FromStatus ?? 'NEW'}
                      <span className="mx-1.5 font-normal text-navy-800/35">→</span>
                      {h.ToStatus}
                    </p>
                    {h.Comment ? <p className="mt-0.5 text-sm text-navy-800/60">{h.Comment}</p> : null}
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-navy-800/40">
                      <CalendarRange className="h-3 w-3" />
                      {h.ActorName ?? 'System'}
                      {h.CreatedAt ? ` · ${fmtDateTime(h.CreatedAt)}` : ''}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
}

function TimePoint({
  label,
  time,
  date,
  align = 'start',
}: {
  label: string;
  time: string;
  date?: string;
  align?: 'start' | 'end';
}) {
  return (
    <div className={align === 'end' ? 'text-left sm:text-right' : ''}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-800/40">{label}</p>
      <p className="mt-0.5 font-display text-xl font-semibold tracking-tight text-navy-900">{time}</p>
      {date ? <p className="text-xs text-navy-800/50">{date}</p> : null}
    </div>
  );
}

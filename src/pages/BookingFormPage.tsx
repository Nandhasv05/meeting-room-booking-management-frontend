import { Formik, Form, Field, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  AlertTriangle,
  Building2,
  CalendarRange,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  MapPin,
  Tag,
  Users,
} from 'lucide-react';
import { api, apiError, unwrap } from '../services/api';
import { useAppSelector } from '../store';
import type { Hall } from '../types/api';
import { EVENT_TYPES } from '../types/api';
import { Spinner } from '../components/ui/Feedback';
import { celebrate } from '../components/ui/SuccessFx';
import { GhostButton, PrimaryButton } from '../components/ui/Form';
import { EmployeePicker, type PickedEmployee } from '../components/booking/EmployeePicker';
import { DayPeek } from '../components/booking/DayPeek';
import { useAvailability, useDebounced, type SlotConflict } from '../hooks/useAvailability';
import { fmtTime } from '../utils/format';

const bare =
  'rounded-lg border border-transparent bg-transparent px-2 py-1.5 text-sm text-ink outline-none transition hover:border-navy-800/10 focus:border-brand-400 focus:bg-white placeholder:text-navy-800/35';

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function toLocalDate(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

/** Next full hour (at least ~1h ahead). Rolls to tomorrow 10:00 if after hall hours. */
function defaultDateTime() {
  const now = new Date();
  const start = new Date(now);
  start.setMinutes(0, 0, 0);
  start.setHours(start.getHours() + 1);
  if (start.getTime() <= now.getTime() + 5 * 60 * 1000) {
    start.setHours(start.getHours() + 1);
  }
  if (start.getHours() >= 20) {
    start.setDate(start.getDate() + 1);
    start.setHours(10, 0, 0, 0);
  }
  if (start.getHours() < 8) {
    start.setHours(10, 0, 0, 0);
  }
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  return {
    date: toLocalDate(start),
    startTime: `${pad2(start.getHours())}:${pad2(start.getMinutes())}`,
    endTime: `${pad2(end.getHours())}:${pad2(end.getMinutes())}`,
  };
}

const defaults = defaultDateTime();

type Values = {
  name: string;
  eventType: string;
  departmentId: string;
  mailId: string;
  hallId: string;
  hallAttendance: number;
  employees: PickedEmployee[];
  extraEmails: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
};

const schema = Yup.object({
  name: Yup.string().required('Title is required'),
  eventType: Yup.string().required(),
  departmentId: Yup.string().required('Department is required'),
  mailId: Yup.string().email('Enter a valid mail ID').required('Organizer mail ID is required'),
  hallId: Yup.string().required('Conference hall is required'),
  hallAttendance: Yup.number().positive('Must be at least 1').required('Hall attendance is required'),
  date: Yup.string().required(),
  startTime: Yup.string().required(),
  endTime: Yup.string()
    .required()
    .test('after-start', 'End time must be after start time', function (endTime) {
      const { date, startTime } = this.parent as { date?: string; startTime?: string };
      if (!date || !startTime || !endTime) return true;
      return new Date(`${date}T${endTime}:00`) > new Date(`${date}T${startTime}:00`);
    }),
  purpose: Yup.string().required('Purpose is required'),
}).test('not-in-past', 'Choose a start time in the future (not earlier today).', (values) => {
  if (!values?.date || !values?.startTime) return true;
  const startAt = new Date(`${values.date}T${values.startTime}:00`);
  return startAt.getTime() >= Date.now() - 60_000;
});

function parseEmails(raw: string): string[] {
  return [
    ...new Set(
      raw
        .split(/[,;\n]+/)
        .map((e) => e.trim().toLowerCase())
        .filter((e) => e.length > 0),
    ),
  ];
}

function slotIso(date: string, time: string): string | undefined {
  if (!date || !time) return undefined;
  const d = new Date(`${date}T${time}:00`);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

function durationLabel(startAt?: string, endAt?: string) {
  if (!startAt || !endAt) return '—';
  const mins = Math.round((new Date(endAt).getTime() - new Date(startAt).getTime()) / 60000);
  if (mins <= 0) return '—';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h ? `${h}h` : ''}${h && m ? ' ' : ''}${m ? `${m}m` : ''}` || '0m';
}

export function BookingFormPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const signedIn = useAppSelector((s) => s.auth.user);
  const { data: halls, isLoading } = useQuery({
    queryKey: ['halls'],
    queryFn: () => unwrap<Hall[]>(api.get('/halls', { params: { active: 'true' } })),
  });
  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: () => unwrap<{ Id: string; Name: string }[]>(api.get('/departments')),
  });
  const create = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      unwrap<{
        Id: string;
        inviteMail?: { configured: boolean; sent: number; failed: number; error?: string };
      }>(api.post('/bookings', body)),
    onSuccess: (booking) => {
      const mail = booking.inviteMail;
      if (mail?.sent) {
        celebrate(
          'Booking confirmed',
          `Invitations were emailed to ${mail.sent} guest${mail.sent === 1 ? '' : 's'}. Replies go to your mail ID.`,
        );
      } else if (mail && !mail.configured) {
        celebrate('Booking confirmed', 'Hall is booked. Invitations were not emailed yet.');
        toast.error(mail.error || 'Save the sending mailbox app password in Settings, then book again.');
      } else {
        celebrate('Booking confirmed', 'Hall is booked, but some invitation emails failed.');
        toast.error(mail?.error || 'Meeting invitations could not be emailed. Check SMTP settings.');
      }
      navigate(`/bookings/${booking.Id}`);
    },
    onError: (e) => toast.error(apiError(e)),
  });

  if (isLoading) return <Spinner />;

  return (
    <div className="animate-rise">
      <Formik<Values>
        initialValues={{
          name: '',
          eventType: 'MEETING',
          departmentId: signedIn?.departmentId ?? '',
          mailId: signedIn?.email ?? '',
          hallId: params.get('hallId') ?? '',
          hallAttendance: 8,
          employees: [],
          extraEmails: '',
          date: params.get('date') ?? defaults.date,
          startTime: params.get('start') ?? defaults.startTime,
          endTime: params.get('end') ?? defaults.endTime,
          purpose: '',
        }}
        validationSchema={schema}
        onSubmit={(v) => {
          const invites = [
            ...new Set([...v.employees.map((e) => e.email.toLowerCase()), ...parseEmails(v.extraEmails)]),
          ];
          if (invites.length === 0) {
            toast.error('Add at least one employee or invitation mail ID.');
            return;
          }
          const bad = invites.find((e) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
          if (bad) {
            toast.error(`Invalid invitation mail ID: ${bad}`);
            return;
          }
          const startAt = new Date(`${v.date}T${v.startTime}:00`);
          const endAt = new Date(`${v.date}T${v.endTime}:00`);
          if (startAt.getTime() < Date.now() - 60_000) {
            toast.error('Cannot book a time in the past. Choose a later start time or tomorrow.');
            return;
          }
          if (endAt <= startAt) {
            toast.error('End time must be after start time.');
            return;
          }
          const named = new Map(v.employees.map((e) => [e.email.toLowerCase(), e.name]));
          create.mutate({
            eventName: v.name,
            eventType: v.eventType,
            departmentId: v.departmentId,
            mailId: v.mailId.trim(),
            invitationEmails: invites,
            hallId: v.hallId,
            startAt: startAt.toISOString(),
            endAt: endAt.toISOString(),
            attendeeCount: Number(v.hallAttendance),
            purpose: v.purpose,
            attendees: invites.map((email) => ({
              name: named.get(email) ?? email.split('@')[0] ?? email,
              email,
            })),
          });
        }}
      >
        <Form>
          <Composer halls={halls ?? []} departments={departments ?? []} pending={create.isPending} />
        </Form>
      </Formik>
    </div>
  );
}

function Composer({
  halls,
  departments,
  pending,
}: {
  halls: Hall[];
  departments: { Id: string; Name: string }[];
  pending: boolean;
}) {
  const navigate = useNavigate();
  const signedIn = useAppSelector((s) => s.auth.user);
  const { values, errors, touched, setFieldValue } = useFormikContext<Values>();

  const startAt = slotIso(values.date, values.startTime);
  const endAt = slotIso(values.date, values.endTime);
  const userIds = values.employees.map((e) => e.id);
  const probe = useDebounced(
    JSON.stringify({ startAt, endAt, hallId: values.hallId, userIds, count: Number(values.hallAttendance) || 0 }),
    450,
  );
  const parsed = JSON.parse(probe) as {
    startAt?: string;
    endAt?: string;
    hallId: string;
    userIds: string[];
    count: number;
  };
  const validSlot = Boolean(parsed.startAt && parsed.endAt && new Date(parsed.endAt) > new Date(parsed.startAt));
  const { data, isFetching } = useAvailability({
    hallId: parsed.hallId,
    userIds: parsed.userIds,
    startAt: validSlot ? parsed.startAt : undefined,
    endAt: validSlot ? parsed.endAt : undefined,
    attendeeCount: parsed.count || undefined,
  });

  const hall = data?.hall ?? null;
  const people = data?.people ?? [];
  const busyPeople = people.filter((p) => !p.available);
  const selectedHall = halls.find((h) => h.Id === values.hallId);

  const overallState: SlotState = !validSlot
    ? 'idle'
    : isFetching
      ? 'checking'
      : (values.hallId && hall && !hall.available) || busyPeople.length
        ? 'busy'
        : 'free';

  return (
    <div className="overflow-hidden rounded-2xl border border-navy-800/10 bg-white shadow-panel">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-navy-800/8 bg-mist/40 px-3 py-2.5 sm:px-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-navy-900 shadow-soft">
            <CalendarRange className="h-3.5 w-3.5 text-brand-500" />
            Event
          </span>
          <span className="rounded-lg px-2 py-1.5 text-xs font-medium text-navy-800/60">
            {durationLabel(startAt, endAt)}
          </span>
          <StatusPill state={overallState} />
        </div>
        <div className="flex items-center gap-2">
          <GhostButton type="button" onClick={() => navigate(-1)}>
            Discard
          </GhostButton>
          <PrimaryButton type="submit" disabled={pending}>
            {pending ? 'Saving…' : 'Save & send invites'}
          </PrimaryButton>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="space-y-1 p-3 sm:p-5">
          <Row icon={Tag}>
            <Field
              name="name"
              placeholder="Add title"
              className="w-full border-0 border-b border-navy-800/10 bg-transparent px-0 pb-2 text-lg font-semibold text-navy-900 outline-none transition placeholder:font-normal placeholder:text-navy-800/35 focus:border-brand-500"
            />
            <FieldError show={touched.name} message={errors.name} />
          </Row>

          <Row icon={Users}>
            <EmployeePicker
              variant="inline"
              placeholder="Invite required attendees"
              selected={values.employees}
              busyIds={busyPeople.map((p) => p.userId)}
              renderEmpty={false}
              onAdd={(employee) => void setFieldValue('employees', [...values.employees, employee])}
              onRemove={(id) =>
                void setFieldValue(
                  'employees',
                  values.employees.filter((e) => e.id !== id),
                )
              }
            />
            <Field
              name="extraEmails"
              placeholder="Anyone else — paste more mail IDs, comma separated"
              className="mt-1 w-full border-0 border-b border-transparent bg-transparent px-0 py-1.5 text-sm text-ink outline-none transition placeholder:text-navy-800/35 focus:border-brand-400"
            />
            <InvitePreview employees={values.employees} extraEmails={values.extraEmails} organizer={values.mailId} />
            {busyPeople.length ? (
              <ul className="mt-2 space-y-1">
                {busyPeople.map((p) => (
                  <li key={p.userId} className="text-xs text-rose-800">
                    <span className="font-semibold">{p.name}</span> is busy —{' '}
                    {p.conflicts[0]
                      ? `${p.conflicts[0].EventName} · ${fmtTime(p.conflicts[0].StartAt)}–${fmtTime(p.conflicts[0].EndAt)}`
                      : 'another event at this time'}
                  </li>
                ))}
              </ul>
            ) : null}
          </Row>

          <Row icon={Clock}>
            <div className="flex flex-wrap items-center gap-1.5">
              <Field name="date" type="date" min={toLocalDate(new Date())} className={bare} />
              <Field name="startTime" type="time" className={bare} />
              <span className="text-navy-800/40">–</span>
              <Field name="endTime" type="time" className={bare} />
              <span className="rounded-full bg-mist px-2.5 py-1 text-[11px] font-semibold text-navy-800/60">
                {durationLabel(startAt, endAt)}
              </span>
            </div>
            <FieldError show={touched.endTime} message={errors.endTime} />
            <FieldError show message={(errors as { ''?: string })['']} />
          </Row>

          <Row icon={MapPin}>
            <div className="flex flex-wrap items-center gap-1.5">
              <Field as="select" name="hallId" className={`${bare} min-w-[13rem]`}>
                <option value="">Add a room or location</option>
                {halls.map((h) => (
                  <option key={h.Id} value={h.Id}>
                    {h.Name} · seats {h.Capacity}
                  </option>
                ))}
              </Field>
              <span className="text-xs text-navy-800/45">Expected</span>
              <Field name="hallAttendance" type="number" min={1} className={`${bare} w-20`} />
              {values.hallId ? <StatusPill state={isFetching ? 'checking' : hall?.available ? 'free' : 'busy'} /> : null}
            </div>
            {selectedHall ? (
              <p className="mt-1 text-xs text-navy-800/45">
                {selectedHall.Building ?? '—'} · Floor {selectedHall.Floor ?? '—'} · open{' '}
                {String(selectedHall.OpeningTime).slice(0, 5)}–{String(selectedHall.ClosingTime).slice(0, 5)}
              </p>
            ) : null}
            <FieldError show={touched.hallId} message={errors.hallId} />
            <FieldError show={touched.hallAttendance} message={errors.hallAttendance} />
            {hall && !hall.available ? (
              <ul className="mt-2 space-y-1">
                {hall.blockers.map((b) => (
                  <li key={b} className="flex items-start gap-1.5 text-xs text-rose-800">
                    <AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0" />
                    {b}
                  </li>
                ))}
                {hall.conflicts.map((c: SlotConflict) => (
                  <li key={c.Id} className="pl-5 text-xs text-rose-700/80">
                    {c.EventName} · {fmtTime(c.StartAt)}–{fmtTime(c.EndAt)}
                  </li>
                ))}
              </ul>
            ) : null}
          </Row>

          <Row icon={Building2}>
            <div className="flex flex-wrap items-center gap-1.5">
              <Field as="select" name="eventType" className={bare}>
                {EVENT_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </Field>
              <Field as="select" name="departmentId" className={`${bare} min-w-[11rem]`}>
                <option value="">Select department</option>
                {departments.map((d) => (
                  <option key={d.Id} value={d.Id}>
                    {d.Name}
                  </option>
                ))}
              </Field>
              <Field name="mailId" type="email" placeholder="Organizer mail ID" className={`${bare} min-w-[13rem]`} />
            </div>
            {signedIn ? (
              <p className="mt-1 text-xs text-navy-800/45">
                Organizer defaults to your account — {signedIn.firstName} {signedIn.lastName}. Change the mail ID only
                when booking on someone else's behalf.
              </p>
            ) : null}
            <FieldError show={touched.departmentId} message={errors.departmentId} />
            <FieldError show={touched.mailId} message={errors.mailId} />
          </Row>

          <Row icon={FileText} last>
            <Field
              as="textarea"
              name="purpose"
              rows={3}
              placeholder="Add a purpose or agenda"
              className="w-full resize-y rounded-xl border border-transparent bg-mist/40 px-3 py-2 text-sm text-ink outline-none transition placeholder:text-navy-800/35 hover:border-navy-800/10 focus:border-brand-400 focus:bg-white"
            />
            <FieldError show={touched.purpose} message={errors.purpose} />
          </Row>

          {overallState === 'busy' ? (
            <p className="ml-0 flex items-start gap-2 rounded-xl border border-amber-300/50 bg-amber-50 px-3 py-2.5 text-xs text-amber-900 sm:ml-10">
              <AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0" />
              This slot clashes with something above. You can still save, but the booking will be refused until the
              clash is cleared.
            </p>
          ) : null}
        </div>

        <div className="h-[26rem] border-t border-navy-800/8 p-3 sm:p-4 lg:h-auto lg:border-l lg:border-t-0">
          <DayPeek
            date={values.date}
            startTime={values.startTime}
            endTime={values.endTime}
            hallId={values.hallId}
            hallName={selectedHall?.Name ?? null}
            openingTime={selectedHall?.OpeningTime}
            closingTime={selectedHall?.ClosingTime}
            onDateChange={(d) => void setFieldValue('date', d)}
            onPickSlot={(start, end) => {
              void setFieldValue('startTime', start);
              void setFieldValue('endTime', end);
            }}
          />
        </div>
      </div>
    </div>
  );
}

function Row({
  icon: Icon,
  children,
  last,
}: {
  icon: typeof Clock;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className={`flex gap-3 py-3 ${last ? '' : 'border-b border-navy-800/[0.06]'}`}>
      <Icon className="mt-2 hidden h-4 w-4 shrink-0 text-navy-800/35 sm:block" />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function FieldError({ show, message }: { show?: boolean; message?: string }) {
  if (!show || typeof message !== 'string' || !message) return null;
  return <p className="mt-1 text-xs text-rose-700">{message}</p>;
}

function InvitePreview({
  employees,
  extraEmails,
  organizer,
}: {
  employees: PickedEmployee[];
  extraEmails: string;
  organizer: string;
}) {
  const guests = [
    ...new Set([...employees.map((e) => e.email.toLowerCase()), ...parseEmails(extraEmails)]),
  ];
  const org = organizer.trim().toLowerCase();
  if (!guests.length) {
    return (
      <p className="mt-2 text-xs text-navy-800/50">
        Add people or extra mail IDs. You are the sender; they only receive the invite.
      </p>
    );
  }
  return (
    <p className="mt-2 text-xs leading-relaxed text-navy-800/55">
      From <span className="font-semibold text-navy-900">{org || 'your login mail ID'}</span> to{' '}
      <span className="font-semibold text-navy-900">{guests.join(', ')}</span>
      . Guests do not need a password.
    </p>
  );
}

type SlotState = 'idle' | 'checking' | 'free' | 'busy';

function StatusPill({ state }: { state: SlotState }) {
  if (state === 'idle') return null;
  if (state === 'checking') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-mist px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-navy-800/60">
        <Loader2 className="h-3 w-3 animate-spin" />
        Checking
      </span>
    );
  }
  const free = state === 'free';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${
        free ? 'bg-signal/12 text-signal' : 'bg-rose-100 text-rose-800'
      }`}
    >
      {free ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
      {free ? 'Available' : 'Not available'}
    </span>
  );
}

export function Composer({
    halls,
    departments,
    pending,
  }: {
    halls: Hall[];
    departments: { Id: string; Name: string }[];
    pending: boolean;
  }) {
    const navigate = useNavigate();
    const signedIn = useAppSelector(selectCurrentUser);
    const { register, watch, setValue, formState: { errors } } = useFormContext<Values>();
    const values = watch();
  
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
              <input
                placeholder="Add title"
                className="w-full border-0 border-b border-navy-800/10 bg-transparent px-0 pb-2 text-lg font-semibold text-navy-900 outline-none transition placeholder:font-normal placeholder:text-navy-800/35 focus:border-brand-500"
                {...register('name')}
              />
              <FieldError show={!!errors.name} message={errors.name?.message} />
            </Row>
  
            <Row icon={Users}>
              <EmployeePicker
                variant="inline"
                placeholder="Invite required attendees"
                selected={values.employees}
                busyIds={busyPeople.map((p) => p.userId)}
                renderEmpty={false}
                onAdd={(employee) => void setValue('employees', [...values.employees, employee])}
                onRemove={(id) =>
                  void setValue(
                    'employees',
                    values.employees.filter((e) => e.id !== id),
                  )
                }
              />
              <input
                placeholder="Anyone else — paste more mail IDs, comma separated"
                className="mt-1 w-full border-0 border-b border-transparent bg-transparent px-0 py-1.5 text-sm text-ink outline-none transition placeholder:text-navy-800/35 focus:border-brand-400"
                {...register('extraEmails')}
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
                <input type="date" min={toLocalDate(new Date())} className={bare} {...register('date')} />
                <input type="time" className={bare} {...register('startTime')} />
                <span className="text-navy-800/40">–</span>
                <input type="time" className={bare} {...register('endTime')} />
                <span className="rounded-full bg-mist px-2.5 py-1 text-[11px] font-semibold text-navy-800/60">
                  {durationLabel(startAt, endAt)}
                </span>
              </div>
              <FieldError show={!!errors.endTime} message={errors.endTime?.message} />
              <FieldError show={!!errors.startTime} message={errors.startTime?.message} />
            </Row>
  
            <Row icon={MapPin}>
              <div className="flex flex-wrap items-center gap-1.5">
                <select className={`${bare} min-w-[13rem]`} {...register('hallId')}>
                  <option value="">Add a room or location</option>
                  {halls.map((h) => (
                    <option key={h.Id} value={h.Id}>
                      {h.Name} · seats {h.Capacity}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-navy-800/45">Expected</span>
                <input type="number" min={1} className={`${bare} w-20`} {...register('hallAttendance')} />
                {values.hallId ? <StatusPill state={isFetching ? 'checking' : hall?.available ? 'free' : 'busy'} /> : null}
              </div>
              {selectedHall ? (
                <p className="mt-1 text-xs text-navy-800/45">
                  {selectedHall.Building ?? '—'} · Floor {selectedHall.Floor ?? '—'} · open{' '}
                  {String(selectedHall.OpeningTime).slice(0, 5)}–{String(selectedHall.ClosingTime).slice(0, 5)}
                </p>
              ) : null}
              <FieldError show={!!errors.hallId} message={errors.hallId?.message} />
              <FieldError show={!!errors.hallAttendance} message={errors.hallAttendance?.message} />
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
                <select className={bare} {...register('eventType')}>
                  {EVENT_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                <select className={`${bare} min-w-[11rem]`} {...register('departmentId')}>
                  <option value="">Select department</option>
                  {departments.map((d) => (
                    <option key={d.Id} value={d.Id}>
                      {d.Name}
                    </option>
                  ))}
                </select>
                <input type="email" placeholder="Organizer mail ID" className={`${bare} min-w-[13rem]`} {...register('mailId')} />
              </div>
              {signedIn ? (
                <p className="mt-1 text-xs text-navy-800/45">
                  Organizer defaults to your account — {signedIn.firstName} {signedIn.lastName}. Change the mail ID only
                  when booking on someone else's behalf.
                </p>
              ) : null}
              <FieldError show={!!errors.departmentId} message={errors.departmentId?.message} />
              <FieldError show={!!errors.mailId} message={errors.mailId?.message} />
            </Row>
  
            <Row icon={FileText} last>
              <textarea
                rows={3}
                placeholder="Add a purpose or agenda"
                className="w-full resize-y rounded-xl border border-transparent bg-mist/40 px-3 py-2 text-sm text-ink outline-none transition placeholder:text-navy-800/35 hover:border-navy-800/10 focus:border-brand-400 focus:bg-white"
                {...register('purpose')}
              />
              <FieldError show={!!errors.purpose} message={errors.purpose?.message} />
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
              onDateChange={(d) => void setValue('date', d)}
              onPickSlot={(start, end) => {
                void setValue('startTime', start);
                void setValue('endTime', end);
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
  
  export function FieldError({ show, message }: { show?: boolean; message?: string }) {
    if (!show || typeof message !== 'string' || !message) return null;
    return <p className="mt-1 text-xs text-rose-700">{message}</p>;
  }
  
  export function InvitePreview({
    employees,
    extraEmails,
    organizer,
  }: {
    employees: PickedEmployee[];
    extraEmails: string;
    organizer: string;
  }) {
    const guests = [
      ...new Set([
        ...employees.map((e) => cleanMailText(e.email).toLowerCase()).filter(Boolean),
        ...parseEmails(extraEmails),
      ]),
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
  
  export function StatusPill({ state }: { state: SlotState }) {
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


  
export const bare =
'rounded-lg border border-transparent bg-transparent px-2 py-1.5 text-sm text-ink outline-none transition hover:border-navy-800/10 focus:border-brand-400 focus:bg-white placeholder:text-navy-800/35';

export function pad2(n: number) {
return String(n).padStart(2, '0');
}

export function toLocalDate(d: Date) {
return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

/** Next full hour (at least ~1h ahead). Rolls to tomorrow 10:00 if after hall hours. */
export function defaultDateTime() {
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

export const defaults = defaultDateTime();

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

export const schema: z.ZodType<Values> = z
.object({
  name: z.string().min(1, 'Title is required'),
  eventType: z.string().min(1),
  departmentId: z.string().min(1, 'Department is required'),
  mailId: z.string().email('Enter a valid mail ID').min(1, 'Organizer mail ID is required'),
  hallId: z.string().min(1, 'Conference hall is required'),
  hallAttendance: z.coerce.number().positive('Must be at least 1'),
  employees: z.array(z.object({ id: z.string(), name: z.string(), email: z.string() })),
  extraEmails: z.string(),
  date: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  purpose: z.string().min(1, 'Purpose is required'),
})
.refine(
  (v) => {
    if (!v.date || !v.startTime || !v.endTime) return true;
    return new Date(`${v.date}T${v.endTime}:00`) > new Date(`${v.date}T${v.startTime}:00`);
  },
  { message: 'End time must be after start time', path: ['endTime'] },
)
.refine(
  (v) => {
    if (!v.date || !v.startTime) return true;
    return new Date(`${v.date}T${v.startTime}:00`).getTime() >= Date.now() - 60_000;
  },
  { message: 'Choose a start time in the future (not earlier today).', path: ['startTime'] },
);

export const MAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;
export const MAIL_EXACT = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

export function cleanMailText(value: string): string {
return value
  .normalize('NFKC')
  .replace(/[\u200B-\u200D\uFEFF\u00AD]/g, '')
  .replace(/\uFF20/g, '@')
  .trim();
}

/** Pull real addresses out of a paste (commas, names, <brackets>, hidden characters). */
export function parseEmails(raw: string): string[] {
const cleaned = cleanMailText(raw).toLowerCase();
const found = cleaned.match(MAIL_RE) ?? [];
return [...new Set(found)];
}

export function isMailId(value: string): boolean {
return MAIL_EXACT.test(cleanMailText(value).toLowerCase());
}

export function slotIso(date: string, time: string): string | undefined {
if (!date || !time) return undefined;
const d = new Date(`${date}T${time}:00`);
return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

export function durationLabel(startAt?: string, endAt?: string) {
if (!startAt || !endAt) return '—';
const mins = Math.round((new Date(endAt).getTime() - new Date(startAt).getTime()) / 60000);
if (mins <= 0) return '—';
const h = Math.floor(mins / 60);
const m = mins % 60;
return `${h ? `${h}h` : ''}${h && m ? ' ' : ''}${m ? `${m}m` : ''}` || '0m';
}

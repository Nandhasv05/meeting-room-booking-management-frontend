import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Building2, Clock, DoorOpen, Hash, LayoutGrid, MapPin, Sparkles, Users } from 'lucide-react';
import { api, apiError, unwrap } from '../services/api';
import type { Hall } from '../types/api';
import { HALL_TYPES } from '../types/api';
import { Spinner } from '../components/ui/Feedback';
import { celebrate } from '../components/ui/SuccessFx';
import { GhostButton, PrimaryButton } from '../components/ui/Form';

const schema = Yup.object({
  name: Yup.string().required('Hall name is required'),
  code: Yup.string().required('Hall code is required'),
  capacity: Yup.number().positive('Capacity must be at least 1').required('Capacity is required'),
  hallType: Yup.string().required(),
  openingTime: Yup.string().required('Opening time is required'),
  closingTime: Yup.string()
    .required('Closing time is required')
    .test('after-open', 'Closing must be after opening', function (closing) {
      const { openingTime } = this.parent as { openingTime?: string };
      if (!openingTime || !closing) return true;
      return closing > openingTime;
    }),
});

const field =
  'w-full rounded-xl border border-navy-800/10 bg-white px-3 py-2 text-sm text-ink outline-none transition placeholder:text-navy-800/30 focus:border-brand-400 focus:ring-4 focus:ring-brand-400/10 disabled:bg-mist/50 disabled:text-navy-800/50';

type Values = {
  name: string;
  code: string;
  description: string;
  location: string;
  building: string;
  floor: string;
  capacity: number;
  hallType: string;
  openingTime: string;
  closingTime: string;
  facilityIds: string[];
  layouts: { name: string; capacity: number; isDefault: boolean }[];
};

export function HallFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: existing, isLoading } = useQuery({
    queryKey: ['hall', id],
    queryFn: () => unwrap<Hall>(api.get(`/halls/${id}`)),
    enabled: Boolean(id),
  });
  const { data: facilities } = useQuery({
    queryKey: ['facilities'],
    queryFn: () => unwrap<{ Id: string; Name: string }[]>(api.get('/facilities')),
  });
  const save = useMutation({
    mutationFn: (values: Record<string, unknown>) =>
      id ? unwrap(api.patch(`/halls/${id}`, values)) : unwrap(api.post('/halls', values)),
    onSuccess: () => {
      celebrate(id ? 'Hall updated' : 'Hall created', 'It is now available for bookings.');
      void qc.invalidateQueries({ queryKey: ['halls'] });
      navigate('/halls');
    },
    onError: (e) => toast.error(apiError(e)),
  });
  if (id && isLoading) return <Spinner />;

  const initial: Values = {
    name: existing?.Name ?? '',
    code: existing?.Code ?? '',
    description: existing?.Description ?? '',
    location: existing?.Location ?? '',
    building: existing?.Building ?? '',
    floor: existing?.Floor ?? '',
    capacity: existing?.Capacity ?? 20,
    hallType: existing?.HallType ?? 'MEETING',
    openingTime: String(existing?.OpeningTime ?? '08:00').slice(0, 5),
    closingTime: String(existing?.ClosingTime ?? '20:00').slice(0, 5),
    facilityIds: existing?.facilities?.map((f) => f.Id) ?? [],
    layouts: [{ name: 'Theatre', capacity: existing?.Capacity ?? 20, isDefault: true }],
  };

  return (
    <div className="animate-rise">
      <Formik<Values>
        enableReinitialize
        initialValues={initial}
        validationSchema={schema}
        onSubmit={(v) => {
          const { layouts, ...rest } = v;
          save.mutate({
            ...rest,
            capacity: Number(v.capacity),
            openingTime: v.openingTime.length === 5 ? `${v.openingTime}:00` : v.openingTime,
            closingTime: v.closingTime.length === 5 ? `${v.closingTime}:00` : v.closingTime,
            ...(id ? {} : { layouts: layouts.map((l) => ({ ...l, capacity: Number(v.capacity) })) }),
          });
        }}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form className="overflow-hidden rounded-2xl border border-navy-800/10 bg-white shadow-panel">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-navy-800/8 bg-mist/40 px-3 py-2.5 sm:px-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-navy-900 shadow-soft">
                  <DoorOpen className="h-3.5 w-3.5 text-brand-500" />
                  {id ? 'Edit hall' : 'New hall'}
                </span>
                {values.code ? (
                  <span className="rounded-full bg-navy-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
                    {values.code}
                  </span>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <GhostButton type="button" onClick={() => navigate('/halls')}>
                  Discard
                </GhostButton>
                <PrimaryButton type="submit" disabled={save.isPending}>
                  {save.isPending ? 'Saving…' : id ? 'Save changes' : 'Create hall'}
                </PrimaryButton>
              </div>
            </div>

            <div className="grid lg:grid-cols-[minmax(0,1fr)_20rem]">
              <div className="space-y-6 p-4 sm:p-5">
                <Section icon={Building2} title="Identity" hint="How the hall is named and found.">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Labelled label="Hall name" error={touched.name ? (errors.name as string) : undefined}>
                      <Field name="name" placeholder="Auditorium" className={field} />
                    </Labelled>
                    <Labelled
                      label="Hall code"
                      hint={id ? 'Fixed after creation' : 'Short unique ID, e.g. AUD-1'}
                      error={touched.code ? (errors.code as string) : undefined}
                    >
                      <Field name="code" placeholder="AUD-1" className={field} disabled={Boolean(id)} />
                    </Labelled>
                    <Labelled label="Building">
                      <Field name="building" placeholder="Tower C" className={field} />
                    </Labelled>
                    <Labelled label="Floor">
                      <Field name="floor" placeholder="Ground" className={field} />
                    </Labelled>
                    <div className="sm:col-span-2">
                      <Labelled label="Location">
                        <Field name="location" placeholder="Near the east lifts" className={field} />
                      </Labelled>
                    </div>
                    <div className="sm:col-span-2">
                      <Labelled label="Description">
                        <Field
                          as="textarea"
                          name="description"
                          rows={3}
                          placeholder="What this hall is best suited for"
                          className={`${field} resize-y`}
                        />
                      </Labelled>
                    </div>
                  </div>
                </Section>

                <Section icon={LayoutGrid} title="Capacity & hours" hint="Used to validate every booking request.">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <Labelled label="Capacity" error={touched.capacity ? (errors.capacity as string) : undefined}>
                      <Field name="capacity" type="number" min={1} className={field} />
                    </Labelled>
                    <Labelled label="Hall type">
                      <Field as="select" name="hallType" className={field}>
                        {HALL_TYPES.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </Field>
                    </Labelled>
                    <Labelled label="Opens">
                      <Field name="openingTime" type="time" className={field} />
                    </Labelled>
                    <Labelled label="Closes" error={touched.closingTime ? (errors.closingTime as string) : undefined}>
                      <Field name="closingTime" type="time" className={field} />
                    </Labelled>
                  </div>
                </Section>

                <Section icon={Sparkles} title="Facilities" hint="Tap to include an amenity in this hall.">
                  {!facilities?.length ? (
                    <p className="text-sm text-navy-800/45">No facilities defined yet.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {facilities.map((f) => {
                        const on = values.facilityIds.includes(f.Id);
                        return (
                          <button
                            type="button"
                            key={f.Id}
                            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                              on
                                ? 'border-navy-900 bg-navy-900 text-white shadow-soft'
                                : 'border-navy-800/12 bg-white text-navy-800/70 hover:border-brand-400/40 hover:bg-brand-50'
                            }`}
                            onClick={() =>
                              void setFieldValue(
                                'facilityIds',
                                on ? values.facilityIds.filter((x) => x !== f.Id) : [...values.facilityIds, f.Id],
                              )
                            }
                          >
                            {f.Name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </Section>
              </div>

              <aside className="border-t border-navy-800/8 bg-mist/25 p-4 lg:border-l lg:border-t-0">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-800/45">Preview</p>
                <HallPreview values={values} facilities={facilities ?? []} />
              </aside>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

function HallPreview({
  values,
  facilities,
}: {
  values: Values;
  facilities: { Id: string; Name: string }[];
}) {
  const picked = facilities.filter((f) => values.facilityIds.includes(f.Id));
  const place = [values.building, values.floor ? `Floor ${values.floor}` : '', values.location]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="overflow-hidden rounded-2xl border border-navy-800/10 bg-white shadow-soft">
      <div className="relative overflow-hidden bg-navy-950 px-4 py-5 text-white">
        <div className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-brand-400/25 blur-2xl" />
        <p className="relative truncate font-display text-lg font-semibold">{values.name || 'Untitled hall'}</p>
        <p className="relative mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
          {values.hallType}
        </p>
      </div>
      <dl className="space-y-3 p-4">
        <PreviewRow icon={Hash} label="Code" value={values.code || '—'} />
        <PreviewRow icon={MapPin} label="Where" value={place || 'Location not set'} />
        <PreviewRow icon={Users} label="Seats" value={`${values.capacity || 0} people`} />
        <PreviewRow icon={Clock} label="Open" value={`${values.openingTime} – ${values.closingTime}`} />
      </dl>
      {picked.length ? (
        <div className="border-t border-navy-800/8 px-4 py-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-navy-800/40">Facilities</p>
          <div className="flex flex-wrap gap-1.5">
            {picked.map((f) => (
              <span key={f.Id} className="rounded-full bg-mist px-2.5 py-1 text-[11px] font-medium text-navy-800/75">
                {f.Name}
              </span>
            ))}
          </div>
        </div>
      ) : null}
      {values.description ? (
        <p className="border-t border-navy-800/8 px-4 py-3 text-xs leading-relaxed text-navy-800/55">
          {values.description}
        </p>
      ) : null}
    </div>
  );
}

function PreviewRow({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-mist text-navy-700">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0">
        <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-navy-800/40">{label}</dt>
        <dd className="truncate text-sm font-medium text-navy-900">{value}</dd>
      </div>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  hint,
  children,
}: {
  icon: typeof Clock;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2.5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-mist text-navy-700">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h2 className="font-display text-sm font-semibold text-navy-900">{title}</h2>
          {hint ? <p className="text-xs text-navy-800/45">{hint}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

function Labelled({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-xs font-semibold text-navy-800/70">{label}</span>
        {hint ? <span className="text-[10px] text-navy-800/35">{hint}</span> : null}
      </span>
      {children}
      {error ? <span className="mt-1 block text-xs text-rose-700">{error}</span> : null}
    </label>
  );
}

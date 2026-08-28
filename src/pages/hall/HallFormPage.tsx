// AUTHOR : NANDNHAKUMAR SV 
// DATE : 28/08/2026
// DESCRIPTION : Hall form page to create and edit hall
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { Building2, Clock, DoorOpen, Hash, LayoutGrid, MapPin, Sparkles, Users } from 'lucide-react';
import type { Hall } from '../../types/api';
import { HALL_TYPES } from '../../types/api';
import { Spinner } from '../../components/ui/Feedback';
import { celebrate } from '../../components/ui/SuccessFx';
import { GhostButton, PrimaryButton } from '../../components/ui/Form';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  fetchFacilitiesStart,
  fetchHallStart,
  saveHallResponseResetStart,
  saveHallStart,
} from '../../redux/halls/halls.action';
import {
  selectFacilities,
  selectHall,
  selectHallLoading,
  selectSaveHallLoading,
  selectSaveHallResponse,
} from '../../redux/halls/halls.selector';
import { useReduxResponse } from '../../redux/_common/useReduxResponse';
import { hallField, hallSchema, HallInput, HallValues } from '@/helpers/hall/facililitesValidation';

export function HallFormPage() {

  /******* STATE *******/
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  /******* SELECTORS *******/
  const existing = useAppSelector(selectHall) as Hall | null;
  const isLoading = useAppSelector(selectHallLoading);
  const facilities = useAppSelector(selectFacilities) as { Id: string; Name: string }[] | undefined;
  const savePending = useAppSelector(selectSaveHallLoading);
  const saveResponse = useAppSelector(selectSaveHallResponse);

  /******* EFFECTS *******/
  useEffect(() => {
    dispatch(fetchFacilitiesStart());
    if (id) dispatch(fetchHallStart({ id }));
  }, [id, dispatch]);

  /******* HANDLERS *******/
  const source = id ? existing : null;
  const initial: HallInput = {
    name: source?.Name ?? '',
    code: source?.Code ?? '',
    description: source?.Description ?? '',
    location: source?.Location ?? '',
    building: source?.Building ?? '',
    floor: source?.Floor ?? '',
    capacity: source?.Capacity ?? 20,
    hallType: source?.HallType ?? 'MEETING',
    openingTime: String(source?.OpeningTime ?? '08:00').slice(0, 5),
    closingTime: String(source?.ClosingTime ?? '20:00').slice(0, 5),
    facilityIds: source?.facilities?.map((f) => f.Id) ?? [],
    layouts: [{ name: 'Theatre', capacity: source?.Capacity ?? 20, isDefault: true }],
  };

  /******* FORM *******/
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<HallInput, unknown, HallValues>({
    resolver: zodResolver(hallSchema),
    defaultValues: initial,
  });

  const values = watch();

  /******* EFFECTS *******/
  useEffect(() => {
    reset(initial);
  }, [existing, id, reset]);

  /******* HANDLERS *******/
  const resetSave = useCallback(() => dispatch(saveHallResponseResetStart()), [dispatch]);
  useReduxResponse(saveResponse, resetSave, () => {
    celebrate(id ? 'Hall updated' : 'Hall created', 'It is now available for bookings.');
    navigate('/halls');
  });

  if (id && isLoading) return <Spinner />;

  return (
    <div className="animate-rise">
      <form
        className="overflow-hidden rounded-2xl border border-navy-800/10 bg-white shadow-panel"
        onSubmit={handleSubmit((v) => {
          const { layouts, ...rest } = v;
          dispatch(
            saveHallStart({
              id,
              ...rest,
              capacity: Number(v.capacity),
              openingTime: v.openingTime.length === 5 ? `${v.openingTime}:00` : v.openingTime,
              closingTime: v.closingTime.length === 5 ? `${v.closingTime}:00` : v.closingTime,
              ...(id ? {} : { layouts: layouts.map((l) => ({ ...l, capacity: Number(v.capacity) })) }),
            }),
          );
        })}
      >
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
                <PrimaryButton type="submit" disabled={savePending}>
                  {savePending ? 'Saving…' : id ? 'Save changes' : 'Create hall'}
                </PrimaryButton>
              </div>
            </div>

            <div className="grid lg:grid-cols-[minmax(0,1fr)_20rem]">
              <div className="space-y-6 p-4 sm:p-5">
                <Section icon={Building2} title="Identity" hint="How the hall is named and found.">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Labelled label="Hall name" error={errors.name?.message}>
                      <input placeholder="Auditorium" className={hallField} {...register('name')} />
                    </Labelled>
                    <Labelled
                      label="Hall code"
                      hint={id ? 'Fixed after creation' : 'Short unique ID, e.g. AUD-1'}
                      error={errors.code?.message}
                    >
                      <input placeholder="AUD-1" className={hallField} disabled={Boolean(id)} {...register('code')} />
                    </Labelled>
                    <Labelled label="Building">
                      <input placeholder="Tower C" className={hallField} {...register('building')} />
                    </Labelled>
                    <Labelled label="Floor">
                        <input placeholder="Ground" className={hallField} {...register('floor')} />
                    </Labelled>
                    <div className="sm:col-span-2">
                      <Labelled label="Location">
                        <input placeholder="Near the east lifts" className={hallField} {...register('location')} />
                      </Labelled>
                    </div>
                    <div className="sm:col-span-2">
                      <Labelled label="Description">
                        <textarea
                          rows={3}
                          placeholder="What this hall is best suited for"
                          className={`${hallField} resize-y`}
                          {...register('description')}
                        />
                      </Labelled>
                    </div>
                  </div>
                </Section>

                <Section icon={LayoutGrid} title="Capacity & hours" hint="Used to validate every booking request.">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <Labelled label="Capacity" error={errors.capacity?.message}>
                      <input type="number" min={1} className={hallField} {...register('capacity')} />
                    </Labelled>
                    <Labelled label="Hall type">
                      <select className={hallField} {...register('hallType')}>
                        {HALL_TYPES.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </Labelled>
                    <Labelled label="Opens">
                        <input type="time" className={hallField} {...register('openingTime')} />
                    </Labelled>
                    <Labelled label="Closes" error={errors.closingTime?.message}>
                      <input type="time" className={hallField} {...register('closingTime')} />
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
                              setValue(
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
          </form>
    </div>
  );
}

// HALL PREVIEW COMPONENT
function HallPreview({
  values,
  facilities,
}: {
  values: HallInput;
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

// PREVIEW ROW COMPONENT
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


// SECTION COMPONENT
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

// LABELED COMPONENT
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
export default HallFormPage;
// AUTHOR : NANDHAKUMAR S V
// DATE : 01/09/2026
// DESCRIPTION : Maintenance — downtime board with offcanvas scheduler
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarClock, Plus, Wrench } from 'lucide-react';
import type { Hall } from '../../types/api';
import { celebrate } from '../../components/ui/SuccessFx';
import { EmptyState, PageHeader, Spinner, StatusBadge } from '../../components/ui/Feedback';
import { Field, GhostButton, inputClass, Offcanvas, PrimaryButton } from '../../components/ui/Form';
import { SearchField, Toolbar } from '../../components/ui/Surface';
import { fmtDate, fmtTime, parseAppDate } from '../../utils/format';
import { usePermission } from '../../hooks/usePermission';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchHallsStart } from '../../redux/halls/halls.action';
import { selectHalls } from '../../redux/halls/halls.selector';
import {
  createMaintenanceResponseResetStart,
  createMaintenanceStart,
  fetchMaintenanceStart,
} from '../../redux/maintenance/maintenance.action';
import {
  selectCreateMaintenanceLoading,
  selectCreateMaintenanceResponse,
  selectMaintenance,
  selectMaintenanceLoading,
} from '../../redux/maintenance/maintenance.selector';
import { useReduxResponse } from '../../redux/_common/useReduxResponse';
import {
  FormData,
  Maint,
  MaintPhase,
  maintenanceDuration,
  maintenancePhase,
  schema,
} from '../../helpers/setting/settingValidation';

const PHASE_TABS = [
  ['all', 'All'],
  ['active', 'Active'],
  ['upcoming', 'Upcoming'],
  ['past', 'Closed'],
] as const;

const PHASE_COPY: Record<MaintPhase, { title: string; hint: string }> = {
  active: { title: 'Blocking now', hint: 'These halls cannot be booked until the window ends.' },
  upcoming: { title: 'Scheduled', hint: 'Upcoming downtime, still bookable until start.' },
  past: { title: 'Closed', hint: 'Finished or cancelled windows.' },
};

function StatTile({ label, value, hint }: { label: string; value: number; hint: string }) {
  return (
    <div className="rounded-2xl border border-navy-800/10 bg-white/85 px-4 py-3.5 shadow-panel">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-navy-800/45">{label}</p>
      <p className="mt-1 font-display text-3xl font-bold tracking-tight text-navy-900">{value}</p>
      <p className="mt-0.5 text-xs text-navy-800/50">{hint}</p>
    </div>
  );
}

function WindowCard({ item }: { item: Maint }) {
  const start = parseAppDate(item.StartAt);
  const end = parseAppDate(item.EndAt);
  const phase = maintenancePhase(item);
  const sameDay = fmtDate(start) === fmtDate(end);
  return (
    <article
      className={`grid overflow-hidden rounded-2xl border bg-white/90 shadow-panel sm:grid-cols-[6.25rem_minmax(0,1fr)] ${
        phase === 'active' ? 'border-amber-300/70' : 'border-navy-800/10'
      }`}
    >
      <div
        className={`flex flex-col items-center justify-center px-3 py-4 text-white ${
          phase === 'active' ? 'bg-amber-800' : 'bg-navy-900'
        }`}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">{format(start, 'EEE')}</p>
        <p className="mt-0.5 font-display text-4xl font-bold leading-none tracking-tight">{format(start, 'd')}</p>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
          {format(start, 'MMM yyyy')}
        </p>
      </div>
      <div className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-display text-base font-semibold text-navy-900">{item.Title}</h3>
            <p className="mt-0.5 text-sm text-navy-800/60">
              {item.HallName}
              {item.HallCode ? ` · ${item.HallCode}` : ''}
              <span className="text-navy-800/25"> · </span>
              {maintenanceDuration(item.StartAt, item.EndAt)}
            </p>
          </div>
          <StatusBadge value={phase === 'active' && item.Status === 'SCHEDULED' ? 'MAINTENANCE' : item.Status} />
        </div>
        <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-navy-800/75">
          <CalendarClock className="h-3.5 w-3.5" />
          {sameDay
            ? `${fmtTime(start)} – ${fmtTime(end)}`
            : `${fmtDate(start)} ${fmtTime(start)} – ${fmtDate(end)} ${fmtTime(end)}`}
        </p>
        {item.Description ? <p className="mt-2 text-sm text-navy-800/55">{item.Description}</p> : null}
        {phase === 'active' ? (
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.1em] text-amber-800">Hall blocked now</p>
        ) : null}
      </div>
    </article>
  );
}

export function MaintenancePage() {
  const { can } = usePermission();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [hallFilter, setHallFilter] = useState('');
  const [phaseFilter, setPhaseFilter] = useState<(typeof PHASE_TABS)[number][0]>('all');

  const data = useAppSelector(selectMaintenance) as Maint[] | undefined;
  const isLoading = useAppSelector(selectMaintenanceLoading);
  const halls = useAppSelector(selectHalls) as Hall[] | undefined;
  const creating = useAppSelector(selectCreateMaintenanceLoading);
  const createResponse = useAppSelector(selectCreateMaintenanceResponse);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { hallId: '', title: '', startAt: '', endAt: '', description: '' },
  });

  useEffect(() => {
    dispatch(fetchMaintenanceStart());
    dispatch(fetchHallsStart());
  }, [dispatch]);

  const resetCreate = useCallback(() => dispatch(createMaintenanceResponseResetStart()), [dispatch]);
  useReduxResponse(createResponse, resetCreate, () => {
    celebrate('Maintenance scheduled', 'The hall is blocked for that window.');
    form.reset();
    setOpen(false);
    dispatch(fetchMaintenanceStart());
  });

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return (data ?? []).filter((item) => {
      if (hallFilter) {
        const hall = (halls ?? []).find((h) => h.Id === hallFilter);
        if (item.HallId ? item.HallId !== hallFilter : hall && item.HallName !== hall.Name) return false;
      }
      if (phaseFilter !== 'all' && maintenancePhase(item) !== phaseFilter) return false;
      if (!query) return true;
      return [item.Title, item.HallName, item.HallCode, item.Description, item.Status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [data, hallFilter, halls, phaseFilter, q]);

  const grouped = useMemo(() => {
    const buckets: Record<MaintPhase, Maint[]> = { active: [], upcoming: [], past: [] };
    for (const item of rows) buckets[maintenancePhase(item)].push(item);
    return buckets;
  }, [rows]);

  const counts = useMemo(() => {
    const all = data ?? [];
    return {
      active: all.filter((item) => maintenancePhase(item) === 'active').length,
      upcoming: all.filter((item) => maintenancePhase(item) === 'upcoming').length,
      past: all.filter((item) => maintenancePhase(item) === 'past').length,
    };
  }, [data]);

  const sections = (['active', 'upcoming', 'past'] as const).filter((phase) => grouped[phase].length);

  return (
    <div>
      <PageHeader
        title="Maintenance"
        description="See which halls are down, what’s next, and schedule a new block without leaving this board."
        actions={
          can('maintenance.manage') ? (
            <PrimaryButton type="button" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" />
              Schedule window
            </PrimaryButton>
          ) : null
        }
      />
      <Toolbar>
        <SearchField value={q} onChange={setQ} placeholder="Search title or hall" />
        <select
          className={`${inputClass} sm:max-w-[14rem]`}
          value={hallFilter}
          onChange={(e) => setHallFilter(e.target.value)}
          aria-label="Filter by hall"
        >
          <option value="">All halls</option>
          {(halls ?? []).map((hall) => (
            <option key={hall.Id} value={hall.Id}>
              {hall.Name}
            </option>
          ))}
        </select>
      </Toolbar>

      {isLoading ? (
        <Spinner />
      ) : !rows.length ? (
        <EmptyState
          title={data?.length ? 'No windows match these filters' : 'No maintenance scheduled'}
          hint={can('maintenance.manage') ? 'Schedule a window to block a hall for downtime.' : undefined}
        />
      ) : (
        <div className="space-y-6">
          {sections.map((phase) => (
            <section key={phase}>
              <div className="mb-3 flex items-center gap-2">
                <Wrench className="h-4 w-4 text-navy-800/40" />
                <div>
                  <h2 className="font-display text-sm font-semibold text-navy-900">{PHASE_COPY[phase].title}</h2>
                  <p className="text-xs text-navy-800/50">{PHASE_COPY[phase].hint}</p>
                </div>
              </div>
              <div className="grid gap-3 xl:grid-cols-2">
                {grouped[phase].map((item) => (
                  <WindowCard key={item.Id} item={item} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <Offcanvas
        open={open}
        title="Schedule a window"
        subtitle="The hall is marked unavailable for this period."
        onClose={() => setOpen(false)}
        footer={
          <div className="flex justify-end gap-2">
            <GhostButton type="button" onClick={() => setOpen(false)}>
              Cancel
            </GhostButton>
            <PrimaryButton type="submit" form="maintenance-schedule-form" disabled={creating}>
              {creating ? 'Scheduling…' : 'Schedule'}
            </PrimaryButton>
          </div>
        }
      >
        <form
          id="maintenance-schedule-form"
          onSubmit={form.handleSubmit((values) =>
            dispatch(
              createMaintenanceStart({
                ...values,
                startAt: new Date(values.startAt).toISOString(),
                endAt: new Date(values.endAt).toISOString(),
              }),
            ),
          )}
        >
          <Field label="Hall" hint={form.formState.errors.hallId?.message}>
            <select className={inputClass} {...form.register('hallId')}>
              <option value="">Select a hall</option>
              {(halls ?? []).map((hall) => (
                <option key={hall.Id} value={hall.Id}>
                  {hall.Name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Title" hint={form.formState.errors.title?.message}>
            <input className={inputClass} placeholder="AC service, painting, AV repair…" {...form.register('title')} />
          </Field>
          <Field label="Notes" hint={form.formState.errors.description?.message}>
            <textarea className={`${inputClass} min-h-[6rem] resize-y`} {...form.register('description')} />
          </Field>
          <div className="grid gap-x-3 sm:grid-cols-2">
            <Field label="Start" hint={form.formState.errors.startAt?.message}>
              <input type="datetime-local" className={inputClass} {...form.register('startAt')} />
            </Field>
            <Field label="End" hint={form.formState.errors.endAt?.message}>
              <input type="datetime-local" className={inputClass} {...form.register('endAt')} />
            </Field>
          </div>
        </form>
      </Offcanvas>
    </div>
  );
}

export default MaintenancePage;

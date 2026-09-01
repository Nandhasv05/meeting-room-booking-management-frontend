// AUTHOR : NANDNHAKUMAR SV 
// DATE : 01/09/2026
// DESCRIPTION : Halls page — catalog plus inline status / maintenance
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addHours, format } from 'date-fns';
import { Building2, Pencil, Plus, Users, Wrench } from 'lucide-react';
import type { Hall } from '../../types/api';
import { hallStatusOptions } from '../../types/api';
import { celebrate } from '../../components/ui/SuccessFx';
import { EmptyState, Spinner, StatusBadge } from '../../components/ui/Feedback';
import { Field, GhostButton, inputClass, Offcanvas, PrimaryButton } from '../../components/ui/Form';
import { SearchField, Toolbar } from '../../components/ui/Surface';
import { usePermission } from '../../hooks/usePermission';
import { useRealtime } from '../../hooks/useRealtime';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  fetchHallsStart,
  saveHallResponseResetStart,
  saveHallStart,
} from '../../redux/halls/halls.action';
import {
  selectHalls,
  selectHallsLoading,
  selectSaveHallLoading,
  selectSaveHallResponse,
} from '../../redux/halls/halls.selector';
import {
  createMaintenanceResponseResetStart,
  createMaintenanceStart,
  fetchMaintenanceStart,
} from '../../redux/maintenance/maintenance.action';
import {
  selectCreateMaintenanceLoading,
  selectCreateMaintenanceResponse,
  selectMaintenance,
} from '../../redux/maintenance/maintenance.selector';
import { useReduxResponse } from '../../redux/_common/useReduxResponse';
import { FormData, Maint, maintenanceDuration, schema } from '../../helpers/setting/settingValidation';
import { fmtDateTime } from '../../utils/format';

function localInput(d: Date) {
  return format(d, "yyyy-MM-dd'T'HH:mm");
}

export function HallsPage() {
  const { can } = usePermission();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const canEditStatus = can('halls.update');
  const canSchedule = can('maintenance.manage');

  const data = useAppSelector(selectHalls) as Hall[] | undefined;
  const isLoading = useAppSelector(selectHallsLoading);
  const savePending = useAppSelector(selectSaveHallLoading);
  const saveResponse = useAppSelector(selectSaveHallResponse);
  const creating = useAppSelector(selectCreateMaintenanceLoading);
  const createResponse = useAppSelector(selectCreateMaintenanceResponse);
  const maintenance = useAppSelector(selectMaintenance) as Maint[] | undefined;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { hallId: '', title: '', startAt: '', endAt: '', description: '' },
  });

  useEffect(() => {
    dispatch(fetchHallsStart({ q }));
    dispatch(fetchMaintenanceStart());
  }, [q, dispatch]);
  useRealtime(['dashboard'], () => {
    dispatch(fetchHallsStart({ q }));
    dispatch(fetchMaintenanceStart());
  });

  const resetSave = useCallback(() => dispatch(saveHallResponseResetStart()), [dispatch]);
  useReduxResponse(saveResponse, resetSave, () => {
    celebrate('Hall status updated', 'The conference hall is now showing the new status.');
    dispatch(fetchHallsStart({ q }));
  });

  const resetCreate = useCallback(() => dispatch(createMaintenanceResponseResetStart()), [dispatch]);
  useReduxResponse(createResponse, resetCreate, () => {
    celebrate('Maintenance scheduled', 'The hall is blocked for that window.');
    form.reset();
    setOpen(false);
    dispatch(fetchHallsStart({ q }));
    dispatch(fetchMaintenanceStart());
  });

  const openScheduler = useCallback(
    (hall: Hall) => {
      const start = new Date();
      form.reset({
        hallId: hall.Id,
        title: 'Maintenance',
        startAt: localInput(start),
        endAt: localInput(addHours(start, 2)),
        description: '',
      });
      setOpen(true);
    },
    [form],
  );

  const onStatusChange = useCallback(
    (hall: Hall, status: string) => {
      if (status === hall.Status) return;
      dispatch(saveHallStart({ id: hall.Id, status }));
      if (status === 'MAINTENANCE' && canSchedule) openScheduler(hall);
    },
    [canSchedule, dispatch, openScheduler],
  );

  const selectedHallId = form.watch('hallId');
  const selectedHallName = useMemo(
    () => (data ?? []).find((h) => h.Id === selectedHallId)?.Name,
    [data, selectedHallId],
  );

  const windowsFor = useCallback(
    (hall: Hall) =>
      (maintenance ?? []).filter((item) => {
        if (item.HallId) return String(item.HallId) === String(hall.Id);
        return item.HallName === hall.Name;
      }),
    [maintenance],
  );

  return (
    <div>
      <Toolbar>
        <SearchField value={q} onChange={setQ} placeholder="Search halls" />
        <div className="flex flex-wrap gap-2 justify-end items-center">
          {can('halls.manage_facilities') ? (
            <Link to="/halls/facilities">
              <GhostButton type="button">Facilities</GhostButton>
            </Link>
          ) : null}
          {can('halls.create') ? (
            <Link to="/halls/new">
              <PrimaryButton>
                <Plus className="h-4 w-4" />
                Add hall
              </PrimaryButton>
            </Link>
          ) : null}
        </div>
      </Toolbar>

      {isLoading ? (
        <Spinner />
      ) : !data?.length ? (
        <EmptyState title="No halls found" hint="Try a different search, or add a new hall." />
      ) : (
        <ul className="stagger grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((h) => (
            <li key={h.Id}>
              <div className="group flex h-full flex-col rounded-2xl border border-navy-800/10 bg-white/85 p-5 shadow-panel backdrop-blur-sm transition hover:-translate-y-1 hover:border-brand-400/35 hover:shadow-lift">
                <Link to={`/halls/${h.Id}`} className="flex flex-1 flex-col">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-100 text-brand-600 transition group-hover:bg-navy-900 group-hover:text-white">
                      <Building2 className="h-5 w-5" />
                    </span>
                    {!canEditStatus ? <StatusBadge value={h.Status} /> : null}
                  </div>
                  <p className="font-display text-lg font-semibold text-navy-900">{h.Name}</p>
                  <p className="text-sm text-navy-800/50">
                    {h.Code} · {h.Building} · L{h.Floor}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-navy-800/8 pt-3 text-sm text-navy-800/70">
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-navy-800/40" />
                      {h.Capacity} seats
                    </span>
                    <span className="font-medium">
                      {String(h.OpeningTime).slice(0, 5)}–{String(h.ClosingTime).slice(0, 5)}
                    </span>
                  </div>
                </Link>
                {canEditStatus ? (
                  <div
                    className="mt-3 flex items-center gap-2 border-t border-navy-800/8 pt-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <label className="sr-only" htmlFor={`hall-status-${h.Id}`}>
                      Status for {h.Name}
                    </label>
                    <select
                      id={`hall-status-${h.Id}`}
                      className={`${inputClass} py-2 text-xs font-semibold uppercase tracking-[0.08em]`}
                      value={h.Status}
                      disabled={savePending}
                      onChange={(e) => onStatusChange(h, e.target.value)}
                    >
                      {hallStatusOptions(h.Status).map((status) => (
                        <option key={status} value={status}>
                          {status.replaceAll('_', ' ')}
                        </option>
                      ))}
                    </select>
                    {canSchedule && h.Status === 'MAINTENANCE' ? (
                      <GhostButton
                        type="button"
                        className="shrink-0 px-3 py-2"
                        onClick={() => openScheduler(h)}
                      >
                        <Wrench className="h-3.5 w-3.5" />
                        Window
                      </GhostButton>
                    ) : null}
                    {can('halls.update') ? (
                      <Link to={`/halls/${h.Id}/edit`} className="shrink-0">
                        <GhostButton type="button" className="px-3 py-2">
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </GhostButton>
                      </Link>
                    ) : null}
                  </div>
                ) : null}
                {h.Status === 'MAINTENANCE' ? (
                  <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2.5">
                    <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-800">
                      Maintenance
                    </p>
                    {windowsFor(h).length ? (
                      <ul className="space-y-1.5">
                        {windowsFor(h).map((item) => (
                          <li key={item.Id} className="text-xs text-navy-800/75">
                            <span className="font-semibold text-navy-900">{item.Title}</span>
                            <span className="block text-navy-800/55">
                              {fmtDateTime(item.StartAt)} – {fmtDateTime(item.EndAt)} · {maintenanceDuration(item.StartAt, item.EndAt)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-navy-800/55">No window scheduled yet.</p>
                    )}
                  </div>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}

      <Offcanvas
        open={open}
        title="Schedule maintenance"
        subtitle={selectedHallName ? `${selectedHallName} will be blocked for this window.` : 'The hall is marked unavailable for this period.'}
        onClose={() => setOpen(false)}
        footer={
          <div className="flex justify-end gap-2">
            <GhostButton type="button" onClick={() => setOpen(false)}>
              Cancel
            </GhostButton>
            <PrimaryButton type="submit" form="hall-maintenance-form" disabled={creating}>
              {creating ? 'Scheduling…' : 'Schedule'}
            </PrimaryButton>
          </div>
        }
      >
        <form
          id="hall-maintenance-form"
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
          <input type="hidden" {...form.register('hallId')} />
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
export default HallsPage;

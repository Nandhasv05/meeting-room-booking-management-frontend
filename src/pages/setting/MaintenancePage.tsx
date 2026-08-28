// AUTHOR : NANDNHAKUMAR SV 
// DATE : 28/08/2026
// DESCRIPTION : Maintenance page to view maintenance
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { celebrate } from '../../components/ui/SuccessFx';
import type { Hall } from '../../types/api';
import { EmptyState, PageHeader, Spinner, StatusBadge } from '../../components/ui/Feedback';
import { Field as Labeled, inputClass, PrimaryButton } from '../../components/ui/Form';
import { Card, CardHeader, DataTable, type Column } from '../../components/ui/Surface';
import { fmtDateTime } from '../../utils/format';
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
import { Maint, schema, FormData } from '../../helpers/setting/settingValidation';

export function MaintenancePage() {

  /******* STATE *******/
  const { can } = usePermission();
  const dispatch = useAppDispatch();

  /******* SELECTORS *******/
  const data = useAppSelector(selectMaintenance) as Maint[] | undefined;
  const isLoading = useAppSelector(selectMaintenanceLoading);
  const halls = useAppSelector(selectHalls) as Hall[] | undefined;
  const creating = useAppSelector(selectCreateMaintenanceLoading);
  const createResponse = useAppSelector(selectCreateMaintenanceResponse);

  /******* FORM *******/
  const { register, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { hallId: '', title: '', startAt: '', endAt: '', description: '' },
  });

  /******* EFFECTS *******/
  useEffect(() => {
    dispatch(fetchMaintenanceStart());
    dispatch(fetchHallsStart());
  }, [dispatch]);

  /******* HANDLERS *******/
  const resetCreate = useCallback(() => dispatch(createMaintenanceResponseResetStart()), [dispatch]);
  useReduxResponse(createResponse, resetCreate, () => {
    celebrate('Maintenance scheduled', 'The hall is blocked for that window.');
    reset();
    dispatch(fetchMaintenanceStart());
  });

  /******* COLUMNS *******/
  const columns: Column<Maint>[] = [
    { key: 'hall', header: 'Hall', render: (m) => <span className="font-semibold text-navy-900">{m.HallName}</span> },
    { key: 'title', header: 'Title', render: (m) => m.Title },
    {
      key: 'window',
      header: 'Window',
      render: (m) => (
        <span className="whitespace-nowrap text-navy-800/70">
          {fmtDateTime(m.StartAt)} – {fmtDateTime(m.EndAt)}
        </span>
      ),
    },
    { key: 'status', header: 'Status', render: (m) => <StatusBadge value={m.Status} /> },
  ];

  return (
    <div>
      <PageHeader title="Maintenance" description="Blocks hall availability for overlapping windows." />
      {can('maintenance.manage') ? (
        <Card className="mb-5">
          <CardHeader title="Schedule a window" subtitle="The hall is marked unavailable for this period." />
          <form
            className="grid gap-x-4 md:grid-cols-2"
            onSubmit={handleSubmit((v) =>
              dispatch(
                createMaintenanceStart({
                  ...v,
                  startAt: new Date(v.startAt).toISOString(),
                  endAt: new Date(v.endAt).toISOString(),
                }),
              ),
            )}
          >
            <Labeled label="Hall">
              <select className={inputClass} {...register('hallId')}>
                <option value="">Select</option>
                {(halls ?? []).map((h) => (
                  <option key={h.Id} value={h.Id}>
                    {h.Name}
                  </option>
                ))}
              </select>
            </Labeled>
            <Labeled label="Title">
              <input className={inputClass} {...register('title')} />
            </Labeled>
            <Labeled label="Start">
              <input type="datetime-local" className={inputClass} {...register('startAt')} />
            </Labeled>
            <Labeled label="End">
              <input type="datetime-local" className={inputClass} {...register('endAt')} />
            </Labeled>
            <div className="md:col-span-2">
              <PrimaryButton type="submit" disabled={creating}>
                Schedule
              </PrimaryButton>
            </div>
          </form>
        </Card>
      ) : null}
      {isLoading ? (
        <Spinner />
      ) : !data?.length ? (
        <EmptyState title="No maintenance scheduled" />
      ) : (
        <DataTable columns={columns} rows={data} rowKey={(m) => m.Id} />
      )}
    </div>
  );
}
export default MaintenancePage;
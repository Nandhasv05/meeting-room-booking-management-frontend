import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Formik, Form, Field } from 'formik';
import toast from 'react-hot-toast';
import { api, apiError, unwrap } from '../services/api';
import { celebrate } from '../components/ui/SuccessFx';
import type { Hall } from '../types/api';
import { EmptyState, PageHeader, Spinner, StatusBadge } from '../components/ui/Feedback';
import { Field as Labeled, inputClass, PrimaryButton } from '../components/ui/Form';
import { Card, CardHeader, DataTable, type Column } from '../components/ui/Surface';
import { fmtDateTime } from '../utils/format';
import { usePermission } from '../hooks/usePermission';

type Maint = {
  Id: string;
  HallName: string;
  Title: string;
  StartAt: string;
  EndAt: string;
  Status: string;
};

export function MaintenancePage() {
  const { can } = usePermission();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['maintenance'],
    queryFn: () => unwrap<Maint[]>(api.get('/maintenance')),
  });
  const { data: halls } = useQuery({
    queryKey: ['halls'],
    queryFn: () => unwrap<Hall[]>(api.get('/halls')),
  });
  const create = useMutation({
    mutationFn: (body: object) => unwrap(api.post('/maintenance', body)),
    onSuccess: () => {
      celebrate('Maintenance scheduled', 'The hall is blocked for that window.');
      void qc.invalidateQueries({ queryKey: ['maintenance'] });
    },
    onError: (e) => toast.error(apiError(e)),
  });

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
          <Formik
            initialValues={{ hallId: '', title: '', startAt: '', endAt: '', description: '' }}
            onSubmit={(v) =>
              create.mutate({
                ...v,
                startAt: new Date(v.startAt).toISOString(),
                endAt: new Date(v.endAt).toISOString(),
              })
            }
          >
            <Form className="grid gap-x-4 md:grid-cols-2">
              <Labeled label="Hall">
                <Field as="select" name="hallId" className={inputClass}>
                  <option value="">Select</option>
                  {(halls ?? []).map((h) => (
                    <option key={h.Id} value={h.Id}>
                      {h.Name}
                    </option>
                  ))}
                </Field>
              </Labeled>
              <Labeled label="Title">
                <Field name="title" className={inputClass} />
              </Labeled>
              <Labeled label="Start">
                <Field name="startAt" type="datetime-local" className={inputClass} />
              </Labeled>
              <Labeled label="End">
                <Field name="endAt" type="datetime-local" className={inputClass} />
              </Labeled>
              <div className="md:col-span-2">
                <PrimaryButton type="submit" disabled={create.isPending}>
                  Schedule
                </PrimaryButton>
              </div>
            </Form>
          </Formik>
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

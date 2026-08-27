import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Formik, Form, Field } from 'formik';
import toast from 'react-hot-toast';
import { api, apiError, unwrap } from '../services/api';
import { celebrate } from '../components/ui/SuccessFx';
import { EmptyState, PageHeader, Spinner, StatusBadge } from '../components/ui/Feedback';
import { Field as Labeled, inputClass, PrimaryButton } from '../components/ui/Form';
import { Card, CardHeader, DataTable, type Column } from '../components/ui/Surface';

type Department = { Id: string; Code: string; Name: string; IsActive: boolean };

export function DepartmentsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['departments-all'],
    queryFn: () => unwrap<Department[]>(api.get('/departments', { params: { all: 'true' } })),
  });
  const create = useMutation({
    mutationFn: (body: object) => unwrap(api.post('/departments', body)),
    onSuccess: () => {
      celebrate('Department created');
      void qc.invalidateQueries({ queryKey: ['departments-all'] });
    },
    onError: (e) => toast.error(apiError(e)),
  });

  const columns: Column<Department>[] = [
    {
      key: 'code',
      header: 'Code',
      render: (d) => (
        <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-bold text-navy-700">{d.Code}</span>
      ),
    },
    { key: 'name', header: 'Name', render: (d) => <span className="font-semibold text-navy-900">{d.Name}</span> },
    { key: 'status', header: 'Status', render: (d) => <StatusBadge value={d.IsActive ? 'ACTIVE' : 'DISABLED'} /> },
  ];

  return (
    <div className="max-w-4xl">
      <PageHeader title="Departments" description="Organisational units that own bookings." />
      <Card className="mb-5">
        <CardHeader title="Add a department" />
        <Formik
          initialValues={{ code: '', name: '', description: '' }}
          onSubmit={(v, h) => {
            create.mutate(v);
            h.resetForm();
          }}
        >
          <Form className="grid items-start gap-x-4 md:grid-cols-[1fr_2fr_auto]">
            <Labeled label="Code">
              <Field name="code" className={inputClass} />
            </Labeled>
            <Labeled label="Name">
              <Field name="name" className={inputClass} />
            </Labeled>
            <div className="mb-3.5 flex items-end pt-[1.6rem]">
              <PrimaryButton type="submit" disabled={create.isPending}>
                Add
              </PrimaryButton>
            </div>
          </Form>
        </Formik>
      </Card>
      {isLoading ? (
        <Spinner />
      ) : !data?.length ? (
        <EmptyState title="No departments yet" />
      ) : (
        <DataTable columns={columns} rows={data} rowKey={(d) => d.Id} />
      )}
    </div>
  );
}

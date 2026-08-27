import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Formik, Form, Field } from 'formik';
import toast from 'react-hot-toast';
import { api, apiError, unwrap } from '../services/api';
import { celebrate } from '../components/ui/SuccessFx';
import { EmptyState, PageHeader, Spinner } from '../components/ui/Feedback';
import { Field as Labeled, inputClass, PrimaryButton } from '../components/ui/Form';
import { Card, CardHeader, ListCard } from '../components/ui/Surface';
import { usePermission } from '../hooks/usePermission';

type Fac = { Id: string; Code: string; Name: string; IsActive: boolean };

export function FacilitiesPage() {
  const { can } = usePermission();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['facilities'],
    queryFn: () => unwrap<Fac[]>(api.get('/facilities')),
  });
  const create = useMutation({
    mutationFn: (body: object) => unwrap(api.post('/facilities', body)),
    onSuccess: () => {
      celebrate('Facility added');
      void qc.invalidateQueries({ queryKey: ['facilities'] });
    },
    onError: (e) => toast.error(apiError(e)),
  });
  return (
    <div className="max-w-3xl">
      <PageHeader title="Facilities catalog" description="Projector, AV, catering, and other hall amenities." />
      {can('halls.manage_facilities') ? (
        <Card className="mb-5">
          <CardHeader title="Add a facility" />
          <Formik
            initialValues={{ code: '', name: '' }}
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
      ) : null}
      {isLoading ? (
        <Spinner />
      ) : !data?.length ? (
        <EmptyState title="No facilities yet" />
      ) : (
        <ListCard>
          {data.map((f) => (
            <li key={f.Id} className="flex items-center justify-between px-4 py-3.5 text-sm transition hover:bg-brand-50/50">
              <span className="font-semibold text-navy-900">{f.Name}</span>
              <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-bold text-navy-700">{f.Code}</span>
            </li>
          ))}
        </ListCard>
      )}
    </div>
  );
}

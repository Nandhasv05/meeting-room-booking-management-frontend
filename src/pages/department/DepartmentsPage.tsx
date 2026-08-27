import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { celebrate } from '../../components/ui/SuccessFx';
import { EmptyState, PageHeader, Spinner, StatusBadge } from '../../components/ui/Feedback';
import { Field as Labeled, inputClass, PrimaryButton } from '../../components/ui/Form';
import { Card, CardHeader, DataTable, type Column } from '../../components/ui/Surface';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  createDepartmentResponseResetStart,
  createDepartmentStart,
  fetchDepartmentsStart,
} from '../../redux/departments/departments.action';
import {
  selectCreateDepartmentLoading,
  selectCreateDepartmentResponse,
  selectDepartments,
  selectDepartmentsLoading,
} from '../../redux/departments/departments.selector';
import { useReduxResponse } from '../../redux/_common/useReduxResponse';

type Department = { Id: string; Code: string; Name: string; IsActive: boolean };

const schema = z.object({
  code: z.string().min(1, 'Code is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function DepartmentsPage() {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectDepartments) as Department[] | undefined;
  const isLoading = useAppSelector(selectDepartmentsLoading);
  const creating = useAppSelector(selectCreateDepartmentLoading);
  const createResponse = useAppSelector(selectCreateDepartmentResponse);

  const { register, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { code: '', name: '', description: '' },
  });

  useEffect(() => {
    dispatch(fetchDepartmentsStart({ all: 'true' }));
  }, [dispatch]);

  const resetCreate = useCallback(() => dispatch(createDepartmentResponseResetStart()), [dispatch]);
  useReduxResponse(createResponse, resetCreate, () => {
    celebrate('Department created');
    reset({ code: '', name: '', description: '' });
    dispatch(fetchDepartmentsStart({ all: 'true' }));
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
        <form
          className="grid items-start gap-x-4 md:grid-cols-[1fr_2fr_auto]"
          onSubmit={handleSubmit((v) => dispatch(createDepartmentStart(v)))}
        >
          <Labeled label="Code">
            <input className={inputClass} {...register('code')} />
          </Labeled>
          <Labeled label="Name">
            <input className={inputClass} {...register('name')} />
          </Labeled>
          <div className="mb-3.5 flex items-end pt-[1.6rem]">
            <PrimaryButton type="submit" disabled={creating}>
              Add
            </PrimaryButton>
          </div>
        </form>
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

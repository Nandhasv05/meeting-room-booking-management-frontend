// AUTHOR : NANDNHAKUMAR SV 
// DATE : 28/08/2026
// DESCRIPTION : Facilities page to view facilities
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { celebrate } from '../../components/ui/SuccessFx';
import { EmptyState, PageHeader, Spinner } from '../../components/ui/Feedback';
import { Field as Labeled, inputClass, PrimaryButton } from '../../components/ui/Form';
import { Card, CardHeader, ListCard } from '../../components/ui/Surface';
import { usePermission } from '../../hooks/usePermission';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  createFacilityResponseResetStart,
  createFacilityStart,
  fetchFacilitiesStart,
} from '../../redux/halls/halls.action';
import {
  selectCreateFacilityLoading,
  selectCreateFacilityResponse,
  selectFacilities,
  selectFacilitiesLoading,
} from '../../redux/halls/halls.selector';
import { useReduxResponse } from '../../redux/_common/useReduxResponse';
import { Fac, schema, FormData } from '../../helpers/hall/facililitesValidation';

export function FacilitiesPage() {

  /******* STATE *******/
  const { can } = usePermission();
  const dispatch = useAppDispatch();

  /******* SELECTORS *******/
  const data = useAppSelector(selectFacilities) as Fac[] | undefined;
  const isLoading = useAppSelector(selectFacilitiesLoading);
  const creating = useAppSelector(selectCreateFacilityLoading);
  const createResponse = useAppSelector(selectCreateFacilityResponse);

  /******* FORM *******/
  const { register, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { code: '', name: '' },
  });

  /******* EFFECTS *******/
  useEffect(() => {
    dispatch(fetchFacilitiesStart());
  }, [dispatch]);

  /******* HANDLERS *******/
  const resetCreate = useCallback(() => dispatch(createFacilityResponseResetStart()), [dispatch]);
  useReduxResponse(createResponse, resetCreate, () => {
    celebrate('Facility added');
    reset({ code: '', name: '' });
    dispatch(fetchFacilitiesStart());
  });

  return (
    <div className="max-w-3xl">
      <PageHeader title="Facilities catalog" description="Projector, AV, catering, and other hall amenities." />
      {can('halls.manage_facilities') ? (
        <Card className="mb-5">
          <CardHeader title="Add a facility" />
          <form
            className="grid items-start gap-x-4 md:grid-cols-[1fr_2fr_auto]"
            onSubmit={handleSubmit((v) => dispatch(createFacilityStart(v)))}
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
export default FacilitiesPage;
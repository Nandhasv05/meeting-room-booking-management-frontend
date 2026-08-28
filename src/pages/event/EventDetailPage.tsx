// AUTHOR : NANDNHAKUMAR SV 
// DATE : 27/08/2026
// DESCRIPTION : Event detail page to view event detail
import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { celebrate } from '../../components/ui/SuccessFx';
import { PageHeader, Spinner } from '../../components/ui/Feedback';
import { Field as Labeled, inputClass, PrimaryButton } from '../../components/ui/Form';
import { Card, CardHeader, DefinitionItem } from '../../components/ui/Surface';
import { fmtDateTime } from '../../utils/format';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  fetchEventStart,
  updateEventResponseResetStart,
  updateEventStart,
} from '../../redux/events/events.action';
import {
  selectEvent,
  selectEventLoading,
  selectUpdateEventLoading,
  selectUpdateEventResponse,
} from '../../redux/events/events.selector';
import { useReduxResponse } from '../../redux/_common/useReduxResponse';
import { EventDetail, schema, FormData, FormInput } from '../../helpers/event/eventValidation';

export function EventDetailPage() {
  /******* STATE *******/
  const { id } = useParams();
  const dispatch = useAppDispatch();


  /******* SELECTORS *******/
  const data = useAppSelector(selectEvent) as EventDetail | null;
  const isLoading = useAppSelector(selectEventLoading);
  const saving = useAppSelector(selectUpdateEventLoading);
  const saveResponse = useAppSelector(selectUpdateEventResponse);

  /******* FORM *******/
  const { register, handleSubmit, reset } = useForm<FormInput, unknown, FormData>({
    resolver: zodResolver(schema),
    defaultValues: { description: '', expectedAttendees: 0, actualAttendees: 0, requirements: '' },
  });

  /******* EFFECTS *******/
  useEffect(() => {
    if (id) dispatch(fetchEventStart({ id }));
  }, [id, dispatch]);

  /******* EFFECTS *******/
  useEffect(() => {
    if (!data) return;
    reset({
      description: data.Description ?? '',
      expectedAttendees: data.ExpectedAttendees,
      actualAttendees: data.ActualAttendees ?? 0,
      requirements: data.Requirements ?? '',
    });
  }, [data, reset]);

  /******* HANDLERS *******/
  const resetSave = useCallback(() => dispatch(updateEventResponseResetStart()), [dispatch]);
  useReduxResponse(saveResponse, resetSave, () => {
    celebrate('Event updated');
    if (id) dispatch(fetchEventStart({ id }));
  });

  /******* RENDER *******/
  if (isLoading || !data) return <Spinner />;
  return (
    <div className="max-w-3xl">
      <PageHeader title={data.EventName} description={`${data.HallName} · ${fmtDateTime(data.StartAt)}`} />
      <Card className="mb-4">
        <dl className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          <DefinitionItem label="Organizer" value={data.OrganizerName} />
          <DefinitionItem label="Contact" value={data.Contact ?? '—'} />
          <DefinitionItem label="Type" value={data.EventType} />
        </dl>
      </Card>
      <form
        onSubmit={handleSubmit((v) => {
          if (id) dispatch(updateEventStart({ id, body: v }));
        })}
      >
        <Card>
          <CardHeader title="Event record" subtitle="Update the brief and headcount after the session." />
          <Labeled label="Description">
            <textarea rows={4} className={inputClass} {...register('description')} />
          </Labeled>
          <div className="grid gap-x-4 sm:grid-cols-2">
            <Labeled label="Expected attendees">
              <input type="number" className={inputClass} {...register('expectedAttendees')} />
            </Labeled>
            <Labeled label="Actual attendees">
              <input type="number" className={inputClass} {...register('actualAttendees')} />
            </Labeled>
          </div>
          <Labeled label="Requirements">
            <textarea rows={3} className={inputClass} {...register('requirements')} />
          </Labeled>
          <PrimaryButton type="submit" disabled={saving}>
            Save event
          </PrimaryButton>
        </Card>
      </form>
    </div>
  );
}

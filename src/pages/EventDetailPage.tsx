import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import toast from 'react-hot-toast';
import { api, apiError, unwrap } from '../services/api';
import { celebrate } from '../components/ui/SuccessFx';
import { PageHeader, Spinner } from '../components/ui/Feedback';
import { Field as Labeled, inputClass, PrimaryButton } from '../components/ui/Form';
import { Card, CardHeader, DefinitionItem } from '../components/ui/Surface';
import { fmtDateTime } from '../utils/format';

type EventDetail = {
  Id: string;
  BookingId: string;
  EventName: string;
  EventType: string;
  Description: string | null;
  ExpectedAttendees: number;
  ActualAttendees: number | null;
  Requirements: string | null;
  HallName: string;
  OrganizerName: string;
  Contact: string | null;
  StartAt: string;
  EndAt: string;
  Purpose: string | null;
};

export function EventDetailPage() {
  const { id } = useParams();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => unwrap<EventDetail>(api.get(`/events/${id}`)),
  });
  const save = useMutation({
    mutationFn: (body: object) => unwrap(api.patch(`/events/${id}`, body)),
    onSuccess: () => {
      celebrate('Event updated');
      void qc.invalidateQueries({ queryKey: ['event', id] });
    },
    onError: (e) => toast.error(apiError(e)),
  });
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
      <Formik
        enableReinitialize
        initialValues={{
          description: data.Description ?? '',
          expectedAttendees: data.ExpectedAttendees,
          actualAttendees: data.ActualAttendees ?? 0,
          requirements: data.Requirements ?? '',
        }}
        onSubmit={(v) => save.mutate(v)}
      >
        <Form>
          <Card>
            <CardHeader title="Event record" subtitle="Update the brief and headcount after the session." />
            <Labeled label="Description">
              <Field as="textarea" name="description" rows={4} className={inputClass} />
            </Labeled>
            <div className="grid gap-x-4 sm:grid-cols-2">
              <Labeled label="Expected attendees">
                <Field type="number" name="expectedAttendees" className={inputClass} />
              </Labeled>
              <Labeled label="Actual attendees">
                <Field type="number" name="actualAttendees" className={inputClass} />
              </Labeled>
            </div>
            <Labeled label="Requirements">
              <Field as="textarea" name="requirements" rows={3} className={inputClass} />
            </Labeled>
            <PrimaryButton type="submit" disabled={save.isPending}>
              Save event
            </PrimaryButton>
          </Card>
        </Form>
      </Formik>
    </div>
  );
}

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState, PageHeader, Spinner, StatusBadge } from '../../components/ui/Feedback';
import { DataTable, type Column } from '../../components/ui/Surface';
import { fmtDateTime } from '../../utils/format';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchEventsStart } from '../../redux/events/events.action';
import { selectEvents, selectEventsLoading } from '../../redux/events/events.selector';

type EventRow = {
  Id: string;
  EventName: string;
  EventType: string;
  HallName: string;
  StartAt: string;
  EndAt: string;
  Status: string;
  OrganizerName: string;
  ExpectedAttendees: number;
};

export function EventsPage() {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectEvents) as EventRow[] | undefined;
  const isLoading = useAppSelector(selectEventsLoading);
  useEffect(() => {
    dispatch(fetchEventsStart());
  }, [dispatch]);

  const columns: Column<EventRow>[] = [
    {
      key: 'event',
      header: 'Event',
      render: (e) => (
        <>
          <Link to={`/events/${e.Id}`} className="font-semibold text-navy-900 transition hover:text-brand-400">
            {e.EventName}
          </Link>
          <p className="text-xs text-navy-800/45">{e.EventType}</p>
        </>
      ),
    },
    { key: 'hall', header: 'Hall', render: (e) => e.HallName },
    { key: 'when', header: 'When', render: (e) => fmtDateTime(e.StartAt) },
    { key: 'organizer', header: 'Organizer', render: (e) => e.OrganizerName },
    { key: 'expected', header: 'Expected', align: 'right', render: (e) => e.ExpectedAttendees },
    { key: 'status', header: 'Status', render: (e) => <StatusBadge value={e.Status} /> },
  ];

  return (
    <div>
      <PageHeader title="Events" description="Event records linked to hall bookings." />
      {isLoading ? (
        <Spinner />
      ) : !data?.length ? (
        <EmptyState title="No events" hint="Events appear once a booking is confirmed." />
      ) : (
        <DataTable columns={columns} rows={data} rowKey={(e) => e.Id} />
      )}
    </div>
  );
}

// AUTHOR : NANDNHAKUMAR SV 
// DATE : 27/08/2026
// DESCRIPTION : My bookings page to view my bookings
import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import type { Booking, Paged } from '../../types/api';
import { EmptyState, Spinner, StatusBadge } from '../../components/ui/Feedback';
import { DataTable, SearchField, TabPills, type Column } from '../../components/ui/Surface';
import { PrimaryButton } from '../../components/ui/Form';
import { fmtDate, fmtTime } from '../../utils/format';
import { useRealtime } from '../../hooks/useRealtime';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchBookingsStart } from '../../redux/bookings/bookings.action';
import { selectBookingsLoading, selectBookingsPage } from '../../redux/bookings/bookings.selector';
import { Tab } from '../../helpers/booking/bookingValidation';
import { tabs } from '../../helpers/booking/bookingValidation';


export function MyBookingsPage() {
  /******* STATE *******/
  const dispatch = useAppDispatch();
  const [params, setParams] = useSearchParams();
  const tab = (params.get('tab') ?? 'upcoming') as Tab;
  const q = params.get('q') ?? '';

  /******* SELECTORS *******/
  const data = useAppSelector(selectBookingsPage) as Paged<Booking> | null;
  const isLoading = useAppSelector(selectBookingsLoading);

  /******* EFFECTS *******/
  useEffect(() => {
    dispatch(fetchBookingsStart({ tab, q: q || undefined, pageSize: 50 }));
  }, [tab, q, dispatch]);

  /******* REALTIME *******/
  useRealtime(['dashboard'], () => dispatch(fetchBookingsStart({ tab, q: q || undefined, pageSize: 50 })));

  /******* COLUMNS *******/
  const columns: Column<Booking>[] = [
    {
      key: 'event',
      header: 'Event',
      render: (b) => (
        <>
          <Link className="font-semibold text-navy-900 transition hover:text-brand-400" to={`/bookings/${b.Id}`}>
            {b.EventName}
          </Link>
          <p className="text-xs text-navy-800/45">{b.BookingNumber}</p>
        </>
      ),
    },
    { key: 'hall', header: 'Hall', render: (b) => b.HallName },
    { key: 'date', header: 'Date', render: (b) => fmtDate(b.StartAt) },
    {
      key: 'time',
      header: 'Time',
      render: (b) => (
        <span className="whitespace-nowrap">
          {fmtTime(b.StartAt)}–{fmtTime(b.EndAt)}
        </span>
      ),
    },
    { key: 'organizer', header: 'Organizer', render: (b) => b.OrganizerName },
    { key: 'attendees', header: 'Guests', align: 'right', render: (b) => b.AttendeeCount },
    { key: 'status', header: 'Status', render: (b) => <StatusBadge value={b.Status} /> },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <TabPills tabs={tabs} value={tab} onChange={(next) => setParams(q ? { tab: next, q } : { tab: next })} />
        <SearchField
          value={q}
          placeholder="Search bookings"
          onChange={(next) => setParams(next ? { tab, q: next } : { tab })}
        />
        <Link to="/bookings/new">
          <PrimaryButton type="button">
            <Plus className="h-4 w-4" />
            New booking
          </PrimaryButton>
        </Link>
      </div>
      {isLoading ? (
        <Spinner />
      ) : !data?.items.length ? (
        <EmptyState title="Nothing in this list" hint="Try another tab or create a new booking." />
      ) : (
        <DataTable columns={columns} rows={data.items} rowKey={(b) => b.Id} />
      )}
    </div>
  );
}

import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { api, unwrap } from '../services/api';
import type { Booking, Paged } from '../types/api';
import { EmptyState, Spinner, StatusBadge } from '../components/ui/Feedback';
import { DataTable, SearchField, TabPills, type Column } from '../components/ui/Surface';
import { PrimaryButton } from '../components/ui/Form';
import { fmtDate, fmtTime } from '../utils/format';
import { useRealtime } from '../hooks/useRealtime';

const tabs = [
  ['upcoming', 'Upcoming'],
  ['today', 'Today'],
  ['ongoing', 'Ongoing'],
  ['completed', 'Completed'],
  ['cancelled', 'Cancelled'],
] as const;

type Tab = (typeof tabs)[number][0];

export function MyBookingsPage() {
  const [params, setParams] = useSearchParams();
  const tab = (params.get('tab') ?? 'upcoming') as Tab;
  const q = params.get('q') ?? '';
  useRealtime(['dashboard'], [['bookings']]);
  const { data, isLoading } = useQuery({
    queryKey: ['bookings', tab, q],
    queryFn: () => unwrap<Paged<Booking>>(api.get('/bookings', { params: { tab, q: q || undefined, pageSize: 50 } })),
  });

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

// AUTHOR : NANDHAKUMAR S V
//VERSION : 1.0.0
//DESCRIPTION : Booking calendar with an Outlook-style toolbar
// DATE : 2026-08-26
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import {
  CalendarDays,
  CalendarRange,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Columns3,
  Filter,
  Grid3x3,
  ListChecks,
  MoveRight,
  Plus,
  Square,
} from 'lucide-react';
import { Spinner } from '../../components/ui/Feedback';
import { useRealtime } from '../../hooks/useRealtime';
import type { Hall } from '../../types/api';
import { usePermission } from '../../hooks/usePermission';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchHallsStart } from '../../redux/halls/halls.action';
import { selectHalls } from '../../redux/halls/halls.selector';
import { fetchCalendarStart } from '../../redux/calendar/calendar.action';
import { selectCalendar, selectCalendarLoading } from '../../redux/calendar/calendar.selector';

const colors: Record<string, string> = {
  PENDING: '#b45309',
  CONFIRMED: '#1A3322',
  APPROVED: '#2F7A4E',
  ONGOING: '#3D7A55',
  CANCELLED: '#9f1239',
  MAINTENANCE: '#475569',
  COMPLETED: '#64748b',
};

type Cal = { Id: string; EventName: string; StartAt: string; EndAt: string; Status: string; HallCode: string };

type ViewOption = {
  id: string;
  label: string;
  view: string;
  hiddenDays: number[];
  icon: typeof CalendarDays;
};

const VIEWS: ViewOption[] = [
  { id: 'day', label: 'Day', view: 'timeGridDay', hiddenDays: [], icon: Square },
  { id: 'workWeek', label: 'Work week', view: 'timeGridWeek', hiddenDays: [0, 6], icon: Columns3 },
  { id: 'week', label: 'Week', view: 'timeGridWeek', hiddenDays: [], icon: CalendarRange },
  { id: 'month', label: 'Month', view: 'dayGridMonth', hiddenDays: [], icon: Grid3x3 },
  { id: 'agenda', label: 'Agenda', view: 'listWeek', hiddenDays: [], icon: ListChecks },
];

const barButton =
  'inline-flex items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1.5 text-sm font-medium text-navy-800 transition hover:border-navy-800/10 hover:bg-white';

export function CalendarPage() {
  const navigate = useNavigate();
  const { can } = usePermission();
  const dispatch = useAppDispatch();
  const calRef = useRef<FullCalendar | null>(null);
  const [hallId, setHallId] = useState('');
  const [range, setRange] = useState({ from: '', to: '' });
  const [title, setTitle] = useState('');
  const [viewId, setViewId] = useState('workWeek');
  const [menu, setMenu] = useState<'view' | 'filter' | null>(null);
  useRealtime(['calendar'], () => {
    if (range.from && range.to) {
      dispatch(fetchCalendarStart({ from: range.from, to: range.to, hallId: hallId || undefined }));
    }
  });

  const active = VIEWS.find((v) => v.id === viewId) ?? VIEWS[1]!;
  const getCal = () => calRef.current?.getApi();

  const halls = useAppSelector(selectHalls) as Hall[] | undefined;
  const data = useAppSelector(selectCalendar) as { bookings: Cal[]; maintenance: Cal[] } | null;
  const isLoading = useAppSelector(selectCalendarLoading);

  useEffect(() => {
    dispatch(fetchHallsStart());
  }, [dispatch]);

  useEffect(() => {
    if (!range.from || !range.to) return;
    dispatch(fetchCalendarStart({ from: range.from, to: range.to, hallId: hallId || undefined }));
  }, [range.from, range.to, hallId, dispatch]);

  const events = [...(data?.bookings ?? []), ...(data?.maintenance ?? [])].map((e) => ({
    id: e.Id,
    title: `${e.EventName} · ${e.HallCode}`,
    start: e.StartAt,
    end: e.EndAt,
    backgroundColor: colors[e.Status] ?? '#062445',
    borderColor: 'transparent',
    extendedProps: e,
  }));

  const selectedHall = halls?.find((h) => h.Id === hallId);

  const applyView = (option: ViewOption) => {
    setViewId(option.id);
    setMenu(null);
    getCal()?.changeView(option.view);
  };

  return (
    <div className="animate-rise">
      <div className="overflow-hidden rounded-2xl border border-navy-800/10 bg-white shadow-panel">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-navy-800/8 bg-mist/40 px-2.5 py-2 sm:px-3">
          <div className="flex flex-wrap items-center gap-1">
            <button type="button" className={barButton} onClick={() => getCal()?.today()}>
              <MoveRight className="h-3.5 w-3.5 text-brand-500" />
              Today
            </button>
            <button
              type="button"
              className="grid h-8 w-8 place-items-center rounded-lg text-navy-800/60 transition hover:bg-white hover:text-navy-900"
              onClick={() => getCal()?.prev()}
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="grid h-8 w-8 place-items-center rounded-lg text-navy-800/60 transition hover:bg-white hover:text-navy-900"
              onClick={() => getCal()?.next()}
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <p className="ml-1 font-display text-sm font-semibold text-navy-900 sm:text-base">{title}</p>
          </div>

          <div className="flex flex-wrap items-center gap-1">
            <Dropdown
              open={menu === 'view'}
              onToggle={() => setMenu((m) => (m === 'view' ? null : 'view'))}
              trigger={
                <>
                  <active.icon className="h-3.5 w-3.5 text-brand-500" />
                  {active.label}
                  <ChevronDown className="h-3.5 w-3.5 text-navy-800/40" />
                </>
              }
            >
              {VIEWS.map((v) => (
                <MenuRow key={v.id} icon={v.icon} label={v.label} checked={v.id === viewId} onClick={() => applyView(v)} />
              ))}
            </Dropdown>

            <Dropdown
              open={menu === 'filter'}
              onToggle={() => setMenu((m) => (m === 'filter' ? null : 'filter'))}
              trigger={
                <>
                  <Filter className="h-3.5 w-3.5 text-brand-500" />
                  {selectedHall ? selectedHall.Name : 'All halls'}
                  <ChevronDown className="h-3.5 w-3.5 text-navy-800/40" />
                </>
              }
            >
              <MenuRow
                icon={CalendarDays}
                label="All halls"
                checked={!hallId}
                onClick={() => {
                  setHallId('');
                  setMenu(null);
                }}
              />
              {(halls ?? []).map((h) => (
                <MenuRow
                  key={h.Id}
                  icon={Square}
                  label={h.Name}
                  checked={hallId === h.Id}
                  onClick={() => {
                    setHallId(h.Id);
                    setMenu(null);
                  }}
                />
              ))}
            </Dropdown>

            {can('bookings.create') ? (
              <button
                type="button"
                onClick={() => navigate(`/bookings/new${hallId ? `?hallId=${hallId}` : ''}`)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-navy-900 px-3 py-1.5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-500"
              >
                <Plus className="h-4 w-4" />
                New
              </button>
            ) : null}
          </div>
        </div>

        <div className="p-2 sm:p-3">
          {isLoading && !data ? <Spinner /> : null}
          <FullCalendar
            ref={calRef}
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            initialView={active.view}
            hiddenDays={active.hiddenDays}
            headerToolbar={false}
            events={events}
            height="auto"
            nowIndicator
            allDaySlot={false}
            slotDuration="00:30:00"
            slotMinTime="07:00:00"
            slotMaxTime="21:00:00"
            expandRows
            selectable={can('bookings.create')}
            datesSet={(arg) => {
              setTitle(arg.view.title);
              const from = arg.start.toISOString();
              const to = arg.end.toISOString();
              setRange((prev) => (prev.from === from && prev.to === to ? prev : { from, to }));
            }}
            eventClick={(info) => {
              const status = (info.event.extendedProps as Cal).Status;
              if (status !== 'MAINTENANCE') navigate(`/bookings/${info.event.id}`);
            }}
            select={(sel) => {
              const date = sel.start.toISOString().slice(0, 10);
              const start = sel.start.toTimeString().slice(0, 5);
              const end = sel.end.toTimeString().slice(0, 5);
              navigate(`/bookings/new?date=${date}&start=${start}&end=${end}&hallId=${hallId}`);
            }}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {Object.entries(colors).map(([k, v]) => (
          <span
            key={k}
            className="inline-flex items-center gap-1.5 rounded-full border border-navy-800/10 bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-navy-800/65"
          >
            <span className="h-2 w-2 rounded-full" style={{ background: v }} />
            {k}
          </span>
        ))}
      </div>
    </div>
  );
}

function Dropdown({
  open,
  onToggle,
  trigger,
  children,
}: {
  open: boolean;
  onToggle: () => void;
  trigger: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={`${barButton} ${open ? 'border-navy-800/10 bg-white' : ''}`}
        aria-expanded={open}
      >
        {trigger}
      </button>
      {open ? (
        <>
          <button type="button" className="fixed inset-0 z-40 cursor-default" aria-label="Close" onClick={onToggle} />
          <div className="absolute right-0 top-[calc(100%+6px)] z-50 max-h-80 w-56 overflow-y-auto rounded-2xl border border-navy-800/10 bg-white py-1.5 shadow-lift animate-rise">
            {children}
          </div>
        </>
      ) : null}
    </div>
  );
}

function MenuRow({
  icon: Icon,
  label,
  checked,
  onClick,
}: {
  icon: typeof CalendarDays;
  label: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-navy-800 transition hover:bg-brand-50"
    >
      <Check className={`h-3.5 w-3.5 shrink-0 ${checked ? 'text-brand-500' : 'text-transparent'}`} />
      <Icon className="h-3.5 w-3.5 shrink-0 text-navy-800/45" />
      <span className="truncate">{label}</span>
    </button>
  );
}

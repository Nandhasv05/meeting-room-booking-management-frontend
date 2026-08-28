import { CalendarDays, CalendarRange, Columns3, Grid3x3, ListChecks, Square } from "lucide-react";

export const colors: Record<string, string> = {
    PENDING: '#b45309',
    CONFIRMED: '#1A3322',
    APPROVED: '#2F7A4E',
    ONGOING: '#3D7A55',
    CANCELLED: '#9f1239',
    MAINTENANCE: '#475569',
    COMPLETED: '#64748b',
  };
  
export type CalendarCall = { Id: string; EventName: string; StartAt: string; EndAt: string; Status: string; HallCode: string };
  
export type ViewOption = {
    id: string;
    label: string;
    view: string;
    hiddenDays: number[];
    icon: typeof CalendarDays;
  };
  
export const VIEWS: ViewOption[] = [
    { id: 'day', label: 'Day', view: 'timeGridDay', hiddenDays: [], icon: Square },
    { id: 'workWeek', label: 'Work week', view: 'timeGridWeek', hiddenDays: [0, 6], icon: Columns3 },
    { id: 'week', label: 'Week', view: 'timeGridWeek', hiddenDays: [], icon: CalendarRange },
    { id: 'month', label: 'Month', view: 'dayGridMonth', hiddenDays: [], icon: Grid3x3 },
    { id: 'agenda', label: 'Agenda', view: 'listWeek', hiddenDays: [], icon: ListChecks },
  ];
  
export const barButton =
    'inline-flex items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1.5 text-sm font-medium text-navy-800 transition hover:border-navy-800/10 hover:bg-white';
  

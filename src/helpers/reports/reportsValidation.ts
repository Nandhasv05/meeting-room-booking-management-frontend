// AUTHOR : NANDNHAKUMAR SV 
// DATE : 28/08/2026
// DESCRIPTION : Reports validation schema

export const tabs = [
    ['bookings', 'Bookings'],
    ['utilization', 'Utilization'],
    ['departments', 'Departments'],
    ['cancellations', 'Cancellations'],
    ['peak-hours', 'Peak hours'],
  ] as const;
  
export type ReportType = (typeof tabs)[number][0];

const COLUMN_LABELS: Record<string, string> = {
    BookingNumber: 'Booking #',
    EventName: 'Event',
    EventType: 'Type',
    Department: 'Department',
    Hall: 'Hall',
    Organizer: 'Organizer',
    StartAt: 'Start',
    EndAt: 'End',
    AttendeeCount: 'Attendees',
    Status: 'Status',
    CancellationReason: 'Reason',
    HoursBooked: 'Hours booked',
    WindowHours: 'Window hours',
    BookingCount: 'Bookings',
    TotalHours: 'Total hours',
    Hour: 'Hour',
    Count: 'Count',
  };

export function humanizeKey(key: string) {
    return COLUMN_LABELS[key] ?? key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ');
}

export function isReportDateField(key: string, value: unknown) {
    if (value instanceof Date) return true;
    if (!/(At|Date)$/.test(key)) return false;
    const asDate = new Date(String(value ?? ''));
    return !Number.isNaN(asDate.getTime());
}

export function formatReportCell(key: string, value: unknown) {
    if (value == null || value === '') return '—';
    if (key === 'Hour') return `${String(value).padStart(2, '0')}:00`;
    if (key === 'Status' || key === 'EventType') return String(value).replaceAll('_', ' ');
    if (typeof value === 'number') return Number.isInteger(value) ? String(value) : value.toFixed(2);
    return String(value);
}
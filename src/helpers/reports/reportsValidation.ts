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

export function humanizeKey(key: string) {
    return key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ');
}
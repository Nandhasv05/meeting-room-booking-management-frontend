/**
 * AUTHOR: NANDHAKUMAR S V
 * DATE : 17/09/2026
 * DESCRPTION: CREATE FILE FOR BOOKING VALIDATION 
 */
import { differenceInMinutes } from 'date-fns';

export type Guest = { Id: string; Name: string; Email: string; Department: string | null };


/*** Duration Label Handle Funtion  */
export function durationLabel(start: Date, end: Date) {
  const mins = Math.max(0, differenceInMinutes(end, start));
  const hours = Math.floor(mins / 60);
  const rem = mins % 60;
  if (hours && rem) return `${hours}h ${rem}m`;
  if (hours) return `${hours}h`;
  return `${rem}m`;
}

/*** Initials Function Handle **/
export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

/*** Booking Tabs **/
export const tabs = [
    ['upcoming', 'Upcoming'],
    ['today', 'Today'],
    ['ongoing', 'Ongoing'],
    ['completed', 'Completed'],
    ['cancelled', 'Cancelled'],
  ] as const;
  
export type Tab = (typeof tabs)[number][0];
  
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { checkAvailabilityStart } from '../redux/availability/availability.action';
import { selectAvailability, selectAvailabilityLoading } from '../redux/availability/availability.selector';

export type SlotConflict = {
  Id: string;
  BookingNumber: string;
  EventName: string;
  StartAt: string;
  EndAt: string;
  Status: string;
  HallName: string;
};

export type HallAvailability = {
  hallId: string;
  hallName: string;
  capacity: number;
  openingTime: string;
  closingTime: string;
  available: boolean;
  blockers: string[];
  conflicts: SlotConflict[];
  maintenance: { Id: string; Title: string; StartAt: string; EndAt: string }[];
};

export type PersonAvailability = {
  userId: string;
  name: string;
  email: string;
  employeeId: string | null;
  department: string | null;
  available: boolean;
  conflicts: SlotConflict[];
};

export type AvailabilityResult = {
  hall: HallAvailability | null;
  people: PersonAvailability[];
};

export function useDebounced<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export function useAvailability(input: {
  hallId?: string;
  userIds: string[];
  startAt?: string;
  endAt?: string;
  attendeeCount?: number;
  excludeBookingId?: string;
}) {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectAvailability) as AvailabilityResult | null;
  const isFetching = useAppSelector(selectAvailabilityLoading);
  const enabled = Boolean(input.startAt && input.endAt && (input.hallId || input.userIds.length));
  const key = JSON.stringify({
    hallId: input.hallId ?? '',
    userIds: [...input.userIds].sort(),
    startAt: input.startAt ?? '',
    endAt: input.endAt ?? '',
    attendeeCount: input.attendeeCount ?? 0,
    excludeBookingId: input.excludeBookingId ?? '',
    enabled,
  });

  useEffect(() => {
    if (!enabled) return;
    dispatch(
      checkAvailabilityStart({
        hallId: input.hallId || undefined,
        userIds: input.userIds.filter((id) => {
          const value = String(id ?? '').trim();
          return value.length > 0 && value.length <= 64 && !value.startsWith('guest:');
        }),
        startAt: input.startAt,
        endAt: input.endAt,
        attendeeCount: input.attendeeCount,
        excludeBookingId: input.excludeBookingId,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, dispatch, enabled]);

  return { data, isFetching };
}

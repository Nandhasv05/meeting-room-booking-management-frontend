import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { api, unwrap } from '../services/api';

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
  const enabled = Boolean(input.startAt && input.endAt && (input.hallId || input.userIds.length));
  return useQuery({
    queryKey: [
      'availability',
      input.hallId ?? '',
      [...input.userIds].sort().join(','),
      input.startAt ?? '',
      input.endAt ?? '',
      input.attendeeCount ?? 0,
    ],
    queryFn: () =>
      unwrap<AvailabilityResult>(
        api.post('/availability/check', {
          hallId: input.hallId || undefined,
          userIds: input.userIds.length ? input.userIds : undefined,
          startAt: input.startAt,
          endAt: input.endAt,
          attendeeCount: input.attendeeCount,
          excludeBookingId: input.excludeBookingId,
        }),
      ),
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });
}

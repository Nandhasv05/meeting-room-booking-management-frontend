import { useEffect, useRef } from 'react';
import { getSocket, joinRooms } from '../services/socket';

const BOOKING_EVENTS = [
  'booking.created',
  'booking.updated',
  'booking.cancelled',
  'booking.deleted',
  'booking.approved',
  'booking.started',
  'booking.completed',
  'hall.status.updated',
  'hall.maintenance.updated',
];

export function useRealtime(rooms: string[], onRefresh: () => void) {
  const cb = useRef(onRefresh);
  cb.current = onRefresh;
  const roomKey = rooms.join('|');
  useEffect(() => {
    const s = getSocket();
    joinRooms(...roomKey.split('|').filter(Boolean));
    const refresh = () => cb.current();
    BOOKING_EVENTS.forEach((ev) => s.on(ev, refresh));
    return () => {
      BOOKING_EVENTS.forEach((ev) => s.off(ev, refresh));
    };
  }, [roomKey]);
}

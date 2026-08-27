import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
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

export function useRealtime(rooms: string[], queryKeys: string[][]) {
  const qc = useQueryClient();
  const roomKey = rooms.join('|');
  const querySig = queryKeys.map((k) => k.join('/')).join('|');
  useEffect(() => {
    const s = getSocket();
    joinRooms(...roomKey.split('|').filter(Boolean));
    const keys = querySig.split('|').map((part) => part.split('/'));
    const refresh = () => {
      keys.forEach((key) => void qc.invalidateQueries({ queryKey: key }));
    };
    BOOKING_EVENTS.forEach((ev) => s.on(ev, refresh));
    return () => {
      BOOKING_EVENTS.forEach((ev) => s.off(ev, refresh));
    };
  }, [qc, roomKey, querySig]);
}

import { io, type Socket } from 'socket.io-client';
import { store } from '../store';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (socket) return socket;
  socket = io(import.meta.env.VITE_SOCKET_URL || '/', {
    path: '/socket.io',
    auth: { token: store.getState().auth.accessToken },
    transports: ['websocket', 'polling'],
  });
  return socket;
}

export function joinRooms(...rooms: string[]): void {
  const s = getSocket();
  rooms.forEach((room) => s.emit('join', room));
}

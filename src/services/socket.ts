import { io, type Socket } from 'socket.io-client';
import { store } from '../store';
import { SOCKET_PATH, SOCKET_URL } from '../redux/const';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (socket) return socket;
  socket = io(SOCKET_URL, {
    path: SOCKET_PATH,
    auth: { token: store.getState().auth.accessToken },
    transports: ['polling', 'websocket'],
    upgrade: true,
    reconnection: true,
    reconnectionAttempts: 8,
  });
  socket.on('connect_error', () => undefined);
  return socket;
}

export function joinRooms(...rooms: string[]): void {
  const s = getSocket();
  rooms.forEach((room) => s.emit('join', room));
}

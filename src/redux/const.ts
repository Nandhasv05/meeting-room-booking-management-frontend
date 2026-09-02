// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : Frontend API and crypto constants

function meetingPrefix(): string {
  if (typeof window === 'undefined') return '';
  const path = window.location.pathname || '';
  if (path === '/Meeting' || path.startsWith('/Meeting/')) return '/Meeting';
  return '';
}

function withAppBase(path: string): string {
  const prefix = meetingPrefix();
  if (prefix) return `${prefix}/${path.replace(/^\/+/, '')}`;
  const base = import.meta.env.BASE_URL || '/';
  return `${base}${path.replace(/^\/+/, '')}`.replace(/\/{2,}/g, '/');
}

export const API_URL = meetingPrefix() ? '/Meeting/api' : import.meta.env.VITE_API_URL || withAppBase('api');
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || '/';
export const SOCKET_PATH = meetingPrefix() ? '/Meeting/socket.io' : import.meta.env.VITE_SOCKET_PATH || withAppBase('socket.io');
export const API_CRYPTO_KEY = import.meta.env.VITE_API_CRYPTO_KEY || 'MeetingHallApiKey';

function evolOrigin(): string {
  if (typeof window === 'undefined') return 'https://apps.evolvclothing.com';
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') return 'https://apps.evolvclothing.com';
  return window.location.origin;
}

export const PORTAL_HOME_URL =
  import.meta.env.VITE_PORTAL_HOME_URL || `${evolOrigin()}/EVOL/portal_dashboard.php`;
export const PORTAL_LOGIN_URL =
  import.meta.env.VITE_PORTAL_LOGIN_URL || `${evolOrigin()}/EVOL/login.php`;
export const PORTAL_LAUNCH_URL =
  import.meta.env.VITE_PORTAL_LAUNCH_URL || `${evolOrigin()}/EVOL/meeting_launch.php`;
export const PORTAL_LOGOUT_URL =
  import.meta.env.VITE_PORTAL_LOGOUT_URL || `${evolOrigin()}/EVOL/logout.php`;

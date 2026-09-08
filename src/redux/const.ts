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

const LIVE_PORTAL_HOST = 'apps.evolvclothing.com';

function isBrowserLocalHost(): boolean {
  if (typeof window === 'undefined') return false;
  return ['localhost', '127.0.0.1'].includes(window.location.hostname);
}

function isLivePortalHost(): boolean {
  if (typeof window === 'undefined') return true;
  return window.location.hostname === LIVE_PORTAL_HOST;
}

function evolOrigin(): string {
  if (typeof window === 'undefined') return `https://${LIVE_PORTAL_HOST}`;
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') {
    const port = window.location.port === '5173' ? '8888' : window.location.port || '8888';
    return `${window.location.protocol}//${host}:${port}`;
  }
  return window.location.origin;
}

function isLanClothingHost(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.hostname === '10.103.10.33';
}

function evolPortalBase(): string {
  const origin = evolOrigin();
  if (isLanClothingHost()) {
    return origin;
  }
  if (isBrowserLocalHost()) {
    try {
      const ref = document.referrer || '';
      if (ref.includes('/dashboard/EVOL')) return `${origin}/dashboard/EVOL`;
    } catch {
      /* ignore */
    }
    return `${origin}/EVOL`;
  }
  return `${origin}/EVOL`;
}

function portalFileUrl(file: string, envValue?: string): string {
  if (isLanClothingHost()) {
    return `${evolOrigin()}/EVOL/${file}`;
  }
  const sameOrigin = `${evolPortalBase()}/${file}`;
  // Production builds bake apps.evolvclothing.com into VITE_PORTAL_*.
  // On localhost / LAN those values must not win, or Meeting Hall jumps to live.
  if (!isLivePortalHost()) {
    return sameOrigin;
  }
  if (typeof envValue === 'string' && envValue.trim() !== '') {
    return envValue.trim();
  }
  return sameOrigin;
}

export const PORTAL_HOME_URL = portalFileUrl(
  'portal_dashboard.php',
  import.meta.env.VITE_PORTAL_HOME_URL,
);
export const PORTAL_LOGIN_URL = portalFileUrl('login.php', import.meta.env.VITE_PORTAL_LOGIN_URL);
export const PORTAL_LAUNCH_URL = portalFileUrl(
  'meeting_launch.php',
  import.meta.env.VITE_PORTAL_LAUNCH_URL,
);
export const PORTAL_LOGOUT_URL = portalFileUrl('logout.php', import.meta.env.VITE_PORTAL_LOGOUT_URL);

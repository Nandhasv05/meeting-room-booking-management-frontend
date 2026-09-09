import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store';
import { goToPortalLogin, readSsoTicket } from '../components/portal/PortalSsoListener';

export function GuestLayout() {
  const token = useAppSelector((s) => s.auth.accessToken);
  const location = useLocation();
  const ticket = readSsoTicket(location.search);
  if (ticket && !token) return null;
  if (token && !location.pathname.startsWith('/display')) {
    return <Navigate to={ticket ? `/?sso=${encodeURIComponent(ticket)}` : '/'} replace />;
  }
  const path = location.pathname.replace(/\/+$/, '').toLowerCase();
  if (path === '/login' || path === '/auth/portal') {
    if (!ticket) goToPortalLogin();
    return null;
  }
  return <Outlet />;
}

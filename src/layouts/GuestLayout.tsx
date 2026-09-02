import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store';
import { goToPortalLogin, readSsoTicket } from '../components/portal/PortalSsoListener';

export function GuestLayout() {
  const token = useAppSelector((s) => s.auth.accessToken);
  const location = useLocation();
  if (readSsoTicket(location.search) && !token) return null;
  if (token && !location.pathname.startsWith('/display')) return <Navigate to="/" replace />;
  const path = location.pathname.replace(/\/+$/, '').toLowerCase();
  if (path === '/login') {
    goToPortalLogin();
    return null;
  }
  return <Outlet />;
}

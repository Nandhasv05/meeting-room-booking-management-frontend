import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store';
import { readSsoTicket } from '../components/portal/PortalSsoListener';

export function GuestLayout() {
  const token = useAppSelector((s) => s.auth.accessToken);
  const location = useLocation();
  if (readSsoTicket(location.search) && !token) return null;
  if (token && !location.pathname.startsWith('/display')) return <Navigate to="/" replace />;
  return <Outlet />;
}

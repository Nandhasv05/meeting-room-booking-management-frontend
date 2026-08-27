import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store';

export function GuestLayout() {
  const token = useAppSelector((s) => s.auth.accessToken);
  const location = useLocation();
  if (token && !location.pathname.startsWith('/display')) return <Navigate to="/" replace />;
  return <Outlet />;
}

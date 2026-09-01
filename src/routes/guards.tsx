import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store';
import { isAdminRole } from '../utils/roles';

// Require admin gate for the application
export function RequireAdmin() {
  const role = useAppSelector((s) => s.auth.user?.roleCode);
  if (!isAdminRole(role)) return <Navigate to="/calendar" replace />;
  return <Outlet />;
}

// Encode decode gate for the application
export function EncodeDecodeGate() {
  const token = useAppSelector((s) => s.auth.accessToken);
  const role = useAppSelector((s) => s.auth.user?.roleCode);
  const location = useLocation();
  if (token && !isAdminRole(role)) {
    return <Navigate to="/calendar" replace state={{ from: location }} />;
  }
  return <Outlet />;
}

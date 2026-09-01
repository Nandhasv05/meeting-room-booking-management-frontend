import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';
import { Footer } from '../components/layout/Footer';
import { ShellProvider } from '../components/layout/ShellContext';
import { useAppSelector } from '../store';
import { readSsoTicket } from '../components/portal/PortalSsoListener';

export function AppLayout() {
  const token = useAppSelector((s) => s.auth.accessToken);
  const location = useLocation();
  if (!token) {
    if (readSsoTicket(location.search)) return null;
    return <Navigate to="/login" replace />;
  }
  return (
    <ShellProvider>
      <div className="app-shell flex h-[100dvh] overflow-hidden">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main
            key={location.pathname}
            className="page-enter flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-5"
          >
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </ShellProvider>
  );
}

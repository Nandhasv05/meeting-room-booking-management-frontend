import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';
import { Footer } from '../components/layout/Footer';
import { ShellProvider } from '../components/layout/ShellContext';
import { useAppSelector } from '../store';
import { goToPortalLogin, readSsoTicket } from '../components/portal/PortalSsoListener';

export function AppLayout() {
  const token = useAppSelector((s) => s.auth.accessToken);
  const location = useLocation();
  if (!token) {
    if (readSsoTicket(location.search)) return null;
    goToPortalLogin();
    return null;
  }
  return (
    <ShellProvider>
      <div className="app-shell flex h-[100dvh] w-full max-w-[100%] overflow-hidden">
        <Sidebar />
        <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col">
          <Topbar />
          <main
            key={location.pathname}
            className="page-enter min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-5"
          >
            <div className="mx-auto w-full min-w-0 max-w-full">
              <Outlet />
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </ShellProvider>
  );
}

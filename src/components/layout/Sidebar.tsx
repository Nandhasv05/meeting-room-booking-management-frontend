/*
 * AUTHOR : NANDHAKUMAR S V
 * DATE : 16/09/2026
 * DESCRIPTION : INITIALIZE STAGE SIDE BAR CREATION THIS COMPONENT IS USED TO DISPLAY THE TIME AND DATE IN THE BOOKING COMPOSER
 */
import { NavLink } from 'react-router-dom';
import {
  CalendarDays,
  DoorOpen,
  ClipboardList,
  Users,
  Monitor,
  Settings,
  ChevronDown,
  Plus,
  Shield,
  X,
  ChartBar,
  BarChart3,
  Contact,
} from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { usePermission } from '../../hooks/usePermission';
import { isAdminRole } from '../../utils/roles';
import { BrandLogo } from '../brand/BrandLogo';
import { useShell } from './ShellContext';

/****  ITEM ***** */
function Item({ to, label, icon: Icon }: { to: string; label: string; icon: typeof CalendarDays }) {
  const { setNavOpen } = useShell();
  return (
    <NavLink
      to={to}
      onClick={() => setNavOpen(false)}
      className={({ isActive }) =>
        `relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${
          isActive
            ? 'bg-brand-400 text-white shadow-soft'
            : 'text-white/70 hover:bg-white/[0.07] hover:text-white'
        }`
      }
    >
      <Icon size={15} strokeWidth={2} />
      {label}
    </NavLink>
  );
}

/**** GROUP ***** */
function Group({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: typeof CalendarDays;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mt-0.5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40 transition hover:text-white/70"
      >
        <span className="flex items-center gap-2">
          <Icon size={13} />
          {label}
        </span>
        <ChevronDown size={12} className={`transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open ? <div className="space-y-0.5 pb-1">{children}</div> : null}
    </div>
  );
}

/**** NAV BODY ***** */
function NavBody() {
  const { can, user } = usePermission();
  const admin = isAdminRole(user?.roleCode);

  return (
    <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2 py-2">
      <Group label="Bookings" icon={ClipboardList}>
        {can('bookings.create') && <Item to="/bookings/new" label="New Booking" icon={Plus} />}
        {can('calendar.view') && <Item to="/calendar" label="Booking" icon={CalendarDays} />}
        {can('bookings.view') && <Item to="/bookings" label="My Bookings" icon={ClipboardList} />}
        <Item to="/contacts" label="Contact" icon={Contact} />
      </Group>
      {can('halls.view') && <Item to="/halls" label="Conference Halls" icon={DoorOpen} />}
      {admin && <Item to="/events" label="Events" icon={CalendarDays} />}
      {can('display.view') && <Item to="/displays" label="Displays" icon={Monitor} />}
      {admin && (
        <Group label="Administration" icon={Settings}>
          <Item to="/admin/users" label="Users & roles" icon={Users} />
          <Item to="/admin/roles" label="Roles" icon={Shield} />
          <Item to="/admin/departments" label="Departments" icon={Users} />
          <Item to="/reports" label="Reports" icon={ChartBar} />
          <Item to="/reports/utilization" label="Utilization Report" icon={BarChart3} />
          <Item to="/admin/audit" label="Audit" icon={ClipboardList} />
        </Group>
      )}
    </nav>
  );
}

/****  USE DESKTOP NAV  ***** */
function useDesktopNav() {
  const [desktop, setDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const apply = () => setDesktop(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return desktop;
}

/**** SIDE BAR ***** */
export function Sidebar() {
  const { navOpen, setNavOpen } = useShell();
  const desktop = useDesktopNav();

  useEffect(() => {
    if (desktop) setNavOpen(false);
  }, [desktop, setNavOpen]);

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNavOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navOpen, setNavOpen]);

  const panel = (
    <>
      <div className="relative overflow-hidden border-b border-white/10 px-4 py-4">
        <div className="pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full bg-brand-400/25 blur-2xl" />
        <BrandLogo variant="light" height={26} to="/" />
        <p className="relative mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
          Conference halls
        </p>
      </div>
      <NavBody />
      <div className="border-t border-white/10 px-4 py-2.5 text-[10px] uppercase tracking-[0.16em] text-white/25">
        Internal LAN
      </div>
    </>
  );

  const mobileDrawer =
    !desktop && navOpen && typeof document !== 'undefined'
      ? createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              width: '100vw',
              height: '100dvh',
            }}
          >
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setNavOpen(false)}
              style={{
                position: 'absolute',
                inset: 0,
                border: 0,
                background: 'rgba(15, 32, 21, 0.55)',
                cursor: 'pointer',
              }}
            />
            <aside
              className="flex flex-col bg-navy-950 text-white shadow-lift animate-slideIn"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: 'min(18rem, 88vw)',
                maxWidth: '88vw',
                borderTopRightRadius: '1.5rem',
                borderBottomRightRadius: '1.5rem',
                overflow: 'hidden',
              }}
            >
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <BrandLogo variant="light" height={24} to="/" />
                <button
                  type="button"
                  className="grid h-9 w-9 place-items-center rounded-xl text-white/70 transition hover:bg-white/10 hover:text-white"
                  onClick={() => setNavOpen(false)}
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
              <NavBody />
            </aside>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      {desktop ? (
        <aside className="flex h-full w-56 shrink-0 flex-col rounded-r-3xl bg-navy-950 text-white shadow-lift lg:w-60">
          {panel}
        </aside>
      ) : null}
      {mobileDrawer}
    </>
  );
}

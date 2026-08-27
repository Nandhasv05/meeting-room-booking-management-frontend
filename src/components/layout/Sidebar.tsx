import { NavLink } from 'react-router-dom';
import {
  CalendarDays,
  DoorOpen,
  ClipboardList,
  Users,
  Monitor,
  BarChart3,
  Settings,
  ChevronDown,
  Plus,
  Shield,
  LayoutDashboard,
  X,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { usePermission } from '../../hooks/usePermission';
import { isOpsDashboardRole } from '../../utils/roles';
import { BrandLogo } from '../brand/BrandLogo';
import { useShell } from './ShellContext';

function Item({ to, label, icon: Icon }: { to: string; label: string; icon: typeof CalendarDays }) {
  return (
    <NavLink
      to={to}
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

function NavBody() {
  const { can, user } = usePermission();
  return (
    <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-2">
      {can('dashboard.view') && isOpsDashboardRole(user?.roleCode) && (
        <Item to="/dashboard" label="Dashboard" icon={LayoutDashboard} />
      )}
      <Group label="Bookings" icon={ClipboardList}>
        {can('bookings.create') && <Item to="/bookings/new" label="New Booking" icon={Plus} />}
        {can('calendar.view') && <Item to="/calendar" label="Booking" icon={CalendarDays} />}
        {can('bookings.view') && <Item to="/bookings" label="My Bookings" icon={ClipboardList} />}
      </Group>
      {can('halls.view') && <Item to="/halls" label="Conference Halls" icon={DoorOpen} />}
      {can('events.view') && <Item to="/events" label="Events" icon={CalendarDays} />}
      {can('display.view') && <Item to="/displays" label="Displays" icon={Monitor} />}
      {can('reports.view') && <Item to="/reports" label="Reports" icon={BarChart3} />}
      {(can('users.view') || can('settings.manage') || can('audit.view')) && (
        <Group label="Administration" icon={Settings}>
          {can('users.view') && <Item to="/admin/users" label="Users" icon={Users} />}
          {can('roles.manage') && <Item to="/admin/roles" label="Roles" icon={Shield} />}
          {can('departments.manage') && <Item to="/admin/departments" label="Departments" icon={Users} />}
          {can('maintenance.view') && <Item to="/admin/maintenance" label="Maintenance" icon={Settings} />}
          {can('settings.manage') && <Item to="/admin/settings" label="Settings" icon={Settings} />}
          {can('audit.view') && <Item to="/admin/audit" label="Audit Logs" icon={ClipboardList} />}
        </Group>
      )}
    </nav>
  );
}

export function Sidebar() {
  const { navOpen, setNavOpen } = useShell();

  return (
    <>
      {/* Desktop */}
      <aside className="hidden h-full w-56 shrink-0 flex-col rounded-r-3xl bg-navy-950 text-white shadow-lift md:flex lg:w-60">
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
      </aside>

      {/* Mobile drawer */}
      {navOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-navy-950/50 backdrop-blur-[2px] animate-fade"
            aria-label="Close menu"
            onClick={() => setNavOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-[min(18rem,88vw)] flex-col rounded-r-3xl bg-navy-950 text-white shadow-lift animate-slideIn">
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
        </div>
      ) : null}
    </>
  );
}

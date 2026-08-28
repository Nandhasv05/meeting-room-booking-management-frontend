import { Bell, LogOut, Menu } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { userSignInLogOutStart, useAppDispatch, useAppSelector } from '../../store';
import { useShell } from './ShellContext';
import { isAdminRole } from '../../utils/roles';
import { fetchNotificationsStart } from '../../redux/notifications/notifications.action';
import { selectNotifications } from '../../redux/notifications/notifications.selector';
import { selectCurrentUser } from '../../redux/login/login.selector';

const PAGE_TITLES: { match: RegExp | string; title: string }[] = [
  { match: /^\/bookings\/new/, title: 'New booking' },
  { match: /^\/bookings\/[^/]+/, title: 'Booking detail' },
  { match: /^\/bookings/, title: 'My bookings' },
  { match: /^\/calendar/, title: 'Booking' },
  { match: /^\/approvals/, title: 'Approvals' },
  { match: /^\/halls\/facilities/, title: 'Facilities' },
  { match: /^\/halls\/new/, title: 'Add hall' },
  { match: /^\/halls\/[^/]+\/edit/, title: 'Edit hall' },
  { match: /^\/halls\/[^/]+/, title: 'Hall detail' },
  { match: /^\/halls/, title: 'Conference halls' },
  { match: /^\/events\/[^/]+/, title: 'Event detail' },
  { match: /^\/events/, title: 'Events' },
  { match: /^\/displays/, title: 'Displays' },
  { match: /^\/reports/, title: 'Reports' },
  { match: /^\/notifications/, title: 'Notifications' },
  { match: /^\/admin\/users/, title: 'Users' },
  { match: /^\/admin\/roles/, title: 'Roles' },
  { match: /^\/admin\/departments/, title: 'Departments' },
  { match: /^\/admin\/settings/, title: 'Settings' },
  { match: /^\/admin\/audit/, title: 'Audit logs' },
  { match: /^\/admin\/maintenance/, title: 'Maintenance' },
];

function pageTitle(pathname: string, roleCode?: string): string {
  if (/^\/dashboard/.test(pathname)) {
    return isAdminRole(roleCode) ? 'Admin dashboard' : 'Manager dashboard';
  }
  for (const row of PAGE_TITLES) {
    if (typeof row.match === 'string' ? pathname === row.match : row.match.test(pathname)) {
      return row.title;
    }
  }
  return 'evolv';
}

function formatClock(d: Date) {
  return d.toLocaleString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

function initials(first?: string, last?: string) {
  const a = (first?.[0] ?? '').toUpperCase();
  const b = (last?.[0] ?? '').toUpperCase();
  return (a + b || 'U').slice(0, 2);
}

export function Topbar() {
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleNav } = useShell();
  const [now, setNow] = useState(() => new Date());
  const [menuOpen, setMenuOpen] = useState(false);
  const avatarRef = useRef<HTMLButtonElement>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });

  const title = useMemo(() => pageTitle(location.pathname, user?.roleCode), [location.pathname, user?.roleCode]);

  const notifications = useAppSelector(selectNotifications) as { unread?: number } | null;
  const unread = notifications?.unread ?? 0;

  useEffect(() => {
    dispatch(fetchNotificationsStart());
    const id = window.setInterval(() => dispatch(fetchNotificationsStart()), 30_000);
    return () => window.clearInterval(id);
  }, [dispatch]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const place = () => {
      const box = avatarRef.current?.getBoundingClientRect();
      if (!box) return;
      setMenuPos({ top: box.bottom + 8, right: window.innerWidth - box.right });
    };
    place();
    const close = () => setMenuOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('resize', place);
    window.addEventListener('scroll', close, true);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const signOut = () => {
    setMenuOpen(false);
    dispatch(userSignInLogOutStart());
    navigate('/login', { replace: true });
  };

  return (
    <header className="relative z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-navy-800/10 bg-white/80 px-3 backdrop-blur-md sm:px-4 md:px-5">
      {/* Left — page name */}
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-navy-800/10 bg-white/70 text-navy-900 transition hover:bg-brand-50 md:hidden"
          onClick={toggleNav}
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
        <h1 className="truncate font-display text-base font-semibold tracking-tight text-navy-900 sm:text-lg">
          {title}
        </h1>
      </div>

      {/* Right — time, notifications, avatar */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <time
          dateTime={now.toISOString()}
          className="hidden rounded-full border border-navy-800/8 bg-white/70 px-3 py-1.5 text-right text-[11px] font-medium tabular-nums text-navy-800/65 sm:block sm:text-xs"
          title="Current time"
        >
          {formatClock(now)}
        </time>

        <Link
          to="/notifications"
          className="relative grid h-9 w-9 place-items-center rounded-xl border border-navy-800/10 bg-white text-navy-800 transition hover:border-brand-400/40 hover:bg-brand-50"
          aria-label={unread > 0 ? `${unread} unread notifications` : 'Notifications'}
        >
          <Bell size={16} />
          {unread > 0 ? (
            <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-400 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
              {unread > 99 ? '99+' : unread}
            </span>
          ) : null}
        </Link>

        <div className="relative">
          <button
            ref={avatarRef}
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-900 text-[11px] font-bold uppercase tracking-wide text-white shadow-soft transition hover:bg-brand-400"
            aria-label="Account menu"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            onClick={() => {
              const box = avatarRef.current?.getBoundingClientRect();
              if (box) setMenuPos({ top: box.bottom + 8, right: window.innerWidth - box.right });
              setMenuOpen((v) => !v);
            }}
          >
            {initials(user?.firstName, user?.lastName)}
          </button>
          {menuOpen
            ? createPortal(
                <div className="fixed inset-0 z-[200]" role="presentation">
                  <button
                    type="button"
                    className="absolute inset-0 cursor-default bg-transparent"
                    aria-label="Close menu"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div
                    role="menu"
                    className="absolute w-56 overflow-hidden rounded-2xl border border-navy-800/10 bg-white py-2 shadow-lift"
                    style={{ top: menuPos.top, right: menuPos.right }}
                  >
                    <div className="border-b border-navy-800/8 px-3.5 pb-2.5">
                      <p className="truncate text-sm font-semibold text-navy-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-400">
                        {user?.roleName}
                      </p>
                      <p className="mt-1 text-[11px] tabular-nums text-navy-800/50 sm:hidden">{formatClock(now)}</p>
                    </div>
                    <button
                      type="button"
                      role="menuitem"
                      className="mt-1 flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm font-medium text-navy-800 transition hover:bg-brand-50"
                      onClick={signOut}
                    >
                      <LogOut size={14} />
                      Sign out
                    </button>
                  </div>
                </div>,
                document.body,
              )
            : null}
        </div>
      </div>
    </header>
  );
}

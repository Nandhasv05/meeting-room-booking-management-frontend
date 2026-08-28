// AUTHOR : NANDNHAKUMAR SV 
// DATE : 27/08/2026
// DESCRIPTION : Admin dashboard to view admin dashboard
import { Link } from 'react-router-dom';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Building2, CalendarClock, ClipboardList, Settings, Shield, Users, Wrench } from 'lucide-react';
import { StatusBadge } from '../../components/ui/Feedback';
import { PulseStat, type Dash } from './shared';

export function AdminDashboard({ data }: { data: Dash }) {
  /******* STATE *******/
  const s = data.stats;
  const maxDept = Math.max(...data.byDepartment.map((d) => Number(d.Count) || 0), 1);
  const maxRole = Math.max(...data.usersByRole.map((r) => Number(r.Count) || 0), 1);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* <WelcomeBand
        kicker="Administrator"
        subtitle={`${s.ActiveUsers ?? 0} active users · ${s.TotalHalls ?? 0} halls · ${s.TodayBookings ?? 0} bookings today`}
      /> */}

      <section className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 stagger">
        <PulseStat icon={Users} label="Users" value={s.TotalUsers} />
        <PulseStat icon={Users} label="Active" value={s.ActiveUsers} accent />
        <PulseStat icon={Building2} label="Halls" value={s.TotalHalls} />
        <PulseStat icon={CalendarClock} label="Today" value={s.TodayBookings} />
        <PulseStat icon={ClipboardList} label="Departments" value={s.Departments} />
        <PulseStat icon={Wrench} label="Cancelled 30d" value={s.CancelledLast30} warn={(s.CancelledLast30 ?? 0) > 8} />
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-navy-800/10 bg-white/85 p-5 shadow-panel animate-rise">
          <h3 className="mb-4 font-display text-base font-semibold text-navy-900">People by role</h3>
          <ul className="space-y-3">
            {(data.usersByRole ?? []).map((row) => {
              const pct = Math.round((Number(row.Count) / maxRole) * 100);
              return (
                <li key={row.RoleCode}>
                  <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                    <span className="truncate font-medium text-navy-900">{row.RoleName}</span>
                    <span className="shrink-0 tabular-nums text-navy-800/55">{row.Count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-stone-200">
                    <div className="h-full rounded-full bg-navy-900 transition-all duration-700" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-2xl border border-navy-800/10 bg-white/85 p-5 shadow-panel animate-rise">
          <h3 className="mb-4 font-display text-base font-semibold text-navy-900">Bookings by department</h3>
          <ul className="space-y-3">
            {data.byDepartment.length === 0 ? (
              <li className="text-sm text-navy-800/50">No bookings in the last 30 days.</li>
            ) : (
              data.byDepartment.slice(0, 6).map((row) => {
                const pct = Math.round((Number(row.Count) / maxDept) * 100);
                return (
                  <li key={row.Department}>
                    <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                      <span className="truncate font-medium text-navy-900">{row.Department}</span>
                      <span className="shrink-0 tabular-nums text-navy-800/55">{row.Count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-stone-200">
                      <div className="h-full rounded-full bg-brand-400 transition-all duration-700" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-navy-800/10 bg-white/85 p-5 shadow-panel animate-rise">
          <h3 className="mb-1 font-display text-base font-semibold text-navy-900">Booking trend</h3>
          <p className="mb-3 text-xs text-navy-800/50">Last 30 days</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data.trend}>
              <defs>
                <linearGradient id="adminTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2F7A4E" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#2F7A4E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#d3ded7" vertical={false} />
              <XAxis dataKey="Period" tick={{ fontSize: 10 }} tickFormatter={(v) => String(v).slice(5)} />
              <YAxis allowDecimals={false} width={28} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Area type="monotone" dataKey="Count" stroke="#122315" strokeWidth={2} fill="url(#adminTrend)" />
            </AreaChart>
          </ResponsiveContainer>
        </section>

        <section className="overflow-hidden rounded-2xl border border-navy-800/10 bg-white/85 shadow-panel">
          <div className="border-b border-navy-800/8 px-4 py-3.5">
            <h3 className="font-display text-base font-semibold text-navy-900">Recent bookings</h3>
          </div>
          <ul className="divide-y divide-navy-800/10">
            {data.recent.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm text-navy-800/50">No recent bookings.</li>
            ) : (
              data.recent.slice(0, 7).map((row) => (
                <li key={row.Id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <div className="min-w-0">
                    <Link to={`/bookings/${row.Id}`} className="truncate text-sm font-medium text-navy-900 hover:text-brand-400">
                      {row.EventName}
                    </Link>
                    <p className="truncate text-xs text-navy-800/50">{row.HallName}</p>
                  </div>
                  <StatusBadge value={row.Status} />
                </li>
              ))
            )}
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border border-navy-800/10 bg-white/85 p-5 shadow-panel">
        <h3 className="mb-3 font-display text-sm font-semibold text-navy-900">Administration</h3>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <AdminLink to="/admin/users" icon={Users} label="Users" hint="Accounts and roles" />
          <AdminLink to="/admin/roles" icon={Shield} label="Roles" hint="Permissions" />
          <AdminLink to="/admin/departments" icon={Building2} label="Departments" hint="Org units" />
          <AdminLink to="/admin/settings" icon={Settings} label="Settings" hint="System options" />
          <AdminLink to="/admin/audit" icon={ClipboardList} label="Audit logs" hint="Who changed what" />
          <AdminLink to="/admin/maintenance" icon={Wrench} label="Maintenance" hint="Hall downtime" />
          <AdminLink to="/reports" icon={CalendarClock} label="Reports" hint="Utilization & trends" />
          <AdminLink to="/halls" icon={Building2} label="Halls" hint="Rooms catalog" />
        </div>
      </section>
    </div>
  );
}

function AdminLink({
  to,
  icon: Icon,
  label,
  hint,
}: {
  to: string;
  icon: typeof Users;
  label: string;
  hint: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-2xl border border-navy-800/10 bg-mist/40 px-3.5 py-3 transition hover:-translate-y-0.5 hover:border-brand-400/30 hover:bg-brand-50"
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-navy-800 shadow-soft">
        <Icon className="h-4 w-4" />
      </span>
      <span>
        <span className="block text-sm font-semibold text-navy-900">{label}</span>
        <span className="block text-xs text-navy-800/50">{hint}</span>
      </span>
    </Link>
  );
}

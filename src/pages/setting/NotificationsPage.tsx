// AUTHOR : NANDNHAKUMAR SV 
// DATE : 28/08/2026
// DESCRIPTION : Notifications page to view notifications
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CalendarPlus, CheckCheck, CircleDot, Clock3, Flag, Play, XCircle } from 'lucide-react';
import { formatDistanceToNow, isToday } from 'date-fns';
import { parseAppDate } from '../../utils/format';
import { EmptyState, Spinner } from '../../components/ui/Feedback';
import { GhostButton } from '../../components/ui/Form';
import { TabPills } from '../../components/ui/Surface';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  fetchNotificationsStart,
  readAllNotificationsResponseResetStart,
  readAllNotificationsStart,
  readNotificationResponseResetStart,
  readNotificationStart,
} from '../../redux/notifications/notifications.action';
import {
  selectNotifications,
  selectNotificationsLoading,
  selectReadAllLoading,
  selectReadAllResponse,
  selectReadNotificationResponse,
} from '../../redux/notifications/notifications.selector';
import { useReduxResponse } from '../../redux/_common/useReduxResponse';
import { FILTERS, Filter, N, matches, groupByDay, iconClass, tone } from '../../helpers/setting/settingValidation';

export function NotificationsPage() {

  /******* STATE *******/
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState<Filter>('all');

  /******* SELECTORS *******/
  const data = useAppSelector(selectNotifications) as { items: N[]; unread: number } | null;
  const isLoading = useAppSelector(selectNotificationsLoading);
  const readOneResponse = useAppSelector(selectReadNotificationResponse);
  const readAllResponse = useAppSelector(selectReadAllResponse);
  const readAllPending = useAppSelector(selectReadAllLoading);

  /******* EFFECTS *******/
  useEffect(() => {
    dispatch(fetchNotificationsStart());
  }, [dispatch]);

  /******* HANDLERS *******/
  const resetReadOne = useCallback(() => dispatch(readNotificationResponseResetStart()), [dispatch]);
  const resetReadAll = useCallback(() => dispatch(readAllNotificationsResponseResetStart()), [dispatch]);
  useReduxResponse(readOneResponse, resetReadOne, () => dispatch(fetchNotificationsStart()));
  useReduxResponse(readAllResponse, resetReadAll, () => dispatch(fetchNotificationsStart()));

  /******* MEMO *******/
  const items = data?.items ?? [];
  const visible = useMemo(() => items.filter((n) => matches(n, filter)), [items, filter]);
  const groups = useMemo(() => groupByDay(visible), [visible]);
  const todayCount = items.filter((n) => isToday(parseAppDate(n.CreatedAt))).length;
  const liveCount = items.filter((n) => n.Type.includes('START') && !n.IsRead).length;

  return (
    <div className="animate-rise">
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <TabPills tabs={FILTERS} value={filter} onChange={setFilter} />
            <GhostButton type="button" onClick={() => dispatch(readAllNotificationsStart())} disabled={!data?.unread || readAllPending}>
            <CheckCheck className="h-4 w-4" />
            {readAllPending ? 'Marking…' : 'Mark all read'}
          </GhostButton>
          </div>

          {isLoading ? (
            <Spinner />
          ) : !visible.length ? (
            <EmptyState
              title={filter === 'all' ? 'No notifications' : 'Nothing in this filter'}
              hint="Booking confirmations, reminders, and room updates land here."
            />
          ) : (
            <div className="space-y-6">
              {groups.map(([label, rows]) => (
                <section key={label}>
                  <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-800/40">
                    {label}
                  </p>
                  <ul className="space-y-2">
                    {rows.map((n) => {
                      const kind = tone(n.Type);
                      const href =
                        n.RelatedModule === 'bookings' && n.RelatedId ? `/bookings/${n.RelatedId}` : null;
                      const body = (
                        <>
                          <span
                            className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${iconClass(kind, !n.IsRead)}`}
                          >
                            <TypeIcon type={n.Type} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold text-navy-900">{n.Title}</span>
                              {!n.IsRead ? (
                                <span className="rounded-full bg-brand-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                                  New
                                </span>
                              ) : null}
                            </span>
                            <span className="mt-0.5 block text-sm text-navy-800/65">{n.Message}</span>
                            <span className="mt-1.5 block text-xs text-navy-800/40">
                              {formatDistanceToNow(parseAppDate(n.CreatedAt), { addSuffix: true })}
                              {href ? ' · Open booking' : ''}
                            </span>
                          </span>
                        </>
                      );
                      const cls = `flex w-full items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition ${
                        n.IsRead
                          ? 'border-navy-800/8 bg-white/70 hover:border-navy-800/12'
                          : 'border-brand-400/25 bg-white shadow-soft hover:border-brand-400/40'
                      }`;
                      return (
                        <li key={n.Id}>
                          {href ? (
                            <Link
                              to={href}
                              className={cls}
                              onClick={() => {
                                if (!n.IsRead) dispatch(readNotificationStart({ id: n.Id }));
                              }}
                            >
                              {body}
                            </Link>
                          ) : (
                            <button
                              type="button"
                              className={cls}
                              onClick={() => {
                                if (!n.IsRead) dispatch(readNotificationStart({ id: n.Id }));
                              }}
                            >
                              {body}
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-3 xl:sticky xl:top-3">
          <div className="rounded-2xl border border-navy-800/10 bg-navy-950 p-5 text-white shadow-panel">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">Inbox</p>
            <p className="mt-2 font-display text-4xl font-bold tabular-nums">{data?.unread ?? 0}</p>
            <p className="mt-1 text-sm text-white/55">unread updates</p>
            {liveCount ? (
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
                <CircleDot className="h-3.5 w-3.5 text-emerald-300" />
                {liveCount} event{liveCount === 1 ? '' : 's'} starting
              </p>
            ) : (
              <p className="mt-4 text-xs text-white/40">No rooms going live right now.</p>
            )}
          </div>
          <div className="rounded-2xl border border-navy-800/10 bg-white/80 p-4 shadow-soft">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-800/40">Today</p>
            <p className="mt-1 font-display text-2xl font-semibold text-navy-900">{todayCount}</p>
            <p className="text-xs text-navy-800/50">notifications arrived today</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function TypeIcon({ type }: { type: string }) {
  if (type.includes('CREATED')) return <CalendarPlus className="h-4 w-4" />;
  if (type.includes('CANCEL') || type.includes('REJECT')) return <XCircle className="h-4 w-4" />;
  if (type.includes('START')) return <Play className="h-4 w-4" />;
  if (type.includes('COMPLETE')) return <Flag className="h-4 w-4" />;
  if (type.includes('REMIND')) return <Clock3 className="h-4 w-4" />;
  return <Bell className="h-4 w-4" />;
}
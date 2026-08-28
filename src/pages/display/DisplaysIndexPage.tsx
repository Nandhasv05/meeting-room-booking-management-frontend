// AUTHOR : NANDNHAKUMAR SV
// DATE : 28/08/2026
// DESCRIPTION : Hall display wall to open room TV boards
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin, MonitorPlay, Radio, Users } from 'lucide-react';
import type { DisplayPayload } from '../../types/api';
import { EmptyState, Spinner } from '../../components/ui/Feedback';
import { fmtTime } from '../../utils/format';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchDisplayWallStart } from '../../redux/display/display.action';
import { selectWall, selectWallLoading } from '../../redux/display/display.selector';
import { previewSkin, wallShort, wallTone, WallItem } from '../../helpers/display/displayValidation';

type FilterId = 'ALL' | DisplayPayload['state'];

const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'ALL', label: 'All screens' },
  { id: 'AVAILABLE', label: 'Free' },
  { id: 'ONGOING', label: 'Live' },
  { id: 'UPCOMING', label: 'Soon' },
  { id: 'MAINTENANCE', label: 'Down' },
];

export function DisplaysIndexPage() {
  /******* STATE *******/
  const dispatch = useAppDispatch();
  const data = (useAppSelector(selectWall) as WallItem[] | undefined) ?? [];
  const isLoading = useAppSelector(selectWallLoading);
  const [filter, setFilter] = useState<FilterId>('ALL');

  /******* EFFECTS *******/
  useEffect(() => {
    dispatch(fetchDisplayWallStart());
    const id = window.setInterval(() => dispatch(fetchDisplayWallStart()), 30_000);
    return () => window.clearInterval(id);
  }, [dispatch]);

  /******* DERIVED *******/
  const counts = useMemo(
    () => ({
      ALL: data.length,
      AVAILABLE: data.filter((x) => x.board.state === 'AVAILABLE').length,
      ONGOING: data.filter((x) => x.board.state === 'ONGOING').length,
      UPCOMING: data.filter((x) => x.board.state === 'UPCOMING').length,
      MAINTENANCE: data.filter((x) => x.board.state === 'MAINTENANCE').length,
    }),
    [data],
  );

  const items = useMemo(
    () => (filter === 'ALL' ? data : data.filter((x) => x.board.state === filter)),
    [data, filter],
  );

  const featuredId =
    filter === 'ALL'
      ? items.find((x) => x.board.state === 'ONGOING')?.hall.Id ?? items[0]?.hall.Id
      : undefined;

  const ticker = useMemo(() => {
    if (!data.length) return [];
    const row = data.map((x) => `${x.hall.Code} · ${wallShort[x.board.state]}`);
    const pad = row.length < 6 ? [...row, ...row, ...row, ...row] : row;
    return [...pad, ...pad];
  }, [data]);

  /******* RENDER *******/
  return (
    <div className="wall-page">
      <section className="wall-hero">
        <span className="wall-hero__bar" aria-hidden>
          <span />
        </span>
        <div className="wall-hero__top">
          <div className="min-w-0">
            <p className="wall-hero__kicker">
              <span className="wall-led" />
              Live wall
            </p>
            <h1 className="wall-hero__title">Hall displays</h1>
            <p className="wall-hero__copy">
              Open a full-screen board for each room TV. Previews refresh on their own.
            </p>
          </div>
          <p className="wall-hero__count">
            <strong>{counts.ALL}</strong>
            <span>screens online</span>
          </p>
        </div>
        {ticker.length ? (
          <div className="wall-ticker" aria-hidden>
            <div className="wall-ticker__track">
              {ticker.map((label, i) => (
                <span key={`${label}-${i}`}>{label}</span>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {data.length ? (
        <div className="wall-stats" role="tablist" aria-label="Filter displays">
          {FILTERS.map((tab, i) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={filter === tab.id}
              className={`wall-stat ${filter === tab.id ? 'is-active' : ''}`}
              style={{ animationDelay: `${80 + i * 60}ms` }}
              onClick={() => setFilter(tab.id)}
            >
              <span className="wall-stat__label">{tab.label}</span>
              <span className="wall-stat__value">{counts[tab.id]}</span>
            </button>
          ))}
        </div>
      ) : null}

      {isLoading && data.length === 0 ? (
        <Spinner />
      ) : data.length === 0 ? (
        <EmptyState title="No active halls" hint="Add a hall first, then open its TV board." />
      ) : items.length === 0 ? (
        <EmptyState title="Nothing in this state" hint="Pick another filter to see more screens." />
      ) : (
        <ul key={filter} className="wall-grid">
          {items.map(({ hall, board }, i) => {
            const featured = hall.Id === featuredId;
            return (
              <li
                key={hall.Id}
                className={featured ? 'wall-grid__feature' : undefined}
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <Link
                  to={`/display/${hall.Code}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`wall-monitor ${wallTone[board.state]} ${featured ? 'wall-monitor--feature' : ''}`}
                >
                  <div className={`wall-screen bg-gradient-to-br ${previewSkin[board.state]}`}>
                    <span className="wall-screen__grain" />
                    <span className="wall-screen__wipe" />
                    <div className="wall-screen__top">
                      <span className="wall-screen__code">{hall.Code}</span>
                      <span className="wall-screen__state">
                        <span className="wall-led" />
                        {wallShort[board.state]}
                      </span>
                    </div>
                    <div className="wall-screen__body">
                      <p className="wall-screen__name">{hall.Name}</p>
                      <p className="wall-screen__headline">{board.headline}</p>
                      {board.next && board.state === 'AVAILABLE' ? (
                        <p className="wall-screen__next">Next {fmtTime(board.next.StartAt)}</p>
                      ) : null}
                      {board.state === 'ONGOING' ? (
                        <span className="wall-eq" aria-hidden>
                          <i />
                          <i />
                          <i />
                          <i />
                          <i />
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="wall-chin">
                    <span className="wall-chin__icon">
                      {board.state === 'ONGOING' ? <Radio className="h-4 w-4" /> : <MonitorPlay className="h-4 w-4" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="wall-chin__name">{hall.Name}</span>
                      <span className="wall-chin__cta">Open TV board</span>
                      <span className="wall-chin__meta">
                        <MapPin className="h-3 w-3 shrink-0 opacity-60" />
                        <span className="truncate">
                          {hall.Building} · Floor {hall.Floor}
                        </span>
                        <Users className="ml-1 h-3 w-3 shrink-0 opacity-60" />
                        {hall.Capacity}
                      </span>
                    </span>
                    <ArrowUpRight className="wall-chin__arrow" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

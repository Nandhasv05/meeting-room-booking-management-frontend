import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowUpRight, MonitorPlay } from 'lucide-react';
import { api, unwrap } from '../services/api';
import type { DisplayPayload, Hall } from '../types/api';
import { EmptyState, PageHeader, Spinner, StatusBadge } from '../components/ui/Feedback';
import { fmtTime } from '../utils/format';

type WallItem = { hall: Hall; board: DisplayPayload };

const previewSkin: Record<DisplayPayload['state'], string> = {
  AVAILABLE: 'from-[#122315] to-[#2F7A4E]',
  UPCOMING: 'from-[#1A3322] to-[#3D7A55]',
  ONGOING: 'from-[#0F2015] to-[#3D7A55]',
  MAINTENANCE: 'from-[#1b2430] to-[#475569]',
};

export function DisplaysIndexPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['display-wall'],
    queryFn: async () => {
      const halls = await unwrap<Hall[]>(api.get('/halls', { params: { active: 'true' } }));
      const boards = await Promise.all(
        halls.map(async (hall) => ({
          hall,
          board: await unwrap<DisplayPayload>(api.get(`/display/${hall.Code}`)),
        })),
      );
      return boards as WallItem[];
    },
    refetchInterval: 30_000,
  });

  return (
    <div className="animate-rise">
      <PageHeader
        title="Hall displays"
        description="Open a full-screen board for each room TV. Previews refresh on their own."
      />
      {isLoading ? (
        <Spinner />
      ) : !data?.length ? (
        <EmptyState title="No active halls" hint="Add a hall first, then open its TV board." />
      ) : (
        <ul className="stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.map(({ hall, board }) => (
            <li key={hall.Id}>
              <Link
                to={`/display/${hall.Code}`}
                target="_blank"
                rel="noreferrer"
                className="group block overflow-hidden rounded-3xl border border-navy-800/10 bg-white shadow-panel transition hover:-translate-y-1 hover:border-brand-400/35 hover:shadow-lift"
              >
                <div
                  className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${previewSkin[board.state]} text-white`}
                >
                  <span className="display-preview-scan" />
                  <div className="absolute inset-0 p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="rounded-full bg-white/12 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] backdrop-blur-sm">
                        {hall.Code}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-black/25 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            board.state === 'ONGOING'
                              ? 'bg-emerald-300 display-chip__dot'
                              : board.state === 'AVAILABLE'
                                ? 'bg-emerald-200'
                                : board.state === 'MAINTENANCE'
                                  ? 'bg-amber-300'
                                  : 'bg-white/80'
                          }`}
                        />
                        {board.state === 'ONGOING'
                          ? 'Live'
                          : board.state === 'AVAILABLE'
                            ? 'Free'
                            : board.state === 'UPCOMING'
                              ? 'Soon'
                              : 'Down'}
                      </span>
                    </div>
                    <p className="mt-6 font-display text-xl font-semibold leading-tight sm:text-2xl">{hall.Name}</p>
                    <p className="mt-2 line-clamp-2 text-sm text-white/75">{board.headline}</p>
                    {board.next && board.state === 'AVAILABLE' ? (
                      <p className="mt-3 text-xs text-white/55">Next {fmtTime(board.next.StartAt)}</p>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-600 transition group-hover:bg-navy-900 group-hover:text-white">
                    <MonitorPlay className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-navy-900">Open TV board</span>
                    <span className="block truncate text-xs text-navy-800/50">
                      {hall.Building} · Floor {hall.Floor} · {hall.Capacity} seats
                    </span>
                  </span>
                  <StatusBadge value={board.state} />
                  <ArrowUpRight className="h-4 w-4 text-navy-800/30 transition group-hover:text-brand-400" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

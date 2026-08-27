import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Plus, Users } from 'lucide-react';
import type { Hall } from '../../types/api';
import { EmptyState, Spinner, StatusBadge } from '../../components/ui/Feedback';
import { GhostButton, PrimaryButton } from '../../components/ui/Form';
import { SearchField, Toolbar } from '../../components/ui/Surface';
import { usePermission } from '../../hooks/usePermission';
import { useRealtime } from '../../hooks/useRealtime';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchHallsStart } from '../../redux/halls/halls.action';
import { selectHalls, selectHallsLoading } from '../../redux/halls/halls.selector';

export function HallsPage() {
  const { can } = usePermission();
  const [q, setQ] = useState('');
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectHalls) as Hall[] | undefined;
  const isLoading = useAppSelector(selectHallsLoading);
  useEffect(() => {
    dispatch(fetchHallsStart({ q }));
  }, [q, dispatch]);
  useRealtime(['dashboard'], () => dispatch(fetchHallsStart({ q })));
  return (
    <div>
      {/* TOOLBAR FOR THE HALLS PAGE */}
      <Toolbar>
        <SearchField value={q} onChange={setQ} placeholder="Search halls" />
        <div className="flex flex-wrap gap-2 justify-end items-center">
            {can('halls.manage_facilities') ? (
              <Link to="/halls/facilities">
                <GhostButton type="button">Facilities</GhostButton>
              </Link>
            ) : null}
            {can('halls.create') ? (
              <Link to="/halls/new">
                <PrimaryButton>
                  <Plus className="h-4 w-4" />
                  Add hall
                </PrimaryButton>
              </Link>
            ) : null}
          </div>
      </Toolbar>
      {/* SPINNER FOR THE HALLS PAGE */}
      {isLoading ? (
        <Spinner />
      ) : !data?.length ? (
        <EmptyState title="No halls found" hint="Try a different search, or add a new hall." />
      ) : (
        <ul className="stagger grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((h) => (
            <li key={h.Id}>
              <Link
                to={`/halls/${h.Id}`}
                className="group flex h-full flex-col rounded-2xl border border-navy-800/10 bg-white/85 p-5 shadow-panel backdrop-blur-sm transition hover:-translate-y-1 hover:border-brand-400/35 hover:shadow-lift"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-100 text-brand-600 transition group-hover:bg-navy-900 group-hover:text-white">
                    <Building2 className="h-5 w-5" />
                  </span>
                  <StatusBadge value={h.Status} />
                </div>
                <p className="font-display text-lg font-semibold text-navy-900">{h.Name}</p>
                <p className="text-sm text-navy-800/50">
                  {h.Code} · {h.Building} · L{h.Floor}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-navy-800/8 pt-3 text-sm text-navy-800/70">
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-navy-800/40" />
                    {h.Capacity} seats
                  </span>
                  <span className="font-medium">
                    {String(h.OpeningTime).slice(0, 5)}–{String(h.ClosingTime).slice(0, 5)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

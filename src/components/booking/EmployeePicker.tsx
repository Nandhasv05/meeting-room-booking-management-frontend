import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, UserPlus, X } from 'lucide-react';
import { useDebounced } from '../../hooks/useAvailability';
import { useAppDispatch, useAppSelector } from '../../store';
import { searchUsersStart } from '../../redux/users/users.action';
import { selectSearchLoading, selectSearchResults } from '../../redux/users/users.selector';
import { selectCurrentUser } from '../../redux/login/login.selector';
import { listContacts, type SavedContact } from '../../helpers/contact/contactStore';

export type Employee = {
  Id: string;
  FirstName: string;
  LastName: string;
  Email: string;
  EmployeeId: string;
  DepartmentName: string | null;
  Designation: string | null;
};

export type PickedEmployee = { id: string; name: string; email: string };

export function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/);
  return `${parts[0]?.[0] ?? ''}${parts[1]?.[0] ?? ''}`.toUpperCase() || 'U';
}

export function EmployeePicker({
  selected,
  onAdd,
  onRemove,
  variant = 'boxed',
  placeholder = 'Search employees by name, ID, or email',
  busyIds = [],
  renderEmpty = true,
}: {
  selected: PickedEmployee[];
  onAdd: (employee: PickedEmployee) => void;
  onRemove: (id: string) => void;
  variant?: 'boxed' | 'inline';
  placeholder?: string;
  busyIds?: string[];
  renderEmpty?: boolean;
}) {
  const [term, setTerm] = useState('');
  const [open, setOpen] = useState(false);
  const q = useDebounced(term, 300);
  const inline = variant === 'inline';
  const dispatch = useAppDispatch();
  const signedIn = useAppSelector(selectCurrentUser);
  const data = useAppSelector(selectSearchResults) as Employee[] | undefined;
  const isFetching = useAppSelector(selectSearchLoading);
  const [saved, setSaved] = useState<SavedContact[]>([]);

  useEffect(() => {
    if (!signedIn?.id) {
      setSaved([]);
      return;
    }
    let cancelled = false;
    void listContacts()
      .then((rows) => {
        if (!cancelled) setSaved(rows);
      })
      .catch(() => {
        if (!cancelled) setSaved([]);
      });
    return () => {
      cancelled = true;
    };
  }, [signedIn?.id]);

  useEffect(() => {
    if (q.trim().length >= 2) dispatch(searchUsersStart({ q }));
  }, [q, dispatch]);

  const directory = (data ?? [])
    .filter((e) => !selected.some((s) => s.id === e.Id || s.email.toLowerCase() === e.Email.toLowerCase()))
    .map((e) => ({
      id: e.Id,
      name: `${e.FirstName} ${e.LastName}`.trim(),
      email: e.Email,
      hint: `${e.EmployeeId} · ${e.DepartmentName ?? 'No department'}`,
    }));

  const book = saved
    .filter((c) => {
      const hay = `${c.name} ${c.email}`.toLowerCase();
      return q.trim().length >= 2 && hay.includes(q.trim().toLowerCase());
    })
    .filter((c) => !selected.some((s) => s.email.toLowerCase() === c.email.toLowerCase()))
    .map((c) => ({ id: `guest:${c.email}`, name: c.name, email: c.email, hint: 'Saved contact' }));

  const results = [...directory, ...book.filter((c) => !directory.some((d) => d.email.toLowerCase() === c.email.toLowerCase()))];

  return (
    <div>
      <div className="relative">
        {inline ? null : (
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-800/40" />
        )}
        <input
          className={
            inline
              ? 'w-full border-0 border-b border-transparent bg-transparent px-0 py-1.5 text-sm text-ink outline-none transition placeholder:text-navy-800/35 focus:border-brand-400'
              : 'w-full rounded-xl border border-navy-800/12 bg-white/90 py-2.5 pl-9 pr-3 text-sm text-ink outline-none transition placeholder:text-navy-800/35 focus:border-brand-400 focus:ring-4 focus:ring-brand-400/12'
          }
          placeholder={placeholder}
          value={term}
          onChange={(e) => {
            setTerm(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
        {open && q.trim().length >= 2 ? (
          <>
            <button
              type="button"
              className="fixed inset-0 z-30 cursor-default"
              aria-label="Close results"
              onClick={() => setOpen(false)}
            />
            <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 max-h-64 overflow-y-auto rounded-2xl border border-navy-800/10 bg-white py-1.5 shadow-lift animate-rise">
              {isFetching && !results.length ? (
                <p className="px-4 py-3 text-sm text-navy-800/50">Searching…</p>
              ) : !results.length ? (
                <div className="px-4 py-3">
                  <p className="text-sm text-navy-800/50">No matching people.</p>
                  <Link to="/contacts" className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline">
                    <UserPlus className="h-4 w-4" />
                    Open Contact page
                  </Link>
                </div>
              ) : (
                results.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition hover:bg-brand-50"
                    onClick={() => {
                      onAdd({ id: e.id, name: e.name, email: e.email });
                      setTerm('');
                      setOpen(false);
                    }}
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-100 text-[11px] font-bold text-brand-600">
                      {initialsOf(e.name)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-navy-900">{e.name}</span>
                      <span className="block truncate text-xs text-navy-800/50">{e.hint}</span>
                    </span>
                    <UserPlus className="h-4 w-4 shrink-0 text-navy-800/30" />
                  </button>
                ))
              )}
            </div>
          </>
        ) : null}
      </div>

      {selected.length ? (
        <ul className="mt-2.5 flex flex-wrap gap-2">
          {selected.map((s) => {
            const busy = busyIds.includes(s.id);
            return (
              <li
                key={s.id}
                className={`inline-flex items-center gap-2 rounded-full border py-1 pl-1 pr-2 text-sm ${
                  busy ? 'border-rose-200 bg-rose-50' : 'border-navy-800/10 bg-mist/60'
                }`}
                title={busy ? `${s.name} is busy at this time` : s.email}
              >
                <span
                  className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold ${
                    busy ? 'bg-rose-200 text-rose-900' : 'bg-brand-100 text-brand-600'
                  }`}
                >
                  {initialsOf(s.name)}
                </span>
                <span className={`font-medium ${busy ? 'text-rose-900' : 'text-navy-900'}`}>{s.name}</span>
                {s.id.startsWith('guest:') ? (
                  <span className="text-[10px] font-bold uppercase tracking-wide text-navy-800/45">guest</span>
                ) : null}
                {busy ? <span className="text-[10px] font-bold uppercase tracking-wide text-rose-700">busy</span> : null}
                <button
                  type="button"
                  className="grid h-5 w-5 place-items-center rounded-full text-navy-800/40 transition hover:bg-white hover:text-rose-600"
                  onClick={() => onRemove(s.id)}
                  aria-label={`Remove ${s.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </li>
            );
          })}
        </ul>
      ) : renderEmpty ? (
        <p className="mt-2 text-xs text-navy-800/45">No employees added yet.</p>
      ) : null}
    </div>
  );
}

import type { ReactNode } from 'react';
import { Search } from 'lucide-react';

export function Card({
  children,
  className = '',
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section
      className={`rounded-2xl border border-navy-800/10 bg-white/85 shadow-panel backdrop-blur-sm ${
        padded ? 'p-4 sm:p-5' : ''
      } ${className}`}
    >
      {children}
    </section>
  );
}

export function CardHeader({
  title,
  subtitle,
  actions,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="font-display text-base font-semibold text-navy-900 sm:text-lg">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-sm text-navy-800/55">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function Toolbar({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`mb-4 flex flex-wrap items-end gap-2 rounded-2xl border border-navy-800/10 bg-white/70 p-2.5 shadow-soft backdrop-blur-sm sm:gap-3 sm:p-3 ${className}`}
    >
      {children}
    </div>
  );
}

export function TabPills<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: readonly (readonly [T, string])[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5 rounded-2xl border border-navy-800/10 bg-white/70 p-1.5 shadow-soft backdrop-blur-sm">
      {tabs.map(([id, label]) => (
        <button
          key={id}
          type="button"
          className={`rounded-xl px-3.5 py-1.5 text-sm font-medium transition ${
            value === id
              ? 'bg-navy-900 text-white shadow-soft'
              : 'text-navy-800/70 hover:bg-brand-50 hover:text-navy-900'
          }`}
          onClick={() => onChange(id)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder = 'Search',
  className = '',
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={`relative w-full sm:max-w-xs ${className}`}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-800/40" />
      <input
        className="w-full rounded-xl border border-navy-800/12 bg-white/90 py-2 pl-9 pr-3 text-sm text-ink outline-none transition placeholder:text-navy-800/35 focus:border-brand-400 focus:ring-4 focus:ring-brand-400/12"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export type Column<T> = {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  className?: string;
  align?: 'left' | 'right' | 'center';
};

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => string;
  onRowClick?: (row: T) => void;
}) {
  const alignOf = (align?: Column<T>['align']) =>
    align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';
  return (
    <div className="soft-scroll overflow-x-auto rounded-2xl border border-navy-800/10 bg-white/85 shadow-panel backdrop-blur-sm">
      <table className="w-full min-w-[38rem] border-collapse text-left text-sm">
        <thead>
          <tr className="bg-mist/70">
            {columns.map((c, i) => (
              <th
                key={c.key}
                className={`whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-navy-800/60 ${alignOf(
                  c.align,
                )} ${i === 0 ? 'rounded-tl-2xl' : ''} ${i === columns.length - 1 ? 'rounded-tr-2xl' : ''}`}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={rowKey(row, index)}
              className={`border-t border-navy-800/8 transition hover:bg-brand-50/60 ${
                onRowClick ? 'cursor-pointer' : ''
              }`}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((c) => (
                <td key={c.key} className={`px-4 py-3 align-middle ${alignOf(c.align)} ${c.className ?? ''}`}>
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ListCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <ul
      className={`divide-y divide-navy-800/8 overflow-hidden rounded-2xl border border-navy-800/10 bg-white/85 shadow-panel backdrop-blur-sm ${className}`}
    >
      {children}
    </ul>
  );
}

export function DefinitionItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-xl bg-mist/40 px-3 py-2.5">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-navy-800/45">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-navy-900">{value}</dd>
    </div>
  );
}

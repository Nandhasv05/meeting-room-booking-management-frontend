export function TimePoint({
  label,
  time,
  date,
  align = 'start',
}: {
  label: string;
  time: string;
  date?: string;
  align?: 'start' | 'end';
}) {
  return (
    <div className={align === 'end' ? 'text-left sm:text-right' : ''}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-800/40">{label}</p>
      <p className="mt-0.5 font-display text-xl font-semibold tracking-tight text-navy-900">{time}</p>
      {date ? <p className="text-xs text-navy-800/50">{date}</p> : null}
    </div>
  );
}

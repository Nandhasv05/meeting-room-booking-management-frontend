export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="flex h-11 shrink-0 items-center justify-between gap-3 border-t border-navy-800/10 bg-white/80 px-3 backdrop-blur-md sm:px-4 md:px-5">
      <p className="truncate text-[11px] font-medium text-navy-800/50">
        © {year} evolv clothing
      </p>
      <p className="hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-navy-800/35 sm:block">
        Conference halls · Internal LAN
      </p>
    </footer>
  );
}

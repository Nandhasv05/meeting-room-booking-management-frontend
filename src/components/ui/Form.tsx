import type { ButtonHTMLAttributes, ReactNode } from 'react';

export function Modal({
  open,
  title,
  children,
  onClose,
  footer,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/55 p-4 backdrop-blur-sm">
      <button className="absolute inset-0 cursor-default" aria-label="Close" onClick={onClose} />
      <div className="relative z-10 max-h-[88vh] w-full max-w-lg overflow-hidden rounded-3xl border border-navy-800/10 bg-white shadow-lift animate-rise">
        <div className="flex items-center justify-between border-b border-navy-800/8 px-5 py-4">
          <h2 className="font-display text-lg font-semibold text-navy-900">{title}</h2>
          <button
            type="button"
            className="grid h-8 w-8 place-items-center rounded-full text-lg leading-none text-navy-800/45 transition hover:bg-mist hover:text-navy-900"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="soft-scroll max-h-[62vh] overflow-y-auto px-5 py-4">{children}</div>
        {footer ? <div className="border-t border-navy-800/8 bg-mist/30 px-5 py-3">{footer}</div> : null}
      </div>
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="mb-3.5 block text-sm">
      <span className="mb-1.5 block font-semibold text-navy-900">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-navy-800/50">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  'w-full rounded-xl border border-navy-800/12 bg-white/90 px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-navy-800/35 focus:border-brand-400 focus:ring-4 focus:ring-brand-400/12 disabled:bg-mist/60 disabled:text-navy-800/50';

export function PrimaryButton({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-brand-500 hover:shadow-panel active:translate-y-0 disabled:translate-y-0 disabled:opacity-50 ${
        props.className ?? ''
      }`}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border border-navy-800/12 bg-white/80 px-4 py-2.5 text-sm font-semibold text-navy-900 transition hover:-translate-y-0.5 hover:border-brand-400/40 hover:bg-brand-50 active:translate-y-0 disabled:translate-y-0 disabled:opacity-50 ${
        props.className ?? ''
      }`}
    >
      {children}
    </button>
  );
}

export function DangerButton({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-100 active:translate-y-0 disabled:translate-y-0 disabled:opacity-50 ${
        props.className ?? ''
      }`}
    >
      {children}
    </button>
  );
}

import { LOGO_SRC } from './BrandLogo';

type Props = {
  label?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  /** Use on dark backgrounds */
  light?: boolean;
};

const sizes = { sm: 36, md: 56, lg: 88 };

/** Loading state with evolv logo + ripple ring. */
export function LogoSpinner({ label = 'Loading…', fullScreen = false, size = 'md', light = false }: Props) {
  const h = sizes[size];
  const logoH = Math.round(h * 0.55);
  const body = (
    <div className="flex flex-col items-center justify-center gap-3 animate-rise" role="status" aria-live="polite">
      <div className={`evolv-spinner ${light ? 'evolv-spinner--light' : ''}`} style={{ width: h + 28, height: h + 28 }}>
        <span className="evolv-spinner__ring" />
        <span className="evolv-spinner__ring evolv-spinner__ring--delay" />
        <img
          src={LOGO_SRC}
          alt="evolv"
          className={`evolv-spinner__logo ${light ? 'evolv-logo--light' : ''}`}
          style={{ height: logoH }}
        />
      </div>
      {label ? (
        <p
          className={`text-xs font-semibold uppercase tracking-[0.18em] ${light ? 'text-white/55' : 'text-navy-800/50'}`}
        >
          {label}
        </p>
      ) : null}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] grid place-items-center bg-stone-50/90 backdrop-blur-sm">{body}</div>
    );
  }
  return <div className="flex justify-center py-10 sm:py-14">{body}</div>;
}

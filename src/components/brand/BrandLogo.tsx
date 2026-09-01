import { Link } from 'react-router-dom';
import { publicAsset } from '../../utils/baseUrl';

const LOGO_SRC = publicAsset('assets/logo.png');

type BrandLogoProps = {
  variant?: 'dark' | 'light';
  className?: string;
  height?: number;
  to?: string | null;
  markOnly?: boolean;
};

/** Official evolv wordmark. Use `light` on dark backgrounds (CSS invert). */
export function BrandLogo({
  variant = 'dark',
  className = '',
  height = 28,
  to = '/',
  markOnly = false,
}: BrandLogoProps) {
  const img = (
    <img
      src={LOGO_SRC}
      alt="evolv"
      height={height}
      className={`evolv-logo ${variant === 'light' ? 'evolv-logo--light' : ''} ${markOnly ? 'evolv-logo--mark' : ''} ${className}`}
      style={{ height, width: 'auto' }}
      draggable={false}
    />
  );
  if (to === null) return img;
  return (
    <Link to={to} className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">
      {img}
    </Link>
  );
}

export { LOGO_SRC };

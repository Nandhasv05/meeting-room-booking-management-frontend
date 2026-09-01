import { PORTAL_LOGIN_URL } from '../../redux/const';
import { BrandLogo } from '../../components/brand/BrandLogo';

export function PortalAuthPage() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center bg-[#07140c] px-6 text-white">
      <BrandLogo variant="light" height={32} to={null} />
      <h1 className="mt-8 text-xl font-semibold">Meeting Hall</h1>
      <p className="mt-3 max-w-sm text-center text-sm text-white/60">
        Open Meeting Hall from the EVOLV dashboard so your portal session can sign you in.
      </p>
      <a
        href={PORTAL_LOGIN_URL}
        className="mt-8 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-[#07140c]"
      >
        Back to EVOLV
      </a>
    </div>
  );
}

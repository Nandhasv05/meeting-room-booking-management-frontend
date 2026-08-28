// AUTHOR : NANDHAKUMAR SV
// DATE : 28/08/2026
// DESCRIPTION : Animated 404 page when a route does not exist
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarDays, DoorOpen, Search } from 'lucide-react';
import { BrandLogo } from '../../components/brand/BrandLogo';
import { GhostButton, PrimaryButton } from '../../components/ui/Form';
import { useAppSelector } from '../../store';
import { selectCurrentUser } from '../../redux/login/login.selector';

export function NotFoundPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useAppSelector(selectCurrentUser);
  const signedIn = Boolean(user);
  const homeTo = signedIn ? '/' : '/login';

  return (
    <div className="nf-page">
      <div className="nf-orb nf-orb--a" aria-hidden />
      <div className="nf-orb nf-orb--b" aria-hidden />
      <div className="nf-orb nf-orb--c" aria-hidden />
      <div className="nf-grid" aria-hidden />
      <div className="nf-scan" aria-hidden />

      <header className="nf-top">
        <BrandLogo variant="light" height={28} to={homeTo} />
        <p className="nf-kicker">Conference halls</p>
      </header>

      <main className="nf-main">
        <div className="nf-digits" aria-hidden>
          <span className="nf-digit nf-digit--a nf-glitch">4</span>
          <span className="nf-zero">
            <span className="nf-zero__ring" />
            <span className="nf-zero__num nf-glitch">0</span>
            <Search className="nf-orbit" size={22} strokeWidth={2.2} />
          </span>
          <span className="nf-digit nf-digit--b nf-glitch">4</span>
        </div>

        <div className="nf-door-wrap" aria-hidden>
          <DoorOpen className="nf-door" size={36} strokeWidth={1.6} />
        </div>

        <p className="nf-tag">Hall not on the floor plan</p>
        <h1 className="nf-title">This room does not exist.</h1>
        <p className="nf-copy">
          <code className="nf-path">{pathname}</code> is not a booked slot, a hall, or a page in evolv.
        </p>

        <div className="nf-chips" aria-hidden>
          <span className="nf-chip nf-chip--a">VACANT</span>
          <span className="nf-chip nf-chip--b">NO SLOT</span>
          <span className="nf-chip nf-chip--c">OFF MAP</span>
        </div>

        <div className="nf-actions">
          <GhostButton type="button" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            Go back
          </GhostButton>
          <PrimaryButton type="button" className="!bg-brand-400 hover:!bg-signal" onClick={() => navigate(homeTo)}>
            {signedIn ? 'Back to home' : 'Sign in'}
          </PrimaryButton>
          {signedIn ? (
            <GhostButton type="button" onClick={() => navigate('/calendar')}>
              <CalendarDays size={16} />
              Calendar
            </GhostButton>
          ) : null}
        </div>
      </main>

      <footer className="nf-foot">Internal LAN · evolv clothing</footer>
    </div>
  );
}

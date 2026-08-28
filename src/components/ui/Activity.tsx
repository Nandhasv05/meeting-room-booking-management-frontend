import { useEffect, useState } from 'react';
import { LogoSpinner } from '../brand/LogoSpinner';
import { useAppSelector } from '../../store';
import type { RootState } from '../../redux/root-reducer';

function loadingFlags(state: RootState): string[] {
  const flags: string[] = [];
  for (const slice of Object.values(state) as any[]) {
    if (!slice || typeof slice !== 'object') continue;
    for (const [key, value] of Object.entries(slice)) {
      if (key.endsWith('Loading') && value) flags.push(key);
    }
  }
  return flags;
}

function isMutationFlag(key: string) {
  return /^(login|save|create|update|delete|cancel|readAll|testMail)/i.test(key);
}

/** Delays turning on so quick requests don't flash the UI. */
function useDelayedFlag(active: boolean, delay: number) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!active) {
      setOn(false);
      return;
    }
    const timer = window.setTimeout(() => setOn(true), delay);
    return () => window.clearTimeout(timer);
  }, [active, delay]);
  return on;
}

/** Thin bar at the top of the window while any request is in flight. */
export function GlobalProgress() {
  const busy = useAppSelector((s) => loadingFlags(s).length > 0);
  const show = useDelayedFlag(busy, 140);
  if (!show) return null;
  return (
    <div className="global-progress" role="presentation">
      <span />
    </div>
  );
}

export function hideBootSplash() {
  const el = document.getElementById('boot-splash');
  if (!el) return;
  el.classList.add('is-out');
  window.setTimeout(() => el.remove(), 280);
}

/** Full-screen overlay only while a mutation is in flight (saves, deletes). */
export function BusyOverlay() {
  const mutating = useAppSelector((s) => loadingFlags(s).some(isMutationFlag));
  const show = useDelayedFlag(mutating, 450);
  if (!show) return null;
  return <LogoSpinner fullScreen size="lg" label="Working…" />;
}

// AUTHOR : NANDNHAKUMAR SV
// DATE : 28/08/2026
// DESCRIPTION : Display page to view display
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Briefcase, CalendarClock, Maximize2, Minimize2, User, Users } from 'lucide-react';
import type { DisplayPayload } from '../../types/api';
import { useRealtime } from '../../hooks/useRealtime';
import { useFullscreen } from '../../hooks/useFullscreen';
import { fmtTime } from '../../utils/format';
import { BrandLogo } from '../../components/brand/BrandLogo';
import { LogoSpinner } from '../../components/brand/LogoSpinner';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchDisplayStart } from '../../redux/display/display.action';
import { selectBoard } from '../../redux/display/display.selector';
import {
  clockParts,
  haloWord,
  progress,
  remaining,
  skins,
  useNow,
} from '../../helpers/display/displayValidation';

const CHIP: Record<DisplayPayload['state'], string> = {
  AVAILABLE: 'Available',
  UPCOMING: 'Starting soon',
  ONGOING: 'In progress',
  MAINTENANCE: 'Unavailable',
};

const COUNT_HINT: Record<DisplayPayload['state'], string> = {
  AVAILABLE: 'Available',
  UPCOMING: 'Starts in',
  ONGOING: 'Ends in',
  MAINTENANCE: 'Offline',
};

export function DisplayPage() {
  /******* USE PARAMS *******/
  const { hallCode } = useParams();
  const boardRef = useRef<HTMLDivElement>(null);
  const { active: isFullscreen, enter, exit, toggle } = useFullscreen(boardRef);
  const [showGate, setShowGate] = useState(true);
  const [fsError, setFsError] = useState(false);

  /******* SELECTORS *******/
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectBoard) as DisplayPayload | null;
  const now = useNow(data?.serverNow);

  /******* EFFECTS *******/
  useRealtime([`hall:${hallCode}`], () => {
    if (hallCode) dispatch(fetchDisplayStart({ hallCode }));
  });
  useEffect(() => {
    if (!hallCode) return;
    dispatch(fetchDisplayStart({ hallCode }));
    const id = window.setInterval(() => dispatch(fetchDisplayStart({ hallCode })), 15_000);
    return () => window.clearInterval(id);
  }, [hallCode, dispatch]);

  useEffect(() => {
    if (isFullscreen) {
      setShowGate(false);
      setFsError(false);
    }
  }, [isFullscreen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        void toggle();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle]);

  const goFullscreen = async () => {
    try {
      await enter();
    } catch {
      setFsError(true);
    }
  };

  if (!data) {
    return (
      <div ref={boardRef} className={`display-board ${isFullscreen ? 'is-fullscreen' : ''}`}>
        <div className="grid min-h-[100dvh] place-items-center">
          <LogoSpinner label="Connecting…" size="lg" light />
        </div>
        {!isFullscreen && showGate ? (
          <FullscreenGate error={fsError} onEnter={() => void goFullscreen()} onSkip={() => setShowGate(false)} />
        ) : null}
      </div>
    );
  }

  /******* RENDER *******/
  const booking = data.current ?? data.next;
  const clock = clockParts(now);
  const endAt = data.current ? new Date(data.current.EndAt) : null;
  const startAt = data.next && data.state !== 'ONGOING' ? new Date(data.next.StartAt) : null;
  const count = data.state === 'ONGOING' && endAt ? remaining(endAt, now) : startAt ? remaining(startAt, now) : null;
  const bar = data.current && data.state === 'ONGOING' ? progress(data.current.StartAt, data.current.EndAt, now) : 0;
  const showDock = Boolean(booking && data.state !== 'MAINTENANCE');

  return (
    <div ref={boardRef} className={`display-board ${skins[data.state]} ${isFullscreen ? 'is-fullscreen' : ''}`}>
      <div className="stage-mesh" />
      <span className="stage-sweep" />
      <span className="stage-hud stage-hud--tl" />
      <span className="stage-hud stage-hud--tr" />
      <span className="stage-hud stage-hud--bl" />
      <span className="stage-hud stage-hud--br" />

      <div className="stage-frame">
        <header className="stage-top">
          <div className="stage-brand">
            <BrandLogo variant="light" height={28} to={null} />
            <p>{data.hallCode}</p>
          </div>
          <div className="stage-tape" aria-hidden>
            <div className="stage-tape__track">
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i}>
                  {CHIP[data.state]} · {data.hallName}
                </span>
              ))}
            </div>
          </div>
          <div className="stage-clock">
            <p className="stage-clock__time">
              {clock.hh}:{clock.mm}
              <span>:{clock.ss}</span>
              <em>{clock.suffix}</em>
            </p>
            <p className="stage-clock__date">{clock.date}</p>
          </div>
        </header>

        <main key={`${data.state}-${data.headline}`} className="stage-hero">
          <div className="stage-hero__status">
            <span className={`stage-pill ${data.state === 'ONGOING' ? 'is-live' : ''}`}>
              <span className="display-chip__dot" />
              {CHIP[data.state]}
            </span>
            <KineticWord word={haloWord[data.state]} />
            {count ? (
              <>
                <p className="stage-hero__hint">{COUNT_HINT[data.state]}</p>
                <div className="stage-count">
                  <CountBlock value={count.h || '0'} label="Hrs" />
                  <span className="stage-count__sep">:</span>
                  <CountBlock value={count.m || '0'} label="Min" />
                  <span className="stage-count__sep">:</span>
                  <CountBlock value={count.s || '0'} label="Sec" />
                </div>
              </>
            ) : (
              <p className="stage-hero__idle">{data.state === 'AVAILABLE' ? 'Available' : data.subtitle}</p>
            )}
          </div>

          <div className="stage-hero__copy">
            <p className="stage-kicker">Hall</p>
            <h1 className="stage-title">{data.hallName}</h1>
            <p className="stage-headline">{data.headline}</p>
            {data.state === 'ONGOING' && data.current ? (
              <p className="stage-when">
                <CalendarClock className="h-5 w-5" />
                {fmtTime(data.current.StartAt)} – {fmtTime(data.current.EndAt)}
              </p>
            ) : null}
            {data.state === 'AVAILABLE' && data.next ? (
              <p className="stage-when">
                Next · {data.next.EventName} · {fmtTime(data.next.StartAt)}
              </p>
            ) : null}
            {data.state === 'MAINTENANCE' && data.availableFrom ? (
              <p className="stage-when">Back at {fmtTime(data.availableFrom)}</p>
            ) : null}
          </div>
        </main>

        {showDock && booking ? (
          <section className="stage-dock">
            {data.state === 'ONGOING' ? (
              <div className="stage-marquee" aria-hidden>
                <div className="stage-marquee__track">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <span key={i}>Do not disturb</span>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="stage-dock__grid">
              <div className="stage-dock__event">
                <p className="stage-kicker">{data.state === 'ONGOING' ? 'Now in this room' : 'Next in this room'}</p>
                <p className="stage-dock__name">{booking.EventName}</p>
                <p className="stage-when">
                  <CalendarClock className="h-4 w-4" />
                  {fmtTime(booking.StartAt)} – {fmtTime(booking.EndAt)}
                </p>
              </div>
              <div className="stage-tiles">
                <article className="stage-tile">
                  <User className="h-4 w-4 opacity-50" />
                  <p>Organizer</p>
                  <strong>{booking.OrganizerName || '—'}</strong>
                </article>
                <article className="stage-tile">
                  <Briefcase className="h-4 w-4 opacity-50" />
                  <p>Department</p>
                  <strong>{booking.DepartmentName || '—'}</strong>
                </article>
                <article className="stage-tile">
                  <Users className="h-4 w-4 opacity-50" />
                  <p>Guests</p>
                  <strong>{booking.AttendeeCount}</strong>
                </article>
              </div>
            </div>
          </section>
        ) : null}

        {data.state === 'ONGOING' ? (
          <div className="stage-progress" aria-hidden>
            <span style={{ width: `${bar}%` }} />
          </div>
        ) : null}

        <footer className="stage-foot">
          <span>Live display</span>
          <span className="stage-foot__bar" aria-hidden>
            <span />
          </span>
          <span className="hidden sm:inline">Auto-refresh · do not power off</span>
          {isFullscreen ? (
            <button type="button" className="display-fs-exit" onClick={() => void exit()} title="Exit fullscreen (Esc)">
              <Minimize2 className="h-3.5 w-3.5" />
              Exit
            </button>
          ) : null}
        </footer>
      </div>

      {!isFullscreen && showGate ? (
        <FullscreenGate error={fsError} onEnter={() => void goFullscreen()} onSkip={() => setShowGate(false)} />
      ) : null}

      {!isFullscreen && !showGate ? (
        <button type="button" className="display-fs-fab" onClick={() => void goFullscreen()} title="Enter fullscreen (F)">
          <Maximize2 className="h-5 w-5" />
          <span>Fullscreen</span>
        </button>
      ) : null}
    </div>
  );
}

/******* FULLSCREEN GATE *******/
function FullscreenGate({
  error,
  onEnter,
  onSkip,
}: {
  error: boolean;
  onEnter: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="display-fs-gate">
      <div className="display-fs-gate__panel">
        <button type="button" className="display-fs-gate__go" onClick={onEnter}>
          <Maximize2 className="h-5 w-5" />
          Enter fullscreen
        </button>
        <p className="display-fs-gate__hint">
          {error
            ? 'Allow fullscreen, or press F11 to hide the browser header.'
            : 'Hides the browser address bar for this TV.'}
        </p>
        <button type="button" className="display-fs-gate__skip" onClick={onSkip}>
          Stay in window
        </button>
      </div>
    </div>
  );
}

function KineticWord({ word }: { word: string }) {
  return (
    <p className="stage-word">
      {word.split('').map((ch, i) => (
        <span key={`${word}-${ch}-${i}`} style={{ animationDelay: `${i * 70}ms` }}>
          {ch}
        </span>
      ))}
    </p>
  );
}

function CountBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="stage-count__block">
      <span key={value} className="stage-count__num">
        {value}
      </span>
      <span className="stage-count__label">{label}</span>
    </div>
  );
}

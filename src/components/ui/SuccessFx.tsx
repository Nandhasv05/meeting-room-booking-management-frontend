import { useEffect, useState } from 'react';

type Payload = { id: number; title: string; detail?: string };

let emit: ((p: Payload) => void) | null = null;
let seq = 0;

/** Show the animated success confirmation. Safe to call from anywhere (mutation handlers, etc.). */
export function celebrate(title: string, detail?: string) {
  seq += 1;
  emit?.({ id: seq, title, detail });
}

/** Mounted once at the app root. */
export function SuccessFx() {
  const [payload, setPayload] = useState<Payload | null>(null);

  useEffect(() => {
    emit = setPayload;
    return () => {
      emit = null;
    };
  }, []);

  useEffect(() => {
    if (!payload) return;
    const timer = window.setTimeout(() => setPayload(null), 1700);
    return () => window.clearTimeout(timer);
  }, [payload]);

  if (!payload) return null;

  return (
    <div className="success-fx" role="status" aria-live="polite">
      <div key={payload.id} className="success-fx__card">
        <span className="success-fx__mark-wrap">
          <span className="success-fx__burst" />
          <svg viewBox="0 0 52 52" className="success-fx__mark" aria-hidden="true">
            <circle className="success-fx__circle" cx="26" cy="26" r="23" />
            <path className="success-fx__check" d="M15 27.5 L22.5 35 L37 19" />
          </svg>
        </span>
        <p className="font-display text-base font-semibold text-navy-900">{payload.title}</p>
        {payload.detail ? <p className="max-w-xs text-center text-sm text-navy-800/55">{payload.detail}</p> : null}
      </div>
    </div>
  );
}

// AUTHOR : NANDNHAKUMAR SV 
// DATE : 27/08/2026
// DESCRIPTION : Display validation helpers
import type { DisplayPayload, Hall } from "../../types/api";
import { useEffect, useRef, useState } from "react";

// REMAINING handle
export function remaining(target: Date, now: Date) {
    const ms = target.getTime() - now.getTime();
    if (ms <= 0) return { label: '00:00:00', h: '00', m: '00', s: '00', overdue: true };
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return {
      label: `${pad(h)}:${pad(m)}:${pad(s % 60)}`,
      h: pad(h),
      m: pad(m),
      s: pad(s % 60),
      overdue: false,
    };
  }
  
// PROGRESS handle
export function progress(startIso: string, endIso: string, now: Date) {
    const start = new Date(startIso).getTime();
    const end = new Date(endIso).getTime();
    if (end <= start) return 0;
    return Math.min(100, Math.max(0, ((now.getTime() - start) / (end - start)) * 100));
  }

// SKINS handle
export const skins: Record<DisplayPayload['state'], string> = {
    AVAILABLE: 'display-board--free',
    UPCOMING: 'display-board--soon',
    ONGOING: 'display-board--live',
    MAINTENANCE: 'display-board--down',
  };
  
  // USE NOW handle — keep the board clock aligned with CLIENT_API GETDATE when provided
  export function useNow(serverNow?: string | null) {
    const offsetRef = useRef(0);
    const [now, setNow] = useState(() => new Date());
    useEffect(() => {
      if (!serverNow) return;
      const parsed = new Date(serverNow).getTime();
      if (!Number.isNaN(parsed)) offsetRef.current = parsed - Date.now();
    }, [serverNow]);
    useEffect(() => {
      const tick = () => setNow(new Date(Date.now() + offsetRef.current));
      tick();
      const id = window.setInterval(tick, 1000);
      return () => window.clearInterval(id);
    }, []);
    return now;
  }
  
  // PAD handle
  export function pad(n: number) {
    return String(n).padStart(2, '0');
  }
  
  // CLOCK PARTS handle
  export function clockParts(d: Date) {
    const h = d.getHours();
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 === 0 ? 12 : h % 12;
    const hh = pad(hour);
    const mm = pad(d.getMinutes());
    const ss = pad(d.getSeconds());
    return {
      time: `${hh}:${mm}:${ss}`,
      hh,
      mm,
      ss,
      suffix,
      date: d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }),
    };
  }

  export const haloWord: Record<DisplayPayload['state'], string> = {
    AVAILABLE: 'AVAILABLE',
    UPCOMING: 'SOON',
    ONGOING: 'LIVE',
    MAINTENANCE: 'HOLD',
  };

  export const watermarkWord: Record<DisplayPayload['state'], string> = {
    AVAILABLE: 'AVAILABLE',
    UPCOMING: 'SOON',
    ONGOING: 'BUSY',
    MAINTENANCE: 'HOLD',
  };

  
export type WallItem = { hall: Hall; board: DisplayPayload };

export const previewSkin: Record<DisplayPayload['state'], string> = {
  AVAILABLE: 'from-[#122315] to-[#2F7A4E]',
  UPCOMING: 'from-[#1A3322] to-[#3D7A55]',
  ONGOING: 'from-[#0F2015] to-[#3D7A55]',
  MAINTENANCE: 'from-[#1b2430] to-[#475569]',
};

export const wallTone: Record<DisplayPayload['state'], string> = {
  AVAILABLE: 'wall-tone--free',
  UPCOMING: 'wall-tone--soon',
  ONGOING: 'wall-tone--live',
  MAINTENANCE: 'wall-tone--down',
};

export const wallShort: Record<DisplayPayload['state'], string> = {
  AVAILABLE: 'Free',
  UPCOMING: 'Soon',
  ONGOING: 'Live',
  MAINTENANCE: 'Down',
};

// AUTHOR : NANDNHAKUMAR SV
// DATE : 28/08/2026
// DESCRIPTION : Browser fullscreen (hides address bar) for the hall TV board
import { useCallback, useEffect, useState, type RefObject } from 'react';

type FsDoc = Document & {
  webkitFullscreenElement?: Element | null;
  msFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
  msExitFullscreen?: () => Promise<void> | void;
};

type FsEl = HTMLElement & {
  webkitRequestFullscreen?: (opts?: FullscreenOptions) => Promise<void> | void;
  msRequestFullscreen?: () => Promise<void> | void;
};

function fsElement() {
  const doc = document as FsDoc;
  return document.fullscreenElement ?? doc.webkitFullscreenElement ?? doc.msFullscreenElement ?? null;
}

export function useFullscreen(targetRef: RefObject<HTMLElement | null>) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const sync = () => setActive(Boolean(fsElement()));
    sync();
    document.addEventListener('fullscreenchange', sync);
    document.addEventListener('webkitfullscreenchange', sync);
    document.addEventListener('MSFullscreenChange', sync);
    return () => {
      document.removeEventListener('fullscreenchange', sync);
      document.removeEventListener('webkitfullscreenchange', sync);
      document.removeEventListener('MSFullscreenChange', sync);
    };
  }, []);

  const enter = useCallback(async () => {
    const el = (targetRef.current ?? document.documentElement) as FsEl;
    if (el.requestFullscreen) {
      await el.requestFullscreen({ navigationUI: 'hide' });
      return;
    }
    if (el.webkitRequestFullscreen) {
      await Promise.resolve(el.webkitRequestFullscreen());
      return;
    }
    if (el.msRequestFullscreen) {
      await Promise.resolve(el.msRequestFullscreen());
      return;
    }
    throw new Error('Fullscreen is not supported');
  }, [targetRef]);

  const exit = useCallback(async () => {
    if (!fsElement()) return;
    const doc = document as FsDoc;
    const fn = document.exitFullscreen ?? doc.webkitExitFullscreen ?? doc.msExitFullscreen;
    if (fn) await Promise.resolve(fn.call(document));
  }, []);

  const toggle = useCallback(() => (active ? exit() : enter()), [active, enter, exit]);

  return { active, enter, exit, toggle };
}

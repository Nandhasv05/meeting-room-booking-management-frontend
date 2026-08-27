import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

type ShellCtx = {
  navOpen: boolean;
  setNavOpen: (v: boolean) => void;
  toggleNav: () => void;
};

const ShellContext = createContext<ShellCtx | null>(null);

export function useShell() {
  const ctx = useContext(ShellContext);
  if (!ctx) throw new Error('useShell must be used within ShellProvider');
  return ctx;
}

export function ShellProvider({ children }: { children: ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = navOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [navOpen]);

  const value = useMemo(
    () => ({
      navOpen,
      setNavOpen,
      toggleNav: () => setNavOpen((v) => !v),
    }),
    [navOpen],
  );

  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}

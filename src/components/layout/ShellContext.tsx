/*
 * AUTHOR : NANDHAKUMAR S V
 * DATE : 16/09/2026
 * DESCRIPTION : INITIALIZE STAGE CREATION THIS COMPONENT IS USED TO DISPLAY THE TIME AND DATE IN THE BOOKING COMPOSER
 */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

/**** SHELL CTX ***** */
type ShellCtx = {
  navOpen: boolean;
  setNavOpen: (v: boolean) => void;
  toggleNav: () => void;
};

/**** SHELL CONTEXT ***** */
const ShellContext = createContext<ShellCtx | null>(null);

/**** USE SHELL ***** */
export function useShell() {
  const ctx = useContext(ShellContext);
  if (!ctx) throw new Error('useShell must be used within ShellProvider');
  return ctx;
}

/**** SHELL PROVIDER ***** */
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

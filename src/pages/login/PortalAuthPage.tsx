import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LogoSpinner } from '../../components/brand/LogoSpinner';
import { goToPortalLogin, readSsoTicket } from '../../components/portal/PortalSsoListener';

export function PortalAuthPage() {
  const location = useLocation();
  const ticket = readSsoTicket(location.search);

  useEffect(() => {
    if (!ticket) goToPortalLogin();
  }, [ticket]);

  return (
    <LogoSpinner
      fullScreen
      light={false}
      label={ticket ? 'Opening Meeting Hall…' : 'Opening EVOLV sign in…'}
      size="lg"
    />
  );
}

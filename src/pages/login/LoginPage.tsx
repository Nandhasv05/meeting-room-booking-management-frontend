import { useEffect } from 'react';
import { LogoSpinner } from '../../components/brand/LogoSpinner';
import { goToPortalLogin } from '../../components/portal/PortalSsoListener';

export function LoginPage() {
  useEffect(() => {
    goToPortalLogin();
  }, []);
  return <LogoSpinner fullScreen light label="Opening EVOLV sign in…" size="lg" />;
}

export default LoginPage;

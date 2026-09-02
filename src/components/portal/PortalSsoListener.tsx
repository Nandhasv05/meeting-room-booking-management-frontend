// AUTHOR : NANDHAKUMAR S V
// DATE : 31/08/2026
// DESCRIPTION : Exchange an EVOL portal SSO ticket for a Meeting Hall session
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { userSsoStart, userSignInResponseResetStart } from '../../redux/login/login.action';
import { selectLoginLoading, selectLoginResponse, selectIsAuthenticated } from '../../redux/login/login.selector';
import { useAppDispatch, useAppSelector } from '../../store';
import { PORTAL_LAUNCH_URL } from '../../redux/const';
import { LogoSpinner } from '../brand/LogoSpinner';

export function readSsoTicket(search: string): string {
  const q = new URLSearchParams(search);
  return (q.get('sso') || q.get('token') || '').trim();
}

export function isLocalHost(): boolean {
  return ['localhost', '127.0.0.1'].includes(window.location.hostname);
}

export function goToPortalLogin() {
  window.location.replace(PORTAL_LAUNCH_URL);
}

function stripSsoFromUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete('sso');
  url.searchParams.delete('token');
  const next = `${url.pathname}${url.search}${url.hash}`;
  window.history.replaceState({}, '', next);
}

export function PortalSsoListener() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const authenticated = useAppSelector(selectIsAuthenticated);
  const loginResponse = useAppSelector(selectLoginResponse);
  const loginLoading = useAppSelector(selectLoginLoading);
  const ticket = readSsoTicket(location.search);
  const started = useRef('');

  useEffect(() => {
    if (!ticket || authenticated || started.current === ticket) return;
    started.current = ticket;
    dispatch(userSsoStart(ticket));
  }, [ticket, authenticated, dispatch]);

  useEffect(() => {
    if (!loginResponse || !started.current) return;
    dispatch(userSignInResponseResetStart());
    if (loginResponse.success) {
      toast.success('Welcome back.');
      stripSsoFromUrl();
      navigate('/', { replace: true });
      return;
    }
    toast.error(loginResponse.message || 'Portal sign-in failed.');
    stripSsoFromUrl();
    started.current = '';
    goToPortalLogin();
  }, [loginResponse, dispatch, navigate]);

  if (ticket && !authenticated) {
    return <LogoSpinner fullScreen light={false} label={loginLoading ? 'Opening Meeting Hall…' : 'Signing in…'} size="lg" />;
  }
  return null;
}

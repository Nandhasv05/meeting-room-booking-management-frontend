import { useAppSelector } from '../store';

export function useAuth() {
  const user = useAppSelector((s) => s.auth.user);
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  return { user, accessToken, isAuthenticated: Boolean(accessToken) };
}

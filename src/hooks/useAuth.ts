import { useAppSelector } from '../store';
import { selectAccessToken, selectCurrentUser } from '../redux/login/login.selector';

export function useAuth() {
  const user = useAppSelector(selectCurrentUser);
  const accessToken = useAppSelector(selectAccessToken);
  return { user, accessToken, isAuthenticated: Boolean(accessToken) };
}

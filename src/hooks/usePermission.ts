import { useAppSelector } from '../store';
import { selectCurrentUser } from '../redux/login/login.selector';

export function usePermission() {
  const user = useAppSelector(selectCurrentUser);
  const can = (...codes: string[]) => {
    if (!user) return false;
    if (codes.length === 0) return true;
    return codes.some((c) => user.permissions.includes(c));
  };
  return { user, can };
}

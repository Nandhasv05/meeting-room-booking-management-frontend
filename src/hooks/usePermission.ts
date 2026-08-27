import { useAppSelector } from '../store';

export function usePermission() {
  const user = useAppSelector((s) => s.auth.user);
  const can = (...codes: string[]) => {
    if (!user) return false;
    if (codes.length === 0) return true;
    return codes.some((c) => user.permissions.includes(c));
  };
  return { user, can };
}

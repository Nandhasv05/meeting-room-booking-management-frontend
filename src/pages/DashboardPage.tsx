import { useQuery } from '@tanstack/react-query';
import { ErrorState, Spinner } from '../components/ui/Feedback';
import { PrimaryButton } from '../components/ui/Form';
import { useRealtime } from '../hooks/useRealtime';
import { api, apiError, unwrap } from '../services/api';
import { useAppSelector } from '../store';
import { AdminDashboard } from './dashboard/AdminDashboard';
import { ManagerDashboard } from './dashboard/ManagerDashboard';
import type { Dash } from './dashboard/shared';

export function DashboardPage() {
  const role = useAppSelector((s) => s.auth.user?.roleCode);
  useRealtime(['dashboard'], [['dashboard']]);
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => unwrap<Dash>(api.get('/dashboard')),
    retry: 1,
  });

  if (isLoading) return <Spinner />;
  if (isError || !data) {
    return (
      <div className="space-y-3">
        <ErrorState message={apiError(error) || 'Failed to load dashboard.'} />
        <PrimaryButton type="button" onClick={() => void refetch()}>
          Retry
        </PrimaryButton>
      </div>
    );
  }

  if (role === 'ADMINISTRATOR') return <AdminDashboard data={data} />;
  return <ManagerDashboard data={data} />;
}

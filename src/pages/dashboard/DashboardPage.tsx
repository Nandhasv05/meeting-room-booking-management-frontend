import { useEffect } from 'react';
import { ErrorState, Spinner } from '../../components/ui/Feedback';
import { PrimaryButton } from '../../components/ui/Form';
import { useRealtime } from '../../hooks/useRealtime';
import { useAppDispatch, useAppSelector } from '../../store';
import { selectCurrentUser } from '../../redux/login/login.selector';
import { fetchDashboardStart } from '../../redux/dashboard/dashboard.action';
import { selectDashboard, selectDashboardError, selectDashboardLoading } from '../../redux/dashboard/dashboard.selector';
import { AdminDashboard } from './AdminDashboard';
import { ManagerDashboard } from './ManagerDashboard';
import type { Dash } from './shared';

export function DashboardPage() {
  const dispatch = useAppDispatch();
  const role = useAppSelector(selectCurrentUser)?.roleCode;
  const data = useAppSelector(selectDashboard) as Dash | null;
  const isLoading = useAppSelector(selectDashboardLoading);
  const error = useAppSelector(selectDashboardError);
  useRealtime(['dashboard'], () => dispatch(fetchDashboardStart()));
  useEffect(() => {
    dispatch(fetchDashboardStart());
  }, [dispatch]);

  if (isLoading && !data) return <Spinner />;
  if (error || !data) {
    return (
      <div className="space-y-3">
        <ErrorState message={error || 'Failed to load dashboard.'} />
        <PrimaryButton type="button" onClick={() => dispatch(fetchDashboardStart())}>
          Retry
        </PrimaryButton>
      </div>
    );
  }

  if (role === 'ADMINISTRATOR') return <AdminDashboard data={data} />;
  return <ManagerDashboard data={data} />;
}

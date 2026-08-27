import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { GuestLayout } from '../layouts/GuestLayout';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { HallsPage } from '../pages/HallsPage';
import { HallFormPage } from '../pages/HallFormPage';
import { HallDetailPage } from '../pages/HallDetailPage';
import { BookingFormPage } from '../pages/BookingFormPage';
import { MyBookingsPage } from '../pages/MyBookingsPage';
import { BookingDetailPage } from '../pages/BookingDetailPage';
import { CalendarPage } from '../pages/CalendarPage';
import { EventsPage } from '../pages/EventsPage';
import { EventDetailPage } from '../pages/EventDetailPage';
import { DisplayPage } from '../pages/DisplayPage';
import { DisplaysIndexPage } from '../pages/DisplaysIndexPage';
import { ReportsPage } from '../pages/ReportsPage';
import { UsersPage } from '../pages/UsersPage';
import { RolesPage } from '../pages/RolesPage';
import { DepartmentsPage } from '../pages/DepartmentsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { AuditPage } from '../pages/AuditPage';
import { MaintenancePage } from '../pages/MaintenancePage';
import { FacilitiesPage } from '../pages/FacilitiesPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { isOpsDashboardRole } from '../utils/roles';
import { useAppSelector } from '../store';

function HomeRedirect() {
  const code = useAppSelector((s) => s.auth.user?.roleCode);
  if (isOpsDashboardRole(code)) return <Navigate to="/dashboard" replace />;
  return <Navigate to="/calendar" replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<GuestLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route path="/display/:hallCode" element={<DisplayPage />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/halls" element={<HallsPage />} />
        <Route path="/halls/facilities" element={<FacilitiesPage />} />
        <Route path="/halls/new" element={<HallFormPage />} />
        <Route path="/halls/:id" element={<HallDetailPage />} />
        <Route path="/halls/:id/edit" element={<HallFormPage />} />
        <Route path="/bookings/new" element={<BookingFormPage />} />
        <Route path="/bookings" element={<MyBookingsPage />} />
        <Route path="/bookings/:id" element={<BookingDetailPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/displays" element={<DisplaysIndexPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/roles" element={<RolesPage />} />
        <Route path="/admin/departments" element={<DepartmentsPage />} />
        <Route path="/admin/settings" element={<SettingsPage />} />
        <Route path="/admin/audit" element={<AuditPage />} />
        <Route path="/admin/maintenance" element={<MaintenancePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

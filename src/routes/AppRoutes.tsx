import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { GuestLayout } from '../layouts/GuestLayout';
import { LoginPage } from '../pages/login/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { HallsPage } from '../pages/hall/HallsPage';
import { HallFormPage } from '../pages/hall/HallFormPage';
import { HallDetailPage } from '../pages/hall/HallDetailPage';
import { BookingFormPage } from '../pages/booking/BookingFormPage';
import { MyBookingsPage } from '../pages/booking/MyBookingsPage';
import { BookingDetailPage } from '../pages/booking/BookingDetailPage';
import { CalendarPage } from '../pages/calendar/CalendarPage';
import { EventsPage } from '../pages/event/EventsPage';
import { EventDetailPage } from '../pages/event/EventDetailPage';
import { DisplayPage } from '../pages/display/DisplayPage';
import { DisplaysIndexPage } from '../pages/display/DisplaysIndexPage';
import { ReportsPage } from '../pages/reports/ReportsPage';
import { UsersPage } from '../pages/setting/UsersPage';
import { RolesPage } from '../pages/role/RolesPage';
import { DepartmentsPage } from '../pages/department/DepartmentsPage';
import { SettingsPage } from '../pages/setting/SettingsPage';
import { EncodeDecodePage, EncodeDecodeStandalonePage } from '../pages/setting/EncodeDecodePage';
import { AuditPage } from '../pages/audit/AuditPage';
import { MaintenancePage } from '../pages/setting/MaintenancePage';
import { FacilitiesPage } from '../pages/hall/FacilitiesPage';
import { NotificationsPage } from '../pages/setting/NotificationsPage';
import { NotFoundPage } from '../pages/error/NotFoundPage';
import { isAdminRole } from '../utils/roles';
import { useAppSelector } from '../store';
import { EncodeDecodeGate, RequireAdmin } from './guards';

function HomeRedirect() {
  const code = useAppSelector((s) => s.auth.user?.roleCode);
  if (isAdminRole(code)) return <Navigate to="/dashboard" replace />;
  return <Navigate to="/calendar" replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<GuestLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route path="/display/:hallCode" element={<DisplayPage />} />
      <Route element={<EncodeDecodeGate />}>
        <Route path="/encode-decode" element={<EncodeDecodeStandalonePage />} />
      </Route>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/Bookings/New" element={<BookingFormPage />} />
        <Route path="/Bookings" element={<MyBookingsPage />} />
        <Route path="/Bookings/:id" element={<BookingDetailPage />} />
        <Route path="/Calendar" element={<CalendarPage />} />
        <Route path="/Displays" element={<DisplaysIndexPage />} />
        <Route path="/Notifications" element={<NotificationsPage />} />
        <Route element={<RequireAdmin />}>
          <Route path="/Dashboard" element={<DashboardPage />} />
          <Route path="/Halls" element={<HallsPage />} />
          <Route path="/Halls/Facilities" element={<FacilitiesPage />} />
          <Route path="/Halls/New" element={<HallFormPage />} />
          <Route path="/Halls/:id" element={<HallDetailPage />} />
          <Route path="/Halls/:id/Edit" element={<HallFormPage />} />
          <Route path="/Events" element={<EventsPage />} />
          <Route path="/Events/:id" element={<EventDetailPage />} />
          <Route path="/Reports" element={<ReportsPage />} />
          <Route path="/Admin/users" element={<UsersPage />} />
          <Route path="/Admin/roles" element={<RolesPage />} />
          <Route path="/Admin/departments" element={<DepartmentsPage />} />
          <Route path="/Admin/settings" element={<SettingsPage />} />
          <Route path="/Admin/encode-decode" element={<EncodeDecodePage />} />
          <Route path="/Admin/audit" element={<AuditPage />} />
          <Route path="/Admin/maintenance" element={<MaintenancePage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

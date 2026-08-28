// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : Root reducer for the Meeting Hall app

import { combineReducers } from '@reduxjs/toolkit';
import loginReducer from './login/login.reducer';
import hallsReducer from './halls/halls.reducer';
import bookingsReducer from './bookings/bookings.reducer';
import calendarReducer from './calendar/calendar.reducer';
import eventsReducer from './events/events.reducer';
import usersReducer from './users/users.reducer';
import rolesReducer from './roles/roles.reducer';
import departmentsReducer from './departments/departments.reducer';
import notificationsReducer from './notifications/notifications.reducer';
import dashboardReducer from './dashboard/dashboard.reducer';
import reportsReducer from './reports/reports.reducer';
import settingsReducer from './settings/settings.reducer';
import auditReducer from './audit/audit.reducer';
import maintenanceReducer from './maintenance/maintenance.reducer';
import displayReducer from './display/display.reducer';
import availabilityReducer from './availability/availability.reducer';

const rootReducer = combineReducers({
	auth: loginReducer,
	halls: hallsReducer,
	bookings: bookingsReducer,
	calendar: calendarReducer,
	events: eventsReducer,
	users: usersReducer,
	roles: rolesReducer,
	departments: departmentsReducer,
	notifications: notificationsReducer,
	dashboard: dashboardReducer,
	reports: reportsReducer,
	settings: settingsReducer,
	audit: auditReducer,
	maintenance: maintenanceReducer,
	display: displayReducer,
	availability: availabilityReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;

// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : Root saga

import { all, call } from 'redux-saga/effects';
import { loginSaga } from './login/login.saga';
import { hallsSaga } from './halls/halls.saga';
import { bookingsSaga } from './bookings/bookings.saga';
import { calendarSaga } from './calendar/calendar.saga';
import { eventsSaga } from './events/events.saga';
import { usersSaga } from './users/users.saga';
import { rolesSaga } from './roles/roles.saga';
import { departmentsSaga } from './departments/departments.saga';
import { notificationsSaga } from './notifications/notifications.saga';
import { dashboardSaga } from './dashboard/dashboard.saga';
import { reportsSaga } from './reports/reports.saga';
import { settingsSaga } from './settings/settings.saga';
import { auditSaga } from './audit/audit.saga';
import { maintenanceSaga } from './maintenance/maintenance.saga';
import { displaySaga } from './display/display.saga';
import { availabilitySaga } from './availability/availability.saga';

export function* rootSaga() {
	yield all([
		call(loginSaga),
		call(hallsSaga),
		call(bookingsSaga),
		call(calendarSaga),
		call(eventsSaga),
		call(usersSaga),
		call(rolesSaga),
		call(departmentsSaga),
		call(notificationsSaga),
		call(dashboardSaga),
		call(reportsSaga),
		call(settingsSaga),
		call(auditSaga),
		call(maintenanceSaga),
		call(displaySaga),
		call(availabilitySaga),
	]);
}

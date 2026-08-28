// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : calendar sagas
import { takeLatest, put, all, call } from 'redux-saga/effects';
import calendarActionTypes from './calendar.types';
import {
	fetchCalendarCall,
} from './calendar.services';
import {
	fetchCalendarSuccess,
	fetchCalendarFailure,
	fetchCalendarResponseChanged,
} from './calendar.action';
import { invokeApi } from '../_common/saga.utils';

/******* FETCH CALENDAR DETAILS START *******/
function* fetchCalendarDetails({ payload }: any) {
	yield* invokeApi(fetchCalendarCall, payload, fetchCalendarSuccess, fetchCalendarFailure);
}

function* fetchCalendarReset() {
	yield put(fetchCalendarResponseChanged());
}

function* onFetchCalendarStart() {
	yield takeLatest(calendarActionTypes.FETCH_CALENDAR_START, fetchCalendarDetails);
}

function* onFetchCalendarReset() {
	yield takeLatest(calendarActionTypes.FETCH_CALENDAR_RESPONSE_RESET_START, fetchCalendarReset);
}
/******* FETCH CALENDAR DETAILS END *******/

/******* CALENDAR SAGA *******/
export function* calendarSaga() {
	yield all([call(onFetchCalendarStart), call(onFetchCalendarReset)]);
}

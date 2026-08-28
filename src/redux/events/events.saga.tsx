// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : events sagas

import { takeLatest, put, all, call } from 'redux-saga/effects';
import eventsActionTypes from './events.types';
import {
	fetchEventsCall,
	fetchEventCall,
	updateEventCall,
} from './events.services';
import {
	fetchEventsSuccess,
	fetchEventsFailure,
	fetchEventsResponseChanged,
	fetchEventSuccess,
	fetchEventFailure,
	fetchEventResponseChanged,
	updateEventSuccess,
	updateEventFailure,
	updateEventResponseChanged,
} from './events.action';
import { invokeApi } from '../_common/saga.utils';

function* fetchEventsDetails({ payload }: any) {
	yield* invokeApi(fetchEventsCall, payload, fetchEventsSuccess, fetchEventsFailure);
}

function* fetchEventsReset() {
	yield put(fetchEventsResponseChanged());
}

function* onFetchEventsStart() {
	yield takeLatest(eventsActionTypes.FETCH_EVENTS_START, fetchEventsDetails);
}

function* onFetchEventsReset() {
	yield takeLatest(eventsActionTypes.FETCH_EVENTS_RESPONSE_RESET_START, fetchEventsReset);
}

function* fetchEventDetails({ payload }: any) {
	yield* invokeApi(fetchEventCall, payload, fetchEventSuccess, fetchEventFailure);
}

function* fetchEventReset() {
	yield put(fetchEventResponseChanged());
}

function* onFetchEventStart() {
	yield takeLatest(eventsActionTypes.FETCH_EVENT_START, fetchEventDetails);
}

function* onFetchEventReset() {
	yield takeLatest(eventsActionTypes.FETCH_EVENT_RESPONSE_RESET_START, fetchEventReset);
}

function* updateEventDetails({ payload }: any) {
	yield* invokeApi(updateEventCall, payload, updateEventSuccess, updateEventFailure);
}

function* updateEventReset() {
	yield put(updateEventResponseChanged());
}

function* onUpdateEventStart() {
	yield takeLatest(eventsActionTypes.UPDATE_EVENT_START, updateEventDetails);
}

function* onUpdateEventReset() {
	yield takeLatest(eventsActionTypes.UPDATE_EVENT_RESPONSE_RESET_START, updateEventReset);
}

export function* eventsSaga() {
	yield all([call(onFetchEventsStart), call(onFetchEventsReset), call(onFetchEventStart), call(onFetchEventReset), call(onUpdateEventStart), call(onUpdateEventReset)]);
}

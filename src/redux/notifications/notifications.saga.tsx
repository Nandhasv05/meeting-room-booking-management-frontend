// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : notifications sagas

import { takeLatest, put, all, call } from 'redux-saga/effects';
import notificationsActionTypes from './notifications.types';
import {
	fetchNotificationsCall,
	readNotificationCall,
	readAllNotificationsCall,
} from './notifications.services';
import {
	fetchNotificationsSuccess,
	fetchNotificationsFailure,
	fetchNotificationsResponseChanged,
	readNotificationSuccess,
	readNotificationFailure,
	readNotificationResponseChanged,
	readAllNotificationsSuccess,
	readAllNotificationsFailure,
	readAllNotificationsResponseChanged,
} from './notifications.action';
import { invokeApi } from '../_common/saga.utils';

function* fetchNotificationsDetails({ payload }: any) {
	yield* invokeApi(fetchNotificationsCall, payload, fetchNotificationsSuccess, fetchNotificationsFailure);
}

function* fetchNotificationsReset() {
	yield put(fetchNotificationsResponseChanged());
}

function* onFetchNotificationsStart() {
	yield takeLatest(notificationsActionTypes.FETCH_NOTIFICATIONS_START, fetchNotificationsDetails);
}

function* onFetchNotificationsReset() {
	yield takeLatest(notificationsActionTypes.FETCH_NOTIFICATIONS_RESPONSE_RESET_START, fetchNotificationsReset);
}

function* readNotificationDetails({ payload }: any) {
	yield* invokeApi(readNotificationCall, payload, readNotificationSuccess, readNotificationFailure);
}

function* readNotificationReset() {
	yield put(readNotificationResponseChanged());
}

function* onReadNotificationStart() {
	yield takeLatest(notificationsActionTypes.READ_NOTIFICATION_START, readNotificationDetails);
}

function* onReadNotificationReset() {
	yield takeLatest(notificationsActionTypes.READ_NOTIFICATION_RESPONSE_RESET_START, readNotificationReset);
}

function* readAllNotificationsDetails({ payload }: any) {
	yield* invokeApi(readAllNotificationsCall, payload, readAllNotificationsSuccess, readAllNotificationsFailure);
}

function* readAllNotificationsReset() {
	yield put(readAllNotificationsResponseChanged());
}

function* onReadAllNotificationsStart() {
	yield takeLatest(notificationsActionTypes.READ_ALL_NOTIFICATIONS_START, readAllNotificationsDetails);
}

function* onReadAllNotificationsReset() {
	yield takeLatest(notificationsActionTypes.READ_ALL_NOTIFICATIONS_RESPONSE_RESET_START, readAllNotificationsReset);
}

export function* notificationsSaga() {
	yield all([call(onFetchNotificationsStart), call(onFetchNotificationsReset), call(onReadNotificationStart), call(onReadNotificationReset), call(onReadAllNotificationsStart), call(onReadAllNotificationsReset)]);
}

// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : settings sagas

import { takeLatest, put, all, call } from 'redux-saga/effects';
import settingsActionTypes from './settings.types';
import {
	fetchSettingsCall,
	saveSettingsCall,
	testMailCall,
} from './settings.services';
import {
	fetchSettingsSuccess,
	fetchSettingsFailure,
	fetchSettingsResponseChanged,
	saveSettingsSuccess,
	saveSettingsFailure,
	saveSettingsResponseChanged,
	testMailSuccess,
	testMailFailure,
	testMailResponseChanged,
} from './settings.action';
import { invokeApi } from '../_common/saga.utils';

function* fetchSettingsDetails({ payload }: any) {
	yield* invokeApi(fetchSettingsCall, payload, fetchSettingsSuccess, fetchSettingsFailure);
}

function* fetchSettingsReset() {
	yield put(fetchSettingsResponseChanged());
}

function* onFetchSettingsStart() {
	yield takeLatest(settingsActionTypes.FETCH_SETTINGS_START, fetchSettingsDetails);
}

function* onFetchSettingsReset() {
	yield takeLatest(settingsActionTypes.FETCH_SETTINGS_RESPONSE_RESET_START, fetchSettingsReset);
}

function* saveSettingsDetails({ payload }: any) {
	yield* invokeApi(saveSettingsCall, payload, saveSettingsSuccess, saveSettingsFailure);
}

function* saveSettingsReset() {
	yield put(saveSettingsResponseChanged());
}

function* onSaveSettingsStart() {
	yield takeLatest(settingsActionTypes.SAVE_SETTINGS_START, saveSettingsDetails);
}

function* onSaveSettingsReset() {
	yield takeLatest(settingsActionTypes.SAVE_SETTINGS_RESPONSE_RESET_START, saveSettingsReset);
}

function* testMailDetails({ payload }: any) {
	yield* invokeApi(testMailCall, payload, testMailSuccess, testMailFailure);
}

function* testMailReset() {
	yield put(testMailResponseChanged());
}

function* onTestMailStart() {
	yield takeLatest(settingsActionTypes.TEST_MAIL_START, testMailDetails);
}

function* onTestMailReset() {
	yield takeLatest(settingsActionTypes.TEST_MAIL_RESPONSE_RESET_START, testMailReset);
}

export function* settingsSaga() {
	yield all([call(onFetchSettingsStart), call(onFetchSettingsReset), call(onSaveSettingsStart), call(onSaveSettingsReset), call(onTestMailStart), call(onTestMailReset)]);
}

// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : maintenance sagas

import { takeLatest, put, all, call } from 'redux-saga/effects';
import maintenanceActionTypes from './maintenance.types';
import {
	fetchMaintenanceCall,
	createMaintenanceCall,
} from './maintenance.services';
import {
	fetchMaintenanceSuccess,
	fetchMaintenanceFailure,
	fetchMaintenanceResponseChanged,
	createMaintenanceSuccess,
	createMaintenanceFailure,
	createMaintenanceResponseChanged,
} from './maintenance.action';
import { invokeApi } from '../_common/saga.utils';

function* fetchMaintenanceDetails({ payload }: any) {
	yield* invokeApi(fetchMaintenanceCall, payload, fetchMaintenanceSuccess, fetchMaintenanceFailure);
}

function* fetchMaintenanceReset() {
	yield put(fetchMaintenanceResponseChanged());
}

function* onFetchMaintenanceStart() {
	yield takeLatest(maintenanceActionTypes.FETCH_MAINTENANCE_START, fetchMaintenanceDetails);
}

function* onFetchMaintenanceReset() {
	yield takeLatest(maintenanceActionTypes.FETCH_MAINTENANCE_RESPONSE_RESET_START, fetchMaintenanceReset);
}

function* createMaintenanceDetails({ payload }: any) {
	yield* invokeApi(createMaintenanceCall, payload, createMaintenanceSuccess, createMaintenanceFailure);
}

function* createMaintenanceReset() {
	yield put(createMaintenanceResponseChanged());
}

function* onCreateMaintenanceStart() {
	yield takeLatest(maintenanceActionTypes.CREATE_MAINTENANCE_START, createMaintenanceDetails);
}

function* onCreateMaintenanceReset() {
	yield takeLatest(maintenanceActionTypes.CREATE_MAINTENANCE_RESPONSE_RESET_START, createMaintenanceReset);
}

export function* maintenanceSaga() {
	yield all([call(onFetchMaintenanceStart), call(onFetchMaintenanceReset), call(onCreateMaintenanceStart), call(onCreateMaintenanceReset)]);
}

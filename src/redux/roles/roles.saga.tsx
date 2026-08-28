// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : roles sagas

import { takeLatest, put, all, call } from 'redux-saga/effects';
import rolesActionTypes from './roles.types';
import {
	fetchRolesCall,
	fetchPermissionsCall,
	fetchRoleDetailCall,
	saveRolePermissionsCall,
} from './roles.services';
import {
	fetchRolesSuccess,
	fetchRolesFailure,
	fetchRolesResponseChanged,
	fetchPermissionsSuccess,
	fetchPermissionsFailure,
	fetchPermissionsResponseChanged,
	fetchRoleDetailSuccess,
	fetchRoleDetailFailure,
	fetchRoleDetailResponseChanged,
	saveRolePermissionsSuccess,
	saveRolePermissionsFailure,
	saveRolePermissionsResponseChanged,
} from './roles.action';
import { invokeApi } from '../_common/saga.utils';

function* fetchRolesDetails({ payload }: any) {
	yield* invokeApi(fetchRolesCall, payload, fetchRolesSuccess, fetchRolesFailure);
}

function* fetchRolesReset() {
	yield put(fetchRolesResponseChanged());
}

function* onFetchRolesStart() {
	yield takeLatest(rolesActionTypes.FETCH_ROLES_START, fetchRolesDetails);
}

function* onFetchRolesReset() {
	yield takeLatest(rolesActionTypes.FETCH_ROLES_RESPONSE_RESET_START, fetchRolesReset);
}

function* fetchPermissionsDetails({ payload }: any) {
	yield* invokeApi(fetchPermissionsCall, payload, fetchPermissionsSuccess, fetchPermissionsFailure);
}

function* fetchPermissionsReset() {
	yield put(fetchPermissionsResponseChanged());
}

function* onFetchPermissionsStart() {
	yield takeLatest(rolesActionTypes.FETCH_PERMISSIONS_START, fetchPermissionsDetails);
}

function* onFetchPermissionsReset() {
	yield takeLatest(rolesActionTypes.FETCH_PERMISSIONS_RESPONSE_RESET_START, fetchPermissionsReset);
}

function* fetchRoleDetailDetails({ payload }: any) {
	yield* invokeApi(fetchRoleDetailCall, payload, fetchRoleDetailSuccess, fetchRoleDetailFailure);
}

function* fetchRoleDetailReset() {
	yield put(fetchRoleDetailResponseChanged());
}

function* onFetchRoleDetailStart() {
	yield takeLatest(rolesActionTypes.FETCH_ROLE_DETAIL_START, fetchRoleDetailDetails);
}

function* onFetchRoleDetailReset() {
	yield takeLatest(rolesActionTypes.FETCH_ROLE_DETAIL_RESPONSE_RESET_START, fetchRoleDetailReset);
}

function* saveRolePermissionsDetails({ payload }: any) {
	yield* invokeApi(saveRolePermissionsCall, payload, saveRolePermissionsSuccess, saveRolePermissionsFailure);
}

function* saveRolePermissionsReset() {
	yield put(saveRolePermissionsResponseChanged());
}

function* onSaveRolePermissionsStart() {
	yield takeLatest(rolesActionTypes.SAVE_ROLE_PERMISSIONS_START, saveRolePermissionsDetails);
}

function* onSaveRolePermissionsReset() {
	yield takeLatest(rolesActionTypes.SAVE_ROLE_PERMISSIONS_RESPONSE_RESET_START, saveRolePermissionsReset);
}

export function* rolesSaga() {
	yield all([call(onFetchRolesStart), call(onFetchRolesReset), call(onFetchPermissionsStart), call(onFetchPermissionsReset), call(onFetchRoleDetailStart), call(onFetchRoleDetailReset), call(onSaveRolePermissionsStart), call(onSaveRolePermissionsReset)]);
}

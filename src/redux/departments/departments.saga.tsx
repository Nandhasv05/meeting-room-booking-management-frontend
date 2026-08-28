// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : departments sagas

import { takeLatest, put, all, call } from 'redux-saga/effects';
import departmentsActionTypes from './departments.types';
import {
	fetchDepartmentsCall,
	createDepartmentCall,
} from './departments.services';
import {
	fetchDepartmentsSuccess,
	fetchDepartmentsFailure,
	fetchDepartmentsResponseChanged,
	createDepartmentSuccess,
	createDepartmentFailure,
	createDepartmentResponseChanged,
} from './departments.action';
import { invokeApi } from '../_common/saga.utils';

function* fetchDepartmentsDetails({ payload }: any) {
	yield* invokeApi(fetchDepartmentsCall, payload, fetchDepartmentsSuccess, fetchDepartmentsFailure);
}

function* fetchDepartmentsReset() {
	yield put(fetchDepartmentsResponseChanged());
}

function* onFetchDepartmentsStart() {
	yield takeLatest(departmentsActionTypes.FETCH_DEPARTMENTS_START, fetchDepartmentsDetails);
}

function* onFetchDepartmentsReset() {
	yield takeLatest(departmentsActionTypes.FETCH_DEPARTMENTS_RESPONSE_RESET_START, fetchDepartmentsReset);
}

function* createDepartmentDetails({ payload }: any) {
	yield* invokeApi(createDepartmentCall, payload, createDepartmentSuccess, createDepartmentFailure);
}

function* createDepartmentReset() {
	yield put(createDepartmentResponseChanged());
}

function* onCreateDepartmentStart() {
	yield takeLatest(departmentsActionTypes.CREATE_DEPARTMENT_START, createDepartmentDetails);
}

function* onCreateDepartmentReset() {
	yield takeLatest(departmentsActionTypes.CREATE_DEPARTMENT_RESPONSE_RESET_START, createDepartmentReset);
}

export function* departmentsSaga() {
	yield all([call(onFetchDepartmentsStart), call(onFetchDepartmentsReset), call(onCreateDepartmentStart), call(onCreateDepartmentReset)]);
}

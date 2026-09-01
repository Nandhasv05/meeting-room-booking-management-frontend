// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : users sagas

import { takeLatest, put, all, call } from 'redux-saga/effects';
import usersActionTypes from './users.types';
import {
	fetchUsersCall,
	searchUsersCall,
	createUserCall,
	updateUserCall,
} from './users.services';
import {
	fetchUsersSuccess,
	fetchUsersFailure,
	fetchUsersResponseChanged,
	searchUsersSuccess,
	searchUsersFailure,
	searchUsersResponseChanged,
	createUserSuccess,
	createUserFailure,
	createUserResponseChanged,
	updateUserSuccess,
	updateUserFailure,
	updateUserResponseChanged,
} from './users.action';
import { invokeApi } from '../_common/saga.utils';

function* fetchUsersDetails({ payload }: any) {
	yield* invokeApi(fetchUsersCall, payload, fetchUsersSuccess, fetchUsersFailure);
}

function* fetchUsersReset() {
	yield put(fetchUsersResponseChanged());
}

function* onFetchUsersStart() {
	yield takeLatest(usersActionTypes.FETCH_USERS_START, fetchUsersDetails);
}

function* onFetchUsersReset() {
	yield takeLatest(usersActionTypes.FETCH_USERS_RESPONSE_RESET_START, fetchUsersReset);
}

function* searchUsersDetails({ payload }: any) {
	yield* invokeApi(searchUsersCall, payload, searchUsersSuccess, searchUsersFailure);
}

function* searchUsersReset() {
	yield put(searchUsersResponseChanged());
}

function* onSearchUsersStart() {
	yield takeLatest(usersActionTypes.SEARCH_USERS_START, searchUsersDetails);
}

function* onSearchUsersReset() {
	yield takeLatest(usersActionTypes.SEARCH_USERS_RESPONSE_RESET_START, searchUsersReset);
}

function* createUserDetails({ payload }: any) {
	yield* invokeApi(createUserCall, payload, createUserSuccess, createUserFailure);
}

function* createUserReset() {
	yield put(createUserResponseChanged());
}

function* onCreateUserStart() {
	yield takeLatest(usersActionTypes.CREATE_USER_START, createUserDetails);
}

function* onCreateUserReset() {
	yield takeLatest(usersActionTypes.CREATE_USER_RESPONSE_RESET_START, createUserReset);
}

function* updateUserDetails({ payload }: any) {
	yield* invokeApi(updateUserCall, payload, updateUserSuccess, updateUserFailure);
}

function* updateUserReset() {
	yield put(updateUserResponseChanged());
}

function* onUpdateUserStart() {
	yield takeLatest(usersActionTypes.UPDATE_USER_START, updateUserDetails);
}

function* onUpdateUserReset() {
	yield takeLatest(usersActionTypes.UPDATE_USER_RESPONSE_RESET_START, updateUserReset);
}

export function* usersSaga() {
	yield all([
		call(onFetchUsersStart),
		call(onFetchUsersReset),
		call(onSearchUsersStart),
		call(onSearchUsersReset),
		call(onCreateUserStart),
		call(onCreateUserReset),
		call(onUpdateUserStart),
		call(onUpdateUserReset),
	]);
}

// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : Login sagas

import { takeLatest, put, all, call } from 'redux-saga/effects';
import { loginActionTypes } from './login.types';
import { userSignIn, userSignOut } from './login.services';
import {
	userSignInSuccess,
	userSignInFailure,
	userSignInResponseChanged,
	userSignInLogOut,
} from './login.action';
import { invokeApi } from '../_common/saga.utils';

export function* signInWithCredentials({ payload }: any) {
	yield* invokeApi(userSignIn, payload, userSignInSuccess, userSignInFailure);
}

export function* makeUserLoginReset() {
	yield put(userSignInResponseChanged());
}

export function* onUserSignInStart() {
	yield takeLatest(loginActionTypes.USER_SIGN_IN_START, signInWithCredentials);
}

export function* onPhoneSignInReset() {
	yield takeLatest(loginActionTypes.USER_SIGN_IN_RESPONSE_RESET_START, makeUserLoginReset);
}

export function* makeUserSignInLogout() {
	try {
		yield call(userSignOut);
	} catch {
		/* still clear local session */
	}
	yield put(userSignInLogOut());
}

export function* userSignInLogout() {
	yield takeLatest(loginActionTypes.USER_SIGN_OUT_START, makeUserSignInLogout);
}

export function* loginSaga() {
	yield all([call(onUserSignInStart), call(userSignInLogout), call(onPhoneSignInReset)]);
}

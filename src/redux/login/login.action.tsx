// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : Login action functions for the login reducer

import {loginActionTypes} from './login.types';

export const userSignInStart = (userCredentials: any) => ({
	type: loginActionTypes.USER_SIGN_IN_START,
	payload: userCredentials,
});

export const userSignInSuccess = (user: any) => ({
	type: loginActionTypes.USER_SIGN_IN_SUCCESS,
	payload: user,
});

export const userSignInFailure = (error: any) => ({
	type: loginActionTypes.USER_SIGN_IN_FAILURE,
	payload: error,
});

export const userSignInResponseResetStart = () => ({
	type: loginActionTypes.USER_SIGN_IN_RESPONSE_RESET_START,
});

export const userSignInResponseChanged = () => ({
	type: loginActionTypes.USER_SIGN_IN_RESPONSE_CHANGED,
});

export const setSession = (session: any) => ({
	type: loginActionTypes.SET_SESSION,
	payload: session,
});

export const userSignInLogOutStart = () => ({
	type: loginActionTypes.USER_SIGN_OUT_START,
});

export const userSignInLogOut = () => ({
	type: loginActionTypes.USER_SIGN_OUT,
});

export const clearSession = () => ({
	type: loginActionTypes.USER_SIGN_OUT,
});

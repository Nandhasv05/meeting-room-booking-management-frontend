// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : Login reducer

import { loginActionTypes } from './login.types';
import { clearAuthStorage, loadAuth, persistAuth } from '../_common/authStorage';

/******* INITIAL STATE *******/
const stored = loadAuth();
const INITIAL_STATE: any = {
	user: stored.user ?? null,
	accessToken: stored.accessToken ?? null,
	refreshToken: stored.refreshToken ?? null,
	loginResponse: null,
	loginLoading: false,
};

/******* PERSIST FROM STATE *******/
const persistFromState = (state: any) => {
	persistAuth({
		user: state.user,
		accessToken: state.accessToken,
		refreshToken: state.refreshToken,
	});
};

/******* LOGIN REDUCER *******/
const loginReducer = (state = INITIAL_STATE, action: any) => {
	switch (action.type) {
		/******* USER SIGN IN START *******/
		case loginActionTypes.USER_SIGN_IN_START:
		case loginActionTypes.USER_SSO_START:
			return {
				...state,
				loginLoading: true,
				loginResponse: null,
			};

		case loginActionTypes.USER_SIGN_IN_SUCCESS: {
			const data = action.payload?.data ?? {};
			const next = {
				...state,
				loginLoading: false,
				loginResponse: action.payload,
				user: data.user ?? null,
				accessToken: data.accessToken ?? null,
				refreshToken: data.refreshToken ?? null,
			};
			persistFromState(next);
			return next;
		}

		case loginActionTypes.USER_SIGN_IN_FAILURE:
			return {
				...state,
				loginLoading: false,
				loginResponse: action.payload,
			};

		case loginActionTypes.USER_SIGN_IN_RESPONSE_CHANGED:
			return {
				...state,
				loginResponse: null,
			};

		/******* SET SESSION *******/
		case loginActionTypes.SET_SESSION: {
			const next = {
				...state,
				user: action.payload?.user ?? state.user,
				accessToken: action.payload?.accessToken ?? null,
				refreshToken: action.payload?.refreshToken ?? null,
			};
			persistFromState(next);
			return next;
		}

		case loginActionTypes.USER_SIGN_OUT:
			clearAuthStorage();
			return {
				...state,
				user: null,
				accessToken: null,
				refreshToken: null,
				loginResponse: null,
				loginLoading: false,
			};

		default:
			return state;
	}
};

export default loginReducer;

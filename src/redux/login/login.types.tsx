// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : Login action types for the login reducer

export const loginActionTypes = {
    /*******  USER SIGN IN START*******/
	USER_SIGN_IN_START: 'user_sign_in_start',
	USER_SIGN_IN_SUCCESS: 'user_sign_in_success',
	USER_SIGN_IN_FAILURE: 'user_sign_in_failure',
	USER_SIGN_IN_RESPONSE_RESET_START: 'user_sign_in_response_reset_start',
	USER_SIGN_IN_RESPONSE_CHANGED: 'user_sign_in_response_changed',
    /*******  USER SIGN IN END*******/

	/******* SET SESSION START*******/
	SET_SESSION: 'user_set_session',
	SET_SESSION_SUCCESS: 'user_set_session_success',
	SET_SESSION_FAILURE: 'user_set_session_failure',
	SET_SESSION_RESPONSE_RESET_START: 'user_set_session_response_reset_start',
	SET_SESSION_RESPONSE_CHANGED: 'user_set_session_response_changed',
	/******* SET SESSION END*******/

	/******* USER SIGN OUT *******/
	USER_SIGN_OUT_START: 'user_sign_out_start',
	USER_SIGN_OUT: 'user_sign_out',
	USER_SIGN_OUT_SUCCESS: 'user_sign_out_success',
	USER_SIGN_OUT_FAILURE: 'user_sign_out_failure',
	USER_SIGN_OUT_RESPONSE_RESET_START: 'user_sign_out_response_reset_start',
	USER_SIGN_OUT_RESPONSE_CHANGED: 'user_sign_out_response_changed',
    /******* USER SIGN OUT END*******/
};

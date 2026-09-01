// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : users action types

const usersActionTypes = {
	FETCH_USERS_START: 'fetch_users_start',
	FETCH_USERS_SUCCESS: 'fetch_users_success',
	FETCH_USERS_FAILURE: 'fetch_users_failure',
	FETCH_USERS_RESPONSE_RESET_START: 'fetch_users_response_reset_start',
	FETCH_USERS_RESPONSE_CHANGED: 'fetch_users_response_changed',

	SEARCH_USERS_START: 'search_users_start',
	SEARCH_USERS_SUCCESS: 'search_users_success',
	SEARCH_USERS_FAILURE: 'search_users_failure',
	SEARCH_USERS_RESPONSE_RESET_START: 'search_users_response_reset_start',
	SEARCH_USERS_RESPONSE_CHANGED: 'search_users_response_changed',

	CREATE_USER_START: 'create_user_start',
	CREATE_USER_SUCCESS: 'create_user_success',
	CREATE_USER_FAILURE: 'create_user_failure',
	CREATE_USER_RESPONSE_RESET_START: 'create_user_response_reset_start',
	CREATE_USER_RESPONSE_CHANGED: 'create_user_response_changed',

	UPDATE_USER_START: 'update_user_start',
	UPDATE_USER_SUCCESS: 'update_user_success',
	UPDATE_USER_FAILURE: 'update_user_failure',
	UPDATE_USER_RESPONSE_RESET_START: 'update_user_response_reset_start',
	UPDATE_USER_RESPONSE_CHANGED: 'update_user_response_changed',

};
export default usersActionTypes;
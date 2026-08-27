// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : roles action types

const rolesActionTypes = {
	FETCH_ROLES_START: 'fetch_roles_start',
	FETCH_ROLES_SUCCESS: 'fetch_roles_success',
	FETCH_ROLES_FAILURE: 'fetch_roles_failure',
	FETCH_ROLES_RESPONSE_RESET_START: 'fetch_roles_response_reset_start',
	FETCH_ROLES_RESPONSE_CHANGED: 'fetch_roles_response_changed',

	FETCH_PERMISSIONS_START: 'fetch_permissions_start',
	FETCH_PERMISSIONS_SUCCESS: 'fetch_permissions_success',
	FETCH_PERMISSIONS_FAILURE: 'fetch_permissions_failure',
	FETCH_PERMISSIONS_RESPONSE_RESET_START: 'fetch_permissions_response_reset_start',
	FETCH_PERMISSIONS_RESPONSE_CHANGED: 'fetch_permissions_response_changed',

	FETCH_ROLE_DETAIL_START: 'fetch_role_detail_start',
	FETCH_ROLE_DETAIL_SUCCESS: 'fetch_role_detail_success',
	FETCH_ROLE_DETAIL_FAILURE: 'fetch_role_detail_failure',
	FETCH_ROLE_DETAIL_RESPONSE_RESET_START: 'fetch_role_detail_response_reset_start',
	FETCH_ROLE_DETAIL_RESPONSE_CHANGED: 'fetch_role_detail_response_changed',

	SAVE_ROLE_PERMISSIONS_START: 'save_role_permissions_start',
	SAVE_ROLE_PERMISSIONS_SUCCESS: 'save_role_permissions_success',
	SAVE_ROLE_PERMISSIONS_FAILURE: 'save_role_permissions_failure',
	SAVE_ROLE_PERMISSIONS_RESPONSE_RESET_START: 'save_role_permissions_response_reset_start',
	SAVE_ROLE_PERMISSIONS_RESPONSE_CHANGED: 'save_role_permissions_response_changed',

};
export default rolesActionTypes;
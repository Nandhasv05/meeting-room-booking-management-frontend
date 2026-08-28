// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : roles action functions

import rolesActionTypes from './roles.types';

export const fetchRolesStart = (payload?: any) => ({
	type: rolesActionTypes.FETCH_ROLES_START,
	payload,
});

export const fetchRolesSuccess = (payload: any) => ({
	type: rolesActionTypes.FETCH_ROLES_SUCCESS,
	payload,
});

export const fetchRolesFailure = (payload: any) => ({
	type: rolesActionTypes.FETCH_ROLES_FAILURE,
	payload,
});

export const fetchRolesResponseResetStart = () => ({
	type: rolesActionTypes.FETCH_ROLES_RESPONSE_RESET_START,
});

export const fetchRolesResponseChanged = () => ({
	type: rolesActionTypes.FETCH_ROLES_RESPONSE_CHANGED,
});

export const fetchPermissionsStart = (payload?: any) => ({
	type: rolesActionTypes.FETCH_PERMISSIONS_START,
	payload,
});

export const fetchPermissionsSuccess = (payload: any) => ({
	type: rolesActionTypes.FETCH_PERMISSIONS_SUCCESS,
	payload,
});

export const fetchPermissionsFailure = (payload: any) => ({
	type: rolesActionTypes.FETCH_PERMISSIONS_FAILURE,
	payload,
});

export const fetchPermissionsResponseResetStart = () => ({
	type: rolesActionTypes.FETCH_PERMISSIONS_RESPONSE_RESET_START,
});

export const fetchPermissionsResponseChanged = () => ({
	type: rolesActionTypes.FETCH_PERMISSIONS_RESPONSE_CHANGED,
});

export const fetchRoleDetailStart = (payload?: any) => ({
	type: rolesActionTypes.FETCH_ROLE_DETAIL_START,
	payload,
});

export const fetchRoleDetailSuccess = (payload: any) => ({
	type: rolesActionTypes.FETCH_ROLE_DETAIL_SUCCESS,
	payload,
});

export const fetchRoleDetailFailure = (payload: any) => ({
	type: rolesActionTypes.FETCH_ROLE_DETAIL_FAILURE,
	payload,
});

export const fetchRoleDetailResponseResetStart = () => ({
	type: rolesActionTypes.FETCH_ROLE_DETAIL_RESPONSE_RESET_START,
});

export const fetchRoleDetailResponseChanged = () => ({
	type: rolesActionTypes.FETCH_ROLE_DETAIL_RESPONSE_CHANGED,
});

export const saveRolePermissionsStart = (payload?: any) => ({
	type: rolesActionTypes.SAVE_ROLE_PERMISSIONS_START,
	payload,
});

export const saveRolePermissionsSuccess = (payload: any) => ({
	type: rolesActionTypes.SAVE_ROLE_PERMISSIONS_SUCCESS,
	payload,
});

export const saveRolePermissionsFailure = (payload: any) => ({
	type: rolesActionTypes.SAVE_ROLE_PERMISSIONS_FAILURE,
	payload,
});

export const saveRolePermissionsResponseResetStart = () => ({
	type: rolesActionTypes.SAVE_ROLE_PERMISSIONS_RESPONSE_RESET_START,
});

export const saveRolePermissionsResponseChanged = () => ({
	type: rolesActionTypes.SAVE_ROLE_PERMISSIONS_RESPONSE_CHANGED,
});

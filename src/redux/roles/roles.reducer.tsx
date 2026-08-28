// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : roles reducer

import rolesActionTypes from './roles.types';

const INITIAL_STATE: any = {
	'roles': [],
	'rolesLoading': false,
	'permissions': [],
	'permissionsLoading': false,
	'roleDetail': null,
	'roleDetailLoading': false,
	'saveRoleResponse': null,
	'saveRoleLoading': false
};

const rolesReducer = (state = INITIAL_STATE, action: any) => {
	switch (action.type) {
		case rolesActionTypes.FETCH_ROLES_START:
			return {
				...state,
				rolesLoading: true,
			};
		case rolesActionTypes.FETCH_ROLES_SUCCESS:
			return {
				...state,
				rolesLoading: false,
				roles: action.payload?.data ?? [],
			};
		case rolesActionTypes.FETCH_ROLES_FAILURE:
			return {
				...state,
				rolesLoading: false,
				roles: [],
			};
		case rolesActionTypes.FETCH_ROLES_RESPONSE_CHANGED:
			return {
				...state,
			};
		case rolesActionTypes.FETCH_PERMISSIONS_START:
			return {
				...state,
				permissionsLoading: true,
			};
		case rolesActionTypes.FETCH_PERMISSIONS_SUCCESS:
			return {
				...state,
				permissionsLoading: false,
				permissions: action.payload?.data ?? [],
			};
		case rolesActionTypes.FETCH_PERMISSIONS_FAILURE:
			return {
				...state,
				permissionsLoading: false,
				permissions: [],
			};
		case rolesActionTypes.FETCH_PERMISSIONS_RESPONSE_CHANGED:
			return {
				...state,
			};
		case rolesActionTypes.FETCH_ROLE_DETAIL_START:
			return {
				...state,
				roleDetailLoading: true,
			};
		case rolesActionTypes.FETCH_ROLE_DETAIL_SUCCESS:
			return {
				...state,
				roleDetailLoading: false,
				roleDetail: action.payload?.data ?? null,
			};
		case rolesActionTypes.FETCH_ROLE_DETAIL_FAILURE:
			return {
				...state,
				roleDetailLoading: false,
			};
		case rolesActionTypes.FETCH_ROLE_DETAIL_RESPONSE_CHANGED:
			return {
				...state,
			};
		case rolesActionTypes.SAVE_ROLE_PERMISSIONS_START:
			return {
				...state,
				saveRoleLoading: true,
			};
		case rolesActionTypes.SAVE_ROLE_PERMISSIONS_SUCCESS:
			return {
				...state,
				saveRoleLoading: false,
				saveRoleResponse: action.payload,
			};
		case rolesActionTypes.SAVE_ROLE_PERMISSIONS_FAILURE:
			return {
				...state,
				saveRoleLoading: false,
				saveRoleResponse: action.payload,
			};
		case rolesActionTypes.SAVE_ROLE_PERMISSIONS_RESPONSE_CHANGED:
			return {
				...state,
				saveRoleResponse: null,
			};
		default:
			return state;
	}
};

export default rolesReducer;
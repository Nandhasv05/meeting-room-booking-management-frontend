// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : users reducer

import usersActionTypes from './users.types';

const INITIAL_STATE: any = {
	'usersPage': null,
	'usersLoading': false,
	'searchResults': [],
	'searchLoading': false,
	'createUserResponse': null,
	'createUserLoading': false,
	'updateUserResponse': null,
	'updateUserLoading': false
};

const usersReducer = (state = INITIAL_STATE, action: any) => {
	switch (action.type) {
		case usersActionTypes.FETCH_USERS_START:
			return {
				...state,
				usersLoading: true,
			};
		case usersActionTypes.FETCH_USERS_SUCCESS:
			return {
				...state,
				usersLoading: false,
				usersPage: action.payload?.data ?? null,
			};
		case usersActionTypes.FETCH_USERS_FAILURE:
			return {
				...state,
				usersLoading: false,
			};
		case usersActionTypes.FETCH_USERS_RESPONSE_CHANGED:
			return {
				...state,
			};
		case usersActionTypes.SEARCH_USERS_START:
			return {
				...state,
				searchLoading: true,
			};
		case usersActionTypes.SEARCH_USERS_SUCCESS:
			return {
				...state,
				searchLoading: false,
				searchResults: action.payload?.data ?? [],
			};
		case usersActionTypes.SEARCH_USERS_FAILURE:
			return {
				...state,
				searchLoading: false,
				searchResults: [],
			};
		case usersActionTypes.SEARCH_USERS_RESPONSE_CHANGED:
			return {
				...state,
			};
		case usersActionTypes.CREATE_USER_START:
			return {
				...state,
				createUserLoading: true,
			};
		case usersActionTypes.CREATE_USER_SUCCESS:
			return {
				...state,
				createUserLoading: false,
				createUserResponse: action.payload,
			};
		case usersActionTypes.CREATE_USER_FAILURE:
			return {
				...state,
				createUserLoading: false,
				createUserResponse: action.payload,
			};
		case usersActionTypes.CREATE_USER_RESPONSE_CHANGED:
			return {
				...state,
				createUserResponse: null,
			};
		case usersActionTypes.UPDATE_USER_START:
			return {
				...state,
				updateUserLoading: true,
			};
		case usersActionTypes.UPDATE_USER_SUCCESS:
			return {
				...state,
				updateUserLoading: false,
				updateUserResponse: action.payload,
			};
		case usersActionTypes.UPDATE_USER_FAILURE:
			return {
				...state,
				updateUserLoading: false,
				updateUserResponse: action.payload,
			};
		case usersActionTypes.UPDATE_USER_RESPONSE_CHANGED:
			return {
				...state,
				updateUserResponse: null,
			};
		default:
			return state;
	}
};

export default usersReducer;
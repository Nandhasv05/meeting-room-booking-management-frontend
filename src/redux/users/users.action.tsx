// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : users action functions

import usersActionTypes from './users.types';

export const fetchUsersStart = (payload?: any) => ({
	type: usersActionTypes.FETCH_USERS_START,
	payload,
});

export const fetchUsersSuccess = (payload: any) => ({
	type: usersActionTypes.FETCH_USERS_SUCCESS,
	payload,
});

export const fetchUsersFailure = (payload: any) => ({
	type: usersActionTypes.FETCH_USERS_FAILURE,
	payload,
});

export const fetchUsersResponseResetStart = () => ({
	type: usersActionTypes.FETCH_USERS_RESPONSE_RESET_START,
});

export const fetchUsersResponseChanged = () => ({
	type: usersActionTypes.FETCH_USERS_RESPONSE_CHANGED,
});

export const searchUsersStart = (payload?: any) => ({
	type: usersActionTypes.SEARCH_USERS_START,
	payload,
});

export const searchUsersSuccess = (payload: any) => ({
	type: usersActionTypes.SEARCH_USERS_SUCCESS,
	payload,
});

export const searchUsersFailure = (payload: any) => ({
	type: usersActionTypes.SEARCH_USERS_FAILURE,
	payload,
});

export const searchUsersResponseResetStart = () => ({
	type: usersActionTypes.SEARCH_USERS_RESPONSE_RESET_START,
});

export const searchUsersResponseChanged = () => ({
	type: usersActionTypes.SEARCH_USERS_RESPONSE_CHANGED,
});

export const createUserStart = (payload?: any) => ({
	type: usersActionTypes.CREATE_USER_START,
	payload,
});

export const createUserSuccess = (payload: any) => ({
	type: usersActionTypes.CREATE_USER_SUCCESS,
	payload,
});

export const createUserFailure = (payload: any) => ({
	type: usersActionTypes.CREATE_USER_FAILURE,
	payload,
});

export const createUserResponseResetStart = () => ({
	type: usersActionTypes.CREATE_USER_RESPONSE_RESET_START,
});

export const createUserResponseChanged = () => ({
	type: usersActionTypes.CREATE_USER_RESPONSE_CHANGED,
});

export const updateUserStart = (payload?: any) => ({
	type: usersActionTypes.UPDATE_USER_START,
	payload,
});

export const updateUserSuccess = (payload: any) => ({
	type: usersActionTypes.UPDATE_USER_SUCCESS,
	payload,
});

export const updateUserFailure = (payload: any) => ({
	type: usersActionTypes.UPDATE_USER_FAILURE,
	payload,
});

export const updateUserResponseResetStart = () => ({
	type: usersActionTypes.UPDATE_USER_RESPONSE_RESET_START,
});

export const updateUserResponseChanged = () => ({
	type: usersActionTypes.UPDATE_USER_RESPONSE_CHANGED,
});

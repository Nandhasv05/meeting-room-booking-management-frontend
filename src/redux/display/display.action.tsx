// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : display action functions

import displayActionTypes from './display.types';

export const fetchDisplayStart = (payload?: any) => ({
	type: displayActionTypes.FETCH_DISPLAY_START,
	payload,
});

export const fetchDisplaySuccess = (payload: any) => ({
	type: displayActionTypes.FETCH_DISPLAY_SUCCESS,
	payload,
});

export const fetchDisplayFailure = (payload: any) => ({
	type: displayActionTypes.FETCH_DISPLAY_FAILURE,
	payload,
});

export const fetchDisplayResponseResetStart = () => ({
	type: displayActionTypes.FETCH_DISPLAY_RESPONSE_RESET_START,
});

export const fetchDisplayResponseChanged = () => ({
	type: displayActionTypes.FETCH_DISPLAY_RESPONSE_CHANGED,
});

export const fetchDisplayWallStart = (payload?: any) => ({
	type: displayActionTypes.FETCH_DISPLAY_WALL_START,
	payload,
});

export const fetchDisplayWallSuccess = (payload: any) => ({
	type: displayActionTypes.FETCH_DISPLAY_WALL_SUCCESS,
	payload,
});

export const fetchDisplayWallFailure = (payload: any) => ({
	type: displayActionTypes.FETCH_DISPLAY_WALL_FAILURE,
	payload,
});

export const fetchDisplayWallResponseResetStart = () => ({
	type: displayActionTypes.FETCH_DISPLAY_WALL_RESPONSE_RESET_START,
});

export const fetchDisplayWallResponseChanged = () => ({
	type: displayActionTypes.FETCH_DISPLAY_WALL_RESPONSE_CHANGED,
});

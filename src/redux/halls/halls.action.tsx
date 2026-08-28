// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : halls action functions

import hallsActionTypes from './halls.types';

export const fetchHallsStart = (payload?: any) => ({
	type: hallsActionTypes.FETCH_HALLS_START,
	payload,
});

export const fetchHallsSuccess = (payload: any) => ({
	type: hallsActionTypes.FETCH_HALLS_SUCCESS,
	payload,
});

export const fetchHallsFailure = (payload: any) => ({
	type: hallsActionTypes.FETCH_HALLS_FAILURE,
	payload,
});

export const fetchHallsResponseResetStart = () => ({
	type: hallsActionTypes.FETCH_HALLS_RESPONSE_RESET_START,
});

export const fetchHallsResponseChanged = () => ({
	type: hallsActionTypes.FETCH_HALLS_RESPONSE_CHANGED,
});

export const fetchHallStart = (payload?: any) => ({
	type: hallsActionTypes.FETCH_HALL_START,
	payload,
});

export const fetchHallSuccess = (payload: any) => ({
	type: hallsActionTypes.FETCH_HALL_SUCCESS,
	payload,
});

export const fetchHallFailure = (payload: any) => ({
	type: hallsActionTypes.FETCH_HALL_FAILURE,
	payload,
});

export const fetchHallResponseResetStart = () => ({
	type: hallsActionTypes.FETCH_HALL_RESPONSE_RESET_START,
});

export const fetchHallResponseChanged = () => ({
	type: hallsActionTypes.FETCH_HALL_RESPONSE_CHANGED,
});

export const saveHallStart = (payload?: any) => ({
	type: hallsActionTypes.SAVE_HALL_START,
	payload,
});

export const saveHallSuccess = (payload: any) => ({
	type: hallsActionTypes.SAVE_HALL_SUCCESS,
	payload,
});

export const saveHallFailure = (payload: any) => ({
	type: hallsActionTypes.SAVE_HALL_FAILURE,
	payload,
});

export const saveHallResponseResetStart = () => ({
	type: hallsActionTypes.SAVE_HALL_RESPONSE_RESET_START,
});

export const saveHallResponseChanged = () => ({
	type: hallsActionTypes.SAVE_HALL_RESPONSE_CHANGED,
});

export const fetchFacilitiesStart = (payload?: any) => ({
	type: hallsActionTypes.FETCH_FACILITIES_START,
	payload,
});

export const fetchFacilitiesSuccess = (payload: any) => ({
	type: hallsActionTypes.FETCH_FACILITIES_SUCCESS,
	payload,
});

export const fetchFacilitiesFailure = (payload: any) => ({
	type: hallsActionTypes.FETCH_FACILITIES_FAILURE,
	payload,
});

export const fetchFacilitiesResponseResetStart = () => ({
	type: hallsActionTypes.FETCH_FACILITIES_RESPONSE_RESET_START,
});

export const fetchFacilitiesResponseChanged = () => ({
	type: hallsActionTypes.FETCH_FACILITIES_RESPONSE_CHANGED,
});

export const createFacilityStart = (payload?: any) => ({
	type: hallsActionTypes.CREATE_FACILITY_START,
	payload,
});

export const createFacilitySuccess = (payload: any) => ({
	type: hallsActionTypes.CREATE_FACILITY_SUCCESS,
	payload,
});

export const createFacilityFailure = (payload: any) => ({
	type: hallsActionTypes.CREATE_FACILITY_FAILURE,
	payload,
});

export const createFacilityResponseResetStart = () => ({
	type: hallsActionTypes.CREATE_FACILITY_RESPONSE_RESET_START,
});

export const createFacilityResponseChanged = () => ({
	type: hallsActionTypes.CREATE_FACILITY_RESPONSE_CHANGED,
});

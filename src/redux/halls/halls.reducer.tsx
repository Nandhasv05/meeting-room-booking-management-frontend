// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : halls reducer

import hallsActionTypes from './halls.types';

const INITIAL_STATE: any = {
	'halls': [],
	'hallsLoading': false,
	'hall': null,
	'hallLoading': false,
	'saveHallResponse': null,
	'saveHallLoading': false,
	'facilities': [],
	'facilitiesLoading': false,
	'createFacilityResponse': null,
	'createFacilityLoading': false
};

const hallsReducer = (state = INITIAL_STATE, action: any) => {
	switch (action.type) {
		case hallsActionTypes.FETCH_HALLS_START:
			return {
				...state,
				hallsLoading: true,
			};
		case hallsActionTypes.FETCH_HALLS_SUCCESS:
			return {
				...state,
				hallsLoading: false,
				halls: action.payload?.data ?? [],
			};
		case hallsActionTypes.FETCH_HALLS_FAILURE:
			return {
				...state,
				hallsLoading: false,
				halls: [],
			};
		case hallsActionTypes.FETCH_HALLS_RESPONSE_CHANGED:
			return {
				...state,
			};
		case hallsActionTypes.FETCH_HALL_START:
			return {
				...state,
				hallLoading: true,
			};
		case hallsActionTypes.FETCH_HALL_SUCCESS:
			return {
				...state,
				hallLoading: false,
				hall: action.payload?.data ?? null,
			};
		case hallsActionTypes.FETCH_HALL_FAILURE:
			return {
				...state,
				hallLoading: false,
			};
		case hallsActionTypes.FETCH_HALL_RESPONSE_CHANGED:
			return {
				...state,
			};
		case hallsActionTypes.SAVE_HALL_START:
			return {
				...state,
				saveHallLoading: true,
			};
		case hallsActionTypes.SAVE_HALL_SUCCESS:
			return {
				...state,
				saveHallLoading: false,
				saveHallResponse: action.payload,
			};
		case hallsActionTypes.SAVE_HALL_FAILURE:
			return {
				...state,
				saveHallLoading: false,
				saveHallResponse: action.payload,
			};
		case hallsActionTypes.SAVE_HALL_RESPONSE_CHANGED:
			return {
				...state,
				saveHallResponse: null,
			};
		case hallsActionTypes.FETCH_FACILITIES_START:
			return {
				...state,
				facilitiesLoading: true,
			};
		case hallsActionTypes.FETCH_FACILITIES_SUCCESS:
			return {
				...state,
				facilitiesLoading: false,
				facilities: action.payload?.data ?? [],
			};
		case hallsActionTypes.FETCH_FACILITIES_FAILURE:
			return {
				...state,
				facilitiesLoading: false,
				facilities: [],
			};
		case hallsActionTypes.FETCH_FACILITIES_RESPONSE_CHANGED:
			return {
				...state,
			};
		case hallsActionTypes.CREATE_FACILITY_START:
			return {
				...state,
				createFacilityLoading: true,
			};
		case hallsActionTypes.CREATE_FACILITY_SUCCESS:
			return {
				...state,
				createFacilityLoading: false,
				createFacilityResponse: action.payload,
			};
		case hallsActionTypes.CREATE_FACILITY_FAILURE:
			return {
				...state,
				createFacilityLoading: false,
				createFacilityResponse: action.payload,
			};
		case hallsActionTypes.CREATE_FACILITY_RESPONSE_CHANGED:
			return {
				...state,
				createFacilityResponse: null,
			};
		default:
			return state;
	}
};

export default hallsReducer;
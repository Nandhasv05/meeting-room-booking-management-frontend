// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : halls action types

const hallsActionTypes = {
	FETCH_HALLS_START: 'fetch_halls_start',
	FETCH_HALLS_SUCCESS: 'fetch_halls_success',
	FETCH_HALLS_FAILURE: 'fetch_halls_failure',
	FETCH_HALLS_RESPONSE_RESET_START: 'fetch_halls_response_reset_start',
	FETCH_HALLS_RESPONSE_CHANGED: 'fetch_halls_response_changed',

	FETCH_HALL_START: 'fetch_hall_start',
	FETCH_HALL_SUCCESS: 'fetch_hall_success',
	FETCH_HALL_FAILURE: 'fetch_hall_failure',
	FETCH_HALL_RESPONSE_RESET_START: 'fetch_hall_response_reset_start',
	FETCH_HALL_RESPONSE_CHANGED: 'fetch_hall_response_changed',

	SAVE_HALL_START: 'save_hall_start',
	SAVE_HALL_SUCCESS: 'save_hall_success',
	SAVE_HALL_FAILURE: 'save_hall_failure',
	SAVE_HALL_RESPONSE_RESET_START: 'save_hall_response_reset_start',
	SAVE_HALL_RESPONSE_CHANGED: 'save_hall_response_changed',

	FETCH_FACILITIES_START: 'fetch_facilities_start',
	FETCH_FACILITIES_SUCCESS: 'fetch_facilities_success',
	FETCH_FACILITIES_FAILURE: 'fetch_facilities_failure',
	FETCH_FACILITIES_RESPONSE_RESET_START: 'fetch_facilities_response_reset_start',
	FETCH_FACILITIES_RESPONSE_CHANGED: 'fetch_facilities_response_changed',

	CREATE_FACILITY_START: 'create_facility_start',
	CREATE_FACILITY_SUCCESS: 'create_facility_success',
	CREATE_FACILITY_FAILURE: 'create_facility_failure',
	CREATE_FACILITY_RESPONSE_RESET_START: 'create_facility_response_reset_start',
	CREATE_FACILITY_RESPONSE_CHANGED: 'create_facility_response_changed',

};
export default hallsActionTypes;
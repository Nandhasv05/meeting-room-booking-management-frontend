// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : departments action types

const departmentsActionTypes = {
	FETCH_DEPARTMENTS_START: 'fetch_departments_start',
	FETCH_DEPARTMENTS_SUCCESS: 'fetch_departments_success',
	FETCH_DEPARTMENTS_FAILURE: 'fetch_departments_failure',
	FETCH_DEPARTMENTS_RESPONSE_RESET_START: 'fetch_departments_response_reset_start',
	FETCH_DEPARTMENTS_RESPONSE_CHANGED: 'fetch_departments_response_changed',

	CREATE_DEPARTMENT_START: 'create_department_start',
	CREATE_DEPARTMENT_SUCCESS: 'create_department_success',
	CREATE_DEPARTMENT_FAILURE: 'create_department_failure',
	CREATE_DEPARTMENT_RESPONSE_RESET_START: 'create_department_response_reset_start',
	CREATE_DEPARTMENT_RESPONSE_CHANGED: 'create_department_response_changed',

};
export default departmentsActionTypes;
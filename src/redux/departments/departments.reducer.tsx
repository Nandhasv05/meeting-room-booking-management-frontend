// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : departments reducer

import departmentsActionTypes from './departments.types';

const INITIAL_STATE: any = {
	'departments': [],
	'departmentsLoading': false,
	'createDepartmentResponse': null,
	'createDepartmentLoading': false
};

const departmentsReducer = (state = INITIAL_STATE, action: any) => {
	switch (action.type) {
		case departmentsActionTypes.FETCH_DEPARTMENTS_START:
			return {
				...state,
				departmentsLoading: true,
			};
		case departmentsActionTypes.FETCH_DEPARTMENTS_SUCCESS:
			return {
				...state,
				departmentsLoading: false,
				departments: action.payload?.data ?? [],
			};
		case departmentsActionTypes.FETCH_DEPARTMENTS_FAILURE:
			return {
				...state,
				departmentsLoading: false,
				departments: [],
			};
		case departmentsActionTypes.FETCH_DEPARTMENTS_RESPONSE_CHANGED:
			return {
				...state,
			};
		case departmentsActionTypes.CREATE_DEPARTMENT_START:
			return {
				...state,
				createDepartmentLoading: true,
			};
		case departmentsActionTypes.CREATE_DEPARTMENT_SUCCESS:
			return {
				...state,
				createDepartmentLoading: false,
				createDepartmentResponse: action.payload,
			};
		case departmentsActionTypes.CREATE_DEPARTMENT_FAILURE:
			return {
				...state,
				createDepartmentLoading: false,
				createDepartmentResponse: action.payload,
			};
		case departmentsActionTypes.CREATE_DEPARTMENT_RESPONSE_CHANGED:
			return {
				...state,
				createDepartmentResponse: null,
			};
		default:
			return state;
	}
};

export default departmentsReducer;
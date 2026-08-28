// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : departments action functions

import departmentsActionTypes from './departments.types';

export const fetchDepartmentsStart = (payload?: any) => ({
	type: departmentsActionTypes.FETCH_DEPARTMENTS_START,
	payload,
});

export const fetchDepartmentsSuccess = (payload: any) => ({
	type: departmentsActionTypes.FETCH_DEPARTMENTS_SUCCESS,
	payload,
});

export const fetchDepartmentsFailure = (payload: any) => ({
	type: departmentsActionTypes.FETCH_DEPARTMENTS_FAILURE,
	payload,
});

export const fetchDepartmentsResponseResetStart = () => ({
	type: departmentsActionTypes.FETCH_DEPARTMENTS_RESPONSE_RESET_START,
});

export const fetchDepartmentsResponseChanged = () => ({
	type: departmentsActionTypes.FETCH_DEPARTMENTS_RESPONSE_CHANGED,
});

export const createDepartmentStart = (payload?: any) => ({
	type: departmentsActionTypes.CREATE_DEPARTMENT_START,
	payload,
});

export const createDepartmentSuccess = (payload: any) => ({
	type: departmentsActionTypes.CREATE_DEPARTMENT_SUCCESS,
	payload,
});

export const createDepartmentFailure = (payload: any) => ({
	type: departmentsActionTypes.CREATE_DEPARTMENT_FAILURE,
	payload,
});

export const createDepartmentResponseResetStart = () => ({
	type: departmentsActionTypes.CREATE_DEPARTMENT_RESPONSE_RESET_START,
});

export const createDepartmentResponseChanged = () => ({
	type: departmentsActionTypes.CREATE_DEPARTMENT_RESPONSE_CHANGED,
});

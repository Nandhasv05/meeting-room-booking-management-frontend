// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : maintenance action functions

import maintenanceActionTypes from './maintenance.types';

/******* FETCH MAINTENANCE START *******/
export const fetchMaintenanceStart = (payload?: any) => ({
	type: maintenanceActionTypes.FETCH_MAINTENANCE_START,
	payload,
});

export const fetchMaintenanceSuccess = (payload: any) => ({
	type: maintenanceActionTypes.FETCH_MAINTENANCE_SUCCESS,
	payload,
});

export const fetchMaintenanceFailure = (payload: any) => ({
	type: maintenanceActionTypes.FETCH_MAINTENANCE_FAILURE,
	payload,
});

export const fetchMaintenanceResponseResetStart = () => ({
	type: maintenanceActionTypes.FETCH_MAINTENANCE_RESPONSE_RESET_START,
});

export const fetchMaintenanceResponseChanged = () => ({
	type: maintenanceActionTypes.FETCH_MAINTENANCE_RESPONSE_CHANGED,
});

/******* CREATE MAINTENANCE START *******/
export const createMaintenanceStart = (payload?: any) => ({
	type: maintenanceActionTypes.CREATE_MAINTENANCE_START,
	payload,
});

export const createMaintenanceSuccess = (payload: any) => ({
	type: maintenanceActionTypes.CREATE_MAINTENANCE_SUCCESS,
	payload,
});

export const createMaintenanceFailure = (payload: any) => ({
	type: maintenanceActionTypes.CREATE_MAINTENANCE_FAILURE,
	payload,
});

export const createMaintenanceResponseResetStart = () => ({
	type: maintenanceActionTypes.CREATE_MAINTENANCE_RESPONSE_RESET_START,
});

export const createMaintenanceResponseChanged = () => ({
	type: maintenanceActionTypes.CREATE_MAINTENANCE_RESPONSE_CHANGED,
});

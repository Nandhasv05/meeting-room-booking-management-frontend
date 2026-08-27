// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : maintenance reducer

import maintenanceActionTypes from './maintenance.types';

const INITIAL_STATE: any = {
	'maintenance': [],
	'maintenanceLoading': false,
	'createMaintenanceResponse': null,
	'createMaintenanceLoading': false
};

const maintenanceReducer = (state = INITIAL_STATE, action: any) => {
	switch (action.type) {
		case maintenanceActionTypes.FETCH_MAINTENANCE_START:
			return {
				...state,
				maintenanceLoading: true,
			};
		case maintenanceActionTypes.FETCH_MAINTENANCE_SUCCESS:
			return {
				...state,
				maintenanceLoading: false,
				maintenance: action.payload?.data ?? [],
			};
		case maintenanceActionTypes.FETCH_MAINTENANCE_FAILURE:
			return {
				...state,
				maintenanceLoading: false,
				maintenance: [],
			};
		case maintenanceActionTypes.FETCH_MAINTENANCE_RESPONSE_CHANGED:
			return {
				...state,
			};
		case maintenanceActionTypes.CREATE_MAINTENANCE_START:
			return {
				...state,
				createMaintenanceLoading: true,
			};
		case maintenanceActionTypes.CREATE_MAINTENANCE_SUCCESS:
			return {
				...state,
				createMaintenanceLoading: false,
				createMaintenanceResponse: action.payload,
			};
		case maintenanceActionTypes.CREATE_MAINTENANCE_FAILURE:
			return {
				...state,
				createMaintenanceLoading: false,
				createMaintenanceResponse: action.payload,
			};
		case maintenanceActionTypes.CREATE_MAINTENANCE_RESPONSE_CHANGED:
			return {
				...state,
				createMaintenanceResponse: null,
			};
		default:
			return state;
	}
};

export default maintenanceReducer;
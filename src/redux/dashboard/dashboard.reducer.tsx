// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : dashboard reducer

import dashboardActionTypes from './dashboard.types';

const INITIAL_STATE: any = {
	'dashboard': null,
	'dashboardLoading': false,
	'dashboardError': null
};

const dashboardReducer = (state = INITIAL_STATE, action: any) => {
	switch (action.type) {
		case dashboardActionTypes.FETCH_DASHBOARD_START:
			return {
				...state,
				dashboardLoading: true,
				dashboardError: null,
			};
		case dashboardActionTypes.FETCH_DASHBOARD_SUCCESS:
			return {
				...state,
				dashboardLoading: false,
				dashboard: action.payload?.data ?? null,
				dashboardError: null,
			};
		case dashboardActionTypes.FETCH_DASHBOARD_FAILURE:
			return {
				...state,
				dashboardLoading: false,
				dashboardError: action.payload?.message || 'Request failed',
			};
		case dashboardActionTypes.FETCH_DASHBOARD_RESPONSE_CHANGED:
			return {
				...state,
			};
		default:
			return state;
	}
};

export default dashboardReducer;
// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : dashboard action functions

import dashboardActionTypes from './dashboard.types';

export const fetchDashboardStart = (payload?: any) => ({
	type: dashboardActionTypes.FETCH_DASHBOARD_START,
	payload,
});

export const fetchDashboardSuccess = (payload: any) => ({
	type: dashboardActionTypes.FETCH_DASHBOARD_SUCCESS,
	payload,
});

export const fetchDashboardFailure = (payload: any) => ({
	type: dashboardActionTypes.FETCH_DASHBOARD_FAILURE,
	payload,
});

export const fetchDashboardResponseResetStart = () => ({
	type: dashboardActionTypes.FETCH_DASHBOARD_RESPONSE_RESET_START,
});

export const fetchDashboardResponseChanged = () => ({
	type: dashboardActionTypes.FETCH_DASHBOARD_RESPONSE_CHANGED,
});

// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : dashboard selectors

import { createSelector } from 'reselect';
const selectSlice = (state: any) => state.dashboard;

/******* SELECT DASHBOARD *******/
export const selectDashboard = createSelector([selectSlice], (slice) => slice.dashboard);
/******* SELECT DASHBOARD LOADING *******/
export const selectDashboardLoading = createSelector([selectSlice], (slice) => slice.dashboardLoading);
/******* SELECT DASHBOARD ERROR *******/
export const selectDashboardError = createSelector([selectSlice], (slice) => slice.dashboardError);

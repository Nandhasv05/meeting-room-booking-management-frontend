// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : dashboard selectors

import { createSelector } from 'reselect';

const selectSlice = (state: any) => state.dashboard;

export const selectDashboard = createSelector([selectSlice], (slice) => slice.dashboard);
export const selectDashboardLoading = createSelector([selectSlice], (slice) => slice.dashboardLoading);
export const selectDashboardError = createSelector([selectSlice], (slice) => slice.dashboardError);

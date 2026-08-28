// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : maintenance selectors

import { createSelector } from 'reselect';

const selectSlice = (state: any) => state.maintenance;

/******* SELECT MAINTENANCE *******/
export const selectMaintenance = createSelector([selectSlice], (slice) => slice.maintenance);
/******* SELECT MAINTENANCE LOADING *******/
export const selectMaintenanceLoading = createSelector([selectSlice], (slice) => slice.maintenanceLoading);
/******* SELECT CREATE MAINTENANCE RESPONSE *******/
export const selectCreateMaintenanceResponse = createSelector([selectSlice], (slice) => slice.createMaintenanceResponse);
/******* SELECT CREATE MAINTENANCE LOADING *******/
export const selectCreateMaintenanceLoading = createSelector([selectSlice], (slice) => slice.createMaintenanceLoading);

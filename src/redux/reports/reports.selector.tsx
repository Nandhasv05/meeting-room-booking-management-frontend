// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : reports selectors

import { createSelector } from 'reselect';

const selectSlice = (state: any) => state.reports;

/******* SELECT ROWS *******/
export const selectRows = createSelector([selectSlice], (slice) => slice.rows);
/******* SELECT REPORT LOADING *******/
export const selectReportLoading = createSelector([selectSlice], (slice) => slice.reportLoading);

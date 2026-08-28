// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : availability selectors

import { createSelector } from 'reselect';
const selectSlice = (state: any) => state.availability;

/******* SELECT AVAILABILITY *******/
export const selectAvailability = createSelector([selectSlice], (slice) => slice.availability);
export const selectAvailabilityLoading = createSelector([selectSlice], (slice) => slice.availabilityLoading);

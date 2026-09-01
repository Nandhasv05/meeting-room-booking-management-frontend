// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : halls selectors

import { createSelector } from 'reselect';

const selectSlice = (state: any) => state.halls;

export const selectHalls = createSelector([selectSlice], (slice) => slice.halls);
export const selectHallsLoading = createSelector([selectSlice], (slice) => slice.hallsLoading);
export const selectHall = createSelector([selectSlice], (slice) => slice.hall);
export const selectHallLoading = createSelector([selectSlice], (slice) => slice.hallLoading);
export const selectSaveHallResponse = createSelector([selectSlice], (slice) => slice.saveHallResponse);
export const selectSaveHallLoading = createSelector([selectSlice], (slice) => slice.saveHallLoading);
export const selectFacilities = createSelector([selectSlice], (slice) => slice.facilities);
export const selectFacilitiesLoading = createSelector([selectSlice], (slice) => slice.facilitiesLoading);
export const selectCreateFacilityResponse = createSelector([selectSlice], (slice) => slice.createFacilityResponse);
export const selectCreateFacilityLoading = createSelector([selectSlice], (slice) => slice.createFacilityLoading);
export const selectHallAvailability = createSelector([selectSlice], (slice) => slice.hallAvailability);
export const selectHallAvailabilityLoading = createSelector([selectSlice], (slice) => slice.hallAvailabilityLoading);

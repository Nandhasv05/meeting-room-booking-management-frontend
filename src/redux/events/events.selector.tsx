// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : events selectors

import { createSelector } from 'reselect';

const selectSlice = (state: any) => state.events;

export const selectEvents = createSelector([selectSlice], (slice) => slice.events);
export const selectEventsLoading = createSelector([selectSlice], (slice) => slice.eventsLoading);
export const selectEvent = createSelector([selectSlice], (slice) => slice.event);
export const selectEventLoading = createSelector([selectSlice], (slice) => slice.eventLoading);
export const selectUpdateEventResponse = createSelector([selectSlice], (slice) => slice.updateEventResponse);
export const selectUpdateEventLoading = createSelector([selectSlice], (slice) => slice.updateEventLoading);

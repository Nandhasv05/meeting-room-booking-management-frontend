// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : calendar selectors

import { createSelector } from 'reselect';

const selectSlice = (state: any) => state.calendar;

export const selectCalendar = createSelector([selectSlice], (slice) => slice.calendar);
export const selectCalendarLoading = createSelector([selectSlice], (slice) => slice.calendarLoading);

// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : bookings selectors

import { createSelector } from 'reselect';

const selectSlice = (state: any) => state.bookings;

export const selectBookingsPage = createSelector([selectSlice], (slice) => slice.bookingsPage);
export const selectBookingsLoading = createSelector([selectSlice], (slice) => slice.bookingsLoading);
export const selectBooking = createSelector([selectSlice], (slice) => slice.booking);
export const selectBookingLoading = createSelector([selectSlice], (slice) => slice.bookingLoading);
export const selectAttendees = createSelector([selectSlice], (slice) => slice.attendees);
export const selectAttendeesLoading = createSelector([selectSlice], (slice) => slice.attendeesLoading);
export const selectCreateBookingResponse = createSelector([selectSlice], (slice) => slice.createBookingResponse);
export const selectCreateBookingLoading = createSelector([selectSlice], (slice) => slice.createBookingLoading);
export const selectCancelBookingResponse = createSelector([selectSlice], (slice) => slice.cancelBookingResponse);
export const selectCancelBookingLoading = createSelector([selectSlice], (slice) => slice.cancelBookingLoading);
export const selectDeleteBookingResponse = createSelector([selectSlice], (slice) => slice.deleteBookingResponse);
export const selectDeleteBookingLoading = createSelector([selectSlice], (slice) => slice.deleteBookingLoading);

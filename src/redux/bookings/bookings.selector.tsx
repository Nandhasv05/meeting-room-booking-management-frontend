// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : bookings selectors

import { createSelector } from 'reselect';

const selectSlice = (state: any) => state.bookings;

/******* SELECT BOOKINGS PAGE *******/
export const selectBookingsPage = createSelector([selectSlice], (slice) => slice.bookingsPage);
export const selectBookingsLoading = createSelector([selectSlice], (slice) => slice.bookingsLoading);

/******* SELECT BOOKING *******/
export const selectBooking = createSelector([selectSlice], (slice) => slice.booking);

/******* SELECT BOOKING LOADING *******/
export const selectBookingLoading = createSelector([selectSlice], (slice) => slice.bookingLoading);

/******* SELECT ATTENDEES *******/
export const selectAttendees = createSelector([selectSlice], (slice) => slice.attendees);

/******* SELECT ATTENDEES LOADING *******/
export const selectAttendeesLoading = createSelector([selectSlice], (slice) => slice.attendeesLoading);

/******* SELECT CREATE BOOKING RESPONSE *******/
export const selectCreateBookingResponse = createSelector([selectSlice], (slice) => slice.createBookingResponse);

/******* SELECT CREATE BOOKING LOADING *******/
export const selectCreateBookingLoading = createSelector([selectSlice], (slice) => slice.createBookingLoading);

/******* SELECT CANCEL BOOKING RESPONSE *******/
export const selectCancelBookingResponse = createSelector([selectSlice], (slice) => slice.cancelBookingResponse);

/******* SELECT CANCEL BOOKING LOADING *******/
export const selectCancelBookingLoading = createSelector([selectSlice], (slice) => slice.cancelBookingLoading);

/******* SELECT DELETE BOOKING RESPONSE *******/
export const selectDeleteBookingResponse = createSelector([selectSlice], (slice) => slice.deleteBookingResponse);

/******* SELECT DELETE BOOKING LOADING *******/
export const selectDeleteBookingLoading = createSelector([selectSlice], (slice) => slice.deleteBookingLoading);

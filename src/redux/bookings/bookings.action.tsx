// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : bookings action functions

import bookingsActionTypes from './bookings.types';

export const fetchBookingsStart = (payload?: any) => ({
	type: bookingsActionTypes.FETCH_BOOKINGS_START,
	payload,
});

export const fetchBookingsSuccess = (payload: any) => ({
	type: bookingsActionTypes.FETCH_BOOKINGS_SUCCESS,
	payload,
});

export const fetchBookingsFailure = (payload: any) => ({
	type: bookingsActionTypes.FETCH_BOOKINGS_FAILURE,
	payload,
});

export const fetchBookingsResponseResetStart = () => ({
	type: bookingsActionTypes.FETCH_BOOKINGS_RESPONSE_RESET_START,
});

export const fetchBookingsResponseChanged = () => ({
	type: bookingsActionTypes.FETCH_BOOKINGS_RESPONSE_CHANGED,
});

export const fetchBookingStart = (payload?: any) => ({
	type: bookingsActionTypes.FETCH_BOOKING_START,
	payload,
});

export const fetchBookingSuccess = (payload: any) => ({
	type: bookingsActionTypes.FETCH_BOOKING_SUCCESS,
	payload,
});

export const fetchBookingFailure = (payload: any) => ({
	type: bookingsActionTypes.FETCH_BOOKING_FAILURE,
	payload,
});

export const fetchBookingResponseResetStart = () => ({
	type: bookingsActionTypes.FETCH_BOOKING_RESPONSE_RESET_START,
});

export const fetchBookingResponseChanged = () => ({
	type: bookingsActionTypes.FETCH_BOOKING_RESPONSE_CHANGED,
});

export const fetchAttendeesStart = (payload?: any) => ({
	type: bookingsActionTypes.FETCH_ATTENDEES_START,
	payload,
});

export const fetchAttendeesSuccess = (payload: any) => ({
	type: bookingsActionTypes.FETCH_ATTENDEES_SUCCESS,
	payload,
});

export const fetchAttendeesFailure = (payload: any) => ({
	type: bookingsActionTypes.FETCH_ATTENDEES_FAILURE,
	payload,
});

export const fetchAttendeesResponseResetStart = () => ({
	type: bookingsActionTypes.FETCH_ATTENDEES_RESPONSE_RESET_START,
});

export const fetchAttendeesResponseChanged = () => ({
	type: bookingsActionTypes.FETCH_ATTENDEES_RESPONSE_CHANGED,
});

export const createBookingStart = (payload?: any) => ({
	type: bookingsActionTypes.CREATE_BOOKING_START,
	payload,
});

export const createBookingSuccess = (payload: any) => ({
	type: bookingsActionTypes.CREATE_BOOKING_SUCCESS,
	payload,
});

export const createBookingFailure = (payload: any) => ({
	type: bookingsActionTypes.CREATE_BOOKING_FAILURE,
	payload,
});

export const createBookingResponseResetStart = () => ({
	type: bookingsActionTypes.CREATE_BOOKING_RESPONSE_RESET_START,
});

export const createBookingResponseChanged = () => ({
	type: bookingsActionTypes.CREATE_BOOKING_RESPONSE_CHANGED,
});

export const cancelBookingStart = (payload?: any) => ({
	type: bookingsActionTypes.CANCEL_BOOKING_START,
	payload,
});

export const cancelBookingSuccess = (payload: any) => ({
	type: bookingsActionTypes.CANCEL_BOOKING_SUCCESS,
	payload,
});

export const cancelBookingFailure = (payload: any) => ({
	type: bookingsActionTypes.CANCEL_BOOKING_FAILURE,
	payload,
});

export const cancelBookingResponseResetStart = () => ({
	type: bookingsActionTypes.CANCEL_BOOKING_RESPONSE_RESET_START,
});

export const cancelBookingResponseChanged = () => ({
	type: bookingsActionTypes.CANCEL_BOOKING_RESPONSE_CHANGED,
});

export const deleteBookingStart = (payload?: any) => ({
	type: bookingsActionTypes.DELETE_BOOKING_START,
	payload,
});

export const deleteBookingSuccess = (payload: any) => ({
	type: bookingsActionTypes.DELETE_BOOKING_SUCCESS,
	payload,
});

export const deleteBookingFailure = (payload: any) => ({
	type: bookingsActionTypes.DELETE_BOOKING_FAILURE,
	payload,
});

export const deleteBookingResponseResetStart = () => ({
	type: bookingsActionTypes.DELETE_BOOKING_RESPONSE_RESET_START,
});

export const deleteBookingResponseChanged = () => ({
	type: bookingsActionTypes.DELETE_BOOKING_RESPONSE_CHANGED,
});

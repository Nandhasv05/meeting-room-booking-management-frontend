// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : bookings reducer

import bookingsActionTypes from './bookings.types';

const INITIAL_STATE: any = {
	'bookingsPage': null,
	'bookingsLoading': false,
	'booking': null,
	'bookingLoading': false,
	'attendees': [],
	'attendeesLoading': false,
	'createBookingResponse': null,
	'createBookingLoading': false,
	'cancelBookingResponse': null,
	'cancelBookingLoading': false,
	'deleteBookingResponse': null,
	'deleteBookingLoading': false
};

const bookingsReducer = (state = INITIAL_STATE, action: any) => {
	switch (action.type) {
		case bookingsActionTypes.FETCH_BOOKINGS_START:
			return {
				...state,
				bookingsLoading: true,
			};
		case bookingsActionTypes.FETCH_BOOKINGS_SUCCESS:
			return {
				...state,
				bookingsLoading: false,
				bookingsPage: action.payload?.data ?? null,
			};
		case bookingsActionTypes.FETCH_BOOKINGS_FAILURE:
			return {
				...state,
				bookingsLoading: false,
			};
		case bookingsActionTypes.FETCH_BOOKINGS_RESPONSE_CHANGED:
			return {
				...state,
			};
		case bookingsActionTypes.FETCH_BOOKING_START:
			return {
				...state,
				bookingLoading: true,
			};
		case bookingsActionTypes.FETCH_BOOKING_SUCCESS:
			return {
				...state,
				bookingLoading: false,
				booking: action.payload?.data ?? null,
			};
		case bookingsActionTypes.FETCH_BOOKING_FAILURE:
			return {
				...state,
				bookingLoading: false,
			};
		case bookingsActionTypes.FETCH_BOOKING_RESPONSE_CHANGED:
			return {
				...state,
			};
		case bookingsActionTypes.FETCH_ATTENDEES_START:
			return {
				...state,
				attendeesLoading: true,
			};
		case bookingsActionTypes.FETCH_ATTENDEES_SUCCESS:
			return {
				...state,
				attendeesLoading: false,
				attendees: action.payload?.data ?? [],
			};
		case bookingsActionTypes.FETCH_ATTENDEES_FAILURE:
			return {
				...state,
				attendeesLoading: false,
				attendees: [],
			};
		case bookingsActionTypes.FETCH_ATTENDEES_RESPONSE_CHANGED:
			return {
				...state,
			};
		case bookingsActionTypes.CREATE_BOOKING_START:
			return {
				...state,
				createBookingLoading: true,
			};
		case bookingsActionTypes.CREATE_BOOKING_SUCCESS:
			return {
				...state,
				createBookingLoading: false,
				createBookingResponse: action.payload,
			};
		case bookingsActionTypes.CREATE_BOOKING_FAILURE:
			return {
				...state,
				createBookingLoading: false,
				createBookingResponse: action.payload,
			};
		case bookingsActionTypes.CREATE_BOOKING_RESPONSE_CHANGED:
			return {
				...state,
				createBookingResponse: null,
			};
		case bookingsActionTypes.CANCEL_BOOKING_START:
			return {
				...state,
				cancelBookingLoading: true,
			};
		case bookingsActionTypes.CANCEL_BOOKING_SUCCESS:
			return {
				...state,
				cancelBookingLoading: false,
				cancelBookingResponse: action.payload,
			};
		case bookingsActionTypes.CANCEL_BOOKING_FAILURE:
			return {
				...state,
				cancelBookingLoading: false,
				cancelBookingResponse: action.payload,
			};
		case bookingsActionTypes.CANCEL_BOOKING_RESPONSE_CHANGED:
			return {
				...state,
				cancelBookingResponse: null,
			};
		case bookingsActionTypes.DELETE_BOOKING_START:
			return {
				...state,
				deleteBookingLoading: true,
			};
		case bookingsActionTypes.DELETE_BOOKING_SUCCESS:
			return {
				...state,
				deleteBookingLoading: false,
				deleteBookingResponse: action.payload,
			};
		case bookingsActionTypes.DELETE_BOOKING_FAILURE:
			return {
				...state,
				deleteBookingLoading: false,
				deleteBookingResponse: action.payload,
			};
		case bookingsActionTypes.DELETE_BOOKING_RESPONSE_CHANGED:
			return {
				...state,
				deleteBookingResponse: null,
			};
		default:
			return state;
	}
};

export default bookingsReducer;
// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : bookings action types

const bookingsActionTypes = {
	/******* FETCH BOOKINGS START *******/
	FETCH_BOOKINGS_START: 'fetch_bookings_start',
	FETCH_BOOKINGS_SUCCESS: 'fetch_bookings_success',
	FETCH_BOOKINGS_FAILURE: 'fetch_bookings_failure',
	FETCH_BOOKINGS_RESPONSE_RESET_START: 'fetch_bookings_response_reset_start',
	FETCH_BOOKINGS_RESPONSE_CHANGED: 'fetch_bookings_response_changed',
	/******* FETCH BOOKINGS RESPONSE RESET END *******/

	/******* FETCH BOOKING START *******/
	FETCH_BOOKING_START: 'fetch_booking_start',
	FETCH_BOOKING_SUCCESS: 'fetch_booking_success',
	FETCH_BOOKING_FAILURE: 'fetch_booking_failure',
	FETCH_BOOKING_RESPONSE_RESET_START: 'fetch_booking_response_reset_start',
	FETCH_BOOKING_RESPONSE_CHANGED: 'fetch_booking_response_changed',
	/******* FETCH BOOKING RESPONSE RESET END *******/

	/******* FETCH ATTENDEES START *******/
	FETCH_ATTENDEES_START: 'fetch_attendees_start',
	FETCH_ATTENDEES_SUCCESS: 'fetch_attendees_success',
	FETCH_ATTENDEES_FAILURE: 'fetch_attendees_failure',
	FETCH_ATTENDEES_RESPONSE_RESET_START: 'fetch_attendees_response_reset_start',
	FETCH_ATTENDEES_RESPONSE_CHANGED: 'fetch_attendees_response_changed',
	/******* FETCH ATTENDEES RESPONSE RESET END *******/

	/******* CREATE BOOKING START *******/
	CREATE_BOOKING_START: 'create_booking_start',
	CREATE_BOOKING_SUCCESS: 'create_booking_success',
	CREATE_BOOKING_FAILURE: 'create_booking_failure',
	CREATE_BOOKING_RESPONSE_RESET_START: 'create_booking_response_reset_start',
	CREATE_BOOKING_RESPONSE_CHANGED: 'create_booking_response_changed',
	/******* CREATE BOOKING RESPONSE RESET END *******/

	/******* CANCEL BOOKING START *******/
	CANCEL_BOOKING_START: 'cancel_booking_start',
	CANCEL_BOOKING_SUCCESS: 'cancel_booking_success',
	CANCEL_BOOKING_FAILURE: 'cancel_booking_failure',
	CANCEL_BOOKING_RESPONSE_RESET_START: 'cancel_booking_response_reset_start',
	CANCEL_BOOKING_RESPONSE_CHANGED: 'cancel_booking_response_changed',
	/******* CANCEL BOOKING RESPONSE RESET END *******/

	/******* DELETE BOOKING START *******/
	DELETE_BOOKING_START: 'delete_booking_start',
	DELETE_BOOKING_SUCCESS: 'delete_booking_success',
	DELETE_BOOKING_FAILURE: 'delete_booking_failure',
	DELETE_BOOKING_RESPONSE_RESET_START: 'delete_booking_response_reset_start',
	DELETE_BOOKING_RESPONSE_CHANGED: 'delete_booking_response_changed',
	/******* DELETE BOOKING RESPONSE RESET END *******/
};
export default bookingsActionTypes;
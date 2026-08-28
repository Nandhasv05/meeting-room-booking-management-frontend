// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : bookings sagas
import { takeLatest, put, all, call } from 'redux-saga/effects';
import bookingsActionTypes from './bookings.types';
import {
	fetchBookingsCall,
	fetchBookingCall,
	fetchAttendeesCall,
	createBookingCall,
	cancelBookingCall,
	deleteBookingCall,
} from './bookings.services';
import {
	fetchBookingsSuccess,
	fetchBookingsFailure,
	fetchBookingsResponseChanged,
	fetchBookingSuccess,
	fetchBookingFailure,
	fetchBookingResponseChanged,
	fetchAttendeesSuccess,
	fetchAttendeesFailure,
	fetchAttendeesResponseChanged,
	createBookingSuccess,
	createBookingFailure,
	createBookingResponseChanged,
	cancelBookingSuccess,
	cancelBookingFailure,
	cancelBookingResponseChanged,
	deleteBookingSuccess,
	deleteBookingFailure,
	deleteBookingResponseChanged,
} from './bookings.action';
import { invokeApi } from '../_common/saga.utils';

/******* FETCH BOOKINGS DETAILS START *******/
function* fetchBookingsDetails({ payload }: any) {
	yield* invokeApi(fetchBookingsCall, payload, fetchBookingsSuccess, fetchBookingsFailure);
}

function* fetchBookingsReset() {
	yield put(fetchBookingsResponseChanged());
}
	function* onFetchBookingsStart() {
	yield takeLatest(bookingsActionTypes.FETCH_BOOKINGS_START, fetchBookingsDetails);
}

function* onFetchBookingsReset() {
	yield takeLatest(bookingsActionTypes.FETCH_BOOKINGS_RESPONSE_RESET_START, fetchBookingsReset);
}

/******* FETCH BOOKING DETAILS START *******/
function* fetchBookingDetails({ payload }: any) {
	yield* invokeApi(fetchBookingCall, payload, fetchBookingSuccess, fetchBookingFailure);
}

function* fetchBookingReset() {
	yield put(fetchBookingResponseChanged());
}

function* onFetchBookingStart() {
	yield takeLatest(bookingsActionTypes.FETCH_BOOKING_START, fetchBookingDetails);
}

function* onFetchBookingReset() {
	yield takeLatest(bookingsActionTypes.FETCH_BOOKING_RESPONSE_RESET_START, fetchBookingReset);
}

function* fetchAttendeesDetails({ payload }: any) {
	yield* invokeApi(fetchAttendeesCall, payload, fetchAttendeesSuccess, fetchAttendeesFailure);
}

function* fetchAttendeesReset() {
	yield put(fetchAttendeesResponseChanged());
}

function* onFetchAttendeesStart() {
	yield takeLatest(bookingsActionTypes.FETCH_ATTENDEES_START, fetchAttendeesDetails);
}

function* onFetchAttendeesReset() {
	yield takeLatest(bookingsActionTypes.FETCH_ATTENDEES_RESPONSE_RESET_START, fetchAttendeesReset);
}

/******* CREATE BOOKING DETAILS START *******/
function* createBookingDetails({ payload }: any) {
	yield* invokeApi(createBookingCall, payload, createBookingSuccess, createBookingFailure);
}

function* createBookingReset() {
	yield put(createBookingResponseChanged());
}

function* onCreateBookingStart() {
	yield takeLatest(bookingsActionTypes.CREATE_BOOKING_START, createBookingDetails);
}

function* onCreateBookingReset() {
	yield takeLatest(bookingsActionTypes.CREATE_BOOKING_RESPONSE_RESET_START, createBookingReset);
}
/******* CREATE BOOKING DETAILS END *******/

/******* CANCEL BOOKING DETAILS START *******/
function* cancelBookingDetails({ payload }: any) {
	yield* invokeApi(cancelBookingCall, payload, cancelBookingSuccess, cancelBookingFailure);
}

function* cancelBookingReset() {
	yield put(cancelBookingResponseChanged());
}

function* onCancelBookingStart() {
	yield takeLatest(bookingsActionTypes.CANCEL_BOOKING_START, cancelBookingDetails);
}

function* onCancelBookingReset() {
	yield takeLatest(bookingsActionTypes.CANCEL_BOOKING_RESPONSE_RESET_START, cancelBookingReset);
}
/******* CANCEL BOOKING DETAILS END *******/

/******* DELETE BOOKING DETAILS START *******/
function* deleteBookingDetails({ payload }: any) {
	yield* invokeApi(deleteBookingCall, payload, deleteBookingSuccess, deleteBookingFailure);
}

function* deleteBookingReset() {
	yield put(deleteBookingResponseChanged());
}

function* onDeleteBookingStart() {
	yield takeLatest(bookingsActionTypes.DELETE_BOOKING_START, deleteBookingDetails);
}

function* onDeleteBookingReset() {
	yield takeLatest(bookingsActionTypes.DELETE_BOOKING_RESPONSE_RESET_START, deleteBookingReset);
}
/******* DELETE BOOKING DETAILS END *******/

/******* BOOKINGS SAGA *******/
export function* bookingsSaga() {
	yield all([call(onFetchBookingsStart), call(onFetchBookingsReset), call(onFetchBookingStart), call(onFetchBookingReset), call(onFetchAttendeesStart), call(onFetchAttendeesReset), call(onCreateBookingStart), call(onCreateBookingReset), call(onCancelBookingStart), call(onCancelBookingReset), call(onDeleteBookingStart), call(onDeleteBookingReset)]);
}

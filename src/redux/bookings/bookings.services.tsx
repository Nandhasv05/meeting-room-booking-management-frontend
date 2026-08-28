// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : bookings API services

import { makeApiCall } from '../_common/api.utils';

/******* FETCH BOOKINGS CALL *******/
export const fetchBookingsCall = (payload?: any) => {
	return makeApiCall('/bookings', payload);
};

/******* FETCH BOOKING CALL *******/
export const fetchBookingCall = (payload?: any) => {
	const { id, ...params } = payload || {};
	return makeApiCall(`/bookings/${id}`, params);
};

/******* FETCH ATTENDEES CALL *******/
export const fetchAttendeesCall = (payload?: any) => {
	const { id, ...params } = payload || {};
	return makeApiCall(`/bookings/${id}/attendees`, params);
};

/******* CREATE BOOKING CALL *******/
export const createBookingCall = (payload?: any) => {
	return makeApiCall('/bookings/create', payload);
};

/******* CANCEL BOOKING CALL *******/
export const cancelBookingCall = (payload?: any) => {
	return makeApiCall(`/bookings/${payload.id}/cancel`, { reason: payload.reason });
};

/******* DELETE BOOKING CALL *******/
export const deleteBookingCall = (payload?: any) => {
	return makeApiCall(`/bookings/${payload.id}/delete`, {});
};

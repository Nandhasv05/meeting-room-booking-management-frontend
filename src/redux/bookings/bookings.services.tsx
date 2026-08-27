// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : bookings API services

import { makeApiCall } from '../_common/api.utils';

export const fetchBookingsCall = (payload?: any) => {
	return makeApiCall('/bookings', payload);
};

export const fetchBookingCall = (payload?: any) => {
	const { id, ...params } = payload || {};
	return makeApiCall(`/bookings/${id}`, params);
};

export const fetchAttendeesCall = (payload?: any) => {
	const { id, ...params } = payload || {};
	return makeApiCall(`/bookings/${id}/attendees`, params);
};

export const createBookingCall = (payload?: any) => {
	return makeApiCall('/bookings/create', payload);
};

export const cancelBookingCall = (payload?: any) => {
	return makeApiCall(`/bookings/${payload.id}/cancel`, { reason: payload.reason });
};

export const deleteBookingCall = (payload?: any) => {
	return makeApiCall(`/bookings/${payload.id}/delete`, {});
};

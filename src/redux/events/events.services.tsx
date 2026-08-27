// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : events API services

import { makeApiCall } from '../_common/api.utils';

export const fetchEventsCall = (payload?: any) => {
	return makeApiCall('/events', payload);
};

export const fetchEventCall = (payload?: any) => {
	const { id, ...params } = payload || {};
	return makeApiCall(`/events/${id}`, params);
};

export const updateEventCall = (payload?: any) => {
	return makeApiCall(`/events/${payload.id}/update`, payload.body);
};

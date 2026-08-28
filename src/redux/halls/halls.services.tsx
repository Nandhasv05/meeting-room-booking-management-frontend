// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : halls API services

import { makeApiCall } from '../_common/api.utils';

export const fetchHallsCall = (payload?: any) => {
	return makeApiCall('/halls', payload);
};

export const fetchHallCall = (payload?: any) => {
	const { id, ...params } = payload || {};
	return makeApiCall(`/halls/${id}`, params);
};

export const fetchFacilitiesCall = (payload?: any) => {
	return makeApiCall('/facilities', payload);
};

export const createFacilityCall = (payload?: any) => {
	return makeApiCall('/facilities/create', payload);
};

export const saveHallCall = (payload: any) => {
	const { id, ...body } = payload || {};
	return id ? makeApiCall(`/halls/${id}/update`, body) : makeApiCall('/halls/create', body);
};

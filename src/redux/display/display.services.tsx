// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : display API services

import { makeApiCall } from '../_common/api.utils';

export const fetchDisplayCall = (payload?: any) => {
	const { hallCode, ...params } = payload || {};
	return makeApiCall(`/display/${hallCode}`, params);
};

export const fetchHallsForWallCall = (payload?: any) => makeApiCall('/halls', payload);

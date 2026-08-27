// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : dashboard API services

import { makeApiCall } from '../_common/api.utils';

export const fetchDashboardCall = (payload?: any) => {
	return makeApiCall('/dashboard', payload);
};

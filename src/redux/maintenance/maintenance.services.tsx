// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : maintenance API services

import { makeApiCall } from '../_common/api.utils';

export const fetchMaintenanceCall = (payload?: any) => {
	return makeApiCall('/maintenance', payload);
};

export const createMaintenanceCall = (payload?: any) => {
	return makeApiCall('/maintenance/create', payload);
};

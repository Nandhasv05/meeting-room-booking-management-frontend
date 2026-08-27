// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : departments API services

import { makeApiCall } from '../_common/api.utils';

export const fetchDepartmentsCall = (payload?: any) => {
	return makeApiCall('/departments', payload);
};

export const createDepartmentCall = (payload?: any) => {
	return makeApiCall('/departments/create', payload);
};

// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : users API services

import { makeApiCall } from '../_common/api.utils';

export const fetchUsersCall = (payload?: any) => {
	return makeApiCall('/users', payload);
};

export const searchUsersCall = (payload?: any) => {
	return makeApiCall('/users/search', payload);
};

export const createUserCall = (payload?: any) => {
	return makeApiCall('/users/create', payload);
};

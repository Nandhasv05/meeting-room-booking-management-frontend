// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : Login API services

import { makeApiCall } from '../_common/api.utils';

/******* USER SIGN IN *******/
export const userSignIn = (loginData: { email: string; password: string }) => {
	return makeApiCall('/auth/login', loginData);
};

/******* USER SIGN OUT *******/
export const userSignOut = () => {
	return makeApiCall('/auth/logout', {});
};

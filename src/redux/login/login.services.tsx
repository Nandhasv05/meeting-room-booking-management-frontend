// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : Login API services

import { makeApiCall } from '../_common/api.utils';

/******* USER SIGN IN *******/
export const userSignIn = (loginData: { email: string; password: string }) => {
	return makeApiCall('/auth/login', loginData);
};

/******* PORTAL SSO *******/
export const userPortalSso = (sso: string) => {
	return makeApiCall('/auth/sso', { sso });
};

/******* USER SIGN OUT *******/
export const userSignOut = () => {
	return makeApiCall('/auth/logout', {});
};

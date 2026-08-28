// AUTHOR : NANDHAKUMAR S V
// DATE : 28/08/2026
// Description : Centralized API helper used by every Redux service

import { api } from '../../services/api';

/**
 * Centralized API call function for all Redux service calls.
 * Uses the shared axios instance so auth, refresh, and AES envelope interceptors apply.
 */
export const makeApiCall = (url: string, data?: any) => {
	return api.post(url, data ?? {});
};

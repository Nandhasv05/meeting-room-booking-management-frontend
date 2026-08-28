// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : availability API services
import { makeApiCall } from '../_common/api.utils';

/******* CHECK AVAILABILITY CALL *******/
export const checkAvailabilityCall = (payload?: any) => {
	return makeApiCall('/availability/check', payload);
};

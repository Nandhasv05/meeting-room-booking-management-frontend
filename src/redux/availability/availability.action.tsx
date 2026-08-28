// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : availability action functions

import availabilityActionTypes from './availability.types';

/******* CHECK AVAILABILITY START *******/
export const checkAvailabilityStart = (payload?: any) => ({
	type: availabilityActionTypes.CHECK_AVAILABILITY_START,
	payload,
});

export const checkAvailabilitySuccess = (payload: any) => ({
	type: availabilityActionTypes.CHECK_AVAILABILITY_SUCCESS,
	payload,
});

export const checkAvailabilityFailure = (payload: any) => ({
	type: availabilityActionTypes.CHECK_AVAILABILITY_FAILURE,
	payload,
});

export const checkAvailabilityResponseResetStart = () => ({
	type: availabilityActionTypes.CHECK_AVAILABILITY_RESPONSE_RESET_START,
});

export const checkAvailabilityResponseChanged = () => ({
	type: availabilityActionTypes.CHECK_AVAILABILITY_RESPONSE_CHANGED,
});
/******* CHECK AVAILABILITY RESPONSE RESET END *******/
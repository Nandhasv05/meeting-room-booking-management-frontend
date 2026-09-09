// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : availability reducer

import availabilityActionTypes from './availability.types';

const INITIAL_STATE: any = {
	'availability': null,
	'availabilityLoading': false
};

const availabilityReducer = (state = INITIAL_STATE, action: any) => {
	switch (action.type) {
		/******* CHECK AVAILABILITY START *******/
		case availabilityActionTypes.CHECK_AVAILABILITY_START:
			return {
				...state,
				availabilityLoading: true,
				availability: null,
			};
		case availabilityActionTypes.CHECK_AVAILABILITY_SUCCESS:
			return {
				...state,
				availabilityLoading: false,
				availability: action.payload?.data ?? null,
			};
        case availabilityActionTypes.CHECK_AVAILABILITY_FAILURE:
			return {
				...state,
				availabilityLoading: false,
				availability: null,
			};
		case availabilityActionTypes.CHECK_AVAILABILITY_RESPONSE_CHANGED:
			return {
				...state,
			};
		/******* CHECK AVAILABILITY RESPONSE RESET END *******/
		default:
			return state;
	}
};

export default availabilityReducer;
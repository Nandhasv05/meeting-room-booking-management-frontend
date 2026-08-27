// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : calendar reducer

import calendarActionTypes from './calendar.types';

const INITIAL_STATE: any = {
	'calendar': null,
	'calendarLoading': false
};

const calendarReducer = (state = INITIAL_STATE, action: any) => {
	switch (action.type) {
		case calendarActionTypes.FETCH_CALENDAR_START:
			return {
				...state,
				calendarLoading: true,
			};
		case calendarActionTypes.FETCH_CALENDAR_SUCCESS:
			return {
				...state,
				calendarLoading: false,
				calendar: action.payload?.data ?? null,
			};
		case calendarActionTypes.FETCH_CALENDAR_FAILURE:
			return {
				...state,
				calendarLoading: false,
			};
		case calendarActionTypes.FETCH_CALENDAR_RESPONSE_CHANGED:
			return {
				...state,
			};
		default:
			return state;
	}
};

export default calendarReducer;
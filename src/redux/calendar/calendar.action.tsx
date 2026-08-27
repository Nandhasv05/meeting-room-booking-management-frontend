// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : calendar action functions

import calendarActionTypes from './calendar.types';

export const fetchCalendarStart = (payload?: any) => ({
	type: calendarActionTypes.FETCH_CALENDAR_START,
	payload,
});

export const fetchCalendarSuccess = (payload: any) => ({
	type: calendarActionTypes.FETCH_CALENDAR_SUCCESS,
	payload,
});

export const fetchCalendarFailure = (payload: any) => ({
	type: calendarActionTypes.FETCH_CALENDAR_FAILURE,
	payload,
});

export const fetchCalendarResponseResetStart = () => ({
	type: calendarActionTypes.FETCH_CALENDAR_RESPONSE_RESET_START,
});

export const fetchCalendarResponseChanged = () => ({
	type: calendarActionTypes.FETCH_CALENDAR_RESPONSE_CHANGED,
});

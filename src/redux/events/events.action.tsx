// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : events action functions

import eventsActionTypes from './events.types';

export const fetchEventsStart = (payload?: any) => ({
	type: eventsActionTypes.FETCH_EVENTS_START,
	payload,
});

export const fetchEventsSuccess = (payload: any) => ({
	type: eventsActionTypes.FETCH_EVENTS_SUCCESS,
	payload,
});

export const fetchEventsFailure = (payload: any) => ({
	type: eventsActionTypes.FETCH_EVENTS_FAILURE,
	payload,
});

export const fetchEventsResponseResetStart = () => ({
	type: eventsActionTypes.FETCH_EVENTS_RESPONSE_RESET_START,
});

export const fetchEventsResponseChanged = () => ({
	type: eventsActionTypes.FETCH_EVENTS_RESPONSE_CHANGED,
});

export const fetchEventStart = (payload?: any) => ({
	type: eventsActionTypes.FETCH_EVENT_START,
	payload,
});

export const fetchEventSuccess = (payload: any) => ({
	type: eventsActionTypes.FETCH_EVENT_SUCCESS,
	payload,
});

export const fetchEventFailure = (payload: any) => ({
	type: eventsActionTypes.FETCH_EVENT_FAILURE,
	payload,
});

export const fetchEventResponseResetStart = () => ({
	type: eventsActionTypes.FETCH_EVENT_RESPONSE_RESET_START,
});

export const fetchEventResponseChanged = () => ({
	type: eventsActionTypes.FETCH_EVENT_RESPONSE_CHANGED,
});

export const updateEventStart = (payload?: any) => ({
	type: eventsActionTypes.UPDATE_EVENT_START,
	payload,
});

export const updateEventSuccess = (payload: any) => ({
	type: eventsActionTypes.UPDATE_EVENT_SUCCESS,
	payload,
});

export const updateEventFailure = (payload: any) => ({
	type: eventsActionTypes.UPDATE_EVENT_FAILURE,
	payload,
});

export const updateEventResponseResetStart = () => ({
	type: eventsActionTypes.UPDATE_EVENT_RESPONSE_RESET_START,
});

export const updateEventResponseChanged = () => ({
	type: eventsActionTypes.UPDATE_EVENT_RESPONSE_CHANGED,
});

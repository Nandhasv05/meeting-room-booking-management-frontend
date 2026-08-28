// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : events reducer

import eventsActionTypes from './events.types';

const INITIAL_STATE: any = {
	'events': [],
	'eventsLoading': false,
	'event': null,
	'eventLoading': false,
	'updateEventResponse': null,
	'updateEventLoading': false
};

const eventsReducer = (state = INITIAL_STATE, action: any) => {
	switch (action.type) {
		case eventsActionTypes.FETCH_EVENTS_START:
			return {
				...state,
				eventsLoading: true,
			};
		case eventsActionTypes.FETCH_EVENTS_SUCCESS:
			return {
				...state,
				eventsLoading: false,
				events: action.payload?.data ?? [],
			};
		case eventsActionTypes.FETCH_EVENTS_FAILURE:
			return {
				...state,
				eventsLoading: false,
				events: [],
			};
		case eventsActionTypes.FETCH_EVENTS_RESPONSE_CHANGED:
			return {
				...state,
			};
		case eventsActionTypes.FETCH_EVENT_START:
			return {
				...state,
				eventLoading: true,
			};
		case eventsActionTypes.FETCH_EVENT_SUCCESS:
			return {
				...state,
				eventLoading: false,
				event: action.payload?.data ?? null,
			};
		case eventsActionTypes.FETCH_EVENT_FAILURE:
			return {
				...state,
				eventLoading: false,
			};
		case eventsActionTypes.FETCH_EVENT_RESPONSE_CHANGED:
			return {
				...state,
			};
		case eventsActionTypes.UPDATE_EVENT_START:
			return {
				...state,
				updateEventLoading: true,
			};
		case eventsActionTypes.UPDATE_EVENT_SUCCESS:
			return {
				...state,
				updateEventLoading: false,
				updateEventResponse: action.payload,
			};
		case eventsActionTypes.UPDATE_EVENT_FAILURE:
			return {
				...state,
				updateEventLoading: false,
				updateEventResponse: action.payload,
			};
		case eventsActionTypes.UPDATE_EVENT_RESPONSE_CHANGED:
			return {
				...state,
				updateEventResponse: null,
			};
		default:
			return state;
	}
};

export default eventsReducer;
// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : events action types

const eventsActionTypes = {
	FETCH_EVENTS_START: 'fetch_events_start',
	FETCH_EVENTS_SUCCESS: 'fetch_events_success',
	FETCH_EVENTS_FAILURE: 'fetch_events_failure',
	FETCH_EVENTS_RESPONSE_RESET_START: 'fetch_events_response_reset_start',
	FETCH_EVENTS_RESPONSE_CHANGED: 'fetch_events_response_changed',

	FETCH_EVENT_START: 'fetch_event_start',
	FETCH_EVENT_SUCCESS: 'fetch_event_success',
	FETCH_EVENT_FAILURE: 'fetch_event_failure',
	FETCH_EVENT_RESPONSE_RESET_START: 'fetch_event_response_reset_start',
	FETCH_EVENT_RESPONSE_CHANGED: 'fetch_event_response_changed',

	UPDATE_EVENT_START: 'update_event_start',
	UPDATE_EVENT_SUCCESS: 'update_event_success',
	UPDATE_EVENT_FAILURE: 'update_event_failure',
	UPDATE_EVENT_RESPONSE_RESET_START: 'update_event_response_reset_start',
	UPDATE_EVENT_RESPONSE_CHANGED: 'update_event_response_changed',

};
export default eventsActionTypes;
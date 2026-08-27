// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : notifications action types

const notificationsActionTypes = {
	FETCH_NOTIFICATIONS_START: 'fetch_notifications_start',
	FETCH_NOTIFICATIONS_SUCCESS: 'fetch_notifications_success',
	FETCH_NOTIFICATIONS_FAILURE: 'fetch_notifications_failure',
	FETCH_NOTIFICATIONS_RESPONSE_RESET_START: 'fetch_notifications_response_reset_start',
	FETCH_NOTIFICATIONS_RESPONSE_CHANGED: 'fetch_notifications_response_changed',

	READ_NOTIFICATION_START: 'read_notification_start',
	READ_NOTIFICATION_SUCCESS: 'read_notification_success',
	READ_NOTIFICATION_FAILURE: 'read_notification_failure',
	READ_NOTIFICATION_RESPONSE_RESET_START: 'read_notification_response_reset_start',
	READ_NOTIFICATION_RESPONSE_CHANGED: 'read_notification_response_changed',

	READ_ALL_NOTIFICATIONS_START: 'read_all_notifications_start',
	READ_ALL_NOTIFICATIONS_SUCCESS: 'read_all_notifications_success',
	READ_ALL_NOTIFICATIONS_FAILURE: 'read_all_notifications_failure',
	READ_ALL_NOTIFICATIONS_RESPONSE_RESET_START: 'read_all_notifications_response_reset_start',
	READ_ALL_NOTIFICATIONS_RESPONSE_CHANGED: 'read_all_notifications_response_changed',

};
export default notificationsActionTypes;
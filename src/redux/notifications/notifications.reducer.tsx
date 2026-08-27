// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : notifications reducer

import notificationsActionTypes from './notifications.types';

const INITIAL_STATE: any = {
	'notifications': null,
	'notificationsLoading': false,
	'readNotificationResponse': null,
	'readNotificationLoading': false,
	'readAllResponse': null,
	'readAllLoading': false
};

const notificationsReducer = (state = INITIAL_STATE, action: any) => {
	switch (action.type) {
		case notificationsActionTypes.FETCH_NOTIFICATIONS_START:
			return {
				...state,
				notificationsLoading: true,
			};
		case notificationsActionTypes.FETCH_NOTIFICATIONS_SUCCESS:
			return {
				...state,
				notificationsLoading: false,
				notifications: action.payload?.data ?? null,
			};
		case notificationsActionTypes.FETCH_NOTIFICATIONS_FAILURE:
			return {
				...state,
				notificationsLoading: false,
			};
		case notificationsActionTypes.FETCH_NOTIFICATIONS_RESPONSE_CHANGED:
			return {
				...state,
			};
		case notificationsActionTypes.READ_NOTIFICATION_START:
			return {
				...state,
				readNotificationLoading: true,
			};
		case notificationsActionTypes.READ_NOTIFICATION_SUCCESS:
			return {
				...state,
				readNotificationLoading: false,
				readNotificationResponse: action.payload,
			};
		case notificationsActionTypes.READ_NOTIFICATION_FAILURE:
			return {
				...state,
				readNotificationLoading: false,
				readNotificationResponse: action.payload,
			};
		case notificationsActionTypes.READ_NOTIFICATION_RESPONSE_CHANGED:
			return {
				...state,
				readNotificationResponse: null,
			};
		case notificationsActionTypes.READ_ALL_NOTIFICATIONS_START:
			return {
				...state,
				readAllLoading: true,
			};
		case notificationsActionTypes.READ_ALL_NOTIFICATIONS_SUCCESS:
			return {
				...state,
				readAllLoading: false,
				readAllResponse: action.payload,
			};
		case notificationsActionTypes.READ_ALL_NOTIFICATIONS_FAILURE:
			return {
				...state,
				readAllLoading: false,
				readAllResponse: action.payload,
			};
		case notificationsActionTypes.READ_ALL_NOTIFICATIONS_RESPONSE_CHANGED:
			return {
				...state,
				readAllResponse: null,
			};
		default:
			return state;
	}
};

export default notificationsReducer;
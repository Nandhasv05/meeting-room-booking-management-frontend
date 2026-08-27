// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : notifications action functions

import notificationsActionTypes from './notifications.types';

export const fetchNotificationsStart = (payload?: any) => ({
	type: notificationsActionTypes.FETCH_NOTIFICATIONS_START,
	payload,
});

export const fetchNotificationsSuccess = (payload: any) => ({
	type: notificationsActionTypes.FETCH_NOTIFICATIONS_SUCCESS,
	payload,
});

export const fetchNotificationsFailure = (payload: any) => ({
	type: notificationsActionTypes.FETCH_NOTIFICATIONS_FAILURE,
	payload,
});

export const fetchNotificationsResponseResetStart = () => ({
	type: notificationsActionTypes.FETCH_NOTIFICATIONS_RESPONSE_RESET_START,
});

export const fetchNotificationsResponseChanged = () => ({
	type: notificationsActionTypes.FETCH_NOTIFICATIONS_RESPONSE_CHANGED,
});

export const readNotificationStart = (payload?: any) => ({
	type: notificationsActionTypes.READ_NOTIFICATION_START,
	payload,
});

export const readNotificationSuccess = (payload: any) => ({
	type: notificationsActionTypes.READ_NOTIFICATION_SUCCESS,
	payload,
});

export const readNotificationFailure = (payload: any) => ({
	type: notificationsActionTypes.READ_NOTIFICATION_FAILURE,
	payload,
});

export const readNotificationResponseResetStart = () => ({
	type: notificationsActionTypes.READ_NOTIFICATION_RESPONSE_RESET_START,
});

export const readNotificationResponseChanged = () => ({
	type: notificationsActionTypes.READ_NOTIFICATION_RESPONSE_CHANGED,
});

export const readAllNotificationsStart = (payload?: any) => ({
	type: notificationsActionTypes.READ_ALL_NOTIFICATIONS_START,
	payload,
});

export const readAllNotificationsSuccess = (payload: any) => ({
	type: notificationsActionTypes.READ_ALL_NOTIFICATIONS_SUCCESS,
	payload,
});

export const readAllNotificationsFailure = (payload: any) => ({
	type: notificationsActionTypes.READ_ALL_NOTIFICATIONS_FAILURE,
	payload,
});

export const readAllNotificationsResponseResetStart = () => ({
	type: notificationsActionTypes.READ_ALL_NOTIFICATIONS_RESPONSE_RESET_START,
});

export const readAllNotificationsResponseChanged = () => ({
	type: notificationsActionTypes.READ_ALL_NOTIFICATIONS_RESPONSE_CHANGED,
});

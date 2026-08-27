// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : notifications API services

import { makeApiCall } from '../_common/api.utils';

export const fetchNotificationsCall = (payload?: any) => {
	return makeApiCall('/notifications', payload);
};

export const readNotificationCall = (payload?: any) => {
	return makeApiCall(`/notifications/${payload.id}/read`, payload);
};

export const readAllNotificationsCall = (payload?: any) => {
	return makeApiCall('/notifications/read-all', payload);
};

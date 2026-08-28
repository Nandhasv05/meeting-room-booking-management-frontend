// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : notifications selectors
import { createSelector } from 'reselect';

const selectSlice = (state: any) => state.notifications;

/******* SELECT NOTIFICATIONS *******/
export const selectNotifications = createSelector([selectSlice], (slice) => slice.notifications);
/******* SELECT NOTIFICATIONS LOADING *******/
export const selectNotificationsLoading = createSelector([selectSlice], (slice) => slice.notificationsLoading);
/******* SELECT READ NOTIFICATION RESPONSE *******/
export const selectReadNotificationResponse = createSelector([selectSlice], (slice) => slice.readNotificationResponse);
/******* SELECT READ NOTIFICATION LOADING *******/
export const selectReadNotificationLoading = createSelector([selectSlice], (slice) => slice.readNotificationLoading);
/******* SELECT READ ALL RESPONSE *******/
export const selectReadAllResponse = createSelector([selectSlice], (slice) => slice.readAllResponse);
/******* SELECT READ ALL LOADING *******/
export const selectReadAllLoading = createSelector([selectSlice], (slice) => slice.readAllLoading);

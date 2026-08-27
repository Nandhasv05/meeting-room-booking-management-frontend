// Version : 0.0.1
// Author : NANDHAKUMAR S V
// Date : 27/08/2026
// Description : notifications selectors

import { createSelector } from 'reselect';

const selectSlice = (state: any) => state.notifications;

export const selectNotifications = createSelector([selectSlice], (slice) => slice.notifications);
export const selectNotificationsLoading = createSelector([selectSlice], (slice) => slice.notificationsLoading);
export const selectReadNotificationResponse = createSelector([selectSlice], (slice) => slice.readNotificationResponse);
export const selectReadNotificationLoading = createSelector([selectSlice], (slice) => slice.readNotificationLoading);
export const selectReadAllResponse = createSelector([selectSlice], (slice) => slice.readAllResponse);
export const selectReadAllLoading = createSelector([selectSlice], (slice) => slice.readAllLoading);
